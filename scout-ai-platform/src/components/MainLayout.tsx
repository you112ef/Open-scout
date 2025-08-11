import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ChatInterface from './ChatInterface';
import FileManager from './FileManager';
import AgentManager from './AgentManager';
import SessionManager from './SessionManager';
import CodeEditor from './CodeEditor';
import SettingsPage from './SettingsPage';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  Code, 
  Folder, 
  Zap, 
  Calendar,
  Settings
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<'running' | 'paused' | 'stopped'>('stopped');
  const [activeTab, setActiveTab] = useState('chat');
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleStatusChange = (status: 'running' | 'paused' | 'stopped') => {
    setSessionStatus(status);
  };

  const tabs = [
    { id: 'chat', label: 'المحادثة', icon: MessageSquare },
    { id: 'code', label: 'محرر الكود', icon: Code },
    { id: 'files', label: 'الملفات', icon: Folder },
    { id: 'agent', label: 'مدير الوكيل', icon: Zap },
    { id: 'sessions', label: 'الجلسات', icon: Calendar },
    { id: 'settings', label: 'الإعدادات', icon: Settings }
  ];

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Bar */}
      <TopBar 
        sessionTitle="مشروع الموقع التجاري - جلسة البرمجة"
        sessionStatus={sessionStatus}
        onStatusChange={handleStatusChange}
        onMobileSidebarOpen={() => setMobileSidebarOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <>
            <div className={`transition-all duration-300 ${
              sidebarCollapsed ? 'w-0' : 'w-72'
            } flex-shrink-0`}>
              <div className={`h-full ${
                sidebarCollapsed ? 'hidden' : 'block'
              }`}>
                <Sidebar />
              </div>
            </div>

            {/* Sidebar Toggle Button */}
            <div className="flex flex-col justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="h-12 w-6 rounded-l-none rounded-r-lg border-l-0 border border-border bg-card hover:bg-accent"
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        )}

        {/* Mobile Sidebar */}
        <Sidebar 
          isMobile={isMobile}
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main Panel with Tabs */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            {/* Tab Navigation */}
            <div className="border-b border-border bg-muted/30">
              <TabsList className="grid w-full grid-cols-6 h-12 bg-transparent">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id} 
                      className="flex items-center gap-1 md:gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs md:text-sm"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              <TabsContent value="chat" className="h-full m-0">
                <ChatInterface />
              </TabsContent>
              
              <TabsContent value="code" className="h-full m-0">
                <CodeEditor 
                  onExecute={(code, language) => {
                    console.log('Executing code:', { code, language });
                  }}
                  onSave={(file) => {
                    console.log('Saving file:', file);
                  }}
                />
              </TabsContent>
              
              <TabsContent value="files" className="h-full m-0">
                <FileManager 
                  onFileSelect={(file) => {
                    console.log('File selected:', file);
                    // يمكن فتح الملف في محرر الكود
                    if (file.type === 'file' && file.fileType === 'code') {
                      setActiveTab('code');
                    }
                  }}
                />
              </TabsContent>
              
              <TabsContent value="agent" className="h-full m-0">
                <AgentManager />
              </TabsContent>
              
              <TabsContent value="sessions" className="h-full m-0">
                <SessionManager 
                  onSessionSelect={(session) => {
                    console.log('Session selected:', session);
                    setActiveTab('chat');
                  }}
                  onProjectSelect={(project) => {
                    console.log('Project selected:', project);
                  }}
                />
              </TabsContent>
              
              <TabsContent value="settings" className="h-full m-0 overflow-auto">
                <SettingsPage />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}