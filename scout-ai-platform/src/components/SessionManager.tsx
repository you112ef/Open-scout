import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Settings,
  MoreHorizontal,
  FolderOpen,
  Clock,
  Users,
  Star,
  Archive,
  Trash2,
  Copy,
  Share,
  Download,
  Calendar,
  Tag,
  Activity
} from 'lucide-react';

interface Session {
  id: string;
  title: string;
  description: string;
  type: 'chat' | 'coding' | 'research' | 'design';
  status: 'active' | 'paused' | 'archived';
  createdAt: Date;
  lastActivity: Date;
  duration: number; // in minutes
  messagesCount: number;
  participants: string[];
  tags: string[];
  favorite: boolean;
  projectId?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  collaborators: string[];
  sessions: string[];
  createdAt: Date;
  lastModified: Date;
  status: 'active' | 'completed' | 'archived';
  tags: string[];
  color: string;
  favorite: boolean;
}

interface SessionManagerProps {
  onSessionSelect?: (session: Session) => void;
  onProjectSelect?: (project: Project) => void;
}

export default function SessionManager({ onSessionSelect, onProjectSelect }: SessionManagerProps) {
  const [activeTab, setActiveTab] = useState<'sessions' | 'projects'>('sessions');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newSessionOpen, setNewSessionOpen] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);

  const sessions: Session[] = [
    {
      id: '1',
      title: 'تطوير موقع التجارة الإلكترونية',
      description: 'العمل على تطوير منصة تجارة إلكترونية متكاملة باستخدام React و Node.js',
      type: 'coding',
      status: 'active',
      createdAt: new Date('2024-01-15'),
      lastActivity: new Date(),
      duration: 240,
      messagesCount: 156,
      participants: ['أحمد محمد', 'Scout AI'],
      tags: ['React', 'Node.js', 'MongoDB'],
      favorite: true,
      projectId: '1'
    },
    {
      id: '2',
      title: 'بحث حول أفضل ممارسات UX',
      description: 'جمع معلومات حول أحدث اتجاهات تصميم تجربة المستخدم',
      type: 'research',
      status: 'paused',
      createdAt: new Date('2024-01-14'),
      lastActivity: new Date(Date.now() - 3600000),
      duration: 85,
      messagesCount: 43,
      participants: ['أحمد محمد', 'Scout AI'],
      tags: ['UX', 'Design', 'Research'],
      favorite: false,
      projectId: '2'
    },
    {
      id: '3',
      title: 'مراجعة الكود والتحسينات',
      description: 'مراجعة شاملة للكود المكتوب وتحسين الأداء',
      type: 'coding',
      status: 'archived',
      createdAt: new Date('2024-01-10'),
      lastActivity: new Date('2024-01-12'),
      duration: 180,
      messagesCount: 89,
      participants: ['أحمد محمد', 'Scout AI'],
      tags: ['Code Review', 'Performance'],
      favorite: false,
      projectId: '1'
    }
  ];

  const projects: Project[] = [
    {
      id: '1',
      name: 'منصة التجارة الإلكترونية',
      description: 'تطوير منصة تجارة إلكترونية شاملة مع إدارة المخزون والدفع',
      owner: 'أحمد محمد',
      collaborators: ['سارة أحمد', 'محمد علي'],
      sessions: ['1', '3'],
      createdAt: new Date('2024-01-01'),
      lastModified: new Date(),
      status: 'active',
      tags: ['E-commerce', 'Full-stack', 'React'],
      color: 'bg-blue-500',
      favorite: true
    },
    {
      id: '2',
      name: 'تطبيق إدارة المهام',
      description: 'تطبيق ويب لإدارة المهام والمشاريع للفرق',
      owner: 'أحمد محمد',
      collaborators: ['علي حسن'],
      sessions: ['2'],
      createdAt: new Date('2024-01-05'),
      lastModified: new Date(Date.now() - 86400000),
      status: 'active',
      tags: ['Productivity', 'Teams', 'Vue.js'],
      color: 'bg-green-500',
      favorite: false
    },
    {
      id: '3',
      name: 'مدونة تقنية',
      description: 'مدونة شخصية للكتابة عن التقنية والبرمجة',
      owner: 'أحمد محمد',
      collaborators: [],
      sessions: [],
      createdAt: new Date('2023-12-15'),
      lastModified: new Date('2024-01-01'),
      status: 'completed',
      tags: ['Blog', 'Content', 'Gatsby'],
      color: 'bg-purple-500',
      favorite: false
    }
  ];

  const getTypeIcon = (type: Session['type']) => {
    switch (type) {
      case 'chat': return '💬';
      case 'coding': return '👨‍💻';
      case 'research': return '🔍';
      case 'design': return '🎨';
    }
  };

  const getStatusColor = (status: Session['status'] | Project['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'archived': return 'bg-gray-500';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}س ${mins}د` : `${mins}د`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredSessions = sessions.filter(session => {
    if (filterStatus !== 'all' && session.status !== filterStatus) return false;
    if (searchQuery && !session.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredProjects = projects.filter(project => {
    if (filterStatus !== 'all' && project.status !== filterStatus) return false;
    if (searchQuery && !project.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">إدارة الجلسات والمشاريع</h2>
          <div className="flex gap-2">
            <Dialog open={newSessionOpen} onOpenChange={setNewSessionOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  جلسة جديدة
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إنشاء جلسة جديدة</DialogTitle>
                  <DialogDescription>
                    قم بإنشاء جلسة عمل جديدة مع Scout AI
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-title">عنوان الجلسة</Label>
                    <Input id="session-title" placeholder="أدخل عنوان الجلسة" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-description">الوصف</Label>
                    <Textarea id="session-description" placeholder="وصف مختصر للجلسة" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-type">نوع الجلسة</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الجلسة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chat">محادثة عامة</SelectItem>
                        <SelectItem value="coding">البرمجة</SelectItem>
                        <SelectItem value="research">البحث</SelectItem>
                        <SelectItem value="design">التصميم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-project">المشروع (اختياري)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر مشروع" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewSessionOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={() => setNewSessionOpen(false)}>
                    إنشاء الجلسة
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2">
                  <FolderOpen className="h-4 w-4" />
                  مشروع جديد
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إنشاء مشروع جديد</DialogTitle>
                  <DialogDescription>
                    قم بإنشاء مشروع جديد لتنظيم جلسات العمل
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">اسم المشروع</Label>
                    <Input id="project-name" placeholder="أدخل اسم المشروع" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-description">الوصف</Label>
                    <Textarea id="project-description" placeholder="وصف مختصر للمشروع" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-tags">العلامات</Label>
                    <Input id="project-tags" placeholder="أدخل العلامات مفصولة بفواصل" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewProjectOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={() => setNewProjectOpen(false)}>
                    إنشاء المشروع
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-2 mb-3">
          <Input
            placeholder="البحث..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="active">نشط</SelectItem>
              <SelectItem value="paused">متوقف</SelectItem>
              <SelectItem value="completed">مكتمل</SelectItem>
              <SelectItem value="archived">مؤرشف</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sessions">الجلسات ({filteredSessions.length})</TabsTrigger>
            <TabsTrigger value="projects">المشاريع ({filteredProjects.length})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsContent value="sessions" className="mt-0">
            <ScrollArea className="h-full">
              <div className="space-y-3">
                {filteredSessions.map((session) => (
                  <Card 
                    key={session.id} 
                    className="group cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onSessionSelect?.(session)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="text-2xl mt-1">
                            {getTypeIcon(session.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold truncate">{session.title}</h3>
                              {session.favorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`} />
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {session.description}
                            </p>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDuration(session.duration)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                {session.messagesCount} رسالة
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(session.lastActivity)}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {session.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {session.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{session.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Star className="h-4 w-4 ml-2" />
                              إضافة للمفضلة
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 ml-2" />
                              نسخ
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share className="h-4 w-4 ml-2" />
                              مشاركة
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 ml-2" />
                              تصدير
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Archive className="h-4 w-4 ml-2" />
                              أرشفة
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 ml-2" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                  </Card>
                ))}

                {filteredSessions.length === 0 && (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      لا توجد جلسات
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ابدأ جلسة جديدة للعمل مع Scout AI
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="projects" className="mt-0">
            <ScrollArea className="h-full">
              <div className="space-y-3">
                {filteredProjects.map((project) => (
                  <Card 
                    key={project.id} 
                    className="group cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onProjectSelect?.(project)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-12 h-12 ${project.color} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
                            {project.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold truncate">{project.name}</h3>
                              {project.favorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {project.description}
                            </p>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {project.collaborators.length + 1} عضو
                              </div>
                              <div className="flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                {project.sessions.length} جلسة
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(project.lastModified)}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {project.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {project.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{project.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Settings className="h-4 w-4 ml-2" />
                              إعدادات المشروع
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Star className="h-4 w-4 ml-2" />
                              إضافة للمفضلة
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="h-4 w-4 ml-2" />
                              إدارة الأعضاء
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share className="h-4 w-4 ml-2" />
                              مشاركة
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Archive className="h-4 w-4 ml-2" />
                              أرشفة
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 ml-2" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                  </Card>
                ))}

                {filteredProjects.length === 0 && (
                  <div className="text-center py-12">
                    <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      لا توجد مشاريع
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      أنشئ مشروع جديد لتنظيم جلسات عملك
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}