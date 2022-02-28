export class NewPlaylistDTO {
  name?: string;
}

export class LikePlaylistDTO {
  playlistId: number;
}

export class GetMyPlaylistsDTO {
  entityId?: number;
}
