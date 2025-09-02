import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Upload, CheckCircle, AlertCircle, Database, Globe, FileText } from 'lucide-react';
import { ProgramDataAutomationService, ProgramDataSource, ProgramImportResult } from '@/services/programDataAutomation';
import { useToast } from '@/hooks/use-toast';

interface ProgramDataImporterProps {
  selectedOrganization: string;
  onImportComplete?: () => void;
}

export function ProgramDataImporter({ selectedOrganization, onImportComplete }: ProgramDataImporterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<ProgramImportResult | null>(null);
  const { toast } = useToast();

  const availableSources = ProgramDataAutomationService.getAvailableDataSources();

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleImport = async () => {
    if (!selectedOrganization || selectedSources.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one data source to import from.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setImportProgress(0);
    setImportResult(null);

    try {
      const sources = availableSources.filter(s => selectedSources.includes(s.id));
      
      toast({
        title: "Import Started",
        description: `Importing programs from ${sources.length} source(s)...`,
      });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const result = await ProgramDataAutomationService.importProgramsForOrganization(
        selectedOrganization,
        sources
      );

      clearInterval(progressInterval);
      setImportProgress(100);
      setImportResult(result);

      if (result.success) {
        toast({
          title: "Import Successful",
          description: `Imported ${result.imported} programs successfully.`,
        });
        onImportComplete?.();
      } else {
        toast({
          title: "Import Completed with Errors",
          description: `Imported ${result.imported} programs, ${result.errors.length} errors occurred.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
      setImportResult({
        success: false,
        imported: 0,
        skipped: 0,
        errors: [error instanceof Error ? error.message : "Unknown error"],
        programs: []
      });
    } finally {
      setIsImporting(false);
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'api': return <Globe className="h-4 w-4" />;
      case 'scraper': return <Download className="h-4 w-4" />;
      case 'manual': return <FileText className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const getSourceTypeLabel = (type: string) => {
    switch (type) {
      case 'api': return 'API';
      case 'scraper': return 'Web Scraper';
      case 'manual': return 'Manual/CSV';
      default: return 'Unknown';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Import Program Data
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Program Data Importer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!isImporting && !importResult && (
            <>
              {/* Data Source Selection */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Available Data Sources</h3>
                  <p className="text-sm text-muted-foreground">
                    Select one or more sources to import program data from:
                  </p>
                </div>

                <div className="grid gap-3">
                  {availableSources.map(source => (
                    <Card 
                      key={source.id}
                      className={`cursor-pointer transition-colors ${
                        selectedSources.includes(source.id) 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleSourceToggle(source.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox 
                            checked={selectedSources.includes(source.id)}
                            onCheckedChange={() => handleSourceToggle(source.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getSourceIcon(source.type)}
                              <h4 className="font-medium">{source.name}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {getSourceTypeLabel(source.type)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {source.baseUrl}
                            </p>
                            {source.rateLimit && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Rate limit: {source.rateLimit} requests/minute
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedSources.length === 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Select at least one data source to begin importing programs.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Import Info */}
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Import Process</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Programs will be fetched from selected sources</li>
                    <li>• Duplicate programs will be automatically skipped</li>
                    <li>• Data will be validated and standardized</li>
                    <li>• New programs will be saved to your organization</li>
                    <li>• You'll receive a detailed import report</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleImport}
                  disabled={selectedSources.length === 0}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Import Programs ({selectedSources.length} source{selectedSources.length !== 1 ? 's' : ''})
                </Button>
              </div>
            </>
          )}

          {/* Import Progress */}
          {isImporting && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Importing Programs...</h3>
                <p className="text-muted-foreground">
                  Fetching and processing program data from selected sources
                </p>
              </div>

              <div className="space-y-2">
                <Progress value={importProgress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  {importProgress}% complete
                </p>
              </div>

              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 animate-pulse" />
                    <span className="text-sm font-medium">Processing...</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This may take a few minutes depending on the data sources selected.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Import Results */}
          {importResult && (
            <div className="space-y-4">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  importResult.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {importResult.success ? (
                    <CheckCircle className="h-8 w-8" />
                  ) : (
                    <AlertCircle className="h-8 w-8" />
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Import {importResult.success ? 'Completed' : 'Completed with Errors'}
                </h3>
              </div>

              {/* Import Statistics */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{importResult.imported}</div>
                    <div className="text-sm text-muted-foreground">Imported</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{importResult.skipped}</div>
                    <div className="text-sm text-muted-foreground">Skipped</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{importResult.errors.length}</div>
                    <div className="text-sm text-muted-foreground">Errors</div>
                  </CardContent>
                </Card>
              </div>

              {/* Error Details */}
              {importResult.errors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      Import Errors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-32">
                      <div className="space-y-1">
                        {importResult.errors.map((error, index) => (
                          <p key={index} className="text-sm text-red-600">
                            • {error}
                          </p>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsOpen(false);
                    setImportResult(null);
                    setSelectedSources([]);
                  }}
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setImportResult(null);
                    setSelectedSources([]);
                  }}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Import More Data
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
