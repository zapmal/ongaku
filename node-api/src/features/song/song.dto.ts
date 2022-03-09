export class UpdateSongDTO {
  id: number;
  name?: string;
  collaborators?: string;
  isExplicit?: boolean;
  artistId: number;
}

export class NewSongDTO {
  id: number;
  name: string;
  collaborators: any;
  isExplicit: string;
  albumId?: number;
  artistId: number;
}
