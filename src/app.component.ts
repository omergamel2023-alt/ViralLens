
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisService } from './services/analysis.service';
import { PlatformSelectorComponent } from './components/platform-selector.component';
import { AnalysisResultComponent } from './components/analysis-result.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, PlatformSelectorComponent, AnalysisResultComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  service = inject(AnalysisService);
  
  isDragging = false;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.service.setVideoFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        this.service.setVideoFile(file);
      }
    }
  }

  onAnalyze() {
    this.service.analyzeVideo();
  }

  removeVideo() {
    this.service.removeVideo();
  }

  updateApiKey(event: Event) {
    const input = event.target as HTMLInputElement;
    this.service.setApiKey(input.value);
  }
}
