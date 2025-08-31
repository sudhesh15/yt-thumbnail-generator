import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type Customizations } from "@shared/schema";
import { Zap, Briefcase, Palette } from "lucide-react";

interface CustomizationFormProps {
  customizations: Customizations;
  onChange: (customizations: Customizations) => void;
}

export default function CustomizationForm({ customizations, onChange }: CustomizationFormProps) {
  const updateField = <K extends keyof Customizations>(field: K, value: Customizations[K]) => {
    onChange({ ...customizations, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Color Scheme */}
      <div className="bg-accent rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">What color scheme do you prefer?</h3>
        <RadioGroup 
          value={customizations.colorScheme} 
          onValueChange={(value) => updateField('colorScheme', value as Customizations['colorScheme'])}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
            <RadioGroupItem value="vibrant" id="vibrant" data-testid="radio-colorscheme-vibrant" />
            <Label htmlFor="vibrant" className="text-sm text-foreground">Vibrant & Bold</Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
            <RadioGroupItem value="professional" id="professional" data-testid="radio-colorscheme-professional" />
            <Label htmlFor="professional" className="text-sm text-foreground">Professional</Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
            <RadioGroupItem value="dark" id="dark" data-testid="radio-colorscheme-dark" />
            <Label htmlFor="dark" className="text-sm text-foreground">Dark & Moody</Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
            <RadioGroupItem value="minimal" id="minimal" data-testid="radio-colorscheme-minimal" />
            <Label htmlFor="minimal" className="text-sm text-foreground">Clean & Minimal</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Text Option */}
      <div className="bg-accent rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Do you want text on your thumbnail?</h3>
        <RadioGroup 
          value={customizations.textOption} 
          onValueChange={(value) => updateField('textOption', value as Customizations['textOption'])}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
            <RadioGroupItem value="yes-title" id="yes-title" data-testid="radio-textoption-yes-title" />
            <div>
              <Label htmlFor="yes-title" className="text-sm font-medium text-foreground">Yes, include video title</Label>
              <p className="text-xs text-muted-foreground">Add your video title in large, readable text</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
            <RadioGroupItem value="yes-custom" id="yes-custom" data-testid="radio-textoption-yes-custom" />
            <div>
              <Label htmlFor="yes-custom" className="text-sm font-medium text-foreground">Yes, custom text</Label>
              <p className="text-xs text-muted-foreground">Specify your own text content</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
            <RadioGroupItem value="no" id="no" data-testid="radio-textoption-no" />
            <div>
              <Label htmlFor="no" className="text-sm font-medium text-foreground">No text needed</Label>
              <p className="text-xs text-muted-foreground">Keep it visual only</p>
            </div>
          </div>
        </RadioGroup>

        {customizations.textOption === "yes-custom" && (
          <div className="mt-4">
            <Input
              placeholder="Enter your custom text..."
              value={customizations.customText || ""}
              onChange={(e) => updateField('customText', e.target.value)}
              data-testid="input-custom-text"
            />
          </div>
        )}
      </div>

      {/* Style Preference */}
      <div className="bg-accent rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">What style matches your content?</h3>
        <RadioGroup 
          value={customizations.style} 
          onValueChange={(value) => updateField('style', value as Customizations['style'])}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
            <RadioGroupItem value="energetic" id="energetic" data-testid="radio-style-energetic" />
            <div>
              <Label htmlFor="energetic" className="block text-sm font-medium text-foreground">Energetic</Label>
              <span className="text-xs text-muted-foreground">High energy, dynamic</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
            <RadioGroupItem value="professional" id="prof-style" data-testid="radio-style-professional" />
            <div>
              <Label htmlFor="prof-style" className="block text-sm font-medium text-foreground">Professional</Label>
              <span className="text-xs text-muted-foreground">Clean, business-like</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
            <RadioGroupItem value="creative" id="creative" data-testid="radio-style-creative" />
            <div>
              <Label htmlFor="creative" className="block text-sm font-medium text-foreground">Creative</Label>
              <span className="text-xs text-muted-foreground">Artistic, unique</span>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Target Emotion */}
      <div className="bg-accent rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">What emotion should your thumbnail convey?</h3>
        <Textarea
          placeholder="e.g., excitement, curiosity, trust, urgency..."
          value={customizations.targetEmotion}
          onChange={(e) => updateField('targetEmotion', e.target.value)}
          className="w-full"
          data-testid="textarea-target-emotion"
        />
      </div>
    </div>
  );
}
