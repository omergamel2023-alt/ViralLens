
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisService } from '../services/analysis.service';
import { PlatformIconComponent } from './platform-icon.component';
import { PlatformId } from '../types/viral-lens.types';

@Component({
  selector: 'app-platform-selector',
  standalone: true,
  imports: [CommonModule, PlatformIconComponent],
  template: `
    <div class="flex flex-col gap-3 md:gap-4">
      <h3 class="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider text-right">اختر المنصة</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        @for (platform of service.platforms; track platform.id) {
          <button 
            (click)="select(platform.id)"
            class="relative overflow-hidden group p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-300 text-right h-full"
            [class]="isSelected(platform.id) 
              ? 'bg-white border-slate-300 shadow-lg scale-[1.02]' 
              : 'bg-white/40 border-transparent hover:bg-white/60 hover:border-slate-200'"
          >
            <!-- Icon Background Blur (Scaled up) -->
            <div class="absolute -left-6 -bottom-6 opacity-5 transform group-hover:scale-125 transition-transform duration-500">
               <app-platform-icon [platformId]="platform.id" class="block w-20 h-20 md:w-28 md:h-28"></app-platform-icon>
            </div>

            <div class="flex flex-col gap-2 md:gap-3 relative z-10">
              <!-- Icon Container -->
              <div 
                class="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 bg-white"
              >
                <app-platform-icon [platformId]="platform.id" class="block w-5 h-5 md:w-6 md:h-6"></app-platform-icon>
              </div>
              
              <div>
                <span class="block text-sm md:text-base font-semibold text-slate-800">{{ platform.name }}</span>
                <span class="text-[10px] md:text-xs text-slate-500 line-clamp-1 opacity-80">
                  {{ isSelected(platform.id) ? 'مفعل' : 'اختر' }}
                </span>
              </div>
            </div>
            
            <!-- Active Indicator -->
            @if (isSelected(platform.id)) {
              <div class="absolute top-2 left-2 md:top-3 md:left-3 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500"></div>
            }
          </button>
        }
      </div>
    </div>
  `
})
export class PlatformSelectorComponent {
  service = inject(AnalysisService);

  isSelected(id: string): boolean {
    return this.service.currentPlatformId() === id;
  }

  select(id: PlatformId) {
    this.service.setPlatform(id);
  }
}
