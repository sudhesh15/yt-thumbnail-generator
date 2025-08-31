import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Customizations } from "@shared/schema";

interface GenerationProgressProps {
  originalPrompt: string;
  customizations: Customizations;
  uploadedImage: string;
  onComplete: (requestId: string) => void;
  onBack: () => void;
}

interface GenerationStep {
  id: string;
  title: string;
  description: string;
  progress: number;
}

const generationSteps: GenerationStep[] = [
  {
    id: "analyzing",
    title: "Analyzing your requirements",
    description: "Processing your prompt and customizations",
    progress: 25,
  },
  {
    id: "refining",
    title: "Enhancing prompt with GPT-5",
    description: "Creating detailed generation instructions",
    progress: 50,
  },
  {
    id: "generating",
    title: "Generating thumbnail with Gemini",
    description: "Creating your custom thumbnail",
    progress: 75,
  },
  {
    id: "finalizing",
    title: "Preparing download",
    description: "Optimizing and preparing files",
    progress: 100,
  },
];

export default function GenerationProgress({ 
  originalPrompt, 
  customizations, 
  uploadedImage, 
  onComplete, 
  onBack 
}: GenerationProgressProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [refinedPrompt, setRefinedPrompt] = useState<string | null>(null);
  const { toast } = useToast();

  const createRequestMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/thumbnail-requests', {
        originalPrompt,
        customizations,
        uploadedImagePath: uploadedImage,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setRequestId(data.id);
      setTimeout(() => setCurrentStepIndex(1), 1000);
    },
    onError: () => {
      toast({
        title: "Failed to start generation",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const refinePromptMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('POST', `/api/thumbnail-requests/${id}/refine`);
      return response.json();
    },
    onSuccess: (data) => {
      setRefinedPrompt(data.refinedPrompt);
      setTimeout(() => setCurrentStepIndex(2), 1000);
    },
    onError: () => {
      toast({
        title: "Failed to refine prompt",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateImageMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('POST', `/api/thumbnail-requests/${id}/generate`);
      return response.json();
    },
    onSuccess: () => {
      setTimeout(() => setCurrentStepIndex(3), 1000);
    },
    onError: () => {
      toast({
        title: "Failed to generate image",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Start the generation process
    createRequestMutation.mutate();
  }, []);

  useEffect(() => {
    if (requestId && currentStepIndex === 1) {
      refinePromptMutation.mutate(requestId);
    } else if (requestId && currentStepIndex === 2) {
      generateImageMutation.mutate(requestId);
    } else if (requestId && currentStepIndex === 3) {
      setTimeout(() => {
        onComplete(requestId);
      }, 1000);
    }
  }, [currentStepIndex, requestId]);

  const currentStep = generationSteps[currentStepIndex];
  const isError = createRequestMutation.isError || refinePromptMutation.isError || generateImageMutation.isError;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Generating Your Thumbnail</h2>
        <p className="text-muted-foreground">We're crafting the perfect thumbnail based on your preferences</p>
      </div>

      {/* Refined Prompt Preview */}
      {refinedPrompt && (
        <div className="bg-accent rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Refined Prompt</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Your Original Prompt:</h4>
              <p className="text-sm text-foreground bg-background p-3 rounded border" data-testid="text-original-prompt">
                {originalPrompt}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">AI-Enhanced Prompt:</h4>
              <p className="text-sm text-foreground bg-background p-3 rounded border" data-testid="text-refined-prompt">
                {refinedPrompt}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Display */}
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-primary text-xl">✨</span>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="text-current-step">
            {isError ? "Generation failed" : currentStep.title}
          </h3>
          <p className="text-muted-foreground" data-testid="text-step-description">
            {isError ? "Please try again" : currentStep.description}
          </p>
        </div>
        
        <Progress value={currentStep.progress} className="w-full" />
        
        <div className="space-y-3">
          {generationSteps.map((step, index) => (
            <div key={step.id} className="flex items-center space-x-3">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  index < currentStepIndex 
                    ? "bg-success text-white" 
                    : index === currentStepIndex 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}
                data-testid={`step-indicator-${step.id}`}
              >
                {index < currentStepIndex ? (
                  <Check className="w-4 h-4" />
                ) : index === currentStepIndex ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  index + 1
                )}
              </div>
              <span 
                className={`text-sm ${
                  index <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button 
          onClick={onBack}
          variant="secondary"
          disabled={currentStepIndex > 0}
          data-testid="button-back-generation"
        >
          ← Back
        </Button>
        <Button 
          variant="destructive"
          data-testid="button-cancel-generation"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
