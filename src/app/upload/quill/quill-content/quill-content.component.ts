import {
  Component,
  ViewChild,
  AfterViewInit,
  forwardRef,
  Output,
  EventEmitter
} from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { UploadAvartarQuillComponent } from '../upload-avartar-quill/upload-avartar-quill.component';
import { UploadFileQuillComponent } from '../upload-file-quill/upload-file-quill.component';
// @ts-ignore
import Quill from 'quill/core';

@Component({
  selector: 'app-quill-content',
  templateUrl: './quill-content.component.html',
  styleUrls: ['./quill-content.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuillContentComponent),
      multi: true
    }
  ]
})
export class QuillContentComponent implements AfterViewInit, ControlValueAccessor {
  @ViewChild('editor') editor!: QuillEditorComponent;
  @ViewChild('uploadAvatar') uploadAvatar!: UploadAvartarQuillComponent;
  @ViewChild('uploadFile') uploadFile!: UploadFileQuillComponent;

  @Output() storagePathsChange = new EventEmitter<{ downloadURL: string; storagePath: string }[]>();

  contentStoragePaths: { downloadURL: string; storagePath: string }[] = [];

  modules = {
    toolbar: {
      container: [
        [{ font: [] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: () => this.triggerImageUpload(),
        video: () => this.triggerFileUpload()
      }
    }
  };

  private onChange = (_: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    const quill = this.editor?.quillEditor as Quill;
    if (quill && typeof value === 'string') {
      quill.clipboard.dangerouslyPasteHTML(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const quill = this.editor?.quillEditor as Quill;
      if (!quill) return;
      quill.on('text-change', () => {
        const html = quill.root.innerHTML;
        this.onChange(html); // cập nhật nội dung HTML vào form

        // Đồng bộ lại danh sách file từ HTML
        this.contentStoragePaths = this.extractStoragePathsFromHtml(html);
        this.storagePathsChange.emit(this.contentStoragePaths);
      });
    }, 0);
  }

  onUploadImage(file: { downloadURL: string; storagePath: string }) {
    const quill = this.editor.quillEditor as Quill;
    const range = quill.getSelection();
    const index = range ? range.index : quill.getLength();

    quill.insertEmbed(index, 'image', file.downloadURL, 'user');
    quill.insertText(index + 1, '\n', 'user');
    quill.setSelection(index + 2);

    this.contentStoragePaths.push(file);
    this.onChange(this.getCurrentContentHTML()); // cập nhật HTML
    this.storagePathsChange.emit(this.contentStoragePaths); // phát danh sách file ra ngoài
  }

  onUploadFile(file: { downloadURL: string; storagePath: string; type: 'audio' | 'video' }) {
    const quill = this.editor.quillEditor as Quill;
    const range = quill.getSelection();
    const index = range ? range.index : quill.getLength();

    quill.insertEmbed(index, file.type, file.downloadURL, 'user');
    quill.insertText(index + 1, '\n', 'user');
    quill.setSelection(index + 2);

    this.contentStoragePaths.push(file);
    this.onChange(this.getCurrentContentHTML()); // cập nhật HTML
    this.storagePathsChange.emit(this.contentStoragePaths); // phát danh sách file ra ngoài
  }

  getStoragePaths(): { downloadURL: string; storagePath: string }[] {
    return this.contentStoragePaths;
  }

  getCurrentContentHTML(): string {
    const quill = this.editor?.quillEditor as Quill;
    return quill.root?.innerHTML ?? '';
  }

  triggerImageUpload() {
    this.uploadAvatar.triggerUpload();
  }

  triggerFileUpload() {
    this.uploadFile.triggerUpload();
  }

  clearContent() {
    const quill = this.editor?.quillEditor as Quill;
    if (quill) {
      quill.setText('');
    }
    this.contentStoragePaths = [];
    this.storagePathsChange.emit(this.contentStoragePaths); // phát ra ngoài để form biết đã clear
  }

// Thêm hàm parse HTML để lấy storagePath
  extractStoragePathsFromHtml(html: string): { downloadURL: string; storagePath: string }[] {
    const paths: { downloadURL: string; storagePath: string }[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    doc.querySelectorAll('img, video, audio').forEach(el => {
      const src = el.getAttribute('src');
      if (src && src.includes('firebasestorage.googleapis.com')) {
        const storagePath = this.extractPathFromUrl(src);
        if (storagePath) {
          paths.push({ downloadURL: src, storagePath });
        }
      }
    });

    return paths;
  }

  extractPathFromUrl(url: string): string | null {
    const match = url.match(/\/o\/(.*?)\?/);
    return match && match[1] ? decodeURIComponent(match[1]) : null;
  }
}
