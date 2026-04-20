import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Image as ImageIcon } from "lucide-react";
import { getHeroImages, deleteHeroImage, toggleHeroStatus } from "@/api/hero";
import { HeroCard } from "@/components/hero/HeroCard";
import { HeroUploadDialog } from "@/components/hero/HeroUploadDialog";

export default function HeroImages() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["hero-images"],
    queryFn: getHeroImages,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHeroImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-images"] });
      toast.success("Hero image deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete hero image");
    },
  });

  const heroImages = data?.items || [];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Hero Images"
          description="Manage responsive header images for your landing page."
        />
        
        <HeroUploadDialog />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-2xl" />
          ))}
        </div>
      ) : heroImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-sidebar rounded-3xl border border-dashed border-sidebar-border">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No Hero Images</h3>
          <p className="text-muted-foreground text-center max-w-sm mt-2">
            You haven't uploaded any hero images yet. Add one to enhance your website's header.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {heroImages.map((hero) => (
            <HeroCard 
              key={hero._id} 
              hero={hero} 
              onDelete={() => deleteMutation.mutate(hero._id)}
              isDeleting={deleteMutation.isPending && deleteMutation.variables === hero._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
