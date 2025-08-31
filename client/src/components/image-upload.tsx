import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudUpload, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onFileSelect: (filePath: string) => void;
  uploadedImage: string | null;
}

export default function ImageUpload({ onFileSelect, uploadedImage }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await apiRequest('POST', '/api/upload', formData);
      return response.json();
    },
    onSuccess: (data) => {
      onFileSelect(data.filePath);
      toast({
        title: "Image uploaded successfully",
        description: "Your image has been uploaded and analyzed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPG, PNG, or WebP image.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeImage = () => {
    onFileSelect("");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Upload Source Image</h3>
      
      {!uploadedImage ? (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            isDragOver 
              ? "border-primary bg-accent" 
              : "border-border hover:border-primary hover:bg-accent"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
          data-testid="upload-dropzone"
        >
          <div className="w-16 h-16 mx-auto bg-accent rounded-full flex items-center justify-center mb-4">
            <CloudUpload className="w-8 h-8 text-muted-foreground" />
          </div>
          <h4 className="text-lg font-medium text-foreground mb-2">
            {uploadMutation.isPending ? "Uploading..." : "Drag & drop your image here"}
          </h4>
          <p className="text-muted-foreground mb-4">or click to browse files</p>
          <Button 
            type="button"
            disabled={uploadMutation.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-choose-file"
          >
            {uploadMutation.isPending ? "Uploading..." : "Choose File"}
          </Button>
          <p className="text-xs text-muted-foreground mt-3">Support: JPG, PNG, WebP • Max size: 10MB</p>
          
          <input
            id="file-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileInput}
            className="hidden"
            data-testid="input-file"
          />
        </div>
      ) : (
        <div className="relative">
          <img 
            src={`/api/images/${uploadedImage}`} 
            alt="Uploaded preview" 
            className="w-full rounded-lg shadow-sm"
            data-testid="img-uploaded-preview"
          />
          <Button
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2 w-8 h-8 p-0"
            onClick={removeImage}
            data-testid="button-remove-image"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
