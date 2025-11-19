import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-upload-file-quill',
  templateUrl: './upload-file-quill.component.html',
  styleUrls: ['./upload-file-quill.component.css']
})
export class UploadFileQuillComponent {
  selectedFile?: File;
  downloadURL?: string;
  checkUploadFileMusic = false;
  fileType: 'audio' | 'video' | null = null;

  @Output()
  giveFileInfo = new EventEmitter<{
    downloadURL: string;
    storagePath: string;
    type: 'audio' | 'video';
  }>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private afStorage: AngularFireStorage) {}

  triggerUpload() {
    this.fileInput?.nativeElement?.click();
  }

  onFileChanged(event: any) {
    const file = event.target.files[0];
    if (!file) {
      console.warn('Chưa chọn file nào');
      return;
    }

    this.selectedFile = file;
    const mimeType = file.type;

    if (mimeType.startsWith('audio/')) {
      this.fileType = 'audio';
    } else if (mimeType.startsWith('video/')) {
      this.fileType = 'video';
    } else {
      this.fileType = null;
      console.warn('Không hỗ trợ định dạng này:', mimeType);
      return;
    }

    this.onUpload();
  }


  onUpload() {
    if (!this.selectedFile || !this.fileType) {
      console.warn('Không có file hợp lệ để upload');
      return;
    }

    this.checkUploadFileMusic = true;

    const timestamp = Date.now();
    const uniqueName = `${timestamp}_${this.selectedFile.name}`;
    const storagePath = `quill/${this.fileType}/${uniqueName}`;
    const fileRef = this.afStorage.ref(storagePath);

    fileRef.put(this.selectedFile).then(snapshot => {
      return snapshot.ref.getDownloadURL();
    }).then(downloadURL => {
      this.downloadURL = downloadURL;
      this.giveFileInfo.emit({
        downloadURL,
        storagePath,
        type: this.fileType!
      });
      this.checkUploadFileMusic = false;
    }).catch(error => {
      console.error('Upload thất bại:', error);
      this.checkUploadFileMusic = false;
    });
  }

}
