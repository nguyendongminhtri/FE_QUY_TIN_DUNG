import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AngularFireStorage, AngularFireStorageReference} from "@angular/fire/compat/storage";

@Component({
  selector: 'app-upload-avartar-quill',
  templateUrl: './upload-avartar-quill.component.html',
  styleUrls: ['./upload-avartar-quill.component.css']
})
export class UploadAvartarQuillComponent {
  selectedFile?: File;
  ref?: AngularFireStorageReference;
  downloadURL?: string;
  checkUploadAvatar = false;
  @Output()
  giveAvatarInfo = new EventEmitter<{ downloadURL: string; storagePath: string }>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  constructor(private afStorage: AngularFireStorage) {
  }
  triggerUpload() {
    this.fileInput.nativeElement.click();
  }
  onFileChanged($event: any){
    this.selectedFile  = $event.target.files[0];
    this.onUpload();
  }
  onUpload() {
    this.checkUploadAvatar = true;

    const timestamp = Date.now();
    const uniqueName = `${timestamp}_${this.selectedFile?.name}`;
    const storagePath = `quill/${uniqueName}`;
    const fileRef = this.afStorage.ref(storagePath);

    fileRef.put(this.selectedFile!).then(snapshot => {
      return snapshot.ref.getDownloadURL();
    }).then(downloadURL => {
      this.downloadURL = downloadURL;
      this.giveAvatarInfo.emit({
        downloadURL,
        storagePath
      });
      this.checkUploadAvatar = false;
    }).catch(error => {
      console.log(`Failed to upload file and get link ${error}`);
      this.checkUploadAvatar = false;
    });
  }

}
