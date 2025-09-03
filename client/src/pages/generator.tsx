// client/src/pages/generator.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Check, Lightbulb } from "lucide-react";
import ImageUpload from "@/components/image-upload";
import CustomizationForm from "@/components/customization-form";
import GenerationProgress from "@/components/generation-progress";
import ThumbnailResults from "@/components/thumbnail-results";
import { ThemeToggle } from "@/components/theme-toggle";
import { type Customizations } from "@shared/schema";
import {
  SignedIn,
  SignedOut,
  UserButton,
  RedirectToSignIn
} from "@clerk/clerk-react";

export default function Generator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [customizations, setCustomizations] = useState<Customizations>({
    colorScheme: "professional",
    textOption: "yes-title",
    style: "professional",
    targetEmotion: "",
  });
  const [requestId, setRequestId] = useState<string | null>(null);

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const resetForm = () => {
    setCurrentStep(1);
    setUploadedImage(null);
    setOriginalPrompt("");
    setCustomizations({
      colorScheme: "professional",
      textOption: "yes-title",
      style: "professional",
      targetEmotion: "",
    });
    setRequestId(null);
  };

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      
      <SignedIn>
        <div className="bg-background text-foreground min-h-screen">
          {/* Header */}
          <header className="bg-card border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Play className="text-primary-foreground w-4 h-4" data-testid="logo-icon" />
                  </div>
                  <h1 className="text-xl font-bold text-foreground">THUMBNAILED.AI</h1>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-green-500 text-white rounded-full">
                    BETA
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <ThemeToggle />
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Progress Steps */}
            <div className="mb-12">
              <div className="max-w-4xl mx-auto">
                <Card className="p-8">
                  <div className="relative">
                    {/* Progress Line Background */}
                    <div className="absolute top-6 left-0 right-0 h-0.5 bg-border"></div>
                    {/* Active Progress Line */}
                    <div
                      className="absolute top-6 left-0 h-0.5 bg-primary transition-all duration-500 ease-in-out"
                      style={{
                        width: `${((currentStep - 1) / 3) * 100}%`
                      }}
                    ></div>

                    {/* Steps Container */}
                    <div className="relative grid grid-cols-4 gap-4">
                      {[
                        { step: 1, title: "Upload & Prompt" },
                        { step: 2, title: "Customize" },
                        { step: 3, title: "Generate" },
                        { step: 4, title: "Download" }
                      ].map(({ step, title }) => (
                        <div key={step} className="flex flex-col items-center text-center">
                          {/* Circle */}
                          <div
                            className={`
                              relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-semibold mb-3 transition-all duration-300
                              ${currentStep > step
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                : currentStep === step
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-4 ring-primary/20"
                                : "bg-muted text-muted-foreground border-2 border-border"
                              }
                            `}
                            data-testid={`step-indicator-${step}`}
                          >
                            {currentStep > step ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <span className="text-sm font-bold">{step}</span>
                            )}
                          </div>

                          {/* Title */}
                          <span
                            className={`
                              text-sm font-medium max-w-[100px] leading-tight
                              ${currentStep >= step ? "text-foreground" : "text-muted-foreground"}
                            `}
                          >
                            {title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Step 1: Upload and Initial Prompt */}
            {currentStep === 1 && (
              <Card className="mb-12">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Create Your Thumbnail</h2>
                  <p className="text-muted-foreground mb-8">Upload an image and describe your vision to get started</p>

                  <div className="grid lg:grid-cols-2 gap-8">
                    <ImageUpload
                      onFileSelect={setUploadedImage}
                      uploadedImage={uploadedImage}
                    />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Describe Your Thumbnail</h3>
                      <div className="space-y-4">
                        <textarea
                          className="w-full h-32 p-4 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                          placeholder="I want to create a YouTube thumbnail for my video about..."
                          value={originalPrompt}
                          onChange={(e) => setOriginalPrompt(e.target.value)}
                          data-testid="textarea-prompt"
                        />

                        <div className="bg-accent rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-primary text-xs"><Lightbulb className="w-8 h-8 text-yellow-600" /></span>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-foreground mb-1">Pro Tip</h4>
                              <p className="text-sm text-muted-foreground">Be specific about your video topic, target audience, and the emotion you want to convey. This helps our AI create better thumbnails!</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button
                      onClick={nextStep}
                      disabled={!uploadedImage || !originalPrompt.trim()}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      data-testid="button-continue-step1"
                    >
                      Continue
                      <span className="ml-2">→</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Customization */}
            {currentStep === 2 && (
              <Card className="mb-12">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Customize Your Style</h2>
                  <p className="text-muted-foreground mb-8">Answer a few questions to help us create the perfect thumbnail</p>

                  <CustomizationForm
                    customizations={customizations}
                    onChange={setCustomizations}
                  />

                  <div className="flex justify-between mt-8">
                    <Button
                      onClick={prevStep}
                      variant="secondary"
                      data-testid="button-back-step2"
                    >
                      ← Back
                    </Button>
                    <Button
                      onClick={nextStep}
                      disabled={!customizations.targetEmotion.trim()}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      data-testid="button-continue-step2"
                    >
                      Review & Generate
                      <span className="ml-2">→</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Generation */}
            {currentStep === 3 && (
              <Card className="mb-12">
                <CardContent className="p-8">
                  <GenerationProgress
                    originalPrompt={originalPrompt}
                    customizations={customizations}
                    uploadedImage={uploadedImage!}
                    onComplete={(id) => {
                      setRequestId(id);
                      setCurrentStep(4);
                    }}
                    onBack={prevStep}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 4: Results */}
            {currentStep === 4 && requestId && (
              <Card className="mb-12">
                <CardContent className="p-8">
                  <ThumbnailResults
                    requestId={requestId}
                    onCreateAnother={resetForm}
                  />
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </SignedIn>
    </>
  );
}
