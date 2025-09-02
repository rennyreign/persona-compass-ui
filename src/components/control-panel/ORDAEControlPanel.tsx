import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Eye, 
  Database, 
  Target, 
  Play, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Settings,
  Pause,
  RotateCcw,
  Zap,
  Clock,
  TrendingUp,
  Users,
  BarChart3,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AgentStatus {
  id: string;
  name: string;
  type: 'analyst' | 'memory' | 'strategist' | 'director' | 'critic';
  status: 'active' | 'idle' | 'processing' | 'error' | 'offline';
  lastActivity: string;
  currentTask: string;
  performance: {
    tasksCompleted: number;
    averageResponseTime: number;
    successRate: number;
    memoryUsage: number;
  };
  metrics: {
    totalOperations: number;
    errorCount: number;
    uptime: string;
  };
}

interface ORDAECycle {
  id: string;
  startTime: string;
  endTime?: string;
  status: 'running' | 'completed' | 'failed';
  currentStep: 'observe' | 'remember' | 'decide' | 'act' | 'evaluate';
  stepProgress: number;
  context: string;
  results?: {
    observations: number;
    memoriesStored: number;
    decisionsGenerated: number;
    actionsExecuted: number;
    evaluationScore: number;
  };
}

interface SystemHealth {
  overall: number;
  vectorMemory: number;
  llmConnections: number;
  dataIntegrity: number;
  responseLatency: number;
}

export function ORDAEControlPanel() {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [cycles, setCycles] = useState<ORDAECycle[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 0,
    vectorMemory: 0,
    llmConnections: 0,
    dataIntegrity: 0,
    responseLatency: 0
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate initial data load
    initializeControlPanel();
    
    if (isMonitoring) {
      const interval = setInterval(updateSystemStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const initializeControlPanel = () => {
    // Mock agent data
    const mockAgents: AgentStatus[] = [
      {
        id: 'analyst-001',
        name: 'Analyst Agent',
        type: 'analyst',
        status: 'active',
        lastActivity: '2 minutes ago',
        currentTask: 'Analyzing persona engagement patterns',
        performance: {
          tasksCompleted: 47,
          averageResponseTime: 1.2,
          successRate: 94,
          memoryUsage: 67
        },
        metrics: {
          totalOperations: 1247,
          errorCount: 3,
          uptime: '99.7%'
        }
      },
      {
        id: 'memory-001',
        name: 'Memory Layer',
        type: 'memory',
        status: 'processing',
        lastActivity: '30 seconds ago',
        currentTask: 'Storing campaign insights to vector database',
        performance: {
          tasksCompleted: 156,
          averageResponseTime: 0.8,
          successRate: 98,
          memoryUsage: 45
        },
        metrics: {
          totalOperations: 3421,
          errorCount: 1,
          uptime: '99.9%'
        }
      },
      {
        id: 'strategist-001',
        name: 'Strategist Agent',
        type: 'strategist',
        status: 'idle',
        lastActivity: '5 minutes ago',
        currentTask: 'Awaiting decision request',
        performance: {
          tasksCompleted: 23,
          averageResponseTime: 2.1,
          successRate: 91,
          memoryUsage: 34
        },
        metrics: {
          totalOperations: 567,
          errorCount: 2,
          uptime: '98.8%'
        }
      },
      {
        id: 'director-001',
        name: 'Director Agent',
        type: 'director',
        status: 'active',
        lastActivity: '1 minute ago',
        currentTask: 'Orchestrating campaign optimization',
        performance: {
          tasksCompleted: 34,
          averageResponseTime: 1.8,
          successRate: 89,
          memoryUsage: 52
        },
        metrics: {
          totalOperations: 892,
          errorCount: 5,
          uptime: '97.2%'
        }
      },
      {
        id: 'critic-001',
        name: 'Critic Agent',
        type: 'critic',
        status: 'processing',
        lastActivity: '45 seconds ago',
        currentTask: 'Evaluating campaign performance metrics',
        performance: {
          tasksCompleted: 67,
          averageResponseTime: 1.5,
          successRate: 96,
          memoryUsage: 41
        },
        metrics: {
          totalOperations: 1834,
          errorCount: 2,
          uptime: '99.4%'
        }
      }
    ];

    const mockCycles: ORDAECycle[] = [
      {
        id: 'cycle-001',
        startTime: '2024-01-15 14:30:00',
        status: 'running',
        currentStep: 'act',
        stepProgress: 67,
        context: 'MBA Career Changer campaign optimization',
        results: {
          observations: 12,
          memoriesStored: 8,
          decisionsGenerated: 3,
          actionsExecuted: 2,
          evaluationScore: 0
        }
      },
      {
        id: 'cycle-002',
        startTime: '2024-01-15 14:15:00',
        endTime: '2024-01-15 14:28:00',
        status: 'completed',
        currentStep: 'evaluate',
        stepProgress: 100,
        context: 'Healthcare Professional persona analysis',
        results: {
          observations: 15,
          memoriesStored: 12,
          decisionsGenerated: 4,
          actionsExecuted: 4,
          evaluationScore: 87
        }
      },
      {
        id: 'cycle-003',
        startTime: '2024-01-15 13:45:00',
        endTime: '2024-01-15 14:02:00',
        status: 'completed',
        currentStep: 'evaluate',
        stepProgress: 100,
        context: 'Cross-channel attribution analysis',
        results: {
          observations: 18,
          memoriesStored: 14,
          decisionsGenerated: 5,
          actionsExecuted: 5,
          evaluationScore: 92
        }
      }
    ];

    setAgents(mockAgents);
    setCycles(mockCycles);
    setSystemHealth({
      overall: 94,
      vectorMemory: 97,
      llmConnections: 89,
      dataIntegrity: 98,
      responseLatency: 92
    });
  };

  const updateSystemStatus = () => {
    // Simulate real-time updates
    setAgents(prev => prev.map(agent => ({
      ...agent,
      performance: {
        ...agent.performance,
        memoryUsage: Math.max(20, Math.min(80, agent.performance.memoryUsage + (Math.random() - 0.5) * 10))
      }
    })));

    setSystemHealth(prev => ({
      overall: Math.max(85, Math.min(99, prev.overall + (Math.random() - 0.5) * 5)),
      vectorMemory: Math.max(90, Math.min(100, prev.vectorMemory + (Math.random() - 0.5) * 3)),
      llmConnections: Math.max(80, Math.min(95, prev.llmConnections + (Math.random() - 0.5) * 8)),
      dataIntegrity: Math.max(95, Math.min(100, prev.dataIntegrity + (Math.random() - 0.5) * 2)),
      responseLatency: Math.max(85, Math.min(98, prev.responseLatency + (Math.random() - 0.5) * 6))
    }));
  };

  const handleAgentAction = (agentId: string, action: 'start' | 'pause' | 'restart' | 'configure') => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    let message = '';
    switch (action) {
      case 'start':
        message = `${agent.name} activated`;
        break;
      case 'pause':
        message = `${agent.name} paused`;
        break;
      case 'restart':
        message = `${agent.name} restarted`;
        break;
      case 'configure':
        message = `${agent.name} configuration updated`;
        break;
    }

    toast({
      title: "Agent Action",
      description: message,
    });

    // Update agent status
    setAgents(prev => prev.map(a => 
      a.id === agentId 
        ? { ...a, status: action === 'pause' ? 'idle' : 'active' as any }
        : a
    ));
  };

  const startORDAECycle = () => {
    const newCycle: ORDAECycle = {
      id: `cycle-${Date.now()}`,
      startTime: new Date().toISOString(),
      status: 'running',
      currentStep: 'observe',
      stepProgress: 0,
      context: 'Manual ORDAE cycle initiated',
      results: {
        observations: 0,
        memoriesStored: 0,
        decisionsGenerated: 0,
        actionsExecuted: 0,
        evaluationScore: 0
      }
    };

    setCycles(prev => [newCycle, ...prev]);
    setIsMonitoring(true);

    toast({
      title: "ORDAE Cycle Started",
      description: "New analysis cycle initiated across all agents",
    });
  };

  const getStatusIcon = (status: AgentStatus['status']) => {
    switch (status) {
      case 'active':
        return <Activity className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Zap className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'idle':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'offline':
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAgentIcon = (type: AgentStatus['type']) => {
    switch (type) {
      case 'analyst':
        return <Eye className="w-5 h-5 text-blue-600" />;
      case 'memory':
        return <Database className="w-5 h-5 text-purple-600" />;
      case 'strategist':
        return <Target className="w-5 h-5 text-green-600" />;
      case 'director':
        return <Users className="w-5 h-5 text-orange-600" />;
      case 'critic':
        return <BarChart3 className="w-5 h-5 text-red-600" />;
    }
  };

  const getStepIcon = (step: ORDAECycle['currentStep']) => {
    switch (step) {
      case 'observe':
        return <Eye className="w-4 h-4" />;
      case 'remember':
        return <Database className="w-4 h-4" />;
      case 'decide':
        return <Target className="w-4 h-4" />;
      case 'act':
        return <Play className="w-4 h-4" />;
      case 'evaluate':
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Panel Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">ORDAE Control Panel</h2>
            <p className="text-muted-foreground">Agent monitoring and system management</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant={isMonitoring ? "default" : "secondary"} className="flex items-center space-x-1">
            <Activity className="w-3 h-3" />
            <span>{isMonitoring ? 'Monitoring' : 'Idle'}</span>
          </Badge>
          <Button 
            onClick={() => setIsMonitoring(!isMonitoring)}
            variant={isMonitoring ? "destructive" : "default"}
          >
            {isMonitoring ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Button>
          <Button onClick={startORDAECycle} className="flex items-center space-x-2">
            <RotateCcw className="w-4 h-4" />
            <span>New Cycle</span>
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{systemHealth.overall}%</div>
            <Progress value={systemHealth.overall} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Vector Memory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{systemHealth.vectorMemory}%</div>
            <Progress value={systemHealth.vectorMemory} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">LLM Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemHealth.llmConnections}%</div>
            <Progress value={systemHealth.llmConnections} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Data Integrity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{systemHealth.dataIntegrity}%</div>
            <Progress value={systemHealth.dataIntegrity} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Response Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{systemHealth.responseLatency}%</div>
            <Progress value={systemHealth.responseLatency} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agents">Agent Status</TabsTrigger>
          <TabsTrigger value="cycles">ORDAE Cycles</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getAgentIcon(agent.type)}
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(agent.status)}
                      <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                        {agent.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Task</p>
                    <p className="text-sm font-medium">{agent.currentTask}</p>
                    <p className="text-xs text-muted-foreground mt-1">Last activity: {agent.lastActivity}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Tasks Completed</p>
                      <p className="font-semibold">{agent.performance.tasksCompleted}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Success Rate</p>
                      <p className="font-semibold">{agent.performance.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Response</p>
                      <p className="font-semibold">{agent.performance.averageResponseTime}s</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Uptime</p>
                      <p className="font-semibold">{agent.metrics.uptime}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory Usage</span>
                      <span>{agent.performance.memoryUsage}%</span>
                    </div>
                    <Progress value={agent.performance.memoryUsage} className="h-2" />
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAgentAction(agent.id, agent.status === 'active' ? 'pause' : 'start')}
                    >
                      {agent.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAgentAction(agent.id, 'restart')}
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAgentAction(agent.id, 'configure')}
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cycles" className="space-y-4">
          <div className="space-y-4">
            {cycles.map((cycle) => (
              <Card key={cycle.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getStepIcon(cycle.currentStep)}
                        <CardTitle className="text-lg">ORDAE Cycle {cycle.id.split('-')[1]}</CardTitle>
                      </div>
                      <Badge variant={cycle.status === 'completed' ? 'default' : cycle.status === 'running' ? 'secondary' : 'destructive'}>
                        {cycle.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Started: {new Date(cycle.startTime).toLocaleTimeString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Context</p>
                    <p className="text-sm font-medium">{cycle.context}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Current Step: {cycle.currentStep.toUpperCase()}</span>
                      <span className="text-sm text-muted-foreground">{cycle.stepProgress}%</span>
                    </div>
                    <Progress value={cycle.stepProgress} className="h-2" />
                  </div>

                  {cycle.results && (
                    <div className="grid grid-cols-5 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground">Observations</p>
                        <p className="font-semibold text-blue-600">{cycle.results.observations}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Memories</p>
                        <p className="font-semibold text-purple-600">{cycle.results.memoriesStored}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Decisions</p>
                        <p className="font-semibold text-green-600">{cycle.results.decisionsGenerated}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Actions</p>
                        <p className="font-semibold text-orange-600">{cycle.results.actionsExecuted}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Score</p>
                        <p className="font-semibold text-red-600">{cycle.results.evaluationScore || 'N/A'}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">14:32:15</span>
                  <Badge variant="default" className="text-xs">INFO</Badge>
                  <span>Analyst Agent completed persona engagement analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">14:31:42</span>
                  <Badge variant="secondary" className="text-xs">DEBUG</Badge>
                  <span>Memory Layer stored 8 new insights to vector database</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">14:30:18</span>
                  <Badge variant="default" className="text-xs">INFO</Badge>
                  <span>ORDAE Cycle cycle-001 initiated for MBA Career Changer optimization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">14:29:55</span>
                  <Badge variant="destructive" className="text-xs">WARN</Badge>
                  <span>Director Agent: High memory usage detected (78%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">14:28:33</span>
                  <Badge variant="default" className="text-xs">INFO</Badge>
                  <span>Critic Agent evaluation completed with score: 87/100</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">14:27:12</span>
                  <Badge variant="secondary" className="text-xs">DEBUG</Badge>
                  <span>Vector similarity search completed: 0.89 relevance score</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
