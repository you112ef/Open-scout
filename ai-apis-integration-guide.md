# دليل ربط المنصة بـ APIs الذكاء الاصطناعي

## 🚀 نظرة عامة

سأوضح لك كيفية تحويل منصة Scout AI من محاكاة إلى منصة حقيقية تتكامل مع أفضل خدمات الذكاء الاصطناعي المتاحة.

## 📋 الخدمات المدعومة

### 1. OpenAI APIs
- **GPT-4/GPT-3.5**: للدردشة والنصوص
- **DALL-E**: لإنشاء الصور
- **Whisper**: لتحويل الصوت إلى نص
- **Code Interpreter**: لتشغيل الكود

### 2. Anthropic Claude
- **Claude 3**: للمحادثات المتقدمة
- **Claude Instant**: للاستجابات السريعة

### 3. Google AI
- **Gemini Pro**: للنصوص والصور
- **PaLM**: لمعالجة اللغة

### 4. خدمات أخرى
- **Hugging Face**: نماذج مفتوحة المصدر
- **Cohere**: للنصوص والتصنيف
- **Replicate**: لتشغيل النماذج المختلفة

## 🏗️ البنية المطلوبة

```
scout-ai-platform/
├── src/
│   ├── api/           # طبقة API للتكامل
│   ├── services/      # خدمات الذكاء الاصطناعي
│   ├── hooks/         # React Hooks للAPI
│   └── types/         # تعريفات TypeScript
├── server/            # Backend API (جديد)
│   ├── routes/        # مسارات API
│   ├── services/      # خدمات الخادم
│   └── middleware/    # وسطاء الأمان
└── .env              # متغيرات البيئة
```

## 🔑 إعداد مفاتيح API

### 1. ملف البيئة (.env)
```env
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_ORG_ID=org-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Google AI
GOOGLE_AI_API_KEY=...

# Other Services
HUGGINGFACE_API_KEY=hf_...
COHERE_API_KEY=...

# Server Config
JWT_SECRET=your-jwt-secret
API_PORT=3001
```

## 🛠️ إنشاء Backend API

### 1. تثبيت المتطلبات
```bash
cd scout-ai-platform
npm install express cors dotenv
npm install openai @anthropic-ai/sdk @google/generative-ai
npm install @types/express @types/cors --save-dev
```

### 2. إعداد الخادم الأساسي
```typescript
// server/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat';
import codeRoutes from './routes/code';
import imageRoutes from './routes/image';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/image', imageRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Scout AI Server running on port ${PORT}`);
});
```

### 3. خدمة OpenAI
```typescript
// server/services/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});

export class OpenAIService {
  async sendMessage(messages: Array<{role: string, content: string}>) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 2000,
        stream: true, // للردود المباشرة
      });

      return completion;
    } catch (error) {
      console.error('OpenAI Error:', error);
      throw new Error('فشل في الحصول على رد من OpenAI');
    }
  }

  async generateImage(prompt: string) {
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });

      return response.data[0].url;
    } catch (error) {
      console.error('DALL-E Error:', error);
      throw new Error('فشل في إنشاء الصورة');
    }
  }

  async transcribeAudio(audioFile: Buffer) {
    try {
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile as any,
        model: "whisper-1",
        language: "ar", // دعم العربية
      });

      return transcription.text;
    } catch (error) {
      console.error('Whisper Error:', error);
      throw new Error('فشل في تحويل الصوت إلى نص');
    }
  }

  async executeCode(code: string, language: string) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `أنت مفسر كود ${language}. قم بتحليل وتشغيل الكود التالي وأعطني النتيجة:`
          },
          {
            role: "user",
            content: code
          }
        ],
        temperature: 0.1,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Code Execution Error:', error);
      throw new Error('فشل في تشغيل الكود');
    }
  }
}
```

### 4. خدمة Anthropic Claude
```typescript
// server/services/anthropic.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export class AnthropicService {
  async sendMessage(messages: Array<{role: string, content: string}>) {
    try {
      const message = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 2000,
        temperature: 0.7,
        messages: messages as any,
      });

      return message.content[0];
    } catch (error) {
      console.error('Anthropic Error:', error);
      throw new Error('فشل في الحصول على رد من Claude');
    }
  }

  async analyzeCode(code: string, language: string) {
    try {
      const message = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1500,
        messages: [
          {
            role: "user",
            content: `حلل هذا الكود بلغة ${language} وأعطني ملاحظات حول الأداء والتحسينات:\n\n${code}`
          }
        ],
      });

      return message.content[0];
    } catch (error) {
      console.error('Code Analysis Error:', error);
      throw new Error('فشل في تحليل الكود');
    }
  }
}
```

### 5. مسارات API
```typescript
// server/routes/chat.ts
import express from 'express';
import { OpenAIService } from '../services/openai';
import { AnthropicService } from '../services/anthropic';

const router = express.Router();
const openaiService = new OpenAIService();
const anthropicService = new AnthropicService();

// إرسال رسالة
router.post('/send', async (req, res) => {
  try {
    const { messages, provider = 'openai' } = req.body;

    let response;
    
    if (provider === 'openai') {
      response = await openaiService.sendMessage(messages);
    } else if (provider === 'anthropic') {
      response = await anthropicService.sendMessage(messages);
    }

    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// دردشة مع تدفق مباشر
router.post('/stream', async (req, res) => {
  try {
    const { messages } = req.body;
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await openaiService.sendMessage(messages);
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

## 🎨 تحديث Frontend للتكامل

### 1. خدمة API للواجهة
```typescript
// src/services/api.ts
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com/api' 
  : 'http://localhost:3001/api';

export class APIService {
  static async sendMessage(messages: any[], provider = 'openai') {
    const response = await fetch(`${API_BASE}/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, provider }),
    });

    if (!response.ok) {
      throw new Error('فشل في إرسال الرسالة');
    }

    return response.json();
  }

  static async streamMessage(
    messages: any[], 
    onChunk: (content: string) => void
  ) {
    const response = await fetch(`${API_BASE}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error('فشل في بدء المحادثة المباشرة');
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          
          try {
            const parsed = JSON.parse(data);
            onChunk(parsed.content);
          } catch (e) {
            // تجاهل الأخطاء في التحليل
          }
        }
      }
    }
  }

  static async generateImage(prompt: string) {
    const response = await fetch(`${API_BASE}/image/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('فشل في إنشاء الصورة');
    }

    return response.json();
  }

  static async executeCode(code: string, language: string) {
    const response = await fetch(`${API_BASE}/code/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language }),
    });

    if (!response.ok) {
      throw new Error('فشل في تشغيل الكود');
    }

    return response.json();
  }
}
```

### 2. Hook للدردشة المباشرة
```typescript
// src/hooks/useAIChat.ts
import { useState, useCallback } from 'react';
import { APIService } from '../services/api';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  streaming?: boolean;
}

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<'openai' | 'anthropic'>('openai');

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // رسالة AI فارغة للتدفق المباشر
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      streaming: true,
    };

    setMessages(prev => [...prev, aiMessage]);

    try {
      const chatMessages = messages.concat(userMessage).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

      await APIService.streamMessage(
        chatMessages,
        (chunk: string) => {
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, content: msg.content + chunk }
              : msg
          ));
        }
      );

      // إزالة علامة التدفق
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, streaming: false }
          : msg
      ));

    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { 
              ...msg, 
              content: 'عذراً، حدث خطأ في معالجة رسالتك. يرجى المحاولة مرة أخرى.',
              streaming: false 
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }, [messages, currentProvider]);

  const switchProvider = useCallback((provider: 'openai' | 'anthropic') => {
    setCurrentProvider(provider);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    currentProvider,
    sendMessage,
    switchProvider,
    clearChat,
  };
}
```

### 3. تحديث واجهة الدردشة
```typescript
// تحديث ChatInterface.tsx
import { useAIChat } from '../hooks/useAIChat';
import { APIService } from '../services/api';

export default function ChatInterface() {
  const { 
    messages, 
    isLoading, 
    currentProvider, 
    sendMessage, 
    switchProvider 
  } = useAIChat();

  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    await sendMessage(input);
    setInput('');
  };

  const handleImageGeneration = async (prompt: string) => {
    try {
      const result = await APIService.generateImage(prompt);
      // إضافة الصورة إلى المحادثة
    } catch (error) {
      console.error('Image generation failed:', error);
    }
  };

  // باقي المكون...
}
```

## 🔒 الأمان وأفضل الممارسات

### 1. حماية مفاتيح API
```typescript
// server/middleware/auth.ts
import jwt from 'jsonwebtoken';

export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
```

### 2. معدل الطلبات (Rate Limiting)
```typescript
// server/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // حد أقصى 100 طلب لكل IP
  message: 'تم تجاوز الحد المسموح من الطلبات',
});

export const imageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // ساعة واحدة
  max: 10, // حد أقصى 10 صور لكل IP
  message: 'تم تجاوز الحد المسموح لإنشاء الصور',
});
```

### 3. تشفير البيانات الحساسة
```typescript
// server/utils/encryption.ts
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(text: string): string {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = textParts.join(':');
  const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

## 🚀 النشر والتشغيل

### 1. إعداد Docker
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# تثبيت التبعيات
COPY package*.json ./
RUN npm install

# نسخ الكود
COPY . .

# بناء التطبيق
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

### 2. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  scout-ai-api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

  scout-ai-frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    depends_on:
      - scout-ai-api
    restart: unless-stopped
```

### 3. متغيرات البيئة للإنتاج
```env
# .env.production
NODE_ENV=production
API_URL=https://your-api-domain.com
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
JWT_SECRET=your-super-secret-jwt-key
ENCRYPTION_KEY=your-32-character-encryption-key
```

## 📊 مراقبة الأداء والتحليل

### 1. تسجيل العمليات
```typescript
// server/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### 2. تتبع الاستخدام
```typescript
// server/middleware/analytics.ts
export function trackUsage(req: any, res: any, next: any) {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('API Request', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });
  });
  
  next();
}
```

## 🎯 الخطوات التالية

1. **إعداد البيئة المحلية**: تثبيت Node.js وإعداد مفاتيح API
2. **تطوير Backend**: إنشاء الخادم وخدمات AI
3. **تحديث Frontend**: ربط الواجهة بالخدمات الحقيقية
4. **اختبار شامل**: فحص جميع الوظائف والأدوات
5. **النشر**: رفع المنصة على خادم الإنتاج
6. **المراقبة**: تتبع الأداء والاستخدام

هذا الدليل يوفر لك كل ما تحتاجه لتحويل منصة Scout AI إلى نظام حقيقي يعمل بالذكاء الاصطناعي! 🚀