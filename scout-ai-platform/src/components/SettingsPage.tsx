import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Key,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Plus,
  Settings,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { SettingsManager, APISettings } from '../services/ai-services';

export default function SettingsPage() {
  const [settings, setSettings] = useState<APISettings>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error' | 'testing'>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadedSettings = SettingsManager.loadSettings();
    setSettings(loadedSettings);
  }, []);

  const handleSave = () => {
    SettingsManager.saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    SettingsManager.clearSettings();
    setSettings({});
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleKeyVisibility = (provider: string) => {
    setShowKeys(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  const testApiKey = async (provider: keyof APISettings) => {
    setTestResults(prev => ({ ...prev, [provider]: 'testing' }));
    
    try {
      // اختبار بسيط لكل مقدم خدمة
      let testUrl = '';
      let testOptions: RequestInit = {};

      switch (provider) {
        case 'openai':
          testUrl = 'https://api.openai.com/v1/models';
          testOptions = {
            headers: {
              'Authorization': `Bearer ${settings.openai?.apiKey}`,
              ...(settings.openai?.organizationId && {
                'OpenAI-Organization': settings.openai.organizationId
              })
            }
          };
          break;
        
        case 'anthropic':
          testUrl = 'https://api.anthropic.com/v1/messages';
          testOptions = {
            method: 'POST',
            headers: {
              'x-api-key': settings.anthropic?.apiKey || '',
              'anthropic-version': '2023-06-01',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'claude-3-haiku-20240307',
              max_tokens: 10,
              messages: [{ role: 'user', content: 'test' }]
            })
          };
          break;
        
        case 'gemini':
          testUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${settings.gemini?.apiKey}`;
          break;
        
        case 'huggingface':
          testUrl = 'https://huggingface.co/api/whoami';
          testOptions = {
            headers: {
              'Authorization': `Bearer ${settings.huggingface?.apiKey}`
            }
          };
          break;
        
        case 'cohere':
          testUrl = 'https://api.cohere.ai/v1/models';
          testOptions = {
            headers: {
              'Authorization': `Bearer ${settings.cohere?.apiKey}`
            }
          };
          break;
        
        case 'mistral':
          testUrl = 'https://api.mistral.ai/v1/models';
          testOptions = {
            headers: {
              'Authorization': `Bearer ${settings.mistral?.apiKey}`
            }
          };
          break;
      }

      const response = await fetch(testUrl, testOptions);
      
      if (response.ok) {
        setTestResults(prev => ({ ...prev, [provider]: 'success' }));
      } else {
        setTestResults(prev => ({ ...prev, [provider]: 'error' }));
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [provider]: 'error' }));
    }
  };

  const updateSettings = (provider: keyof APISettings, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value
      }
    }));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            إعدادات APIs الذكاء الاصطناعي
          </h1>
          <p className="text-muted-foreground mt-1">
            قم بتكوين مفاتيح API لخدمات الذكاء الاصطناعي المختلفة
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            حفظ الإعدادات
          </Button>
          <Button variant="outline" onClick={handleClear} className="gap-2">
            <Trash2 className="h-4 w-4" />
            مسح الكل
          </Button>
        </div>
      </div>

      {saved && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            تم حفظ الإعدادات بنجاح!
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="openai" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="openai" className="gap-2">
            <div className="flex items-center gap-2">
              OpenAI
              {settings.openai?.apiKey && (
                <Badge variant="secondary" className="h-2 w-2 p-0 bg-green-500" />
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger value="anthropic" className="gap-2">
            <div className="flex items-center gap-2">
              Anthropic
              {settings.anthropic?.apiKey && (
                <Badge variant="secondary" className="h-2 w-2 p-0 bg-green-500" />
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger value="gemini" className="gap-2">
            <div className="flex items-center gap-2">
              Gemini
              {settings.gemini?.apiKey && (
                <Badge variant="secondary" className="h-2 w-2 p-0 bg-green-500" />
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger value="huggingface" className="gap-2">
            <div className="flex items-center gap-2">
              HF
              {settings.huggingface?.apiKey && (
                <Badge variant="secondary" className="h-2 w-2 p-0 bg-green-500" />
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger value="cohere" className="gap-2">
            <div className="flex items-center gap-2">
              Cohere
              {settings.cohere?.apiKey && (
                <Badge variant="secondary" className="h-2 w-2 p-0 bg-green-500" />
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger value="mistral" className="gap-2">
            <div className="flex items-center gap-2">
              Mistral
              {settings.mistral?.apiKey && (
                <Badge variant="secondary" className="h-2 w-2 p-0 bg-green-500" />
              )}
            </div>
          </TabsTrigger>
        </TabsList>

        {/* OpenAI Settings */}
        <TabsContent value="openai">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                OpenAI Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">API Key *</Label>
                <div className="relative">
                  <Input
                    id="openai-key"
                    type={showKeys.openai ? "text" : "password"}
                    placeholder="sk-..."
                    value={settings.openai?.apiKey || ''}
                    onChange={(e) => updateSettings('openai', 'apiKey', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    onClick={() => toggleKeyVisibility('openai')}
                  >
                    {showKeys.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="openai-org">Organization ID (اختياري)</Label>
                <Input
                  id="openai-org"
                  placeholder="org-..."
                  value={settings.openai?.organizationId || ''}
                  onChange={(e) => updateSettings('openai', 'organizationId', e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => testApiKey('openai')}
                  disabled={!settings.openai?.apiKey || testResults.openai === 'testing'}
                  variant="outline"
                  size="sm"
                >
                  {testResults.openai === 'testing' ? 'جاري الاختبار...' : 'اختبار الاتصال'}
                </Button>
                
                {testResults.openai === 'success' && (
                  <Badge variant="secondary" className="gap-1 text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    يعمل بنجاح
                  </Badge>
                )}
                
                {testResults.openai === 'error' && (
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    خطأ في الاتصال
                  </Badge>
                )}
              </div>

              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  احصل على مفتاح API من{' '}
                  <a href="https://platform.openai.com/api-keys" target="_blank" className="text-primary hover:underline">
                    OpenAI Platform
                  </a>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Anthropic Settings */}
        <TabsContent value="anthropic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                Anthropic Claude Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="anthropic-key">API Key *</Label>
                <div className="relative">
                  <Input
                    id="anthropic-key"
                    type={showKeys.anthropic ? "text" : "password"}
                    placeholder="sk-ant-..."
                    value={settings.anthropic?.apiKey || ''}
                    onChange={(e) => updateSettings('anthropic', 'apiKey', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    onClick={() => toggleKeyVisibility('anthropic')}
                  >
                    {showKeys.anthropic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => testApiKey('anthropic')}
                  disabled={!settings.anthropic?.apiKey || testResults.anthropic === 'testing'}
                  variant="outline"
                  size="sm"
                >
                  {testResults.anthropic === 'testing' ? 'جاري الاختبار...' : 'اختبار الاتصال'}
                </Button>
                
                {testResults.anthropic === 'success' && (
                  <Badge variant="secondary" className="gap-1 text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    يعمل بنجاح
                  </Badge>
                )}
                
                {testResults.anthropic === 'error' && (
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    خطأ في الاتصال
                  </Badge>
                )}
              </div>

              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  احصل على مفتاح API من{' '}
                  <a href="https://console.anthropic.com/" target="_blank" className="text-primary hover:underline">
                    Anthropic Console
                  </a>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Google Gemini Settings */}
        <TabsContent value="gemini">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Google Gemini Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gemini-key">API Key *</Label>
                <div className="relative">
                  <Input
                    id="gemini-key"
                    type={showKeys.gemini ? "text" : "password"}
                    placeholder="AIza..."
                    value={settings.gemini?.apiKey || ''}
                    onChange={(e) => updateSettings('gemini', 'apiKey', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    onClick={() => toggleKeyVisibility('gemini')}
                  >
                    {showKeys.gemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => testApiKey('gemini')}
                  disabled={!settings.gemini?.apiKey || testResults.gemini === 'testing'}
                  variant="outline"
                  size="sm"
                >
                  {testResults.gemini === 'testing' ? 'جاري الاختبار...' : 'اختبار الاتصال'}
                </Button>
                
                {testResults.gemini === 'success' && (
                  <Badge variant="secondary" className="gap-1 text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    يعمل بنجاح
                  </Badge>
                )}
                
                {testResults.gemini === 'error' && (
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    خطأ في الاتصال
                  </Badge>
                )}
              </div>

              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  احصل على مفتاح API من{' '}
                  <a href="https://ai.google.dev/" target="_blank" className="text-primary hover:underline">
                    Google AI Studio
                  </a>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hugging Face Settings */}
        <TabsContent value="huggingface">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Hugging Face Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hf-key">API Key *</Label>
                <div className="relative">
                  <Input
                    id="hf-key"
                    type={showKeys.huggingface ? "text" : "password"}
                    placeholder="hf_..."
                    value={settings.huggingface?.apiKey || ''}
                    onChange={(e) => updateSettings('huggingface', 'apiKey', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    onClick={() => toggleKeyVisibility('huggingface')}
                  >
                    {showKeys.huggingface ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => testApiKey('huggingface')}
                  disabled={!settings.huggingface?.apiKey || testResults.huggingface === 'testing'}
                  variant="outline"
                  size="sm"
                >
                  {testResults.huggingface === 'testing' ? 'جاري الاختبار...' : 'اختبار الاتصال'}
                </Button>
                
                {testResults.huggingface === 'success' && (
                  <Badge variant="secondary" className="gap-1 text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    يعمل بنجاح
                  </Badge>
                )}
                
                {testResults.huggingface === 'error' && (
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    خطأ في الاتصال
                  </Badge>
                )}
              </div>

              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  احصل على مفتاح API من{' '}
                  <a href="https://huggingface.co/settings/tokens" target="_blank" className="text-primary hover:underline">
                    Hugging Face Tokens
                  </a>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cohere Settings */}
        <TabsContent value="cohere">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                Cohere Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cohere-key">API Key *</Label>
                <div className="relative">
                  <Input
                    id="cohere-key"
                    type={showKeys.cohere ? "text" : "password"}
                    placeholder="your-cohere-api-key"
                    value={settings.cohere?.apiKey || ''}
                    onChange={(e) => updateSettings('cohere', 'apiKey', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    onClick={() => toggleKeyVisibility('cohere')}
                  >
                    {showKeys.cohere ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => testApiKey('cohere')}
                  disabled={!settings.cohere?.apiKey || testResults.cohere === 'testing'}
                  variant="outline"
                  size="sm"
                >
                  {testResults.cohere === 'testing' ? 'جاري الاختبار...' : 'اختبار الاتصال'}
                </Button>
                
                {testResults.cohere === 'success' && (
                  <Badge variant="secondary" className="gap-1 text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    يعمل بنجاح
                  </Badge>
                )}
                
                {testResults.cohere === 'error' && (
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    خطأ في الاتصال
                  </Badge>
                )}
              </div>

              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  احصل على مفتاح API من{' '}
                  <a href="https://dashboard.cohere.ai/api-keys" target="_blank" className="text-primary hover:underline">
                    Cohere Dashboard
                  </a>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mistral AI Settings */}
        <TabsContent value="mistral">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-indigo-600" />
                Mistral AI Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mistral-key">API Key *</Label>
                <div className="relative">
                  <Input
                    id="mistral-key"
                    type={showKeys.mistral ? "text" : "password"}
                    placeholder="your-mistral-api-key"
                    value={settings.mistral?.apiKey || ''}
                    onChange={(e) => updateSettings('mistral', 'apiKey', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    onClick={() => toggleKeyVisibility('mistral')}
                  >
                    {showKeys.mistral ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => testApiKey('mistral')}
                  disabled={!settings.mistral?.apiKey || testResults.mistral === 'testing'}
                  variant="outline"
                  size="sm"
                >
                  {testResults.mistral === 'testing' ? 'جاري الاختبار...' : 'اختبار الاتصال'}
                </Button>
                
                {testResults.mistral === 'success' && (
                  <Badge variant="secondary" className="gap-1 text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    يعمل بنجاح
                  </Badge>
                )}
                
                {testResults.mistral === 'error' && (
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    خطأ في الاتصال
                  </Badge>
                )}
              </div>

              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  احصل على مفتاح API من{' '}
                  <a href="https://console.mistral.ai/" target="_blank" className="text-primary hover:underline">
                    Mistral Console
                  </a>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Alert className="mt-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>تنبيه أمني:</strong> مفاتيح API يتم حفظها محلياً في متصفحك فقط ولا يتم إرسالها لأي خادم.
          تأكد من عدم مشاركة هذه المفاتيح مع أي شخص آخر.
        </AlertDescription>
      </Alert>
    </div>
  );
}