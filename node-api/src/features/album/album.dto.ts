export class LikeAlbumDTO {
  albumId: number;
}

export class UpdateAlbumDTO {
  id: number;
  name?: string;
  year?: Date;
  releaseType?: string;
  cover?: any;
  artistId: number;
}

export class NewAlbumDTO {
  name: string;
  year: Date;
  releaseType: string;
  cover: any;
  artistId: number;
}
