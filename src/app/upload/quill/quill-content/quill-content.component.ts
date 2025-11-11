import {
  Component,
  ViewChild,
  AfterViewInit,
  forwardRef
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
  contentStoragePaths: string[] = [];
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
        this.onChange(html);
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

    this.contentStoragePaths.push(file.storagePath);
  }

  onUploadFile(file: {
    downloadURL: string;
    storagePath: string;
    type: 'audio' | 'video';
  }) {
    const quill = this.editor.quillEditor as Quill;
    const range = quill.getSelection();
    const index = range ? range.index : quill.getLength();

    quill.insertEmbed(index, file.type, file.downloadURL, 'user');
    quill.insertText(index + 1, '\n', 'user');
    quill.setSelection(index + 2);

    this.contentStoragePaths.push(file.storagePath);
  }
  getStoragePaths(): string[] {
    return this.contentStoragePaths;
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
  }
}
