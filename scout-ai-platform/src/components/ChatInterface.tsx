import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  Send,
  Paperclip,
  Mic,
  MicOff,
  Image,
  Code,
  Search,
  FileText,
  MoreHorizontal,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Bot,
  User,
  Loader2,
  AlertCircle,
  Settings
} from 'lucide-react';
import { AIServiceManager } from '../services/ai-services';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'code' | 'image' | 'file';
  status?: 'sending' | 'sent' | 'error';
  tools?: string[];
}

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'مرحباً! أنا Scout، مساعدك الذكي للبرمجة والمشاريع. كيف يمكنني مساعدتك اليوم؟\n\nملاحظة: تأكد من إعداد مفاتيح API في تبويب الإعدادات لتفعيل الوظائف الكاملة.',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'cohere' | 'mistral'>('openai');
  const [selectedModel, setSelectedModel] = useState('');
  const [useStreaming, setUseStreaming] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const aiService = useRef(new AIServiceManager());

  const tools: Tool[] = [
    {
      id: 'code',
      name: 'محرر الكود',
      icon: <Code className="h-4 w-4" />,
      description: 'كتابة وتعديل الكود'
    },
    {
      id: 'search',
      name: 'البحث',
      icon: <Search className="h-4 w-4" />,
      description: 'البحث في الإنترنت'
    },
    {
      id: 'image',
      name: 'الصور',
      icon: <Image className="h-4 w-4" />,
      description: 'إنشاء ومعالجة الصور'
    },
    {
      id: 'file',
      name: 'الملفات',
      icon: <FileText className="h-4 w-4" />,
      description: 'إدارة الملفات والمستندات'
    }
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    };

    const messageHistory = [...messages, userMessage];
    setMessages(messageHistory);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // تحويل التاريخ إلى تنسيق API
      const apiMessages = messageHistory
        .filter(msg => msg.sender === 'user' || msg.sender === 'ai')
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));

      let aiResponse = '';
      const aiMessageId = (Date.now() + 1).toString();

      // إضافة رسالة مؤقتة للـ AI
      const tempAiMessage: Message = {
        id: aiMessageId,
        content: '',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        tools: ['code', 'search']
      };
      
      setMessages(prev => [...prev, tempAiMessage]);

      if (useStreaming && selectedProvider === 'openai') {
        // استخدام البث المباشر
        await aiService.current.streamMessage(
          apiMessages,
          selectedProvider,
          (chunk: string) => {
            aiResponse += chunk;
            setMessages(prev => 
              prev.map(msg => 
                msg.id === aiMessageId 
                  ? { ...msg, content: aiResponse }
                  : msg
              )
            );
          },
          selectedModel || undefined
        );
      } else {
        // استخدام الاستجابة العادية
        aiResponse = await aiService.current.sendMessage(
          apiMessages,
          selectedProvider,
          selectedModel || undefined
        );
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, content: aiResponse }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: `حدث خطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        status: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  // الحصول على قائمة مقدمي الخدمة المتاحين
  const availableProviders = aiService.current.getAvailableProviders();
  
  // نماذج كل مقدم خدمة
  const providerModels = {
    openai: ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo'],
    anthropic: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
    gemini: ['gemini-pro', 'gemini-pro-vision'],
    huggingface: ['microsoft/DialoGPT-large', 'facebook/blenderbot-400M-distill'],
    cohere: ['command', 'command-nightly', 'command-light'],
    mistral: ['mistral-tiny', 'mistral-small', 'mistral-medium']
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* AI Settings Panel */}
      <div className="border-b border-border p-4 bg-muted/30">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">مقدم الخدمة:</label>
              <Select value={selectedProvider} onValueChange={(value: any) => setSelectedProvider(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableProviders.map(provider => (
                    <SelectItem key={provider.id} value={provider.id} disabled={!provider.available}>
                      <div className="flex items-center gap-2">
                        {provider.name}
                        {!provider.available && <AlertCircle className="h-3 w-3 text-red-500" />}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">النموذج:</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="اختر النموذج" />
                </SelectTrigger>
                <SelectContent>
                  {providerModels[selectedProvider]?.map(model => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProvider === 'openai' && (
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="streaming" 
                  checked={useStreaming} 
                  onChange={(e) => setUseStreaming(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="streaming" className="text-sm">البث المباشر</label>
              </div>
            )}
          </div>

          {!availableProviders.some(p => p.available) && (
            <Alert className="flex-1 max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                لم يتم إعداد أي مفاتيح API. توجه إلى تبويب الإعدادات لإضافتها.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'ai' && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={`flex flex-col max-w-[70%] ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <Card className={`${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                  <CardContent className="p-3">
                    <div className="prose prose-sm max-w-none">
                      {message.type === 'code' ? (
                        <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
                          <code>{message.content}</code>
                        </pre>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                    
                    {message.tools && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {message.tools.map((toolId) => {
                          const tool = tools.find(t => t.id === toolId);
                          return tool ? (
                            <Badge key={toolId} variant="secondary" className="text-xs gap-1">
                              {tool.icon}
                              {tool.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </span>
                  
                  {message.sender === 'ai' && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <RefreshCw className="h-4 w-4 ml-2" />
                            إعادة إنشاء
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 ml-2" />
                            نسخ
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              </div>

              {message.sender === 'user' && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="bg-card">
                <CardContent className="p-3">
                  <div className="flex items-center gap-1">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Scout يكتب...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 mb-3">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant="outline"
                size="sm"
                className="gap-2 text-xs"
              >
                {tool.icon}
                {tool.name}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب رسالتك هنا... (اضغط Enter للإرسال، Shift+Enter لسطر جديد)"
                className="min-h-[60px] max-h-32 resize-none pl-12"
                dir="rtl"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 bottom-2 h-8 w-8 p-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="sm"
              onClick={toggleRecording}
              className="h-12 w-12 p-0"
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>

            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className="h-12 w-12 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>استخدم الأدوات أعلاه لتحسين تجربة المحادثة</span>
            <span>Shift + Enter للسطر الجديد</span>
          </div>
        </div>
      </div>
    </div>
  );
}