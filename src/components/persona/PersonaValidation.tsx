import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Edit,
  Plus
} from 'lucide-react';
import { Persona } from '@/types/persona';
import { useNavigate } from 'react-router-dom';

interface ValidationResult {
  field: string;
  status: 'complete' | 'partial' | 'missing';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

interface PersonaValidationProps {
  persona: Persona;
  showActions?: boolean;
  className?: string;
}

export function PersonaValidation({ persona, showActions = true, className }: PersonaValidationProps) {
  const navigate = useNavigate();

  const validatePersona = (persona: Persona): ValidationResult[] => {
    const results: ValidationResult[] = [];

    // Basic Information
    results.push({
      field: 'Basic Info',
      status: persona.name && persona.description ? 'complete' : 'missing',
      message: persona.name && persona.description 
        ? 'Name and description are complete' 
        : 'Missing name or description',
      priority: 'high'
    });

    // Demographics
    const demographics = [persona.age_range, persona.occupation, persona.industry, persona.education_level].filter(Boolean);
    results.push({
      field: 'Demographics',
      status: demographics.length >= 3 ? 'complete' : demographics.length >= 1 ? 'partial' : 'missing',
      message: `${demographics.length}/4 demographic fields completed`,
      priority: 'high'
    });

    // Psychographics
    const psychographics = [
      ...(persona.personality_traits || []),
      ...(persona.values || []),
      ...(persona.goals || []),
      ...(persona.pain_points || [])
    ];
    results.push({
      field: 'Psychographics',
      status: psychographics.length >= 6 ? 'complete' : psychographics.length >= 3 ? 'partial' : 'missing',
      message: `${psychographics.length} psychographic traits defined`,
      priority: 'medium'
    });

    // Preferred Channels
    const channels = persona.preferred_channels || [];
    results.push({
      field: 'Marketing Channels',
      status: channels.length >= 3 ? 'complete' : channels.length >= 1 ? 'partial' : 'missing',
      message: `${channels.length} preferred channels selected`,
      priority: 'high'
    });

    // Visual Identity
    results.push({
      field: 'Visual Identity',
      status: persona.avatar_url ? 'complete' : 'missing',
      message: persona.avatar_url ? 'Avatar image set' : 'No avatar image',
      priority: 'low'
    });

    // Program Category
    results.push({
      field: 'Program Category',
      status: persona.program_category ? 'complete' : 'missing',
      message: persona.program_category ? `Categorized as ${persona.program_category}` : 'No program category assigned',
      priority: 'medium'
    });

    return results;
  };

  const validation = validatePersona(persona);
  const completionRate = Math.round((validation.filter(v => v.status === 'complete').length / validation.length) * 100);
  const isReadyForCampaigns = validation.filter(v => v.priority === 'high').every(v => v.status !== 'missing');
  
  const getStatusIcon = (status: ValidationResult['status']) => {
    switch (status) {
      case 'complete': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'partial': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'missing': return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: ValidationResult['status']) => {
    switch (status) {
      case 'complete': return 'text-green-600';
      case 'partial': return 'text-yellow-600';
      case 'missing': return 'text-red-600';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Persona Readiness</span>
            <Badge 
              variant={isReadyForCampaigns ? "default" : "destructive"}
              className="ml-2"
            >
              {completionRate}% Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isReadyForCampaigns && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This persona needs more complete data before it can be used effectively in campaigns. 
                Focus on completing the high-priority missing fields.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            {validation.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <p className="font-medium">{result.field}</p>
                    <p className={`text-sm ${getStatusColor(result.status)}`}>
                      {result.message}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={result.priority === 'high' ? 'destructive' : result.priority === 'medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {result.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {showActions && (
            <div className="flex gap-2 mt-6">
              <Button 
                onClick={() => navigate(`/edit-persona/${persona.id}`)}
                size="sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Complete Persona
              </Button>
              
              {isReadyForCampaigns && (
                <Button 
                  onClick={() => navigate('/campaigns')}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}