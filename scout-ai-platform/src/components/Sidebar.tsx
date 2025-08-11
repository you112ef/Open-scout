import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  Plus, 
  MessageSquare, 
  Folder, 
  Clock, 
  Settings, 
  Search,
  Bot,
  Code,
  FileText,
  Zap,
  Menu
} from 'lucide-react';

interface Session {
  id: string;
  title: string;
  type: 'chat' | 'coding' | 'research';
  lastActive: string;
  status: 'active' | 'completed' | 'paused';
}

interface Project {
  id: string;
  name: string;
  description: string;
  sessionsCount: number;
  lastModified: string;
}

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

function SidebarContent() {
  const [activeTab, setActiveTab] = useState<'sessions' | 'projects'>('sessions');

  const sessions: Session[] = [
    {
      id: '1',
      title: 'إنشاء موقع ويب تجاري',
      type: 'coding',
      lastActive: 'منذ 5 دقائق',
      status: 'active'
    },
    {
      id: '2', 
      title: 'بحث عن أفضل مكتبات React',
      type: 'research',
      lastActive: 'منذ ساعة',
      status: 'completed'
    },
    {
      id: '3',
      title: 'مساعدة في حل مشكلة CSS',
      type: 'chat',
      lastActive: 'منذ يومين',
      status: 'paused'
    }
  ];

  const projects: Project[] = [
    {
      id: '1',
      name: 'تطبيق التجارة الإلكترونية',
      description: 'منصة متكاملة للتسوق الإلكتروني',
      sessionsCount: 12,
      lastModified: 'منذ ساعة'
    },
    {
      id: '2',
      name: 'موقع المدونة الشخصية',
      description: 'مدونة بتقنية React و Node.js',
      sessionsCount: 8,
      lastModified: 'منذ يومين'
    }
  ];

  const getSessionIcon = (type: Session['type']) => {
    switch (type) {
      case 'chat': return <MessageSquare className="h-4 w-4" />;
      case 'coding': return <Code className="h-4 w-4" />;
      case 'research': return <Search className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
    }
  };

  return (
    <div className="w-full bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Scout AI</span>
          </div>
          <Badge variant="secondary" className="text-xs">Pro</Badge>
        </div>
        
        <Button className="w-full justify-start gap-2" size="sm">
          <Plus className="h-4 w-4" />
          جلسة جديدة
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <Button
          variant={activeTab === 'sessions' ? 'default' : 'ghost'}
          className="flex-1 rounded-none h-10"
          onClick={() => setActiveTab('sessions')}
        >
          <MessageSquare className="h-4 w-4 ml-2" />
          <span className="hidden sm:inline">الجلسات</span>
        </Button>
        <Button
          variant={activeTab === 'projects' ? 'default' : 'ghost'}
          className="flex-1 rounded-none h-10"
          onClick={() => setActiveTab('projects')}
        >
          <Folder className="h-4 w-4 ml-2" />
          <span className="hidden sm:inline">المشاريع</span>
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-2">
        {activeTab === 'sessions' ? (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="group p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getSessionIcon(session.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium truncate">
                        {session.title}
                      </h4>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {session.lastActive}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {project.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate mb-1">
                      {project.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{project.sessionsCount} جلسة</span>
                      <span className="hidden sm:inline">{project.lastModified}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="flex-1 justify-start gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">الإعدادات</span>
          </Button>
          <Button variant="ghost" size="sm">
            <Zap className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ isMobile = false, isOpen = false, onClose }: SidebarProps) {
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="p-0 w-72">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return <SidebarContent />;
}

export function MobileSidebarTrigger({ onOpen }: { onOpen: () => void }) {
  return (
    <Button variant="ghost" size="sm" onClick={onOpen} className="md:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  );
}