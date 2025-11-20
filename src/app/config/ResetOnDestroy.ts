import {FirebaseStorageService} from "../service/firebase-storage.service";
import {QuillContentComponent} from "../upload/quill/quill-content/quill-content.component";
import {FormGroup} from "@angular/forms";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ResetOnDestroy {
  constructor(private firebaseStorageService: FirebaseStorageService) {}

  async cleanupUnusedFiles(
    isCreated: boolean,
    quillContent: QuillContentComponent,
    form: FormGroup,
    oldAvatarPath?: string
  ): Promise<void> {
    if (!isCreated) {
      const uploadedPaths = [
        ...quillContent.getStoragePaths().map(f => f.storagePath),
      ];

      const newAvatarPath = form.get('imageStoragePath')?.value;
      if (newAvatarPath && newAvatarPath !== oldAvatarPath) {
        uploadedPaths.push(newAvatarPath);
      }

      if (uploadedPaths.length > 0) {
        await this.firebaseStorageService.deleteMultipleFilesByPaths(uploadedPaths);
        console.log('Đã dọn file chưa dùng');
      }
    }
  }
}
