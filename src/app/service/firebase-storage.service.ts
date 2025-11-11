import { Injectable } from '@angular/core';
import { getStorage, ref, deleteObject } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  deleteFileByPath(path: string | null | undefined): Promise<void> {
    if (!path) return Promise.resolve();

    const storage = getStorage();
    const fileRef = ref(storage, path);
    return deleteObject(fileRef);
  }

  deleteMultipleFilesByPaths(paths: string[]): Promise<void[]> {
    if (!paths || paths.length === 0) return Promise.resolve([]);

    const storage = getStorage();

    const deletePromises = paths.map(path => {
      if (!path || path === 'undefined') return Promise.resolve();

      const cleanPath = path.startsWith('https://') ? this.extractPathFromUrl(path) : path;
      if (!cleanPath) return Promise.resolve();

      try {
        const fileRef = ref(storage, cleanPath);
        return deleteObject(fileRef).catch(err => {
          console.warn(`Không thể xóa file: ${cleanPath}`, err);
          return Promise.resolve();
        });
      } catch (err) {
        console.warn(`Lỗi tạo ref cho path: ${cleanPath}`, err);
        return Promise.resolve();
      }
    });

    return Promise.all(deletePromises);
  }

  extractStoragePathsFromHtml(html: string): string[] {
    const paths: string[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Ảnh
    doc.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      if (src && src.includes('firebasestorage.googleapis.com')) {
        paths.push(src);
      }
    });

    // Video
    doc.querySelectorAll('video').forEach(video => {
      const src = video.getAttribute('src');
      if (src && src.includes('firebasestorage.googleapis.com')) {
        paths.push(src);
      }
    });

    // Audio
    doc.querySelectorAll('audio').forEach(audio => {
      const src = audio.getAttribute('src');
      if (src && src.includes('firebasestorage.googleapis.com')) {
        paths.push(src);
      }
    });

    // Link trực tiếp (trong thẻ <a>)
    doc.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.includes('firebasestorage.googleapis.com') && href.endsWith('.mp3')) {
        paths.push(href);
      }
    });
    return paths;
  }

  extractPathFromUrl(url: string): string | null {
    const match = url.match(/\/o\/(.*?)\?alt=media/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
    return null;
  }

}
