export class PlaylistDTO {
  public playlist_id ?: number;
  public song_id?: number;

  constructor(playlist_id: number, song_id: number) {
    this.playlist_id = playlist_id;
    this.song_id = song_id;
  }
}
