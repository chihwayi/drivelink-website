import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  Renderer2,
  HostListener,
  Output,
  EventEmitter,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ImageResize as ImageResizeService, ImageResizeOptions } from '../services/image-resize';

@Directive({
  selector: '[appImageResize]'
})
export class ImageResize implements OnInit, OnDestroy {
  @Input() resizeOptions: ImageResizeOptions = {};
  @Input() autoResize: boolean = true;
  @Input() showLoader: boolean = true;
  @Input() placeholderSrc: string = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+';

  @Output() imageLoaded = new EventEmitter<string>();
  @Output() imageError = new EventEmitter<string>();
  @Output() resizeComplete = new EventEmitter<any>();

  private originalSrc: string = '';
  private resizeObserver?: ResizeObserver;
  private intersectionObserver?: IntersectionObserver;
  private isIntersecting: boolean = false;
  private debounceTimeout?: any; // Changed from number to any for cross-platform compatibility

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private renderer: Renderer2,
    private imageResizeService: ImageResizeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.setupImageElement();
    
    // Only setup observers in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.setupObservers();
    } else {
      // In SSR, mark as intersecting to allow processing
      this.isIntersecting = true;
    }
    
    this.handleInitialLoad();
  }

  ngOnDestroy(): void {
    this.cleanupObservers();
    this.clearDebounceTimeout();
  }

  @HostListener('load', ['$event'])
  onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    this.hideLoader();
    this.imageLoaded.emit(img.src);
  }

  @HostListener('error', ['$event'])
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    this.hideLoader();
    this.showErrorPlaceholder();
    this.imageError.emit('Failed to load image');
  }

  /**
   * Manually trigger image resize
   */
  resize(): void {
    if (this.originalSrc && isPlatformBrowser(this.platformId)) {
      this.processImage(this.originalSrc);
    }
  }

  /**
   * Update resize options
   */
  updateOptions(options: ImageResizeOptions): void {
    this.resizeOptions = { ...this.resizeOptions, ...options };
    if (this.autoResize) {
      this.resize();
    }
  }

  /**
   * Set new image source
   */
  setSrc(src: string): void {
    this.originalSrc = src;
    if (this.isIntersecting || !this.intersectionObserver) {
      this.processImage(src);
    }
  }

  private setupImageElement(): void {
    const img = this.el.nativeElement;

    // Add CSS classes for styling
    this.renderer.addClass(img, 'app-image-resize');
    this.renderer.setStyle(img, 'transition', 'opacity 0.3s ease-in-out');

    // Store original src
    this.originalSrc = img.src || img.getAttribute('data-src') || '';

    // Set loading state
    if (this.showLoader && this.originalSrc) {
      this.displayLoader();
    }
  }

  private setupObservers(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Don't run in SSR
    }

    // Intersection Observer for lazy loading
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.isIntersecting = true;
              if (this.originalSrc) {
                this.processImage(this.originalSrc);
              }
              this.intersectionObserver?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      this.intersectionObserver.observe(this.el.nativeElement);
    } else {
      this.isIntersecting = true;
    }

    // Resize Observer for responsive images
    if (typeof window !== 'undefined' && 'ResizeObserver' in window && this.autoResize) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.isIntersecting && this.originalSrc) {
          this.debounceResize();
        }
      });

      this.resizeObserver.observe(this.el.nativeElement);
    }
  }

  private cleanupObservers(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private clearDebounceTimeout(): void {
    if (this.debounceTimeout) {
      if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
        clearTimeout(this.debounceTimeout);
      }
      this.debounceTimeout = undefined;
    }
  }

  private handleInitialLoad(): void {
    if (this.originalSrc && (this.isIntersecting || !this.intersectionObserver)) {
      this.processImage(this.originalSrc);
    }
  }

  private async processImage(src: string): Promise<void> {
    // Skip processing during SSR
    if (!isPlatformBrowser(this.platformId)) {
      this.setImageSrc(src);
      return;
    }

    try {
      // If it's a data URL or blob URL, use it directly
      if (src.startsWith('data:') || src.startsWith('blob:')) {
        this.setImageSrc(src);
        return;
      }

      // If it's a regular URL, fetch and process it
      const response = await fetch(src);
      const blob = await response.blob();
      const file = new File([blob], 'image', { type: blob.type });

      if (this.imageResizeService.isImageFile(file)) {
        const containerDimensions = this.getContainerDimensions();
        const options: ImageResizeOptions = {
          maxWidth: containerDimensions.width,
          maxHeight: containerDimensions.height,
          ...this.resizeOptions
        };

        const result = await this.imageResizeService.resizeImage(file, options);
        this.setImageSrc(result.resizedDataUrl);
        this.resizeComplete.emit(result);
      } else {
        // Not an image file, use original src
        this.setImageSrc(src);
      }
    } catch (error) {
      console.error('Failed to process image:', error);
      this.setImageSrc(src); // Fallback to original src
    }
  }

  private getContainerDimensions(): { width: number; height: number } {
    // Return default dimensions for SSR
    if (!isPlatformBrowser(this.platformId)) {
      return { width: 1920, height: 1080 };
    }

    const img = this.el.nativeElement;
    const container = img.parentElement;

    if (container && typeof container.getBoundingClientRect === 'function') {
      try {
        const containerRect = container.getBoundingClientRect();
        return {
          width: containerRect.width || 1920,
          height: containerRect.height || 1080
        };
      } catch (error) {
        console.warn('Failed to get container dimensions:', error);
        // Fallback to default dimensions
      }
    }

    // Fallback to window dimensions or defaults
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth || 1920,
        height: window.innerHeight || 1080
      };
    }

    return { width: 1920, height: 1080 };
  }

  private setImageSrc(src: string): void {
    const img = this.el.nativeElement;
    this.renderer.setAttribute(img, 'src', src);
  }

  private displayLoader(): void {
    if (!this.showLoader) return;

    const img = this.el.nativeElement;
    this.renderer.setStyle(img, 'opacity', '0.5');
    this.renderer.setAttribute(img, 'src', this.placeholderSrc);
  }

  private hideLoader(): void {
    const img = this.el.nativeElement;
    this.renderer.setStyle(img, 'opacity', '1');
  }

  private showErrorPlaceholder(): void {
    const img = this.el.nativeElement;
    const errorSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yIExvYWRpbmc8L3RleHQ+PC9zdmc+';
    this.renderer.setAttribute(img, 'src', errorSrc);
  }

  private debounceResize(): void {
    this.clearDebounceTimeout();

    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
      this.debounceTimeout = window.setTimeout(() => {
        this.resize();
      }, 300);
    }
  }
}