
import { Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisResult, Platform } from '../types/viral-lens.types';

@Component({
  selector: 'app-analysis-result',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-in fade-in slide-in-from-bottom-4 duration-500 glass-panel rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-xl border border-white/60 text-right">
      <!-- Header -->
      <div class="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div class="w-1.5 md:w-2 h-6 md:h-8 rounded-full" [class]="platform().color.split(' ')[0]"></div>
        <h2 class="text-xl md:text-2xl font-bold text-slate-800">استراتيجية الانتشار</h2>
        <span class="mr-auto px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-slate-100 text-[10px] md:text-xs font-medium text-slate-500">
          {{ platform().name }}
        </span>
      </div>

      <!-- Strategy Insight -->
      <div class="mb-6 md:mb-8 p-3 md:p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-indigo-900 text-sm flex gap-3 items-start leading-relaxed">
        <svg class="w-5 h-5 text-indigo-500 shrink-0 mt-0.5 ml-2 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div class="space-y-2" dir="auto">
          @for (line of strategyLines(); track $index) {
            <p>{{ line }}</p>
          }
        </div>
      </div>

      <!-- Title Section -->
      <div class="space-y-5 md:space-y-6">
        <div class="group relative">
           <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">العنوان المحسن</label>
           <div class="p-3 md:p-4 bg-white rounded-xl border border-slate-200 shadow-sm text-base md:text-lg font-medium text-slate-800 pl-10 md:pl-12" dir="auto">
             {{ result().title }}
           </div>
           <button 
             (click)="copyToClipboard(result().title, 'title')" 
             class="absolute top-9 md:top-10 left-2 md:left-3 transition-all duration-200 flex items-center gap-1 p-1 rounded-md hover:bg-slate-50"
             [class]="copiedField() === 'title' ? 'text-emerald-500' : 'text-slate-400 hover:text-indigo-500'"
             title="نسخ العنوان"
           >
              @if (copiedField() === 'title') {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              } @else {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              }
           </button>
        </div>

        <!-- Caption Section -->
        <div class="group relative">
           <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">الوصف (الكابشن)</label>
           <div class="p-3 md:p-4 bg-white rounded-xl border border-slate-200 shadow-sm text-sm md:text-base text-slate-700 whitespace-pre-wrap leading-relaxed pl-10 md:pl-12" dir="auto">
             {{ result().caption }}
           </div>
            <button 
              (click)="copyToClipboard(result().caption, 'caption')" 
              class="absolute top-9 md:top-10 left-2 md:left-3 transition-all duration-200 flex items-center gap-1 p-1 rounded-md hover:bg-slate-50"
              [class]="copiedField() === 'caption' ? 'text-emerald-500' : 'text-slate-400 hover:text-indigo-500'"
              title="نسخ الوصف"
            >
              @if (copiedField() === 'caption') {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              } @else {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              }
           </button>
        </div>

        <!-- Hashtags -->
        <div class="group relative">
           <div class="flex justify-between items-end mb-2">
             <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">الهاشتاغات</label>
             <button 
                (click)="copyHashtags()" 
                class="text-[10px] md:text-xs font-medium transition-colors flex items-center gap-1"
                [class]="copiedField() === 'hashtags' ? 'text-emerald-600' : 'text-indigo-600 hover:text-indigo-800'"
             >
                @if (copiedField() === 'hashtags') {
                  <span>تم النسخ!</span>
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                } @else {
                  <span>نسخ الكل</span>
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                }
             </button>
           </div>
           
           <div class="flex flex-wrap gap-2">
             @for (tag of result().hashtags; track tag) {
               <span class="px-2.5 py-1 md:px-3 md:py-1.5 bg-white border border-slate-200 rounded-lg text-indigo-600 font-medium text-xs md:text-sm shadow-sm select-all" dir="auto">
                 {{ tag }}
               </span>
             }
           </div>
        </div>
      </div>
    </div>
  `
})
export class AnalysisResultComponent {
  result = input.required<AnalysisResult>();
  platform = input.required<Platform>();
  
  copiedField = signal<string | null>(null);

  // Split strategy text into paragraphs for better readability
  strategyLines = computed(() => {
    return this.result().strategy.split('\n').filter(line => line.trim().length > 0);
  });

  copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text);
    this.showCopiedFeedback(field);
  }

  copyHashtags() {
    const tags = this.result().hashtags.join(' ');
    navigator.clipboard.writeText(tags);
    this.showCopiedFeedback('hashtags');
  }

  private showCopiedFeedback(field: string) {
    this.copiedField.set(field);
    setTimeout(() => {
      if (this.copiedField() === field) {
        this.copiedField.set(null);
      }
    }, 2000);
  }
}
