export class FollowArtistDTO {
  artistId: number;
}

export class UpdateArtistDTO {
  id: number;
  officialWebsite?: string;
  biography?: string;
  cover?: any;
  avatar?: any;
}
