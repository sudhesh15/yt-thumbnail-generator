import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Eye, Plus, Share } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { type ThumbnailRequest } from "@shared/schema";

interface ThumbnailResultsProps {
  requestId: string;
  onCreateAnother: () => void;
}

export default function ThumbnailResults({ requestId, onCreateAnother }: ThumbnailResultsProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  const { data: request, isLoading } = useQuery<ThumbnailRequest>({
    queryKey: ['/api/thumbnail-requests', requestId],
    enabled: !!requestId,
  });

  const handleDownload = async (filename: string) => {
    try {
      const response = await fetch(`/api/download/${filename}`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `thumbnail_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: "Your thumbnail is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download the thumbnail.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My AI-Generated Thumbnail',
        text: 'Check out this awesome thumbnail I created with AI!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Share link copied to clipboard.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading your results...</p>
      </div>
    );
  }

  if (!request || request.status !== 'completed') {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load results. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Thumbnail is Ready!</h2>
        <p className="text-muted-foreground">Download your AI-generated thumbnail or create another one</p>
      </div>

      {/* Generated Thumbnail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="relative group">
            <img 
              src={`/api/images/${request.generatedImagePath}`} 
              alt="Generated YouTube thumbnail" 
              className="w-full aspect-video object-cover rounded-lg shadow-lg"
              data-testid="img-generated-thumbnail"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-4">
              <Button 
                variant="secondary"
                onClick={() => setIsPreviewOpen(true)}
                data-testid="button-preview-thumbnail"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button 
                onClick={() => handleDownload(request.generatedImagePath!)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-download-primary"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-foreground">Your Thumbnail</h3>
            <p className="text-sm text-muted-foreground">1280×720 • YouTube optimized</p>
          </div>
        </div>

        {/* Download Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Download Options</h3>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto p-4"
              onClick={() => handleDownload(request.generatedImagePath!)}
              data-testid="button-download-hq"
            >
              <Download className="w-5 h-5 mr-3 text-primary" />
              <div className="text-left">
                <div className="font-medium text-foreground">High Quality</div>
                <div className="text-sm text-muted-foreground">1280×720 PNG</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto p-4"
              onClick={() => handleDownload(request.generatedImagePath!)}
              data-testid="button-download-web"
            >
              <Download className="w-5 h-5 mr-3 text-primary" />
              <div className="text-left">
                <div className="font-medium text-foreground">Web Optimized</div>
                <div className="text-sm text-muted-foreground">1280×720 JPG</div>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Session History */}
      <Card className="bg-accent">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Session History</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-9 bg-muted rounded overflow-hidden">
                  <img 
                    src={`/api/images/${request.generatedImagePath}`} 
                    alt="Thumbnail history preview" 
                    className="w-full h-full object-cover"
                    data-testid="img-history-preview"
                  />
                </div>
                <div>
                  <div className="font-medium text-foreground text-sm">Generated Thumbnail</div>
                  <div className="text-xs text-muted-foreground">Generated just now</div>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => handleDownload(request.generatedImagePath!)}
                data-testid="button-download-history"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button 
          onClick={onCreateAnother}
          variant="secondary"
          data-testid="button-create-another"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Another
        </Button>
        <div className="flex space-x-4">
          <Button 
            onClick={handleShare}
            variant="outline"
            data-testid="button-share"
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button 
            onClick={() => handleDownload(request.generatedImagePath!)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-download-all"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setIsPreviewOpen(false)}
          data-testid="modal-preview"
        >
          <div className="max-w-4xl w-full">
            <img 
              src={`/api/images/${request.generatedImagePath}`} 
              alt="Thumbnail preview" 
              className="w-full rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
