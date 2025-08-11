// نظام إدارة مقدمي خدمات الذكاء الاصطناعي المتقدم
export interface AIModel {
  id: string;
  name: string;
  contextLength: number;
  maxTokens: number;
  supportsStreaming: boolean;
  supportsImages: boolean;
  supportsTools: boolean;
  pricing?: {
    input: number; // السعر لكل مليون token
    output: number;
  };
}

export interface AIProvider {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: 'general' | 'specialized' | 'research' | 'fast' | 'open-source';
  website: string;
  apiKeyPrefix: string;
  baseUrl: string;
  isOpenAICompatible: boolean;
  models: AIModel[];
  capabilities: {
    chat: boolean;
    completion: boolean;
    embedding: boolean;
    imageGeneration: boolean;
    audioTranscription: boolean;
    functionCalling: boolean;
    webSearch: boolean;
  };
  headers?: Record<string, string>;
  requiresSpecialAuth?: boolean;
}

export interface ProviderSettings {
  apiKey: string;
  organizationId?: string;
  baseUrl?: string;
  customHeaders?: Record<string, string>;
}

export interface LLMManagerConfig {
  providers: Record<string, ProviderSettings>;
  defaultProvider?: string;
  fallbackProviders?: string[];
  ratelimits?: Record<string, number>;
}

class LLMManager {
  private static instance: LLMManager;
  private providers: Map<string, AIProvider> = new Map();
  private settings: LLMManagerConfig;
  private readonly STORAGE_KEY = 'scout-llm-config';

  private constructor() {
    this.settings = this.loadSettings();
    this.initializeProviders();
  }

  public static getInstance(): LLMManager {
    if (!LLMManager.instance) {
      LLMManager.instance = new LLMManager();
    }
    return LLMManager.instance;
  }

  private loadSettings(): LLMManagerConfig {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : { providers: {} };
  }

  public saveSettings(settings: LLMManagerConfig): void {
    this.settings = { ...this.settings, ...settings };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));
  }

  private initializeProviders(): void {
    // OpenAI
    this.providers.set('openai', {
      id: 'openai',
      name: 'OpenAI',
      displayName: 'OpenAI (GPT, DALL-E, Whisper)',
      description: 'الذكاء الاصطناعي الرائد من OpenAI مع GPT-4 و DALL-E',
      category: 'general',
      website: 'https://openai.com',
      apiKeyPrefix: 'sk-',
      baseUrl: 'https://api.openai.com/v1',
      isOpenAICompatible: true,
      models: [
        {
          id: 'gpt-4',
          name: 'GPT-4',
          contextLength: 8192,
          maxTokens: 4096,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: true,
          pricing: { input: 30, output: 60 }
        },
        {
          id: 'gpt-4-turbo',
          name: 'GPT-4 Turbo',
          contextLength: 128000,
          maxTokens: 4096,
          supportsStreaming: true,
          supportsImages: true,
          supportsTools: true,
          pricing: { input: 10, output: 30 }
        },
        {
          id: 'gpt-3.5-turbo',
          name: 'GPT-3.5 Turbo',
          contextLength: 16384,
          maxTokens: 4096,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: true,
          pricing: { input: 0.5, output: 1.5 }
        }
      ],
      capabilities: {
        chat: true,
        completion: true,
        embedding: true,
        imageGeneration: true,
        audioTranscription: true,
        functionCalling: true,
        webSearch: false
      }
    });

    // Anthropic
    this.providers.set('anthropic', {
      id: 'anthropic',
      name: 'Anthropic',
      displayName: 'Anthropic (Claude)',
      description: 'نماذج Claude المتقدمة للمحادثة والتحليل',
      category: 'general',
      website: 'https://anthropic.com',
      apiKeyPrefix: 'sk-ant-',
      baseUrl: 'https://api.anthropic.com/v1',
      isOpenAICompatible: false,
      models: [
        {
          id: 'claude-3-opus-20240229',
          name: 'Claude 3 Opus',
          contextLength: 200000,
          maxTokens: 4096,
          supportsStreaming: true,
          supportsImages: true,
          supportsTools: true,
          pricing: { input: 15, output: 75 }
        },
        {
          id: 'claude-3-sonnet-20240229',
          name: 'Claude 3 Sonnet',
          contextLength: 200000,
          maxTokens: 4096,
          supportsStreaming: true,
          supportsImages: true,
          supportsTools: true,
          pricing: { input: 3, output: 15 }
        },
        {
          id: 'claude-3-haiku-20240307',
          name: 'Claude 3 Haiku',
          contextLength: 200000,
          maxTokens: 4096,
          supportsStreaming: true,
          supportsImages: true,
          supportsTools: true,
          pricing: { input: 0.25, output: 1.25 }
        }
      ],
      capabilities: {
        chat: true,
        completion: false,
        embedding: false,
        imageGeneration: false,
        audioTranscription: false,
        functionCalling: true,
        webSearch: false
      },
      headers: {
        'anthropic-version': '2023-06-01'
      }
    });

    // Google Gemini
    this.providers.set('gemini', {
      id: 'gemini',
      name: 'Google',
      displayName: 'Google (Gemini)',
      description: 'نماذج Gemini المتقدمة من Google',
      category: 'general',
      website: 'https://ai.google.dev',
      apiKeyPrefix: 'AIza',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      isOpenAICompatible: false,
      models: [
        {
          id: 'gemini-pro',
          name: 'Gemini Pro',
          contextLength: 32768,
          maxTokens: 2048,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: true,
          pricing: { input: 0.5, output: 1.5 }
        },
        {
          id: 'gemini-pro-vision',
          name: 'Gemini Pro Vision',
          contextLength: 16384,
          maxTokens: 2048,
          supportsStreaming: false,
          supportsImages: true,
          supportsTools: false,
          pricing: { input: 0.5, output: 1.5 }
        }
      ],
      capabilities: {
        chat: true,
        completion: true,
        embedding: true,
        imageGeneration: false,
        audioTranscription: false,
        functionCalling: true,
        webSearch: false
      },
      requiresSpecialAuth: true
    });

    // Perplexity AI
    this.providers.set('perplexity', {
      id: 'perplexity',
      name: 'Perplexity',
      displayName: 'Perplexity (البحث الذكي)',
      description: 'بحث ذكي في الوقت الفعلي مع مصادر موثقة',
      category: 'research',
      website: 'https://perplexity.ai',
      apiKeyPrefix: 'pplx-',
      baseUrl: 'https://api.perplexity.ai',
      isOpenAICompatible: true,
      models: [
        {
          id: 'sonar-pro',
          name: 'Sonar Pro',
          contextLength: 127072,
          maxTokens: 4096,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: false,
          pricing: { input: 1, output: 3 }
        },
        {
          id: 'sonar-small-online',
          name: 'Sonar Small Online',
          contextLength: 12000,
          maxTokens: 4096,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: false,
          pricing: { input: 0.2, output: 0.2 }
        }
      ],
      capabilities: {
        chat: true,
        completion: false,
        embedding: false,
        imageGeneration: false,
        audioTranscription: false,
        functionCalling: false,
        webSearch: true
      }
    });

    // Together AI
    this.providers.set('together', {
      id: 'together',
      name: 'Together AI',
      displayName: 'Together AI (نماذج مفتوحة)',
      description: 'أكثر من 200 نموذج مفتوح المصدر',
      category: 'open-source',
      website: 'https://together.ai',
      apiKeyPrefix: '',
      baseUrl: 'https://api.together.xyz/v1',
      isOpenAICompatible: true,
      models: [
        {
          id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
          name: 'Llama 3.1 70B Turbo',
          contextLength: 131072,
          maxTokens: 4096,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: true,
          pricing: { input: 0.88, output: 0.88 }
        },
        {
          id: 'Qwen/Qwen2.5-72B-Instruct-Turbo',
          name: 'Qwen 2.5 72B Turbo',
          contextLength: 32768,
          maxTokens: 8192,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: true,
          pricing: { input: 1.2, output: 1.2 }
        }
      ],
      capabilities: {
        chat: true,
        completion: true,
        embedding: true,
        imageGeneration: true,
        audioTranscription: false,
        functionCalling: true,
        webSearch: false
      }
    });

    // Groq
    this.providers.set('groq', {
      id: 'groq',
      name: 'Groq',
      displayName: 'Groq (الاستنتاج السريع)',
      description: 'استنتاج فائق السرعة مع LPU',
      category: 'fast',
      website: 'https://groq.com',
      apiKeyPrefix: 'gsk_',
      baseUrl: 'https://api.groq.com/openai/v1',
      isOpenAICompatible: true,
      models: [
        {
          id: 'llama-3.1-70b-versatile',
          name: 'Llama 3.1 70B',
          contextLength: 131072,
          maxTokens: 32768,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: true,
          pricing: { input: 0.59, output: 0.79 }
        },
        {
          id: 'llama-3.1-8b-instant',
          name: 'Llama 3.1 8B Instant',
          contextLength: 131072,
          maxTokens: 32768,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: true,
          pricing: { input: 0.05, output: 0.08 }
        },
        {
          id: 'mixtral-8x7b-32768',
          name: 'Mixtral 8x7B',
          contextLength: 32768,
          maxTokens: 32768,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: true,
          pricing: { input: 0.24, output: 0.24 }
        }
      ],
      capabilities: {
        chat: true,
        completion: true,
        embedding: false,
        imageGeneration: false,
        audioTranscription: false,
        functionCalling: true,
        webSearch: false
      }
    });

    // Fireworks AI
    this.providers.set('fireworks', {
      id: 'fireworks',
      name: 'Fireworks',
      displayName: 'Fireworks AI (نماذج سريعة)',
      description: 'استنتاج سريع للنماذج المفتوحة والمخصصة',
      category: 'fast',
      website: 'https://fireworks.ai',
      apiKeyPrefix: 'fw-',
      baseUrl: 'https://api.fireworks.ai/inference/v1',
      isOpenAICompatible: true,
      models: [
        {
          id: 'accounts/fireworks/models/llama-v3p1-70b-instruct',
          name: 'Llama 3.1 70B Instruct',
          contextLength: 131072,
          maxTokens: 4096,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: true,
          pricing: { input: 0.9, output: 0.9 }
        },
        {
          id: 'accounts/fireworks/models/mixtral-8x7b-instruct',
          name: 'Mixtral 8x7B Instruct',
          contextLength: 32768,
          maxTokens: 16384,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: true,
          pricing: { input: 0.5, output: 0.5 }
        }
      ],
      capabilities: {
        chat: true,
        completion: true,
        embedding: true,
        imageGeneration: true,
        audioTranscription: false,
        functionCalling: true,
        webSearch: false
      }
    });

    // DeepSeek
    this.providers.set('deepseek', {
      id: 'deepseek',
      name: 'DeepSeek',
      displayName: 'DeepSeek (النماذج المتقدمة)',
      description: 'نماذج DeepSeek V3 و R1 المتقدمة',
      category: 'general',
      website: 'https://deepseek.com',
      apiKeyPrefix: 'sk-',
      baseUrl: 'https://api.deepseek.com',
      isOpenAICompatible: true,
      models: [
        {
          id: 'deepseek-chat',
          name: 'DeepSeek V3',
          contextLength: 64000,
          maxTokens: 8192,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: true,
          pricing: { input: 0.14, output: 0.28 }
        },
        {
          id: 'deepseek-reasoner',
          name: 'DeepSeek R1',
          contextLength: 64000,
          maxTokens: 64000,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: false,
          pricing: { input: 0.55, output: 2.19 }
        }
      ],
      capabilities: {
        chat: true,
        completion: true,
        embedding: false,
        imageGeneration: false,
        audioTranscription: false,
        functionCalling: true,
        webSearch: false
      }
    });

    // xAI (Grok)
    this.providers.set('xai', {
      id: 'xai',
      name: 'xAI',
      displayName: 'xAI (Grok)',
      description: 'نماذج Grok من xAI لـ Elon Musk',
      category: 'general',
      website: 'https://x.ai',
      apiKeyPrefix: 'xai-',
      baseUrl: 'https://api.x.ai/v1',
      isOpenAICompatible: true,
      models: [
        {
          id: 'grok-beta',
          name: 'Grok Beta',
          contextLength: 131072,
          maxTokens: 4096,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: true,
          pricing: { input: 5, output: 15 }
        },
        {
          id: 'grok-vision-beta',
          name: 'Grok Vision Beta',
          contextLength: 8192,
          maxTokens: 4096,
          supportsStreaming: false,
          supportsImages: true,
          supportsTools: false,
          pricing: { input: 5, output: 15 }
        }
      ],
      capabilities: {
        chat: true,
        completion: false,
        embedding: false,
        imageGeneration: false,
        audioTranscription: false,
        functionCalling: true,
        webSearch: true
      }
    });

    // AI21 Labs
    this.providers.set('ai21', {
      id: 'ai21',
      name: 'AI21',
      displayName: 'AI21 Labs (Jurassic)',
      description: 'نماذج Jurassic و Jamba من AI21 Labs',
      category: 'general',
      website: 'https://ai21.com',
      apiKeyPrefix: '',
      baseUrl: 'https://api.ai21.com/studio/v1',
      isOpenAICompatible: false,
      models: [
        {
          id: 'jamba-1.5-large',
          name: 'Jamba 1.5 Large',
          contextLength: 256000,
          maxTokens: 4096,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: true,
          pricing: { input: 2, output: 8 }
        },
        {
          id: 'jamba-1.5-mini',
          name: 'Jamba 1.5 Mini',
          contextLength: 256000,
          maxTokens: 4096,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: true,
          pricing: { input: 0.2, output: 0.4 }
        }
      ],
      capabilities: {
        chat: true,
        completion: true,
        embedding: false,
        imageGeneration: false,
        audioTranscription: false,
        functionCalling: true,
        webSearch: false
      }
    });

    // Replicate
    this.providers.set('replicate', {
      id: 'replicate',
      name: 'Replicate',
      displayName: 'Replicate (نماذج مخصصة)',
      description: 'تشغيل النماذج المخصصة والمفتوحة المصدر',
      category: 'specialized',
      website: 'https://replicate.com',
      apiKeyPrefix: 'r8_',
      baseUrl: 'https://api.replicate.com/v1',
      isOpenAICompatible: false,
      models: [
        {
          id: 'meta/llama-2-70b-chat',
          name: 'Llama 2 70B Chat',
          contextLength: 4096,
          maxTokens: 4096,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: false,
          pricing: { input: 0.7, output: 2.8 }
        }
      ],
      capabilities: {
        chat: true,
        completion: true,
        embedding: false,
        imageGeneration: true,
        audioTranscription: true,
        functionCalling: false,
        webSearch: false
      },
      requiresSpecialAuth: true
    });

    // Anyscale
    this.providers.set('anyscale', {
      id: 'anyscale',
      name: 'Anyscale',
      displayName: 'Anyscale (نماذج موزعة)',
      description: 'نماذج موزعة عالية الأداء',
      category: 'specialized',
      website: 'https://anyscale.com',
      apiKeyPrefix: '',
      baseUrl: 'https://api.endpoints.anyscale.com/v1',
      isOpenAICompatible: true,
      models: [
        {
          id: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
          name: 'Llama 3.1 70B Instruct',
          contextLength: 131072,
          maxTokens: 4096,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: true,
          pricing: { input: 1, output: 1 }
        },
        {
          id: 'mistralai/Mistral-7B-Instruct-v0.1',
          name: 'Mistral 7B Instruct',
          contextLength: 32768,
          maxTokens: 16384,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: false,
          pricing: { input: 0.15, output: 0.15 }
        }
      ],
      capabilities: {
        chat: true,
        completion: true,
        embedding: false,
        imageGeneration: false,
        audioTranscription: false,
        functionCalling: true,
        webSearch: false
      }
    });

    // إضافة المقدمين الحاليين للتوافق مع النسخة السابقة
    // Hugging Face
    this.providers.set('huggingface', {
      id: 'huggingface',
      name: 'HuggingFace',
      displayName: 'Hugging Face',
      description: 'مجتمع النماذج مفتوحة المصدر',
      category: 'open-source',
      website: 'https://huggingface.co',
      apiKeyPrefix: 'hf_',
      baseUrl: 'https://api-inference.huggingface.co/models',
      isOpenAICompatible: false,
      models: [
        {
          id: 'microsoft/DialoGPT-large',
          name: 'DialoGPT Large',
          contextLength: 1024,
          maxTokens: 200,
          supportsStreaming: false,
          supportsImages: false,
          supportsTools: false,
          pricing: { input: 0, output: 0 }
        }
      ],
      capabilities: {
        chat: true,
        completion: true,
        embedding: true,
        imageGeneration: true,
        audioTranscription: true,
        functionCalling: false,
        webSearch: false
      }
    });

    // Cohere
    this.providers.set('cohere', {
      id: 'cohere',
      name: 'Cohere',
      displayName: 'Cohere (Command)',
      description: 'نماذج Command المتخصصة في الأعمال',
      category: 'general',
      website: 'https://cohere.ai',
      apiKeyPrefix: '',
      baseUrl: 'https://api.cohere.ai/v1',
      isOpenAICompatible: false,
      models: [
        {
          id: 'command',
          name: 'Command',
          contextLength: 4096,
          maxTokens: 2000,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: true,
          pricing: { input: 1, output: 2 }
        },
        {
          id: 'command-nightly',
          name: 'Command Nightly',
          contextLength: 4096,
          maxTokens: 2000,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: true,
          pricing: { input: 1, output: 2 }
        }
      ],
      capabilities: {
        chat: true,
        completion: true,
        embedding: true,
        imageGeneration: false,
        audioTranscription: false,
        functionCalling: true,
        webSearch: false
      }
    });

    // Mistral AI
    this.providers.set('mistral', {
      id: 'mistral',
      name: 'Mistral',
      displayName: 'Mistral AI',
      description: 'نماذج Mistral الأوروبية المتقدمة',
      category: 'general',
      website: 'https://mistral.ai',
      apiKeyPrefix: '',
      baseUrl: 'https://api.mistral.ai/v1',
      isOpenAICompatible: true,
      models: [
        {
          id: 'mistral-large-latest',
          name: 'Mistral Large',
          contextLength: 128000,
          maxTokens: 4096,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: true,
          pricing: { input: 2, output: 6 }
        },
        {
          id: 'mistral-small-latest',
          name: 'Mistral Small',
          contextLength: 128000,
          maxTokens: 4096,
          supportsStreaming: true,
          supportsImages: false,
          supportsTools: true,
          pricing: { input: 0.2, output: 0.6 }
        }
      ],
      capabilities: {
        chat: true,
        completion: true,
        embedding: true,
        imageGeneration: false,
        audioTranscription: false,
        functionCalling: true,
        webSearch: false
      }
    });
  }

  // طرق الحصول على البيانات
  public getAllProviders(): AIProvider[] {
    return Array.from(this.providers.values());
  }

  public getProvider(id: string): AIProvider | undefined {
    return this.providers.get(id);
  }

  public getProvidersByCategory(category: AIProvider['category']): AIProvider[] {
    return this.getAllProviders().filter(p => p.category === category);
  }

  public getAvailableProviders(): AIProvider[] {
    return this.getAllProviders().filter(provider => 
      this.hasValidApiKey(provider.id)
    );
  }

  public getProviderModels(providerId: string): AIModel[] {
    const provider = this.getProvider(providerId);
    return provider ? provider.models : [];
  }

  public getModel(providerId: string, modelId: string): AIModel | undefined {
    const provider = this.getProvider(providerId);
    return provider?.models.find(model => model.id === modelId);
  }

  // إدارة مفاتيح API
  public hasValidApiKey(providerId: string): boolean {
    return !!(this.settings.providers[providerId]?.apiKey);
  }

  public setApiKey(providerId: string, apiKey: string, additional?: Partial<ProviderSettings>): void {
    if (!this.settings.providers) {
      this.settings.providers = {};
    }
    
    this.settings.providers[providerId] = {
      apiKey,
      ...additional
    };
    
    this.saveSettings(this.settings);
  }

  public getApiKey(providerId: string): string | undefined {
    return this.settings.providers[providerId]?.apiKey;
  }

  public removeApiKey(providerId: string): void {
    if (this.settings.providers[providerId]) {
      delete this.settings.providers[providerId];
      this.saveSettings(this.settings);
    }
  }

  // البحث والتصفية
  public searchProviders(query: string): AIProvider[] {
    const searchTerm = query.toLowerCase();
    return this.getAllProviders().filter(provider =>
      provider.name.toLowerCase().includes(searchTerm) ||
      provider.displayName.toLowerCase().includes(searchTerm) ||
      provider.description.toLowerCase().includes(searchTerm) ||
      provider.models.some(model => 
        model.name.toLowerCase().includes(searchTerm)
      )
    );
  }

  public searchModels(query: string): Array<{provider: AIProvider, model: AIModel}> {
    const searchTerm = query.toLowerCase();
    const results: Array<{provider: AIProvider, model: AIModel}> = [];
    
    this.getAllProviders().forEach(provider => {
      provider.models.forEach(model => {
        if (model.name.toLowerCase().includes(searchTerm) ||
            model.id.toLowerCase().includes(searchTerm)) {
          results.push({ provider, model });
        }
      });
    });
    
    return results;
  }

  // إحصائيات ومعلومات
  public getStats(): {
    totalProviders: number;
    availableProviders: number;
    totalModels: number;
    categoriesCount: Record<string, number>;
  } {
    const providers = this.getAllProviders();
    const available = this.getAvailableProviders();
    
    const categoriesCount: Record<string, number> = {};
    providers.forEach(provider => {
      categoriesCount[provider.category] = (categoriesCount[provider.category] || 0) + 1;
    });

    return {
      totalProviders: providers.length,
      availableProviders: available.length,
      totalModels: providers.reduce((sum, p) => sum + p.models.length, 0),
      categoriesCount
    };
  }

  // إدارة الإعدادات المتقدمة
  public setDefaultProvider(providerId: string): void {
    this.settings.defaultProvider = providerId;
    this.saveSettings(this.settings);
  }

  public getDefaultProvider(): string | undefined {
    return this.settings.defaultProvider;
  }

  public setFallbackProviders(providerIds: string[]): void {
    this.settings.fallbackProviders = providerIds;
    this.saveSettings(this.settings);
  }

  public getFallbackProviders(): string[] {
    return this.settings.fallbackProviders || [];
  }

  // تصدير/استيراد الإعدادات
  public exportSettings(): string {
    return JSON.stringify(this.settings, null, 2);
  }

  public importSettings(settingsJson: string): boolean {
    try {
      const settings = JSON.parse(settingsJson);
      this.saveSettings(settings);
      return true;
    } catch (error) {
      console.error('خطأ في استيراد الإعدادات:', error);
      return false;
    }
  }

  // مسح جميع الإعدادات
  public clearAllSettings(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.settings = { providers: {} };
  }
}

export default LLMManager;