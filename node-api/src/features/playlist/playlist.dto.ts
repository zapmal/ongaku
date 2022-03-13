export class NewPlaylistDTO {
  name?: string;
}

export class LikePlaylistDTO {
  playlistId: number;
}

export class getLikedPlaylistsDTO {
  entityId: number;
}

export class AddAlbumToPlaylistDTO {
  playlistId: number;
  albumId: number;
}

export class AddSongToPlaylistDTO {
  playlistId: number;
  songId: number;
}

export class RemoveSongFromPlaylistDTO {
  playlistId: number;
  songId: number;
}
