import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Search, Eye, Music, MapPin, Star, ChevronLeft, ChevronRight, CalendarDays, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getArtists, verifyArtist, rejectArtist } from "@/api/artists";
import { getPlanners, verifyPlanner, rejectPlanner } from "@/api/planners";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { RejectionDialog } from "@/components/dashboard/RejectionDialog";

const ITEMS_PER_PAGE = 9;

export default function VerifyArtists() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("artists");

  // Artist State
  const [artistSearchQuery, setArtistSearchQuery] = useState("");
  const [artistCurrentPage, setArtistCurrentPage] = useState(1);

  // Planner State
  const [plannerSearchQuery, setPlannerSearchQuery] = useState("");
  const [plannerCurrentPage, setPlannerCurrentPage] = useState(1);

  // --- Artist Queries & Mutations ---
  const { data: artists = [], isLoading: isLoadingArtists, error: artistError } = useQuery({
    queryKey: ["artists"],
    queryFn: getArtists,
  });

  const verifyArtistMutation = useMutation({
    mutationFn: verifyArtist,
    onSuccess: () => {
      toast.success("Artist verified successfully!");
      queryClient.invalidateQueries({ queryKey: ["artists"] });
    },
    onError: () => toast.error("Failed to verify artist"),
  });

  const rejectArtistMutation = useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) => rejectArtist(id, message),
    onSuccess: () => {
      toast.success("Artist rejected");
      queryClient.invalidateQueries({ queryKey: ["artists"] });
    },
    onError: () => toast.error("Failed to reject artist"),
  });

  // --- Planner Queries & Mutations ---
  const { data: planners = [], isLoading: isLoadingPlanners, error: plannerError } = useQuery({
    queryKey: ["planners"],
    queryFn: getPlanners,
  });

  const verifyPlannerMutation = useMutation({
    mutationFn: verifyPlanner,
    onSuccess: () => {
      toast.success("Planner verified successfully!");
      queryClient.invalidateQueries({ queryKey: ["planners"] });
    },
    onError: () => toast.error("Failed to verify planner"),
  });

  const rejectPlannerMutation = useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) => rejectPlanner(id, message),
    onSuccess: () => {
      toast.success("Planner rejected");
      queryClient.invalidateQueries({ queryKey: ["planners"] });
    },
    onError: () => toast.error("Failed to reject planner"),
  });

  // --- Handlers ---
  // --- Dialog State ---
  const [rejectDialog, setRejectDialog] = useState<{
    isOpen: boolean;
    userId: string | null;
    type: "artist" | "planner" | null;
  }>({
    isOpen: false,
    userId: null,
    type: null,
  });

  // --- Handlers ---
  const handleVerifyArtist = (id: string) => verifyArtistMutation.mutate(id);
  const handleRejectArtist = (id: string) => {
    setRejectDialog({ isOpen: true, userId: id, type: "artist" });
  };

  const handleVerifyPlanner = (id: string) => verifyPlannerMutation.mutate(id);
  const handleRejectPlanner = (id: string) => {
    setRejectDialog({ isOpen: true, userId: id, type: "planner" });
  };

  const confirmRejection = (reason: string) => {
    const { userId, type } = rejectDialog;
    if (!userId || !type) return;

    if (type === "artist") {
      rejectArtistMutation.mutate({ id: userId, message: reason });
    } else {
      rejectPlannerMutation.mutate({ id: userId, message: reason });
    }
    setRejectDialog({ isOpen: false, userId: null, type: null });
  };

  // --- Filtering & Pagination Logic ---

  // Artists
  const filteredArtists = artists.filter(artist =>
    artist.userId.displayName.toLowerCase().includes(artistSearchQuery.toLowerCase()) ||
    artist.category.some(c => c.toLowerCase().includes(artistSearchQuery.toLowerCase())) ||
    artist.location.city.toLowerCase().includes(artistSearchQuery.toLowerCase())
  );
  const totalArtistPages = Math.ceil(filteredArtists.length / ITEMS_PER_PAGE);
  const paginatedArtists = filteredArtists.slice(
    (artistCurrentPage - 1) * ITEMS_PER_PAGE,
    artistCurrentPage * ITEMS_PER_PAGE
  );
  const pendingArtistCount = artists.filter(a => a.verificationStatus === "pending").length;

  // Planners
  const filteredPlanners = planners.filter(planner =>
    planner.userId.displayName.toLowerCase().includes(plannerSearchQuery.toLowerCase()) ||
    (planner.organization && planner.organization.toLowerCase().includes(plannerSearchQuery.toLowerCase()))
  );
  const totalPlannerPages = Math.ceil(filteredPlanners.length / ITEMS_PER_PAGE);
  const paginatedPlanners = filteredPlanners.slice(
    (plannerCurrentPage - 1) * ITEMS_PER_PAGE,
    plannerCurrentPage * ITEMS_PER_PAGE
  );
  const pendingPlannerCount = planners.filter(p => p.verificationStatus === "pending").length;

  const handleArtistPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalArtistPages) setArtistCurrentPage(newPage);
  };

  const handlePlannerPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPlannerPages) setPlannerCurrentPage(newPage);
  };

  if (artistError) toast.error("Failed to load artists");
  if (plannerError) toast.error("Failed to load planners");

  return (
    <>
      <PageHeader
        title="Verify Users"
        description="Manage artist and planner verification requests"
      >
        {/* Helper text or global actions could go here if needed, keeping empty for now */}
      </PageHeader>

      <Tabs defaultValue="artists" value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <TabsList className="bg-secondary/50 p-1">
            <TabsTrigger value="artists" className="gap-2">
              <Music className="w-4 h-4" />
              Artists
              {pendingArtistCount > 0 && (
                <span className="ml-1.5 bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                  {pendingArtistCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="planners" className="gap-2">
              <CalendarDays className="w-4 h-4" />
              Planners
              {pendingPlannerCount > 0 && (
                <span className="ml-1.5 bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                  {pendingPlannerCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={activeTab === "artists" ? artistSearchQuery : plannerSearchQuery}
              onChange={(e) => {
                if (activeTab === "artists") {
                  setArtistSearchQuery(e.target.value);
                  setArtistCurrentPage(1);
                } else {
                  setPlannerSearchQuery(e.target.value);
                  setPlannerCurrentPage(1);
                }
              }}
              className="pl-10 bg-secondary border-border"
            />
          </div>
        </div>

        {/* ARTISTS TAB */}
        <TabsContent value="artists" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {isLoadingArtists ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="glass-modern rounded-xl overflow-hidden h-[300px]">
                  <Skeleton className="h-24 w-full" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2 pt-4">
                      <Skeleton className="h-9 flex-1" />
                      <Skeleton className="h-9 flex-1" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              paginatedArtists.map((artist) => (
                <div key={artist._id} className="glass-modern rounded-xl overflow-hidden hover-glow">
                  {/* Header */}
                  <div className="relative h-20 sm:h-24 bg-gradient-primary">
                    <div className="absolute -bottom-8 sm:-bottom-10 left-4 sm:left-6">
                      <img
                        src={artist.profileImage.startsWith("http") ? artist.profileImage : `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${artist.profileImage}`}
                        alt={artist.userId.displayName}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-4 border-card shadow-strong bg-secondary"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.userId.displayName)}&background=random`;
                        }}
                      />
                    </div>
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                      <StatusBadge status={artist.verificationStatus === "verified" ? "approved" : artist.verificationStatus} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-10 sm:pt-14 px-4 sm:px-6 pb-4 sm:pb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
                      {artist.userId.displayName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                      <Music className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{artist.category.join(", ")}</span>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{artist.location.city}, {artist.location.state}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    {artist.verificationStatus === "pending" && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          className="flex-1 text-xs sm:text-sm"
                          onClick={() => handleVerifyArtist(artist._id)}
                        >
                          <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Verify</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs sm:text-sm"
                          onClick={() => handleRejectArtist(artist._id)}
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Reject</span>
                        </Button>
                        <Button
                          variant="glass"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => navigate(`/verify-artists/${artist._id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {artist.verificationStatus !== "pending" && (
                      <Button
                        variant="glass"
                        size="sm"
                        className="w-full text-xs sm:text-sm"
                        onClick={() => navigate(`/artist/${artist._id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Artist Pagination */}
          {!isLoadingArtists && filteredArtists.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {((artistCurrentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(artistCurrentPage * ITEMS_PER_PAGE, filteredArtists.length)} of {filteredArtists.length} artists
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleArtistPageChange(artistCurrentPage - 1)}
                  disabled={artistCurrentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalArtistPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={artistCurrentPage === page ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => handleArtistPageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleArtistPageChange(artistCurrentPage + 1)}
                  disabled={artistCurrentPage === totalArtistPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* PLANNERS TAB */}
        <TabsContent value="planners" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {isLoadingPlanners ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="glass-modern rounded-xl overflow-hidden h-[300px]">
                  <Skeleton className="h-24 w-full" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2 pt-4">
                      <Skeleton className="h-9 flex-1" />
                      <Skeleton className="h-9 flex-1" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              paginatedPlanners.map((planner) => (
                <div key={planner._id} className="glass-modern rounded-xl overflow-hidden hover-glow">
                  {/* Header */}
                  <div className="relative h-20 sm:h-24 bg-gradient-secondary">
                    <div className="absolute -bottom-8 sm:-bottom-10 left-4 sm:left-6">
                      <img
                        src={planner.profileImage?.startsWith("http") ? planner.profileImage : (planner.profileImage ? `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${planner.profileImage}` : "")}
                        alt={planner.userId.displayName}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-4 border-card shadow-strong bg-secondary"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(planner.userId.displayName)}&background=random`;
                        }}
                      />
                    </div>
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                      <StatusBadge status={planner.verificationStatus === "verified" ? "approved" : planner.verificationStatus} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-10 sm:pt-14 px-4 sm:px-6 pb-4 sm:pb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
                      {planner.userId.displayName}
                    </h3>
                    {planner.organization && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                        <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="truncate">{planner.organization}</span>
                      </div>
                    )}
                    {!planner.organization && (
                      <div className="mb-3 sm:mb-4 h-4 sm:h-5"></div> /* Spacer */
                    )}

                    <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                      {/* Planner location removed as it is not in the data structure */}
                      <div className="h-4 sm:h-5"></div>
                    </div>

                    {/* Actions */}
                    {planner.verificationStatus === "pending" && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          className="flex-1 text-xs sm:text-sm"
                          onClick={() => handleVerifyPlanner(planner._id)}
                        >
                          <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Verify</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs sm:text-sm"
                          onClick={() => handleRejectPlanner(planner._id)}
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Reject</span>
                        </Button>
                        <Button
                          variant="glass"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => navigate(`/verify-planners/${planner._id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {planner.verificationStatus !== "pending" && (
                      <Button
                        variant="glass"
                        size="sm"
                        className="w-full text-xs sm:text-sm"
                        onClick={() => navigate(`/verify-planners/${planner._id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Planner Pagination */}
          {!isLoadingPlanners && filteredPlanners.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {((plannerCurrentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(plannerCurrentPage * ITEMS_PER_PAGE, filteredPlanners.length)} of {filteredPlanners.length} planners
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePlannerPageChange(plannerCurrentPage - 1)}
                  disabled={plannerCurrentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPlannerPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={plannerCurrentPage === page ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => handlePlannerPageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePlannerPageChange(plannerCurrentPage + 1)}
                  disabled={plannerCurrentPage === totalPlannerPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <RejectionDialog
        isOpen={rejectDialog.isOpen}
        onClose={() => setRejectDialog({ ...rejectDialog, isOpen: false })}
        onConfirm={confirmRejection}
        title={`Reject ${rejectDialog.type === "artist" ? "Artist" : "Planner"}`}
        isSubmitting={rejectArtistMutation.isPending || rejectPlannerMutation.isPending}
      />
    </>
  );
}
