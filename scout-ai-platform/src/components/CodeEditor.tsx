import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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
  Play,
  Save,
  Copy,
  Download,
  Upload,
  Settings,
  Zap,
  Code,
  FileText,
  Terminal,
  Eye,
  EyeOff,
  RotateCcw,
  RotateCw,
  Search,
  Replace,
  Palette,
  Moon,
  Sun,
  Type,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface CodeFile {
  id: string;
  name: string;
  language: string;
  content: string;
  modified: boolean;
  lastSaved: Date;
}

interface CodeEditorProps {
  onExecute?: (code: string, language: string) => void;
  onSave?: (file: CodeFile) => void;
}

export default function CodeEditor({ onExecute, onSave }: CodeEditorProps) {
  const [files, setFiles] = useState<CodeFile[]>([
    {
      id: '1',
      name: 'App.tsx',
      language: 'typescript',
      content: `import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>مرحباً بك في Scout AI</h1>
        <p>عدد النقرات: {count}</p>
        <button onClick={() => setCount(count + 1)}>
          اضغط هنا
        </button>
      </header>
    </div>
  );
}

export default App;`,
      modified: false,
      lastSaved: new Date()
    },
    {
      id: '2',
      name: 'styles.css',
      language: 'css',
      content: `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

button {
  background-color: #61dafb;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

button:hover {
  background-color: #21b8c4;
}`,
      modified: true,
      lastSaved: new Date(Date.now() - 300000)
    }
  ]);

  const [activeFile, setActiveFile] = useState('1');
  const [fontSize, setFontSize] = useState('14');
  const [theme, setTheme] = useState('dark');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);

  const currentFile = files.find(f => f.id === activeFile);

  const languageOptions = [
    { value: 'typescript', label: 'TypeScript', icon: '📘' },
    { value: 'javascript', label: 'JavaScript', icon: '📒' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'css', label: 'CSS', icon: '🎨' },
    { value: 'html', label: 'HTML', icon: '🌐' },
    { value: 'json', label: 'JSON', icon: '📋' },
    { value: 'markdown', label: 'Markdown', icon: '📝' }
  ];

  const getLanguageInfo = (lang: string) => {
    return languageOptions.find(l => l.value === lang) || languageOptions[0];
  };

  const handleFileChange = (content: string) => {
    if (!currentFile) return;
    
    setFiles(prev => prev.map(f => 
      f.id === activeFile 
        ? { ...f, content, modified: content !== f.content }
        : f
    ));
  };

  const handleSave = () => {
    if (!currentFile) return;
    
    const updatedFile = { ...currentFile, modified: false, lastSaved: new Date() };
    setFiles(prev => prev.map(f => f.id === activeFile ? updatedFile : f));
    onSave?.(updatedFile);
  };

  const handleExecute = async () => {
    if (!currentFile) return;
    
    setIsExecuting(true);
    setOutput('جاري تنفيذ الكود...\n');
    
    // محاكاة تنفيذ الكود
    setTimeout(() => {
      setOutput(`تم تنفيذ ${currentFile.name} بنجاح!\n\nالنتيجة:\n✅ لا توجد أخطاء\n⚡ وقت التنفيذ: 0.5 ثانية\n📊 الذاكرة المستخدمة: 2.1 MB`);
      setIsExecuting(false);
      onExecute?.(currentFile.content, currentFile.language);
    }, 2000);
  };

  const handleCopy = () => {
    if (currentFile) {
      navigator.clipboard.writeText(currentFile.content);
    }
  };

  const handleDownload = () => {
    if (!currentFile) return;
    
    const blob = new Blob([currentFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatCode = () => {
    // محاكاة تنسيق الكود
    if (currentFile) {
      handleFileChange(currentFile.content);
    }
  };

  const addNewFile = () => {
    const newFile: CodeFile = {
      id: Date.now().toString(),
      name: 'untitled.js',
      language: 'javascript',
      content: '// ملف جديد\nconsole.log("مرحباً من Scout AI!");',
      modified: true,
      lastSaved: new Date()
    };
    
    setFiles(prev => [...prev, newFile]);
    setActiveFile(newFile.id);
  };

  const getLineNumbers = (content: string) => {
    const lines = content.split('\n');
    return lines.map((_, index) => index + 1).join('\n');
  };

  useEffect(() => {
    // محاكاة حفظ تلقائي
    const interval = setInterval(() => {
      const modifiedFiles = files.filter(f => f.modified);
      if (modifiedFiles.length > 0) {
        // Auto-save logic here
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [files]);

  return (
    <TooltipProvider>
      <div className={`h-full flex flex-col bg-background ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <span className="font-semibold">محرر الكود</span>
            {currentFile?.modified && (
              <Badge variant="secondary" className="text-xs">
                غير محفوظ
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={handleSave} disabled={!currentFile?.modified}>
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>حفظ (Ctrl+S)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={handleExecute} disabled={isExecuting}>
                  {isExecuting ? <Zap className="h-4 w-4 animate-pulse" /> : <Play className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>تشغيل الكود (F5)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>نسخ</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>إعدادات المحرر</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                  {theme === 'dark' ? <Sun className="h-4 w-4 ml-2" /> : <Moon className="h-4 w-4 ml-2" />}
                  {theme === 'dark' ? 'المظهر الفاتح' : 'المظهر الداكن'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowLineNumbers(!showLineNumbers)}>
                  {showLineNumbers ? <EyeOff className="h-4 w-4 ml-2" /> : <Eye className="h-4 w-4 ml-2" />}
                  {showLineNumbers ? 'إخفاء أرقام الأسطر' : 'إظهار أرقام الأسطر'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowMinimap(!showMinimap)}>
                  <Minimize2 className="h-4 w-4 ml-2" />
                  {showMinimap ? 'إخفاء الخريطة المصغرة' : 'إظهار الخريطة المصغرة'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={formatCode}>
                  <Palette className="h-4 w-4 ml-2" />
                  تنسيق الكود
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => setIsFullscreen(!isFullscreen)}>
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isFullscreen ? 'تصغير' : 'ملء الشاشة'}</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/30 overflow-x-auto">
          {files.map((file) => (
            <Button
              key={file.id}
              variant={activeFile === file.id ? 'secondary' : 'ghost'}
              size="sm"
              className="gap-2 whitespace-nowrap"
              onClick={() => setActiveFile(file.id)}
            >
              <span>{getLanguageInfo(file.language).icon}</span>
              <span>{file.name}</span>
              {file.modified && <div className="w-2 h-2 bg-primary rounded-full" />}
            </Button>
          ))}
          <Button size="sm" variant="ghost" onClick={addNewFile} className="ml-2">
            <FileText className="h-4 w-4" />
          </Button>
        </div>

        {/* Editor Settings Bar */}
        <div className="flex items-center justify-between p-2 border-b border-border bg-muted/20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">اللغة:</span>
              <Select
                value={currentFile?.language}
                onValueChange={(lang) => {
                  if (currentFile) {
                    setFiles(prev => prev.map(f => 
                      f.id === activeFile ? { ...f, language: lang, modified: true } : f
                    ));
                  }
                }}
              >
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      <span className="flex items-center gap-2">
                        <span>{lang.icon}</span>
                        <span>{lang.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">حجم الخط:</span>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="14">14</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                  <SelectItem value="18">18</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {currentFile && (
              <>
                <span>السطر: 1, العمود: 1</span>
                <span>|</span>
                <span>UTF-8</span>
                <span>|</span>
                <span>آخر حفظ: {currentFile.lastSaved.toLocaleTimeString('ar-SA')}</span>
              </>
            )}
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Editor */}
          <div className="flex-1 flex">
            {showLineNumbers && (
              <div 
                className="w-12 bg-muted/30 border-r border-border p-2 text-xs text-muted-foreground font-mono text-right"
                style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
              >
                <pre>{currentFile ? getLineNumbers(currentFile.content) : ''}</pre>
              </div>
            )}
            
            <div className="flex-1 relative">
              <textarea
                ref={editorRef}
                value={currentFile?.content || ''}
                onChange={(e) => handleFileChange(e.target.value)}
                className={`w-full h-full p-4 bg-transparent border-none outline-none resize-none font-mono ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}
                style={{ 
                  fontSize: `${fontSize}px`, 
                  lineHeight: '1.5',
                  direction: 'ltr',
                  textAlign: 'left'
                }}
                placeholder="ابدأ الكتابة هنا..."
                spellCheck={false}
              />
            </div>
          </div>

          {/* Minimap */}
          {showMinimap && (
            <div className="w-20 bg-muted/20 border-l border-border p-1">
              <div className="text-xs text-muted-foreground text-center mb-2">خريطة</div>
              <div 
                className="bg-muted/40 h-32 rounded text-xs overflow-hidden"
                style={{ fontSize: '6px', lineHeight: '1' }}
              >
                <pre className="p-1 text-muted-foreground">
                  {currentFile?.content.slice(0, 200)}...
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Output Panel */}
        <div className="h-48 border-t border-border bg-card">
          <Tabs defaultValue="output" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="output">المخرجات</TabsTrigger>
              <TabsTrigger value="terminal">الطرفية</TabsTrigger>
              <TabsTrigger value="problems">المشاكل</TabsTrigger>
            </TabsList>
            
            <TabsContent value="output" className="h-[calc(100%-40px)] m-0">
              <ScrollArea className="h-full p-4">
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {output || 'لا توجد مخرجات بعد...'}
                </pre>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="terminal" className="h-[calc(100%-40px)] m-0">
              <div className="h-full p-4 bg-black text-green-400 font-mono text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="h-4 w-4" />
                  <span>Scout AI Terminal</span>
                </div>
                <div>$ اكتب أمرك هنا...</div>
              </div>
            </TabsContent>
            
            <TabsContent value="problems" className="h-[calc(100%-40px)] m-0">
              <ScrollArea className="h-full p-4">
                <div className="text-sm text-muted-foreground">
                  ✅ لا توجد مشاكل في الكود الحالي
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
}