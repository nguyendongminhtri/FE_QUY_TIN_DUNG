export class AlbumDTO {
  public album_id ?: number;
  public song_id?: number;

  constructor(album_id: number, song_id: number) {
    this.album_id = album_id;
    this.song_id = song_id;
  }
}
