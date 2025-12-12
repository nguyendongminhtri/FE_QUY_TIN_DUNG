import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Component({
  selector: 'app-upload-multiple-avatar',
  templateUrl: './upload-multiple-avatar.component.html',
  styleUrls: ['./upload-multiple-avatar.component.css']
})
export class UploadMultipleAvatarComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFiles: File[] = [];
  downloadURLs: string[] = [];
  checkUploadAvatar = false;

  @Output()
  giveURLsToCreate = new EventEmitter<{ downloadURLs: string[], storagePaths: string[] }>();

  constructor(private afStorage: AngularFireStorage,
              private cdr: ChangeDetectorRef) {}

  onFilesChanged($event: any) {
    this.selectedFiles = Array.from($event.target.files);
    this.onUpload();
  }

  async onUpload() {
    this.checkUploadAvatar = true;
    const storagePaths: string[] = [];
    const urls: string[] = [];

    for (const file of this.selectedFiles) {
      const timestamp = Date.now();
      const uniqueName = `${timestamp}_${file.name}`;
      const fileRef = this.afStorage.ref(`avatars/${uniqueName}`);

      try {
        const snapshot = await fileRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        urls.push(downloadURL);
        storagePaths.push(`avatars/${uniqueName}`);
      } catch (error) {
        console.log(`Failed to upload file ${file.name}: ${error}`);
      }
    }

    this.downloadURLs = urls;
    this.giveURLsToCreate.emit({
      downloadURLs: urls,
      storagePaths: storagePaths,
    });
    this.checkUploadAvatar = false;
  }

  reset() {
    this.downloadURLs = [];
    this.selectedFiles = [];
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.cdr.detectChanges();
  }
}
