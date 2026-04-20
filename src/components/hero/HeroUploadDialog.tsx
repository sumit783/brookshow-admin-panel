import { useState, ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Monitor, 
  Tablet, 
  Smartphone,
  Loader2 
} from "lucide-react";
import { createHeroImage } from "@/api/hero";
import { toast } from "sonner";

export function HeroUploadDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [tabletFile, setTabletFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: createHeroImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-images"] });
      toast.success("Hero image uploaded successfully");
      resetForm();
      setIsOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload hero image");
    },
    onSettled: () => setIsUploading(false),
  });

  const resetForm = () => {
    setTitle("");
    setOrder(1);
    setDesktopFile(null);
    setTabletFile(null);
    setMobileFile(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'desktop' | 'tablet' | 'mobile') => {
    const file = e.target.files?.[0] || null;
    if (type === 'desktop') setDesktopFile(file);
    else if (type === 'tablet') setTabletFile(file);
    else if (type === 'mobile') setMobileFile(file);
  };

  const handleUpload = async () => {
    if (!title || !desktopFile || !tabletFile || !mobileFile) {
      toast.error("Please provide title and all three image versions");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("order", order.toString());
    formData.append("desktopHero", desktopFile);
    formData.append("tabletHero", tabletFile);
    formData.append("mobileHero", mobileFile);

    uploadMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary shadow-glow">
          <Plus className="w-4 h-4 mr-2" />
          Add Hero Image
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass-modern overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Upload New Hero Image</DialogTitle>
          <DialogDescription>
            Provide responsive versions for different device sizes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Summer Festival 2024"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value))}
            />
          </div>
          
          <div className="space-y-4">
             <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Monitor className="w-4 h-4" /> Desktop Image
              </Label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleFileChange(e, 'desktop')}
                className="cursor-pointer"
              />
              {desktopFile && <p className="text-xs text-primary">Selected: {desktopFile.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Tablet className="w-4 h-4" /> Tablet Image
              </Label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleFileChange(e, 'tablet')}
                className="cursor-pointer"
              />
              {tabletFile && <p className="text-xs text-primary">Selected: {tabletFile.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> Mobile Image
              </Label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleFileChange(e, 'mobile')}
                className="cursor-pointer"
              />
              {mobileFile && <p className="text-xs text-primary">Selected: {mobileFile.name}</p>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpload} 
            disabled={isUploading}
            className="min-w-[100px]"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : "Upload Hero"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
