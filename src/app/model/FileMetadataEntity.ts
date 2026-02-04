export interface FileMetadataEntity {
  fileName: string;
  contentType: string;   // thêm vào
  fileUrl: string;       // hoặc filePath nếu backend trả về tên này
}
