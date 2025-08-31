import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Check, Brain, Zap, Palette, Image, Lightbulb } from "lucide-react";
import StepIndicator from "@/components/step-indicator";
import ImageUpload from "@/components/image-upload";
import CustomizationForm from "@/components/customization-form";
import GenerationProgress from "@/components/generation-progress";
import ThumbnailResults from "@/components/thumbnail-results";
import { ThemeToggle } from "@/components/theme-toggle";
import { type Customizations } from "@shared/schema";

export default function Home() {
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
            </div>
          </div>
        </div>
      </header>

      {/* Hero Landing Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b border-border">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Generate YouTube Thumbnails in{" "}
                <span className="text-primary bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  30 Seconds
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                Transform your content with AI-powered thumbnails that drive clicks and boost engagement. Upload your image, customize your style, and get professional results instantly.
              </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-3"
                  onClick={() => document.getElementById("main-content")?.scrollIntoView({ behavior: "smooth" })}
                  data-testid="button-get-started"
                >
                  Get Started Free
                  <span className="ml-2">→</span>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-3"
                  onClick={() => window.open("https://www.linkedin.com/in/sudheshhollav/", "_blank", "noopener,noreferrer")}
                  data-testid="button-view-examples"
                >
                  Contact Sales
                </Button>
                </div>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start mt-12">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">10K+</div>
                  <div className="text-sm text-muted-foreground">Thumbnails Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">30s</div>
                  <div className="text-sm text-muted-foreground">Average Generation Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">98%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                </div>
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="relative">
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6 text-center">Featured Thumbnails</h3>
                
                {/* 2x2 Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="group relative overflow-hidden rounded-lg aspect-video hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <img 
                      src="/hero-images/1.png" 
                      alt="Tech Tutorial Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <span className="font-bold text-white text-lg">Hitesh Choudhary</span>
                      <span className="block text-xs text-white/90">+2.3M Views</span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">8:42</div>
                  </div>

                  <div className="group relative overflow-hidden rounded-lg aspect-video hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <img 
                      src="/hero-images/6.png" 
                      alt="Cooking Tips Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <span className="font-bold text-white text-lg">Piyush Garg</span>
                      <span className="block text-xs text-white/90">+1.8M Views</span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">15:32</div>
                  </div>

                  <div className="group relative overflow-hidden rounded-lg aspect-video hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <img 
                      src="/hero-images/3.png" 
                      alt="Fitness Guide Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <span className="font-bold text-white text-lg">Taarak Mehta</span>
                      <span className="block text-xs text-white/90">+950K Views</span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">18:46</div>
                  </div>

                  <div className="group relative overflow-hidden rounded-lg aspect-video hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <img 
                      src="/hero-images/7.png" 
                      alt="Travel Vlog Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <span className="font-bold text-white text-lg">Technical Guruji</span>
                      <span className="block text-xs text-white/90">+1.2M Views</span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">22:15</div>
                  </div>

                  <div className="group relative overflow-hidden rounded-lg aspect-video hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <img 
                      src="/hero-images/8.png" 
                      alt="Travel Vlog Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <span className="font-bold text-white text-lg">Dhruv Rathee</span>
                      <span className="block text-xs text-white/90">+1.4M Views</span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">25:12</div>
                  </div>

                  <div className="group relative overflow-hidden rounded-lg aspect-video hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <img 
                      src="/hero-images/4.png" 
                      alt="Travel Vlog Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <span className="font-bold text-white text-lg">Sudhesh Holla</span>
                      <span className="block text-xs text-white/90">+10K Views</span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">04:05</div>
                  </div>

                </div>

                <div className="text-center">
                  <span className="text-sm text-muted-foreground">AI-Generated • Professional Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Features Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/20 rounded-2xl border border-border/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose Our <span className="text-primary">Thumbnail Generator?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your content with AI-powered thumbnails that drive clicks and boost engagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">AI-Powered Intelligence</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Advanced Gemini and GPT models understand your content and create thumbnails that convert
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Lightning Fast</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Get professional-quality thumbnails in seconds, not hours of manual design work
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Palette className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Fully Customizable</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Tailor colors, styles, and emotions to match your brand and content perfectly
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Image className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Image Integration</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Upload your own images and watch AI seamlessly blend them into stunning thumbnails
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      </main>

      {/* Pricing Section */}
      <section className="bg-accent/30 border-t border-border py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your thumbnail creation needs. Start free and upgrade as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="relative border-border bg-card hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground mb-2">Free</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">₹0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground mb-8">Perfect for getting started</p>
                  
                  <ul className="space-y-4 mb-8 text-left">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">5 thumbnails per month</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">AI-powered generation</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">Basic customization</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">1080p quality</span>
                    </li>
                  </ul>
                  
                  <Button 
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    data-testid="button-plan-free"
                  >
                    Get Started Free
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative border-primary bg-card hover:shadow-xl transition-all duration-300 scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground mb-2">Pro</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">₹499</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground mb-8">For content creators</p>
                  
                  <ul className="space-y-4 mb-8 text-left">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">100 thumbnails per month</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">Advanced AI models</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">Premium templates</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">4K quality exports</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">Priority support</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">No watermarks</span>
                    </li>
                  </ul>
                  
                  <Button 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-plan-pro"
                  >
                    Upgrade to Pro
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative border-border bg-card hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground mb-2">Enterprise</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">₹3,999</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground mb-8">For teams and agencies</p>
                  
                  <ul className="space-y-4 mb-8 text-left">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">Unlimited thumbnails</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">Team collaboration</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">Custom AI training</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">API access</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">Dedicated support</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">White-label options</span>
                    </li>
                  </ul>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => window.open("https://www.linkedin.com/in/sudheshhollav/", "_blank", "noopener,noreferrer")}
                    data-testid="button-plan-enterprise"
                  >
                    Contact Sales
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-bold text-foreground mb-8">Frequently Asked Questions</h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Can I cancel anytime?</h4>
                <p className="text-muted-foreground">Yes, you can cancel your subscription at any time. No long-term commitments required.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">What payment methods do you accept?</h4>
                <p className="text-muted-foreground">We accept all major credit cards, PayPal, and bank transfers for enterprise plans.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Is there a free trial for Pro?</h4>
                <p className="text-muted-foreground">Yes! Start with our free plan and upgrade when you need more thumbnails and features.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Do unused thumbnails roll over?</h4>
                <p className="text-muted-foreground">Unused thumbnails don't roll over, but you can upgrade or downgrade your plan anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Powered by Gemini 2.5 Flash Image Preview and GPT-4.1-mini • Built for creators</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
