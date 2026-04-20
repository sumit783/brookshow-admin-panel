import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  Monitor, 
  Tablet, 
  Smartphone,
  Loader2 
} from "lucide-react";
import { HeroImage } from "@/api/hero";
import { cn } from "@/lib/utils";

interface HeroCardProps {
  hero: HeroImage;
  onDelete: () => void;
  isDeleting: boolean;
}

export function HeroCard({ 
  hero, 
  onDelete,
  isDeleting 
}: HeroCardProps) {
  const [view, setView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  return (
    <Card className="glass-modern border-sidebar-border overflow-hidden group hover:shadow-glow-sm transition-all duration-300">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg font-heading truncate max-w-[150px]">
            {hero.title}
          </CardTitle>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
              Order: {hero.order}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button 
            variant="ghost" 
            size="icon" 
            onClick={onDelete}
            disabled={isDeleting}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative group/image">
          <AspectRatio ratio={16 / 9} className="bg-secondary/50">
            {/* Instant Preview: Render all images and toggle visibility with CSS */}
            <img 
              src={hero.desktopUrl} 
              alt={`${hero.title} Desktop`} 
              className={cn(
                "absolute inset-0 object-cover w-full h-full transition-opacity duration-300",
                view === 'desktop' ? "opacity-100 z-10" : "opacity-0 z-0"
              )}
            />
            <img 
              src={hero.tabletUrl} 
              alt={`${hero.title} Tablet`} 
              className={cn(
                "absolute inset-0 object-cover w-full h-full transition-opacity duration-300",
                view === 'tablet' ? "opacity-100 z-10" : "opacity-0 z-0"
              )}
            />
            <img 
              src={hero.mobileUrl} 
              alt={`${hero.title} Mobile`} 
              className={cn(
                "absolute inset-0 object-cover w-full h-full transition-opacity duration-300",
                view === 'mobile' ? "opacity-100 z-10" : "opacity-0 z-0"
              )}
            />
          </AspectRatio>
          
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center bg-background/80 backdrop-blur-md rounded-full border border-border p-1 gap-1 shadow-lg opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 z-20">
            <button 
              onClick={() => setView('desktop')}
              className={cn(
                "p-2 rounded-full transition-colors",
                view === 'desktop' ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-muted-foreground"
              )}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('tablet')}
              className={cn(
                "p-2 rounded-full transition-colors",
                view === 'tablet' ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-muted-foreground"
              )}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('mobile')}
              className={cn(
                "p-2 rounded-full transition-colors",
                view === 'mobile' ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-muted-foreground"
              )}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-secondary/20 flex flex-col gap-2">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground uppercase tracking-tight font-medium">
          <span className="flex items-center gap-1.5">
            {view === 'desktop' ? <Monitor className="w-3.5 h-3.5" /> : 
             view === 'tablet' ? <Tablet className="w-3.5 h-3.5" /> : 
             <Smartphone className="w-3.5 h-3.5" />}
            {view} View
          </span>
          <span className="text-primary font-bold">Resized</span>
        </div>
      </CardFooter>
    </Card>
  );
}
