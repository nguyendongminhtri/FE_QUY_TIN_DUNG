import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AngularFireStorage, AngularFireStorageReference} from "@angular/fire/compat/storage";


@Component({
  selector: 'app-upload-avatar',
  templateUrl: './upload-avatar.component.html',
  styleUrls: ['./upload-avatar.component.css']
})
export class UploadAvatarComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile?: File;
  downloadURL?: string;
  checkUploadAvatar = false;
  @Output()
  giveURLtoCreate = new EventEmitter<{ downloadURL: string, storagePath: string }>();

  constructor(private afStorage: AngularFireStorage,
              private cdr: ChangeDetectorRef) {
  }

  onFileChanged($event: any) {
    this.selectedFile = $event.target.files[0];
    this.onUpload();
  }

  onUpload() {
    this.checkUploadAvatar = true;
    const timestamp = Date.now();
    const uniqueName = `${timestamp}_${this.selectedFile?.name}`;
    const fileRef = this.afStorage.ref(`avatars/${uniqueName}`);

    fileRef.put(this.selectedFile!).then(snapshot => {
      return snapshot.ref.getDownloadURL();
    }).then(downloadURL => {
      this.downloadURL = downloadURL;
      this.giveURLtoCreate.emit({
        downloadURL: downloadURL,
        storagePath: `avatars/${uniqueName}`,
      });
      this.checkUploadAvatar = false;
    }).catch(error => {
      console.log(`Failed to upload avatar and get link ${error}`);
      this.checkUploadAvatar = false;
    });
  }

  reset() {
    console.log('Reset called. Before:', this.downloadURL);
    this.downloadURL = undefined;
    console.log('After:', this.downloadURL);
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.cdr.detectChanges();
  }

}

