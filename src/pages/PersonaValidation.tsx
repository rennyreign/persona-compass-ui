import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { PersonaValidation } from "@/components/persona/PersonaValidation";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Persona } from '@/types/persona';

export default function PersonaValidationPage() {
  const { personaId } = useParams();
  const navigate = useNavigate();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (personaId) {
      fetchPersona();
    }
  }, [personaId]);

  const fetchPersona = async () => {
    try {
      const { data, error } = await supabase
        .from('personas')
        .select('*')
        .eq('id', personaId)
        .single();

      if (error) throw error;
      setPersona(data);
    } catch (error) {
      console.error('Error fetching persona:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopHeader />
          <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-1/3"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopHeader />
          <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto px-6 py-8">
              <Card>
                <CardContent className="pt-6">
                  <p>Persona not found.</p>
                  <Button 
                    onClick={() => navigate('/')}
                    className="mt-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  Persona Validation
                </h1>
                <p className="text-muted-foreground">
                  Ensure {persona.name} has complete data for effective campaign targeting
                </p>
              </div>
            </div>

            {/* Persona Overview */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{persona.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Program Category:</span>
                    <p>{persona.program_category || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Age Range:</span>
                    <p>{persona.age_range || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Occupation:</span>
                    <p>{persona.occupation || 'Not specified'}</p>
                  </div>
                </div>
                {persona.description && (
                  <div className="mt-4">
                    <span className="font-medium text-muted-foreground">Description:</span>
                    <p className="mt-1">{persona.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Validation Component */}
            <PersonaValidation persona={persona} />
          </div>
        </div>
      </div>
    </div>
  );
}