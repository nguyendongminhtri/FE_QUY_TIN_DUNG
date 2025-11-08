import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AngularFireStorage, AngularFireStorageReference} from "@angular/fire/compat/storage";

@Component({
  selector: 'app-upload-file-quill',
  templateUrl: './upload-file-quill.component.html',
  styleUrls: ['./upload-file-quill.component.css']
})
export class UploadFileQuillComponent {
  selectedFile?: File;
  ref?: AngularFireStorageReference;
  downloadURL?: string;
  checkUploadFileMusic = false;
  fileType: 'audio' | 'video' | null = null;

  @Output()
  giveURLtoCreate = new EventEmitter<{ url: string; type: 'audio' | 'video' }>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private afStorage: AngularFireStorage) {}

  triggerUpload() {
    this.fileInput.nativeElement.click();
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const mimeType = this.selectedFile.type;
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
  }

  onUpload() {
    if (!this.selectedFile || !this.fileType) return;

    this.checkUploadFileMusic = true;
    const id = Math.random().toString(36).substring(2); // Tạo tên file ngẫu nhiên
    this.ref = this.afStorage.ref(id);

    this.ref.put(this.selectedFile).then(snapshot => {
      return snapshot.ref.getDownloadURL();
    }).then(downloadURL => {
      this.downloadURL = downloadURL;
      this.giveURLtoCreate.emit({
        url: this.downloadURL!,
        type: this.fileType!
      });
      this.checkUploadFileMusic = false;
    }).catch(error => {
      console.error('Upload thất bại:', error);
      this.checkUploadFileMusic = false;
    });
  }
}
