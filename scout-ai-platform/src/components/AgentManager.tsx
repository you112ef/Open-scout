import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Code,
  Search,
  Image,
  FileText,
  Database,
  Globe,
  Zap,
  Play,
  Pause,
  Square,
  MoreHorizontal,
  AlertCircle,
  Plus,
  Settings
} from 'lucide-react';
import { AIServiceManager } from '../services/ai-services';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  tool: string;
  createdAt: Date;
  estimatedDuration?: number;
  result?: string;
  error?: string;
  aiProvider?: 'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'cohere' | 'mistral';
  prompt?: string;
}

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  status: 'available' | 'busy' | 'disabled';
  currentTask?: string;
  requiresAI?: boolean;
}

export default function AgentManager() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'إنشاء وثائق API',
      description: 'توليد وثائق تفصيلية لـ APIs المشروع باستخدام AI',
      status: 'running',
      progress: 65,
      tool: 'ai-documentation',
      createdAt: new Date(),
      estimatedDuration: 120,
      aiProvider: 'openai',
      prompt: 'قم بتوليد وثائق API شاملة للمشروع'
    },
    {
      id: '2',
      title: 'مراجعة الكود بالذكاء الاصطناعي',
      description: 'استخدام Claude لمراجعة وتحسين جودة الكود',
      status: 'completed',
      progress: 100,
      tool: 'ai-code-review',
      createdAt: new Date(Date.now() - 600000),
      result: 'تم العثور على 5 تحسينات وتطبيقها بنجاح',
      aiProvider: 'anthropic'
    },
    {
      id: '3',
      title: 'تحليل الأداء الذكي',
      description: 'تحليل أداء التطبيق واقتراح تحسينات باستخدام Gemini',
      status: 'pending',
      progress: 0,
      tool: 'ai-performance',
      createdAt: new Date(),
      aiProvider: 'gemini'
    }
  ]);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskProvider, setNewTaskProvider] = useState<'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'cohere' | 'mistral'>('openai');
  const [showAddTask, setShowAddTask] = useState(false);
  
  const aiService = useRef(new AIServiceManager());
  const [oldTasks] = useState<Task[]>([
    {
      id: 'old1',
      title: 'تحليل كود React',
      description: 'فحص وتحليل مكونات React للبحث عن التحسينات',
      status: 'completed',
      progress: 100,
      tool: 'code-analyzer',
      createdAt: new Date(Date.now() - 3600000),
      result: 'تم العثور على 3 تحسينات وتطبيقها'
    },
    {
      id: 'old2',
      title: 'ضغط الصور',
      description: 'ضغط وتحسين صور المشروع',
      status: 'completed',
      progress: 100,
      tool: 'image-processor',
      createdAt: new Date(Date.now() - 7200000),
      result: 'تم ضغط 15 صورة بنجاح'
    }
  ]);

  const [tools] = useState<Tool[]>([
    {
      id: 'ai-chat',
      name: 'محادثة ذكية',
      icon: <Zap className="h-5 w-5" />,
      description: 'محادثة تفاعلية مع نماذج الذكاء الاصطناعي المختلفة',
      status: 'available',
      requiresAI: true
    },
    {
      id: 'ai-code-review',
      name: 'مراجعة الكود',
      icon: <Code className="h-5 w-5" />,
      description: 'مراجعة وتحسين الكود باستخدام الذكاء الاصطناعي',
      status: 'available',
      requiresAI: true
    },
    {
      id: 'ai-documentation',
      name: 'توليد الوثائق',
      icon: <FileText className="h-5 w-5" />,
      description: 'إنشاء وثائق تفصيلية للمشاريع تلقائياً',
      status: 'busy',
      currentTask: 'إنشاء وثائق API',
      requiresAI: true
    },
    {
      id: 'ai-image-gen',
      name: 'توليد الصور',
      icon: <Image className="h-5 w-5" />,
      description: 'إنشاء ومعالجة الصور باستخدام DALL-E',
      status: 'available',
      requiresAI: true
    },
    {
      id: 'ai-performance',
      name: 'تحليل الأداء',
      icon: <Search className="h-5 w-5" />,
      description: 'تحليل أداء التطبيق وتقديم اقتراحات للتحسين',
      status: 'available',
      requiresAI: true
    },
    {
      id: 'database-manager',
      name: 'مدير قواعد البيانات',
      icon: <Database className="h-5 w-5" />,
      description: 'إدارة والتعامل مع قواعد البيانات',
      status: 'disabled'
    },
    {
      id: 'api-tester',
      name: 'مختبر APIs',
      icon: <Globe className="h-5 w-5" />,
      description: 'اختبار وفحص APIs والخدمات الخارجية',
      status: 'available'
    },
    {
      id: 'code-analyzer',
      name: 'محلل الكود',
      icon: <Code className="h-5 w-5" />,
      description: 'تحليل وفحص الكود للبحث عن التحسينات والأخطاء',
      status: 'busy',
      currentTask: 'تحليل كود React'
    },
    {
      id: 'web-search',
      name: 'البحث الذكي',
      icon: <Search className="h-5 w-5" />,
      description: 'البحث في الإنترنت وجمع المعلومات',
      status: 'available'
    },
    {
      id: 'image-processor',
      name: 'معالج الصور',
      icon: <Image className="h-5 w-5" />,
      description: 'تحرير ومعالجة الصور والرسوميات',
      status: 'available'
    },
    {
      id: 'document-generator',
      name: 'منشئ المستندات',
      icon: <FileText className="h-5 w-5" />,
      description: 'إنشاء وتحرير المستندات والتقارير',
      status: 'available'
    },
    {
      id: 'database-manager',
      name: 'مدير قواعد البيانات',
      icon: <Database className="h-5 w-5" />,
      description: 'إدارة والتعامل مع قواعد البيانات',
      status: 'disabled'
    },
    {
      id: 'api-tester',
      name: 'مختبر APIs',
      icon: <Globe className="h-5 w-5" />,
      description: 'اختبار وفحص APIs والخدمات الخارجية',
      status: 'available'
    }
  ]);

  const [agentStatus, setAgentStatus] = useState<'idle' | 'working' | 'error'>('working');
  
  // دمج المهام الجديدة والقديمة
  const allTasks = [...tasks, ...oldTasks];
  
  // الحصول على قائمة مقدمي الخدمة المتاحين
  const availableProviders = aiService.current.getAvailableProviders();

  useEffect(() => {
    // محاكاة تحديث التقدم
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.status === 'running' && task.progress < 100) {
          const newProgress = Math.min(task.progress + Math.random() * 5, 100);
          if (newProgress >= 100) {
            return {
              ...task,
              progress: 100,
              status: 'completed',
              result: 'تمت المهمة بنجاح'
            };
          }
          return { ...task, progress: newProgress };
        }
        return task;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'paused': return 'bg-orange-500';
    }
  };

  const getToolStatusColor = (status: Tool['status']) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'disabled': return 'bg-gray-500';
    }
  };

  const handleTaskAction = (taskId: string, action: 'pause' | 'resume' | 'stop' | 'retry') => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        switch (action) {
          case 'pause':
            return { ...task, status: 'paused' };
          case 'resume':
            return { ...task, status: 'running' };
          case 'stop':
            return { ...task, status: 'failed', error: 'تم إيقاف المهمة بواسطة المستخدم' };
          case 'retry':
            return { ...task, status: 'running', progress: 0, error: undefined };
        }
      }
      return task;
    }));
  };
  
  const addNewTask = async () => {
    if (!newTaskTitle.trim() || !newTaskDescription.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      status: 'running',
      progress: 0,
      tool: 'ai-chat',
      createdAt: new Date(),
      estimatedDuration: 60,
      aiProvider: newTaskProvider,
      prompt: newTaskDescription
    };
    
    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setShowAddTask(false);
    
    // محاكاة تنفيذ المهمة باستخدام AI
    try {
      setTimeout(async () => {
        const messages = [{ role: 'user', content: newTaskDescription }];
        const result = await aiService.current.sendMessage(messages, newTaskProvider);
        
        setTasks(prev => prev.map(task => 
          task.id === newTask.id 
            ? { ...task, status: 'completed', progress: 100, result: result.slice(0, 100) + '...' }
            : task
        ));
      }, 2000);
    } catch (error) {
      setTasks(prev => prev.map(task => 
        task.id === newTask.id 
          ? { ...task, status: 'failed', error: 'فشل في تنفيذ المهمة: ' + (error as Error).message }
          : task
      ));
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}س ${mins}د` : `${mins}د`;
  };

  const runningTasks = allTasks.filter(task => task.status === 'running').length;
  const completedTasks = allTasks.filter(task => task.status === 'completed').length;
  const failedTasks = allTasks.filter(task => task.status === 'failed').length;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Zap className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">مدير الوكيل الذكي</h2>
              <p className="text-sm text-muted-foreground">
                {agentStatus === 'working' ? 'يعمل حالياً' : 'في وضع الاستعداد'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={agentStatus === 'working' ? 'default' : 'secondary'}>
              {runningTasks} مهمة نشطة
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <div className="text-xs text-muted-foreground">مكتملة</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-blue-600">{runningTasks}</div>
            <div className="text-xs text-muted-foreground">قيد التنفيذ</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-red-600">{failedTasks}</div>
            <div className="text-xs text-muted-foreground">فاشلة</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Tasks Panel */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold">المهام الحالية</h3>
            <Button 
              size="sm" 
              onClick={() => setShowAddTask(!showAddTask)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              مهمة جديدة
            </Button>
          </div>
          
          {showAddTask && (
            <div className="p-4 border-b border-border bg-muted/30 space-y-3">
              <Input
                placeholder="عنوان المهمة"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <Textarea
                placeholder="وصف المهمة أو الطلب للذكاء الاصطناعي"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                rows={3}
              />
              <div className="flex items-center justify-between">
                <Select value={newTaskProvider} onValueChange={(value: any) => setNewTaskProvider(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProviders.map(provider => (
                      <SelectItem key={provider.id} value={provider.id} disabled={!provider.available}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button size="sm" onClick={addNewTask} disabled={!newTaskTitle.trim() || !newTaskDescription.trim()}>
                    إضافة
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddTask(false)}>
                    إلغاء
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {allTasks.map((task) => (
                <Card key={task.id} className="group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getStatusIcon(task.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{task.title}</h4>
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`} />
                            {task.aiProvider && (
                              <Badge variant="outline" className="text-xs">
                                {task.aiProvider.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {task.description}
                          </p>
                          
                          {/* Progress Bar */}
                          {task.status === 'running' && (
                            <div className="space-y-1">
                              <Progress value={task.progress} className="h-2" />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{Math.round(task.progress)}%</span>
                                {task.estimatedDuration && (
                                  <span>
                                    المتبقي: {formatDuration(
                                      Math.round(task.estimatedDuration * (1 - task.progress / 100))
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Result or Error */}
                          {task.result && (
                            <div className="mt-2 p-2 bg-green-50 dark:bg-green-950 rounded text-sm text-green-700 dark:text-green-300">
                              ✓ {task.result}
                            </div>
                          )}
                          
                          {task.error && (
                            <div className="mt-2 p-2 bg-red-50 dark:bg-red-950 rounded text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              {task.error}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Task Controls */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {task.status === 'running' && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleTaskAction(task.id, 'pause')}
                            >
                              <Pause className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleTaskAction(task.id, 'stop')}
                            >
                              <Square className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        
                        {task.status === 'paused' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleTaskAction(task.id, 'resume')}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        )}
                        
                        {task.status === 'failed' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleTaskAction(task.id, 'retry')}
                          >
                            <Loader2 className="h-3 w-3" />
                          </Button>
                        )}
                        
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}

              {allTasks.length === 0 && (
                <div className="text-center py-12">
                  <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    لا توجد مهام حالياً
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    سيتم عرض المهام هنا عند بدء تشغيلها
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Tools Panel */}
        <div className="w-80 border-l border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">الأدوات المتاحة</h3>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {tools.map((tool) => (
                <Card key={tool.id} className="group cursor-pointer hover:shadow-sm transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{tool.name}</h4>
                          <div className={`w-2 h-2 rounded-full ${getToolStatusColor(tool.status)}`} />
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {tool.description}
                        </p>
                        
                        {tool.currentTask && (
                          <Badge variant="secondary" className="text-xs">
                            {tool.currentTask}
                          </Badge>
                        )}
                        
                        {tool.status === 'disabled' && (
                          <Badge variant="outline" className="text-xs">
                            غير متاح
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}