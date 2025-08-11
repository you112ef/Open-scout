// خدمات APIs الحقيقية للذكاء الاصطناعي المتطورة
import LLMManager, { AIProvider, AIModel, ProviderSettings } from './llm-manager';

// إعدادات التوافق مع النسخة السابقة
export interface APISettings {
  [key: string]: {
    apiKey: string;
    organizationId?: string;
    baseUrl?: string;
    models?: string[];
    [key: string]: any;
  };
}

class SettingsManager {
  private static STORAGE_KEY = 'scout-ai-settings';
  private static llmManager = LLMManager.getInstance();

  static saveSettings(settings: APISettings): void {
    // تحويل الإعدادات للتوافق مع LLMManager الجديد
    Object.entries(settings).forEach(([providerId, config]) => {
      if (config.apiKey) {
        this.llmManager.setApiKey(providerId, config.apiKey, {
          organizationId: config.organizationId,
          baseUrl: config.baseUrl,
        });
      }
    });
    
    // حفظ في النظام القديم للتوافق
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
  }

  static loadSettings(): APISettings {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const oldSettings = saved ? JSON.parse(saved) : {};
    
    // دمج مع إعدادات LLMManager الجديد
    const newSettings: APISettings = {};
    const providers = this.llmManager.getAllProviders();
    
    providers.forEach(provider => {
      const apiKey = this.llmManager.getApiKey(provider.id);
      if (apiKey || oldSettings[provider.id]) {
        newSettings[provider.id] = {
          apiKey: apiKey || oldSettings[provider.id]?.apiKey || '',
          organizationId: oldSettings[provider.id]?.organizationId,
          baseUrl: oldSettings[provider.id]?.baseUrl,
          models: provider.models.map(m => m.id)
        };
      }
    });
    
    return newSettings;
  }

  static clearSettings(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.llmManager.clearAllSettings();
  }

  static hasValidKey(provider: string): boolean {
    return this.llmManager.hasValidApiKey(provider);
  }

  // طرق جديدة لاستخدام LLMManager
  static getLLMManager(): LLMManager {
    return this.llmManager;
  }

  static getAvailableProviders(): Array<{id: string, name: string, available: boolean}> {
    return this.llmManager.getAllProviders().map(provider => ({
      id: provider.id,
      name: provider.displayName,
      available: this.llmManager.hasValidApiKey(provider.id)
    }));
  }
}

// خدمة OpenAI الحقيقية
class OpenAIService {
  private apiKey: string;
  private organizationId?: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    const settings = SettingsManager.loadSettings();
    this.apiKey = settings.openai?.apiKey || '';
    this.organizationId = settings.openai?.organizationId;
  }

  private async makeRequest(endpoint: string, data: any) {
    if (!this.apiKey) {
      throw new Error('مفتاح OpenAI API غير مُعرّف. يرجى إضافته في الإعدادات.');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };

    if (this.organizationId) {
      headers['OpenAI-Organization'] = this.organizationId;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API Error: ${error}`);
    }

    return response;
  }

  async sendMessage(messages: Array<{role: string, content: string}>, model = 'gpt-3.5-turbo'): Promise<string> {
    const response = await this.makeRequest('/chat/completions', {
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async streamMessage(
    messages: Array<{role: string, content: string}>, 
    onChunk: (content: string) => void,
    model = 'gpt-3.5-turbo'
  ): Promise<void> {
    const response = await this.makeRequest('/chat/completions', {
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
    });

    const reader = response.body?.getReader();
    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

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
            // تجاهل أخطاء التحليل
          }
        }
      }
    }
  }

  async generateImage(prompt: string, model = 'dall-e-3'): Promise<string> {
    const response = await this.makeRequest('/images/generations', {
      model,
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    });

    const data = await response.json();
    return data.data[0].url;
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    if (!this.apiKey) {
      throw new Error('مفتاح OpenAI API غير مُعرّف.');
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('language', 'ar');

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
    };

    if (this.organizationId) {
      headers['OpenAI-Organization'] = this.organizationId;
    }

    const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Whisper API Error: ${error}`);
    }

    const data = await response.json();
    return data.text;
  }
}

// خدمة Anthropic Claude الحقيقية
class AnthropicService {
  private apiKey: string;
  private baseUrl = 'https://api.anthropic.com/v1';

  constructor() {
    const settings = SettingsManager.loadSettings();
    this.apiKey = settings.anthropic?.apiKey || '';
  }

  private async makeRequest(endpoint: string, data: any) {
    if (!this.apiKey) {
      throw new Error('مفتاح Anthropic API غير مُعرّف. يرجى إضافته في الإعدادات.');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API Error: ${error}`);
    }

    return response.json();
  }

  async sendMessage(messages: Array<{role: string, content: string}>, model = 'claude-3-sonnet-20240229'): Promise<string> {
    const data = await this.makeRequest('/messages', {
      model,
      max_tokens: 2000,
      messages,
    });

    return data.content[0].text;
  }
}

// خدمة Google Gemini الحقيقية
class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor() {
    const settings = SettingsManager.loadSettings();
    this.apiKey = settings.gemini?.apiKey || '';
  }

  async sendMessage(messages: Array<{role: string, content: string}>, model = 'gemini-pro'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('مفتاح Gemini API غير مُعرّف. يرجى إضافته في الإعدادات.');
    }

    const contents = messages.map(msg => ({
      parts: [{ text: msg.content }],
      role: msg.role === 'assistant' ? 'model' : 'user',
    }));

    const response = await fetch(`${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API Error: ${error}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }
}

// خدمة Hugging Face الحقيقية
class HuggingFaceService {
  private apiKey: string;
  private baseUrl = 'https://api-inference.huggingface.co/models';

  constructor() {
    const settings = SettingsManager.loadSettings();
    this.apiKey = settings.huggingface?.apiKey || '';
  }

  async sendMessage(text: string, model = 'microsoft/DialoGPT-large'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('مفتاح Hugging Face API غير مُعرّف. يرجى إضافته في الإعدادات.');
    }

    const response = await fetch(`${this.baseUrl}/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          max_length: 200,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Hugging Face API Error: ${error}`);
    }

    const data = await response.json();
    return data[0].generated_text || data.generated_text;
  }
}

// خدمة Cohere الحقيقية
class CohereService {
  private apiKey: string;
  private baseUrl = 'https://api.cohere.ai/v1';

  constructor() {
    const settings = SettingsManager.loadSettings();
    this.apiKey = settings.cohere?.apiKey || '';
  }

  private async makeRequest(endpoint: string, data: any) {
    if (!this.apiKey) {
      throw new Error('مفتاح Cohere API غير مُعرّف. يرجى إضافته في الإعدادات.');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cohere API Error: ${error}`);
    }

    return response.json();
  }

  async sendMessage(messages: Array<{role: string, content: string}>, model = 'command'): Promise<string> {
    // تحويل تنسيق الرسائل لـ Cohere
    const message = messages[messages.length - 1].content;
    const chatHistory = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'CHATBOT' : 'USER',
      message: msg.content
    }));

    const data = await this.makeRequest('/chat', {
      model,
      message,
      chat_history: chatHistory,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return data.text;
  }
}

// خدمة Mistral AI الحقيقية
class MistralService {
  private apiKey: string;
  private baseUrl = 'https://api.mistral.ai/v1';

  constructor() {
    const settings = SettingsManager.loadSettings();
    this.apiKey = settings.mistral?.apiKey || '';
  }

  private async makeRequest(endpoint: string, data: any) {
    if (!this.apiKey) {
      throw new Error('مفتاح Mistral API غير مُعرّف. يرجى إضافته في الإعدادات.');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Mistral API Error: ${error}`);
    }

    return response.json();
  }

  async sendMessage(messages: Array<{role: string, content: string}>, model = 'mistral-tiny'): Promise<string> {
    const data = await this.makeRequest('/chat/completions', {
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return data.choices[0].message.content;
  }
}

// مدير الخدمات الموحد
export class AIServiceManager {
  private openai: OpenAIService;
  private anthropic: AnthropicService;
  private gemini: GeminiService;
  private huggingface: HuggingFaceService;
  private cohere: CohereService;
  private mistral: MistralService;

  constructor() {
    this.openai = new OpenAIService();
    this.anthropic = new AnthropicService();
    this.gemini = new GeminiService();
    this.huggingface = new HuggingFaceService();
    this.cohere = new CohereService();
    this.mistral = new MistralService();
  }

  async sendMessage(
    messages: Array<{role: string, content: string}>,
    provider: 'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'cohere' | 'mistral',
    model?: string
  ): Promise<string> {
    switch (provider) {
      case 'openai':
        return this.openai.sendMessage(messages, model);
      case 'anthropic':
        return this.anthropic.sendMessage(messages, model);
      case 'gemini':
        return this.gemini.sendMessage(messages, model);
      case 'huggingface':
        // Hugging Face يحتاج فقط النص الأخير
        const lastMessage = messages[messages.length - 1];
        return this.huggingface.sendMessage(lastMessage.content, model);
      case 'cohere':
        return this.cohere.sendMessage(messages, model);
      case 'mistral':
        return this.mistral.sendMessage(messages, model);
      default:
        throw new Error('مقدم الخدمة غير مدعوم');
    }
  }

  async streamMessage(
    messages: Array<{role: string, content: string}>,
    provider: 'openai',
    onChunk: (content: string) => void,
    model?: string
  ): Promise<void> {
    if (provider === 'openai') {
      return this.openai.streamMessage(messages, onChunk, model);
    }
    throw new Error('البث المباشر مدعوم فقط مع OpenAI');
  }

  async generateImage(prompt: string, provider: 'openai' = 'openai'): Promise<string> {
    if (provider === 'openai') {
      return this.openai.generateImage(prompt);
    }
    throw new Error('إنشاء الصور مدعوم فقط مع OpenAI حالياً');
  }

  async transcribeAudio(audioBlob: Blob, provider: 'openai' = 'openai'): Promise<string> {
    if (provider === 'openai') {
      return this.openai.transcribeAudio(audioBlob);
    }
    throw new Error('تحويل الصوت مدعوم فقط مع OpenAI حالياً');
  }

  getAvailableProviders(): Array<{id: string, name: string, available: boolean}> {
    return [
      {
        id: 'openai',
        name: 'OpenAI (GPT-4, DALL-E, Whisper)',
        available: SettingsManager.hasValidKey('openai'),
      },
      {
        id: 'anthropic',
        name: 'Anthropic (Claude)',
        available: SettingsManager.hasValidKey('anthropic'),
      },
      {
        id: 'gemini',
        name: 'Google (Gemini)',
        available: SettingsManager.hasValidKey('gemini'),
      },
      {
        id: 'huggingface',
        name: 'Hugging Face',
        available: SettingsManager.hasValidKey('huggingface'),
      },
      {
        id: 'cohere',
        name: 'Cohere (Command)',
        available: SettingsManager.hasValidKey('cohere'),
      },
      {
        id: 'mistral',
        name: 'Mistral AI',
        available: SettingsManager.hasValidKey('mistral'),
      },
    ];
  }
}

export { SettingsManager };