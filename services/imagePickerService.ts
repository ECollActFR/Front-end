/**
 * Image picker service for React Native and Web
 * Handles image selection from camera or gallery
 */

import { Platform, Alert, PermissionsAndroid } from 'react-native';

// For native mobile
import { launchImageLibrary, launchCamera, MediaType, ImagePickerResponse } from 'react-native-image-picker';

export interface ImagePickerResult {
  uri: string;
  name?: string;
  type?: string;
  size?: number;
}

export interface ImagePickerOptions {
  includeBase64?: boolean;
  includeExtra?: boolean;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  mediaType?: 'photo' | 'video' | 'mixed';
}

/**
 * Check and request camera permission for Android
 */
async function requestCameraPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true; // iOS doesn't require explicit permission for photo library
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Permission de caméra requise',
        message: 'Cette application a besoin d\'accéder à votre caméra pour prendre des photos.',
        buttonNeutral: 'Demander plus tard',
        buttonNegative: 'Annuler',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Camera permission error:', err);
    return false;
  }
}

/**
 * Check and request storage permission for Android (for older versions)
 */
async function requestStoragePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Permission de stockage requise',
        message: 'Cette application a besoin d\'accéder à vos photos pour sélectionner une image.',
        buttonNeutral: 'Demander plus tard',
        buttonNegative: 'Annuler',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Storage permission error:', err);
    return false;
  }
}

export interface ImagePickerOptions {
  includeBase64?: boolean;
  includeExtra?: boolean;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  mediaType?: 'photo' | 'video' | 'mixed';
}

class ImagePickerService {
  /**
   * Check if running on web platform
   */
  private isWeb(): boolean {
    return Platform.OS === 'web';
  }

  /**
   * Request photo library permission for iOS
   */
  private async requestPhotoLibraryPermission(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      return true;
    }
    
    // iOS handles photo library permission automatically when launchImageLibrary is called
    return true;
  }

  /**
   * Select image from gallery/camera roll
   */
  async pickImage(options: ImagePickerOptions = {}): Promise<ImagePickerResult | null> {
    if (this.isWeb()) {
      return this.pickImageWeb(options);
    } else {
      return this.pickImageNative(options);
    }
  }

  /**
   * Take photo with camera
   */
  async takePhoto(options: ImagePickerOptions = {}): Promise<ImagePickerResult | null> {
    if (this.isWeb()) {
      return this.takePhotoWeb(options);
    } else {
      // Check camera permission first
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert('Permission refusée', 'La permission d\'accéder à la caméra est requise pour prendre une photo.');
        return null;
      }
      return this.takePhotoNative(options);
    }
  }

  /**
   * Native image picker from gallery
   */
  private async pickImageNative(options: ImagePickerOptions): Promise<ImagePickerResult | null> {
    // Check storage permission first
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission refusée', 'La permission d\'accéder aux photos est requise pour sélectionner une image.');
      return null;
    }

    return new Promise((resolve) => {
      const pickerOptions = {
        mediaType: 'photo' as MediaType,
        quality: (options.quality || 0.8) as any, // Cast to any to handle type mismatch
        maxWidth: options.maxWidth || 800,
        maxHeight: options.maxHeight || 600,
        includeBase64: options.includeBase64 || false,
        includeExtra: options.includeExtra || true,
      };

      launchImageLibrary(pickerOptions, (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorMessage) {
          resolve(null);
          return;
        }

        const asset = response.assets?.[0];
        if (!asset) {
          resolve(null);
          return;
        }

        resolve({
          uri: asset.uri || '',
          name: asset.fileName,
          type: asset.type,
          size: asset.fileSize,
        });
      });
    });
  }

  /**
   * Native camera capture
   */
  private async takePhotoNative(options: ImagePickerOptions): Promise<ImagePickerResult | null> {
    return new Promise((resolve) => {
      const pickerOptions = {
        mediaType: 'photo' as MediaType,
        quality: (options.quality || 0.8) as any, // Cast to any to handle type mismatch
        maxWidth: options.maxWidth || 800,
        maxHeight: options.maxHeight || 600,
        includeBase64: options.includeBase64 || false,
        includeExtra: options.includeExtra || true,
      };

      launchCamera(pickerOptions, (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorMessage) {
          resolve(null);
          return;
        }

        const asset = response.assets?.[0];
        if (!asset) {
          resolve(null);
          return;
        }

        resolve({
          uri: asset.uri || '',
          name: asset.fileName,
          type: asset.type,
          size: asset.fileSize,
        });
      });
    });
  }

  /**
   * Web image picker using file input
   */
  private async pickImageWeb(options: ImagePickerOptions): Promise<ImagePickerResult | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        // Create object URL for preview
        const uri = URL.createObjectURL(file);

        // If base64 is included, convert file to base64
        if (options.includeBase64) {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              uri: reader.result as string,
              name: file.name,
              type: file.type,
              size: file.size,
            });
          };
          reader.readAsDataURL(file);
        } else {
          resolve({
            uri,
            name: file.name,
            type: file.type,
            size: file.size,
          });
        }
      };

      input.click();
    });
  }

  /**
   * Web camera capture (not implemented - would need getUserMedia API)
   */
  private async takePhotoWeb(options: ImagePickerOptions): Promise<ImagePickerResult | null> {
    // For web camera, we'd need to implement getUserMedia API
    // This is more complex and requires video stream handling
    // For now, we'll fall back to file picker
    console.warn('Camera capture not implemented for web, falling back to file picker');
    return this.pickImageWeb(options);
  }

  /**
   * Convert file to base64 (useful for API upload)
   */
  async fileToBase64(uri: string): Promise<string> {
    if (this.isWeb()) {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      // For native, we'll need additional packages like react-native-fs
      // For now, return the URI as-is (native APIs can handle file URIs)
      return uri;
    }
  }

  /**
   * Create a data URL from file (web only)
   */
  async createDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

export const imagePickerService = new ImagePickerService();