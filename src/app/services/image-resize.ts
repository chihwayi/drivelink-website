import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ImageResizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  maintainAspectRatio?: boolean;
}

export interface ImageResizeResult {
  originalFile: File;
  resizedBlob: Blob;
  resizedDataUrl: string;
  originalSize: { width: number; height: number };
  resizedSize: { width: number; height: number };
  compressionRatio: number;
}

@Injectable({
  providedIn: 'root'
})
export class ImageResize {
  private readonly DEFAULT_OPTIONS: ImageResizeOptions = {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    format: 'jpeg',
    maintainAspectRatio: true
  };

  constructor() {}

  /**
   * Resize a single image file
   */
  resizeImage(file: File, options?: ImageResizeOptions): Promise<ImageResizeResult> {
    return new Promise((resolve, reject) => {
      const mergedOptions = { ...this.DEFAULT_OPTIONS, ...options };
      
      if (!this.isImageFile(file)) {
        reject(new Error('File is not a valid image'));
        return;
      }

      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        try {
          const { width, height } = this.calculateDimensions(
            img.width, 
            img.height, 
            mergedOptions.maxWidth!, 
            mergedOptions.maxHeight!,
            mergedOptions.maintainAspectRatio!
          );

          canvas.width = width;
          canvas.height = height;

          // Apply image smoothing for better quality
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const result: ImageResizeResult = {
                      originalFile: file,
                      resizedBlob: blob,
                      resizedDataUrl: reader.result as string,
                      originalSize: { width: img.width, height: img.height },
                      resizedSize: { width, height },
                      compressionRatio: blob.size / file.size
                    };
                    resolve(result);
                  };
                  reader.readAsDataURL(blob);
                } else {
                  reject(new Error('Failed to create blob from canvas'));
                }
              },
              `image/${mergedOptions.format}`,
              mergedOptions.quality
            );
          } else {
            reject(new Error('Could not get canvas context'));
          }
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Resize multiple images
   */
  resizeImages(files: FileList | File[], options?: ImageResizeOptions): Observable<ImageResizeResult> {
    const subject = new Subject<ImageResizeResult>();
    const fileArray = Array.from(files);

    const processFiles = async () => {
      for (const file of fileArray) {
        try {
          const result = await this.resizeImage(file, options);
          subject.next(result);
        } catch (error) {
          console.error(`Failed to resize image ${file.name}:`, error);
        }
      }
      subject.complete();
    };

    processFiles();
    return subject.asObservable();
  }

  /**
   * Create a thumbnail from an image
   */
  createThumbnail(file: File, size: number = 150): Promise<string> {
    return new Promise((resolve, reject) => {
      const options: ImageResizeOptions = {
        maxWidth: size,
        maxHeight: size,
        quality: 0.7,
        format: 'jpeg',
        maintainAspectRatio: true
      };

      this.resizeImage(file, options)
        .then(result => resolve(result.resizedDataUrl))
        .catch(error => reject(error));
    });
  }

  /**
   * Compress an image without changing dimensions
   */
  compressImage(file: File, quality: number = 0.8): Promise<ImageResizeResult> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        if (ctx) {
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const reader = new FileReader();
                reader.onload = () => {
                  const result: ImageResizeResult = {
                    originalFile: file,
                    resizedBlob: blob,
                    resizedDataUrl: reader.result as string,
                    originalSize: { width: img.width, height: img.height },
                    resizedSize: { width: img.width, height: img.height },
                    compressionRatio: blob.size / file.size
                  };
                  resolve(result);
                };
                reader.readAsDataURL(blob);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            'image/jpeg',
            quality
          );
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Convert image to different format
   */
  convertImageFormat(file: File, format: 'jpeg' | 'png' | 'webp', quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        if (ctx) {
          // Set background color for jpeg format
          if (format === 'jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to convert image format'));
              }
            },
            `image/${format}`,
            quality
          );
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Get image dimensions without resizing
   */
  getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Check if file is a valid image
   */
  isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  /**
   * Get supported image formats
   */
  getSupportedFormats(): string[] {
    return ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
  }

  /**
   * Calculate optimal dimensions maintaining aspect ratio
   */
  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number,
    maintainAspectRatio: boolean
  ): { width: number; height: number } {
    if (!maintainAspectRatio) {
      return { width: maxWidth, height: maxHeight };
    }

    const aspectRatio = originalWidth / originalHeight;

    let width = originalWidth;
    let height = originalHeight;

    // If image is larger than max dimensions, scale it down
    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return {
      width: Math.round(width),
      height: Math.round(height)
    };
  }

  /**
   * Create a data URL from file
   */
  fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Download resized image
   */
  downloadImage(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Get file size in human readable format
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Validate image dimensions
   */
  validateImageDimensions(
    width: number, 
    height: number, 
    minWidth?: number, 
    minHeight?: number, 
    maxWidth?: number, 
    maxHeight?: number
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (minWidth && width < minWidth) {
      errors.push(`Image width (${width}px) is less than minimum required (${minWidth}px)`);
    }

    if (minHeight && height < minHeight) {
      errors.push(`Image height (${height}px) is less than minimum required (${minHeight}px)`);
    }

    if (maxWidth && width > maxWidth) {
      errors.push(`Image width (${width}px) exceeds maximum allowed (${maxWidth}px)`);
    }

    if (maxHeight && height > maxHeight) {
      errors.push(`Image height (${height}px) exceeds maximum allowed (${maxHeight}px)`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
