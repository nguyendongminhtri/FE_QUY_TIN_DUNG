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
  giveURLtoCreate = new EventEmitter<string>();
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
  onUpload(){
    this.checkUploadAvatar = true;
    const id = Math.random().toString(36).substring(2); //Tạo ra 1 name riêng cho mỗi DB firebase;
    console.log('id ---> ', id);
    this.ref = this.afStorage.ref(id);
    this.ref.put(this.selectedFile).then(snapshot =>{
      return snapshot.ref.getDownloadURL(); //Tra ve 1 chuoi sieu van ban tren FB.
    }).then( downloadURL =>{ //chuyen giao link tu nhung component khac nhau khi su upload
      this.downloadURL = downloadURL;
      this.giveURLtoCreate.emit(this.downloadURL);
      this.checkUploadAvatar = false;
      return downloadURL;
    })
      .catch(error =>{
        console.log(`Failed to upload avatar and get link ${error}`);
      })
  }
}
