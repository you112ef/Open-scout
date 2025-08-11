# 🤖 دليل إضافة مقدمي خدمة ذكاء اصطناعي جدد

## نظرة عامة

يدعم Scout AI Platform إضافة مقدمي خدمة ذكاء اصطناعي جدد بسهولة من خلال بنية قابلة للتوسع. هذا الدليل يوضح كيفية إضافة مقدم خدمة جديد خطوة بخطوة.

## الهيكل العام

### 1. واجهة الخدمة الأساسية

جميع خدمات الذكاء الاصطناعي تتبع النمط التالي:

```typescript
class YourAIService {
  private apiKey: string;
  private baseUrl: string = 'https://api.yourprovider.com';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async makeRequest(endpoint: string, data: any): Promise<any> {
    // منطق الطلب الأساسي
  }

  async sendMessage(messages: Array<{role: string, content: string}>): Promise<string> {
    // منطق إرسال الرسائل
  }
}
```

## خطوات إضافة مقدم خدمة جديد

### الخطوة 1: تحديث واجهة APISettings

في ملف `src/services/ai-services.ts`:

```typescript
export interface APISettings {
  // ... الخدمات الموجودة
  yourProvider?: {
    apiKey: string;
    models: string[];
  };
}
```

### الخطوة 2: إنشاء فئة الخدمة الجديدة

```typescript
class YourProviderService {
  private apiKey: string;
  private baseUrl: string = 'https://api.yourprovider.com';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async makeRequest(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async sendMessage(messages: Array<{role: string, content: string}>): Promise<string> {
    try {
      // تحويل تنسيق الرسائل إذا لزم الأمر
      const formattedMessages = this.formatMessages(messages);
      
      const response = await this.makeRequest('/chat/completions', {
        model: 'your-default-model',
        messages: formattedMessages,
        max_tokens: 4000,
        temperature: 0.7,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('YourProvider API Error:', error);
      throw new Error(`خطأ في الاتصال مع YourProvider: ${error.message}`);
    }
  }

  private formatMessages(messages: Array<{role: string, content: string}>) {
    // تحويل الرسائل للتنسيق المطلوب من مقدم الخدمة
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }
}
```

### الخطوة 3: تحديث AIServiceManager

```typescript
export class AIServiceManager {
  // ... الخدمات الموجودة
  private yourProvider: YourProviderService;

  constructor(settings: APISettings) {
    // ... تهيئة الخدمات الموجودة
    
    if (settings.yourProvider?.apiKey) {
      this.yourProvider = new YourProviderService(settings.yourProvider.apiKey);
    }
  }

  async sendMessage(
    provider: 'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'cohere' | 'mistral' | 'yourProvider',
    messages: Array<{role: string, content: string}>
  ): Promise<string> {
    switch (provider) {
      // ... الحالات الموجودة
      case 'yourProvider':
        if (!this.yourProvider) throw new Error('Your Provider غير مُعدّ');
        return await this.yourProvider.sendMessage(messages);
      default:
        throw new Error(`مقدم خدمة غير مدعوم: ${provider}`);
    }
  }

  getAvailableProviders(): string[] {
    const providers = [];
    // ... إضافة المقدمين الموجودين
    if (this.yourProvider) providers.push('yourProvider');
    return providers;
  }
}
```

### الخطوة 4: تحديث واجهة الإعدادات

في ملف `src/components/SettingsPage.tsx`:

#### إضافة التبويب الجديد:

```typescript
// تحديث TabsList
<TabsList className="grid w-full grid-cols-7"> {/* زيادة العدد */}
  {/* ... التبويبات الموجودة */}
  <TabsTrigger value="yourProvider" className="relative">
    YourProvider
    {settings.yourProvider?.apiKey && (
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
    )}
  </TabsTrigger>
</TabsList>
```

#### إضافة محتوى التبويب:

```typescript
<TabsContent value="yourProvider" className="space-y-4">
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">إعدادات YourProvider</h3>
    
    <div className="space-y-2">
      <Label htmlFor="yourprovider-key">مفتاح API</Label>
      <div className="relative">
        <Input
          id="yourprovider-key"
          type={showKeys.yourProvider ? "text" : "password"}
          value={settings.yourProvider?.apiKey || ''}
          onChange={(e) => updateSetting('yourProvider', 'apiKey', e.target.value)}
          placeholder="أدخل مفتاح YourProvider API"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute left-2 top-1/2 -translate-y-1/2"
          onClick={() => setShowKeys(prev => ({...prev, yourProvider: !prev.yourProvider}))}
        >
          {showKeys.yourProvider ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    </div>

    {settings.yourProvider?.apiKey && (
      <Button 
        onClick={() => testApiKey('yourProvider')} 
        disabled={testingKeys.yourProvider}
        className="w-full"
      >
        {testingKeys.yourProvider ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            جاري الاختبار...
          </>
        ) : (
          <>
            <Zap className="mr-2 h-4 w-4" />
            اختبار الاتصال
          </>
        )}
      </Button>
    )}

    {apiResults.yourProvider && (
      <Alert className={apiResults.yourProvider.success ? "border-green-500" : "border-red-500"}>
        <AlertDescription className={apiResults.yourProvider.success ? "text-green-700" : "text-red-700"}>
          {apiResults.yourProvider.message}
        </AlertDescription>
      </Alert>
    )}

    <div className="text-sm text-muted-foreground">
      <p>احصل على مفتاح API من <a href="https://console.yourprovider.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">لوحة تحكم YourProvider</a></p>
    </div>
  </div>
</TabsContent>
```

#### تحديث دالة testApiKey:

```typescript
const testApiKey = async (provider: string) => {
  setTestingKeys(prev => ({...prev, [provider]: true}));
  
  try {
    let url = '';
    let headers = {};
    
    switch (provider) {
      // ... الحالات الموجودة
      case 'yourProvider':
        url = 'https://api.yourprovider.com/v1/models';
        headers = {
          'Authorization': `Bearer ${settings.yourProvider?.apiKey}`,
          'Content-Type': 'application/json'
        };
        break;
    }

    const response = await fetch(url, { headers });
    
    if (response.ok) {
      setApiResults(prev => ({
        ...prev,
        [provider]: { success: true, message: 'الاتصال نجح! ✅' }
      }));
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    setApiResults(prev => ({
      ...prev,
      [provider]: { success: false, message: `فشل الاتصال: ${error.message}` }
    }));
  } finally {
    setTestingKeys(prev => ({...prev, [provider]: false}));
  }
};
```

### الخطوة 5: تحديث واجهة المحادثة

في ملف `src/components/ChatInterface.tsx`:

```typescript
// تحديث نوع البيانات
const [selectedProvider, setSelectedProvider] = useState<'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'cohere' | 'mistral' | 'yourProvider'>('openai');

// إضافة النماذج المتاحة
const providerModels = {
  // ... المقدمين الموجودين
  yourProvider: ['your-model-1', 'your-model-2', 'your-model-3'],
};
```

### الخطوة 6: تحديث مدير الوكيل

في ملف `src/components/AgentManager.tsx`:

```typescript
const [newTaskProvider, setNewTaskProvider] = useState<'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'cohere' | 'mistral' | 'yourProvider'>('openai');
```

## أمثلة عملية

### مثال 1: إضافة دعم Perplexity AI

```typescript
class PerplexityService {
  private apiKey: string;
  private baseUrl: string = 'https://api.perplexity.ai';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(messages: Array<{role: string, content: string}>): Promise<string> {
    const response = await this.makeRequest('/chat/completions', {
      model: 'llama-3.1-sonar-small-128k-online',
      messages: messages,
      max_tokens: 4000,
      temperature: 0.2,
      top_p: 0.9,
      return_citations: true,
      search_domain_filter: ["perplexity.ai"],
      return_images: false,
      return_related_questions: false,
      search_recency_filter: "month",
      top_k: 0,
      stream: false,
      presence_penalty: 0,
      frequency_penalty: 1
    });

    return response.choices[0].message.content;
  }
}
```

### مثال 2: إضافة دعم Together AI

```typescript
class TogetherService {
  private apiKey: string;
  private baseUrl: string = 'https://api.together.xyz/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(messages: Array<{role: string, content: string}>): Promise<string> {
    const response = await this.makeRequest('/chat/completions', {
      model: 'meta-llama/Llama-2-7b-chat-hf',
      messages: messages,
      max_tokens: 4000,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ["</s>", "[INST]"]
    });

    return response.choices[0].message.content;
  }
}
```

## نصائح وأفضل الممارسات

### 1. معالجة الأخطاء

```typescript
async sendMessage(messages: Array<{role: string, content: string}>): Promise<string> {
  try {
    const response = await this.makeRequest('/chat/completions', data);
    return response.choices[0].message.content;
  } catch (error) {
    console.error('API Error:', error);
    
    // معالجة أنواع مختلفة من الأخطاء
    if (error.message.includes('401')) {
      throw new Error('مفتاح API غير صحيح');
    } else if (error.message.includes('429')) {
      throw new Error('تم تجاوز حد الطلبات. حاول مرة أخرى لاحقاً');
    } else if (error.message.includes('500')) {
      throw new Error('خطأ في الخادم. حاول مرة أخرى لاحقاً');
    }
    
    throw new Error(`خطأ في الاتصال: ${error.message}`);
  }
}
```

### 2. تحويل تنسيق الرسائل

```typescript
private formatMessages(messages: Array<{role: string, content: string}>) {
  // مثال: تحويل للتنسيق المطلوب من مقدم الخدمة
  return messages.map(msg => {
    switch (msg.role) {
      case 'user':
        return { role: 'user', content: msg.content };
      case 'assistant':
        return { role: 'assistant', content: msg.content };
      case 'system':
        return { role: 'system', content: msg.content };
      default:
        return { role: 'user', content: msg.content };
    }
  });
}
```

### 3. إدارة حدود الطلبات

```typescript
class RateLimitedService {
  private lastRequestTime: number = 0;
  private minInterval: number = 1000; // ثانية واحدة بين الطلبات

  async makeRequest(endpoint: string, data: any): Promise<any> {
    // انتظار إذا كان الطلب سريعاً جداً
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minInterval - timeSinceLastRequest)
      );
    }

    this.lastRequestTime = Date.now();
    
    // تنفيذ الطلب الفعلي
    return fetch(/* ... */);
  }
}
```

### 4. دعم البث المباشر (Streaming)

```typescript
async sendMessageStream(
  messages: Array<{role: string, content: string}>,
  onChunk: (chunk: string) => void
): Promise<void> {
  const response = await fetch(`${this.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'your-model',
      messages: messages,
      stream: true,
    }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0]?.delta?.content;
          if (content) {
            onChunk(content);
          }
        } catch (e) {
          // تجاهل أخطاء JSON
        }
      }
    }
  }
}
```

## الاختبار والتحقق

### 1. اختبار الاتصال الأساسي

```bash
# تشغيل المشروع
bun dev

# فتح المتصفح والانتقال للإعدادات
# إدخال مفتاح API واختبار الاتصال
```

### 2. اختبار التكامل

```typescript
// إضافة اختبارات في ملف منفصل
describe('YourProviderService', () => {
  test('should send message successfully', async () => {
    const service = new YourProviderService('test-api-key');
    const response = await service.sendMessage([
      { role: 'user', content: 'مرحبا' }
    ]);
    expect(response).toBeDefined();
  });
});
```

### 3. اختبار معالجة الأخطاء

```typescript
test('should handle API errors gracefully', async () => {
  const service = new YourProviderService('invalid-key');
  
  await expect(service.sendMessage([
    { role: 'user', content: 'test' }
  ])).rejects.toThrow('مفتاح API غير صحيح');
});
```

## خلاصة

إضافة مقدمي خدمة جدد للمنصة عملية مباشرة تتطلب:

1. ✅ إنشاء فئة خدمة جديدة
2. ✅ تحديث واجهة الإعدادات  
3. ✅ تحديث مدير الخدمات
4. ✅ تحديث واجهات المستخدم
5. ✅ إضافة الاختبارات والتحقق

باتباع هذا الدليل، يمكنك إضافة أي مقدم خدمة ذكاء اصطناعي جديد بسهولة والاستفادة من جميع ميزات المنصة.

---

*للمزيد من المساعدة أو الأسئلة، يرجى مراجعة [التوثيق الرئيسي](../README.md) أو فتح issue في المستودع.*