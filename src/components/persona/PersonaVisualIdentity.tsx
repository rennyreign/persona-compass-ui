import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Images } from "lucide-react";

interface PersonaVisualIdentityProps {
  images: string[];
  personaName: string;
}

export function PersonaVisualIdentity({ images, personaName }: PersonaVisualIdentityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Images className="w-5 h-5 text-primary" />
          <span>Visual Identity</span>
        </CardTitle>
        <CardDescription>
          Visual mood board representing {personaName}'s aesthetic and style preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden rounded-lg bg-muted hover:opacity-90 transition-opacity cursor-pointer group"
            >
              <img
                src={imageUrl}
                alt={`${personaName} visual identity ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          This mood board helps visualize the aesthetic preferences and lifestyle of {personaName}, 
          providing creative direction for marketing materials and campaign imagery.
        </p>
      </CardContent>
    </Card>
  );
}