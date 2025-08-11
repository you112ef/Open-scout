# 📁 هيكل المشروع - Scout AI Platform

## نظرة عامة

Scout AI Platform عبارة عن منصة ويب حديثة مبنية بـ React و TypeScript. هذا الملف يوضح بنية المشروع وتنظيم الملفات.

```
scout-ai-platform/
├── 📁 public/                     # الملفات العامة
├── 📁 src/                        # الكود المصدري الرئيسي
│   ├── 📁 components/             # مكونات React
│   ├── 📁 services/               # خدمات API والتطبيق
│   ├── 📁 hooks/                  # React Hooks مخصصة
│   ├── 📁 lib/                    # مكتبات مساعدة
│   ├── 📁 types/                  # تعريفات TypeScript
│   └── 📄 main.tsx               # نقطة دخول التطبيق
├── 📁 docs/                       # التوثيق
├── 📁 dist/                       # ملفات البناء (مُولدة)
├── 📄 package.json               # تبعيات وإعدادات npm
├── 📄 tsconfig.json              # إعدادات TypeScript
├── 📄 vite.config.ts             # إعدادات Vite
├── 📄 tailwind.config.js         # إعدادات Tailwind CSS
└── 📄 README.md                  # الدليل الرئيسي
```

---

## 📁 مجلد `src/` - الكود المصدري

### 🧩 `components/` - مكونات واجهة المستخدم

```
src/components/
├── 📁 ui/                         # مكونات UI الأساسية (ShadCN)
│   ├── 📄 button.tsx
│   ├── 📄 card.tsx
│   ├── 📄 dialog.tsx
│   ├── 📄 input.tsx
│   ├── 📄 tabs.tsx
│   └── ...
├── 📄 App.tsx                     # المكون الجذر
├── 📄 ChatInterface.tsx           # واجهة المحادثة الرئيسية
├── 📄 AgentManager.tsx            # مدير المهام والوكيل الذكي
├── 📄 SettingsPage.tsx            # صفحة إعدادات APIs
├── 📄 CodeEditor.tsx              # محرر الكود المتقدم
├── 📄 FileManager.tsx             # مدير الملفات
├── 📄 Sidebar.tsx                 # الشريط الجانبي
└── 📄 Header.tsx                  # الرأس العلوي
```

#### وصف المكونات الرئيسية:

**`App.tsx`** - المكون الجذر للتطبيق
- إدارة الحالة العامة للتطبيق
- التنقل بين التبويبات المختلفة
- تحميل وحفظ الإعدادات

**`ChatInterface.tsx`** - واجهة المحادثة
- عرض المحادثات التفاعلية
- اختيار مقدم الخدمة والنموذج
- إرسال واستقبال الرسائل
- عرض تاريخ المحادثات

**`AgentManager.tsx`** - مدير الوكيل الذكي
- إنشاء وإدارة المهام الذكية
- مراقبة تقدم المهام
- عرض النتائج والتقارير
- تكامل مع خدمات AI المختلفة

**`SettingsPage.tsx`** - إعدادات المنصة
- إدارة مفاتيح APIs لجميع المقدمين
- اختبار صحة الاتصالات
- حفظ وتشفير الإعدادات
- عرض معلومات الاستخدام

**`CodeEditor.tsx`** - محرر الكود
- تحرير ملفات البرمجة
- تمييز بناء الجملة (Syntax Highlighting)
- الإكمال التلقائي
- تكامل مع AI لمراجعة الكود

**`FileManager.tsx`** - إدارة الملفات
- تصفح الملفات والمجلدات
- رفع وتحميل الملفات
- معاينة أنواع ملفات مختلفة
- تنظيم وترتيب الملفات

---

### 🔧 `services/` - خدمات التطبيق

```
src/services/
├── 📄 ai-services.ts              # خدمات الذكاء الاصطناعي
├── 📄 file-services.ts            # خدمات إدارة الملفات
├── 📄 storage-services.ts         # خدمات التخزين المحلي
└── 📄 websocket-services.ts       # خدمات WebSocket
```

#### وصف الخدمات:

**`ai-services.ts`** - الخدمة الأساسية
- `AIServiceManager`: المدير الرئيسي لجميع خدمات AI
- `OpenAIService`: خدمة OpenAI (GPT-4, GPT-3.5)
- `AnthropicService`: خدمة Anthropic (Claude)
- `GeminiService`: خدمة Google Gemini
- `HuggingFaceService`: خدمة Hugging Face
- `CohereService`: خدمة Cohere
- `MistralService`: خدمة Mistral AI
- `SettingsManager`: إدارة حفظ واسترجاع الإعدادات

**`file-services.ts`** - خدمات الملفات
- رفع وتحميل الملفات
- معالجة أنواع ملفات مختلفة
- ضغط وتحسين الملفات
- تشفير الملفات الحساسة

**`storage-services.ts`** - التخزين المحلي
- حفظ بيانات المحادثات
- إدارة ذاكرة التخزين المؤقت
- تصدير واستيراد البيانات
- تنظيف التخزين التلقائي

**`websocket-services.ts`** - الاتصال المباشر
- اتصالات WebSocket للمحادثة المباشرة
- إدارة إعادة الاتصال التلقائي
- تشفير الرسائل المباشرة
- مزامنة الحالة في الوقت الفعلي

---

### 🪝 `hooks/` - React Hooks مخصصة

```
src/hooks/
├── 📄 useLocalStorage.ts          # إدارة التخزين المحلي
├── 📄 useAIService.ts             # إدارة خدمات AI
├── 📄 useChat.ts                  # إدارة المحادثات
├── 📄 useFileUpload.ts            # رفع الملفات
└── 📄 useWebSocket.ts             # اتصالات WebSocket
```

#### وصف الـ Hooks:

**`useLocalStorage.ts`**
```typescript
// مثال للاستخدام
const [settings, setSettings] = useLocalStorage('ai-settings', defaultSettings);
```

**`useAIService.ts`**
```typescript
// إدارة خدمات AI
const { sendMessage, loading, error } = useAIService('openai');
```

**`useChat.ts`**
```typescript
// إدارة المحادثات
const { messages, sendMessage, clearChat } = useChat();
```

---

### 📚 `lib/` - مكتبات مساعدة

```
src/lib/
├── 📄 utils.ts                    # أدوات مساعدة عامة
├── 📄 cn.ts                       # دمج class names
├── 📄 encryption.ts               # تشفير البيانات
├── 📄 validation.ts               # التحقق من صحة البيانات
└── 📄 constants.ts                # الثوابت والإعدادات
```

#### وصف المكتبات:

**`utils.ts`** - أدوات عامة
```typescript
export function formatDate(date: Date): string
export function truncateText(text: string, length: number): string
export function generateId(): string
export function debounce(func: Function, wait: number): Function
```

**`encryption.ts`** - تشفير البيانات
```typescript
export function encryptApiKey(apiKey: string): string
export function decryptApiKey(encryptedKey: string): string
export function hashPassword(password: string): string
```

**`validation.ts`** - التحقق من صحة البيانات
```typescript
export function validateApiKey(key: string, provider: string): boolean
export function validateEmail(email: string): boolean
export function sanitizeInput(input: string): string
```

---

### 🏷️ `types/` - تعريفات TypeScript

```
src/types/
├── 📄 api.ts                      # أنواع بيانات APIs
├── 📄 chat.ts                     # أنواع المحادثات
├── 📄 agent.ts                    # أنواع الوكيل الذكي
├── 📄 file.ts                     # أنواع الملفات
└── 📄 global.ts                   # أنواع عامة
```

#### أمثلة على التعريفات:

**`api.ts`**
```typescript
export interface APISettings {
  openai?: {
    apiKey: string;
    organizationId?: string;
    models: string[];
  };
  anthropic?: {
    apiKey: string;
    models: string[];
  };
  // ... باقي المقدمين
}

export interface AIProvider {
  id: string;
  name: string;
  models: string[];
  capabilities: string[];
}
```

**`chat.ts`**
```typescript
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  provider?: string;
  model?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
```

**`agent.ts`**
```typescript
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  estimatedDuration?: number;
  aiProvider?: string;
  result?: string;
  error?: string;
}
```

---

## 📁 مجلد `docs/` - التوثيق

```
docs/
├── 📄 adding-ai-providers.md      # دليل إضافة مقدمي خدمة جدد
├── 📄 supported-apis.md           # قائمة APIs المدعومة
├── 📄 quick-examples.md           # أمثلة سريعة للاستخدام
├── 📄 project-structure.md        # هيكل المشروع (هذا الملف)
├── 📄 deployment.md               # دليل النشر
└── 📄 contributing.md             # دليل المساهمة
```

---

## 📄 ملفات الإعدادات الرئيسية

### `package.json` - تبعيات وإعدادات npm

```json
{
  "name": "scout-ai-platform",
  "version": "2.1.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^19.1.0",
    "typescript": "~5.8.3",
    // ... باقي التبعيات
  }
}
```

### `tsconfig.json` - إعدادات TypeScript

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{"path": "./tsconfig.node.json"}]
}
```

### `vite.config.ts` - إعدادات Vite

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

### `tailwind.config.js` - إعدادات Tailwind CSS

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        // ... باقي الألوان المخصصة
      }
    },
  },
  plugins: [],
}
```

---

## 🛠️ بنية البيانات والحالة

### إدارة الحالة العامة

يستخدم التطبيق React State مع localStorage للحفاظ على البيانات:

```typescript
// حالة التطبيق الرئيسية
interface AppState {
  currentTab: string;
  settings: APISettings;
  chatSessions: ChatSession[];
  tasks: Task[];
  theme: 'light' | 'dark';
}

// حفظ الحالة في localStorage
const saveState = (state: AppState) => {
  localStorage.setItem('scout-ai-state', JSON.stringify(state));
};

// استرجاع الحالة من localStorage
const loadState = (): AppState => {
  const saved = localStorage.getItem('scout-ai-state');
  return saved ? JSON.parse(saved) : defaultState;
};
```

### تدفق البيانات

```
المستخدم
    ↓
واجهة المستخدم (Components)
    ↓
خدمات التطبيق (Services)
    ↓
APIs الخارجية
    ↓
استجابة ونتائج
    ↓
تحديث الحالة
    ↓
إعادة عرض الواجهة
```

---

## 🔒 الأمان والخصوصية

### تشفير البيانات الحساسة

```typescript
// تشفير مفاتيح API قبل الحفظ
const encryptApiKey = (apiKey: string): string => {
  return btoa(apiKey); // تشفير أساسي - يمكن تحسينه
};

// فك التشفير عند الاستخدام
const decryptApiKey = (encryptedKey: string): string => {
  return atob(encryptedKey);
};
```

### حماية البيانات

- **عدم الإرسال**: مفاتيح API لا تُرسل لأي خادم خارجي
- **تشفير محلي**: البيانات الحساسة مشفرة في localStorage
- **اتصالات آمنة**: جميع الطلبات تستخدم HTTPS
- **تنظيف تلقائي**: حذف البيانات المؤقتة بانتظام

---

## 📊 الأداء والتحسين

### تحسينات React

```typescript
// استخدام React.memo للمكونات الثقيلة
export const ChatMessage = React.memo(({ message }: { message: Message }) => {
  return <div>{message.content}</div>;
});

// استخدام useMemo للحسابات المعقدة
const sortedMessages = useMemo(() => {
  return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}, [messages]);

// استخدام useCallback للدوال
const handleSendMessage = useCallback((content: string) => {
  // منطق إرسال الرسالة
}, [/* dependencies */]);
```

### تحسينات الشبكة

```typescript
// إعادة المحاولة التلقائية للطلبات الفاشلة
const retryRequest = async (requestFn: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

// تقليل الطلبات بـ debouncing
const debouncedApiCall = useCallback(
  debounce((query: string) => {
    // استدعاء API
  }, 500),
  []
);
```

---

## 🧪 الاختبار

### هيكل الاختبارات

```
tests/
├── 📁 components/                 # اختبارات المكونات
│   ├── ChatInterface.test.tsx
│   ├── AgentManager.test.tsx
│   └── SettingsPage.test.tsx
├── 📁 services/                   # اختبارات الخدمات
│   ├── ai-services.test.ts
│   └── storage-services.test.ts
├── 📁 hooks/                      # اختبارات الـ Hooks
│   ├── useChat.test.ts
│   └── useAIService.test.ts
└── 📁 utils/                      # اختبارات الأدوات
    ├── encryption.test.ts
    └── validation.test.ts
```

### أمثلة على الاختبارات

```typescript
// اختبار مكون
import { render, screen } from '@testing-library/react';
import { ChatInterface } from '../components/ChatInterface';

test('renders chat interface', () => {
  render(<ChatInterface />);
  expect(screen.getByText('رسالة جديدة')).toBeInTheDocument();
});

// اختبار خدمة
import { AIServiceManager } from '../services/ai-services';

test('sends message successfully', async () => {
  const manager = new AIServiceManager(mockSettings);
  const response = await manager.sendMessage('openai', [
    { role: 'user', content: 'مرحبا' }
  ]);
  expect(response).toBeDefined();
});
```

---

## 🚀 النشر والتطوير

### بيئة التطوير

```bash
# تشغيل بيئة التطوير
bun dev

# بناء للإنتاج
bun run build

# معاينة البناء
bun run preview

# فحص الكود
bun run lint

# فحص الأنواع
bun run type-check
```

### متغيرات البيئة

```env
# ملف .env.local (غير مُتضمن في Git)
VITE_APP_VERSION=2.1.0
VITE_API_BASE_URL=https://api.scout-ai.com
VITE_ENABLE_ANALYTICS=false
```

### بنية النشر

```
dist/
├── 📄 index.html                  # الصفحة الرئيسية
├── 📁 assets/                     # الملفات المُحسنة
│   ├── index-[hash].js           # JavaScript مُجمع
│   ├── index-[hash].css          # CSS مُحسن
│   └── ...
└── 📁 static/                     # الملفات الثابتة
```

---

## 📈 التطوير المستقبلي

### ميزات مخططة

1. **نظام الإضافات (Plugins)**
   ```
   src/plugins/
   ├── custom-ai-provider/
   ├── code-formatter/
   └── export-tools/
   ```

2. **واجهة برمجة التطبيقات (API)**
   ```
   src/api/
   ├── routes/
   ├── middleware/
   └── controllers/
   ```

3. **قاعدة البيانات**
   ```
   src/database/
   ├── models/
   ├── migrations/
   └── seeds/
   ```

### تحسينات مخططة

- **Web Workers** للعمليات الثقيلة
- **Service Workers** للعمل أوفلاين
- **PWA** للتطبيق على الهواتف
- **WebAssembly** للأداء العالي

---

## 🤝 المساهمة في المشروع

### إرشادات تنظيم الكود

1. **تسمية الملفات**: PascalCase للمكونات، camelCase للباقي
2. **تنظيم الواردات**: مكتبات خارجية، ثم ملفات داخلية
3. **التعليقات**: باللغة العربية للوصف، الإنجليزية للكود
4. **الاختبارات**: اختبار لكل مكون وخدمة رئيسية

### هيكل Pull Request

```
feat: إضافة دعم مقدم خدمة جديد

- إضافة خدمة NewAIProvider
- تحديث واجهة الإعدادات
- إضافة اختبارات شاملة
- تحديث التوثيق

Closes #123
```

---

*هذا الملف جزء من توثيق Scout AI Platform v2.1.0*  
*للمزيد من المعلومات، راجع [README.md](../README.md)*