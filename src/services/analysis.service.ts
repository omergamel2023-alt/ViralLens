import { Injectable, signal, computed } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';
import { PlatformId, AnalysisResult, AnalysisState, Platform, VideoData } from '../types/viral-lens.types';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  // State Signals
  private state = signal<AnalysisState>({
    currentPlatform: 'tiktok',
    isLoading: false,
    error: null,
    result: null,
    video: null
  });

  // Selectors
  readonly currentPlatformId = computed(() => this.state().currentPlatform);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly error = computed(() => this.state().error);
  readonly result = computed(() => this.state().result);
  readonly video = computed(() => this.state().video);

  // Platform Definitions
  readonly platforms: Platform[] = [
    {
      id: 'tiktok',
      name: 'TikTok',
      color: 'bg-black text-white',
      description: 'نصوص قصيرة وحماسية + هاشتاغات فيروسية (Viral).'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      color: 'bg-red-600 text-white',
      description: 'عناوين متوافقة مع SEO + وصف تفصيلي.'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white',
      description: 'نصوص جمالية (Aesthetic) + وسوم بصرية ومجتمعية.'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      color: 'bg-blue-700 text-white',
      description: 'رؤى مهنية احترافية + وسوم خاصة بالصناعة.'
    }
  ];

  readonly currentPlatform = computed(() => 
    this.platforms.find(p => p.id === this.state().currentPlatform) || this.platforms[0]
  );

  // Actions
  setPlatform(id: PlatformId) {
    this.state.update(s => ({ ...s, currentPlatform: id, result: null, error: null }));
  }

  async setVideoFile(file: File) {
    // Safety Check: Limit file size to ~25MB to prevent browser freeze during Base64 conversion
    // and to respect API payload limits for inline data.
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
      this.state.update(s => ({
        ...s,
        isLoading: false,
        error: 'عذراً، حجم الفيديو كبير جداً. يرجى استخدام ملف أقل من 25 ميجابايت لضمان سرعة التحليل.'
      }));
      return;
    }

    try {
      this.state.update(s => ({ ...s, isLoading: true, error: null }));
      const videoData = await this.processFile(file);
      this.state.update(s => ({ 
        ...s, 
        video: videoData, 
        isLoading: false, 
        result: null // Reset result on new video
      }));
    } catch (e) {
      this.state.update(s => ({ 
        ...s, 
        isLoading: false, 
        error: 'فشل في معالجة ملف الفيديو. يرجى تجربة ملف آخر.' 
      }));
    }
  }

  removeVideo() {
    this.state.update(s => ({ ...s, video: null, result: null, error: null }));
  }

  async analyzeVideo() {
    const currentState = this.state();
    const video = currentState.video;
    const platform = this.currentPlatform();

    if (!video) {
      this.state.update(s => ({ ...s, error: 'يرجى رفع فيديو للتحليل.' }));
      return;
    }

    this.state.update(s => ({ ...s, isLoading: true, error: null, result: null }));

    try {
      const result = await this.callGeminiAPI(video, platform);
      this.state.update(s => ({ ...s, isLoading: false, result }));
    } catch (e) {
      console.error(e);
      this.state.update(s => ({ 
        ...s, 
        isLoading: false, 
        error: 'فشل التحليل. تأكد من إعداد مفتاح API بشكل صحيح في ملف .env' 
      }));
    }
  }

  private async processFile(file: File): Promise<VideoData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve({
          data: base64String,
          mimeType: file.type,
          previewUrl: URL.createObjectURL(file),
          name: file.name
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private async callGeminiAPI(video: VideoData, platform: Platform): Promise<AnalysisResult> {
    // ---------------------------------------------------------
    // هام: يتم قراءة المفتاح هنا من ملف .env
    // تأكد من وجود السطر التالي في ملف .env الخاص بك:
    // API_KEY=AIzaSy...
    // ---------------------------------------------------------
    const apiKey = process.env['API_KEY'];
    
    // Check if key is missing or is clearly the placeholder
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      // Mock fallback: إذا لم يتم العثور على المفتاح، نعرض محاكاة للنتيجة
      // لكي لا يتوقف التطبيق عن العمل أثناء التجربة
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        title: `[تنبيه: مفتاح API مفقود] تحليل افتراضي لـ ${platform.name}`,
        caption: `هذه نتيجة محاكاة لأن التطبيق لم يجد مفتاح Gemini API صالحاً.\n\nللحصول على تحليل حقيقي بالذكاء الاصطناعي:\n1. افتح ملف .env في المجلد الرئيسي.\n2. استبدل النص الموجود بمفتاحك: API_KEY=AIzaSy...\n3. أعد تشغيل التطبيق.`,
        hashtags: ['#تنبيه', '#API_KEY_MISSING', '#قم_بإعداد_المفتاح', `#${platform.id}`],
        strategy: `لم يتم الاتصال بـ Gemini AI. يرجى إضافة مفتاح API في ملف .env لتفعيل الذكاء الاصطناعي.`
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      تصرف كخبير ومختص في استراتيجيات وسائل التواصل الاجتماعي. قم بتحليل هذا الفيديو من البداية إلى النهاية.
      حدد العناصر البصرية الرئيسية، الحالة المزاجية، الحركة، وأي كلمات منطوقة.
      
      بعد ذلك، قم بتوليد بيانات وصفية (Metadata) محسنة ومخصصة لمنصة ${platform.name}.
      
      المتطلبات الخاصة بمنصة ${platform.name}:
      ${platform.description}
      
      المخرجات يجب أن تكون باللغة العربية (ماعدا الهاشتاغات يمكن أن تكون مختلطة إذا كان ذلك أنسب للانتشار).
      
      أرجع كائن JSON يحتوي على:
      - title: عنوان جذاب وقابل للانتشار (Viral).
      - caption: نص الكابشن الكامل (مع استخدام الإيموجي المناسب للمنصة).
      - hashtags: مصفوفة تحتوي على 5-10 هاشتاغات ذات صلة قوية.
      - strategy: شرح موجز باللغة العربية لسبب اختيار هذه الاستراتيجية وكيف تناسب محتوى الفيديو.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: video.mimeType,
                data: video.data
              }
            },
            {
              text: prompt
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        // High thinking budget for "Video Understanding" and deep analysis
        thinkingConfig: { thinkingBudget: 2048 }, 
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            caption: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            strategy: { type: Type.STRING }
          },
          required: ['title', 'caption', 'hashtags', 'strategy']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error('No response from Gemini');
    
    return JSON.parse(text) as AnalysisResult;
  }
}