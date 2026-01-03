
export type PlatformId = 'tiktok' | 'youtube' | 'instagram' | 'linkedin';

export interface Platform {
  id: PlatformId;
  name: string;
  color: string;
  description: string;
}

export interface AnalysisResult {
  title: string;
  caption: string;
  hashtags: string[];
  strategy: string;
}

export interface VideoData {
  data: string; // Base64
  mimeType: string;
  previewUrl: string; // Blob URL for local preview
  name: string;
}

export interface AnalysisState {
  currentPlatform: PlatformId;
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
  video: VideoData | null;
}
