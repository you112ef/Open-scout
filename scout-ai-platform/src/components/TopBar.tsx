import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Play,
  Pause,
  Square,
  MoreHorizontal,
  Share,
  Download,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Cpu,
  Zap,
  Activity,
  Menu
} from 'lucide-react';
import { useState } from 'react';

interface TopBarProps {
  sessionTitle?: string;
  sessionStatus: 'running' | 'paused' | 'stopped';
  onStatusChange: (status: 'running' | 'paused' | 'stopped') => void;
  onMobileSidebarOpen?: () => void;
}

export default function TopBar({ 
  sessionTitle = "جلسة جديدة", 
  sessionStatus, 
  onStatusChange,
  onMobileSidebarOpen
}: TopBarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const getStatusIcon = () => {
    switch (sessionStatus) {
      case 'running': return <Activity className="h-3 w-3 md:h-4 md:w-4 text-green-500" />;
      case 'paused': return <Pause className="h-3 w-3 md:h-4 md:w-4 text-yellow-500" />;
      case 'stopped': return <Square className="h-3 w-3 md:h-4 md:w-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (sessionStatus) {
      case 'running': return 'قيد التشغيل';
      case 'paused': return 'متوقف مؤقتاً';
      case 'stopped': return 'متوقف';
    }
  };

  return (
    <TooltipProvider>
      <div className="h-14 bg-background border-b border-border flex items-center justify-between px-3 md:px-6">
        {/* Left Section - Mobile Menu + Session Info */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileSidebarOpen}
            className="md:hidden p-2"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-sm md:text-lg font-semibold truncate max-w-32 md:max-w-md">
              {sessionTitle}
            </h1>
            <Badge variant="outline" className="gap-1 text-xs hidden sm:flex">
              {getStatusIcon()}
              <span className="hidden md:inline">{getStatusText()}</span>
            </Badge>
            <div className="sm:hidden">
              {getStatusIcon()}
            </div>
          </div>
        </div>

        {/* Center Section - Controls (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={sessionStatus === 'running' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onStatusChange(sessionStatus === 'running' ? 'paused' : 'running')}
              >
                {sessionStatus === 'running' ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {sessionStatus === 'running' ? 'إيقاف مؤقت' : 'تشغيل'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange('stopped')}
              >
                <Square className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>إيقاف</TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-border mx-2" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>مشاركة</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>تحميل</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem>
                <Settings className="h-4 w-4 ml-2" />
                إعدادات الجلسة
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Cpu className="h-4 w-4 ml-2" />
                أدوات المطور
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Square className="h-4 w-4 ml-2" />
                إنهاء الجلسة
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Section - User Menu */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Credits (Desktop only) */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>95 نقطة</span>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Mobile Controls Sheet */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden p-2">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">تحكم في الجلسة</h3>
                  <div className="flex gap-2">
                    <Button
                      variant={sessionStatus === 'running' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        onStatusChange(sessionStatus === 'running' ? 'paused' : 'running');
                        setMobileMenuOpen(false);
                      }}
                      className="flex-1"
                    >
                      {sessionStatus === 'running' ? (
                        <><Pause className="h-4 w-4 ml-2" /> إيقاف</>
                      ) : (
                        <><Play className="h-4 w-4 ml-2" /> تشغيل</>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onStatusChange('stopped');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">الإجراءات</h3>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Share className="h-4 w-4" />
                    مشاركة
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Download className="h-4 w-4" />
                    تحميل
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    إعدادات
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>95 نقطة متبقية</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 p-1 md:p-2">
                <Avatar className="h-6 w-6 md:h-7 md:w-7">
                  <AvatarImage src="/avatar.jpg" alt="User" />
                  <AvatarFallback className="text-xs">أح</AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline text-sm">أحمد محمد</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>حسابي</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="h-4 w-4 ml-2" />
                الملف الشخصي
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 ml-2" />
                الإعدادات
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Zap className="h-4 w-4 ml-2" />
                إدارة الاشتراك
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="h-4 w-4 ml-2" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  );
}