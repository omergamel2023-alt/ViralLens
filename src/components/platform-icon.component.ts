
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformId } from '../types/viral-lens.types';

@Component({
  selector: 'app-platform-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    @switch (platformId()) {
      @case ('youtube') {
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" fill="#FF0000" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white" />
        </svg>
      }
      @case ('linkedin') {
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" fill="#0077B5" />
          <rect x="2" y="9" width="4" height="12" fill="#0077B5" />
          <circle cx="4" cy="4" r="2" fill="#0077B5" />
        </svg>
      }
      @case ('tiktok') {
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
          <!-- Cyan Layer (Shifted Top-Left) -->
          <path 
            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.49a4.86 4.86 0 0 1-1.04-.01Z" 
            fill="#25F4EE" 
            transform="translate(-0.4, -0.4)"
            class="opacity-90"
          />
          <!-- Red Layer (Shifted Bottom-Right) -->
          <path 
            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.49a4.86 4.86 0 0 1-1.04-.01Z" 
            fill="#FE2C55" 
            transform="translate(0.4, 0.4)"
            class="opacity-90"
          />
          <!-- Main Black Layer -->
          <path 
            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.49a4.86 4.86 0 0 1-1.04-.01Z" 
            fill="#000000" 
          />
        </svg>
      }
      @case ('instagram') {
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
          <defs>
            <linearGradient [id]="gradientId" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f09433" />
              <stop offset="25%" stopColor="#e6683c" />
              <stop offset="50%" stopColor="#dc2743" />
              <stop offset="75%" stopColor="#cc2366" />
              <stop offset="100%" stopColor="#bc1888" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" [attr.stroke]="'url(#' + gradientId + ')'" stroke-width="2" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" [attr.stroke]="'url(#' + gradientId + ')'" stroke-width="2" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" [attr.stroke]="'url(#' + gradientId + ')'" stroke-width="2" stroke-linecap="round" />
        </svg>
      }
    }
  `
})
export class PlatformIconComponent {
  platformId = input.required<PlatformId>();
  
  // Unique ID for gradient to avoid conflicts
  readonly gradientId = 'insta-gradient-' + Math.random().toString(36).substr(2, 9);
}
