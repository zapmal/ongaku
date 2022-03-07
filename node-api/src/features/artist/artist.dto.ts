export class FollowArtistDTO {
  artistId: number;
}

export class UpdateArtistDTO {
  id: number;
  isAdminEdit?: string;
  officialWebsite?: string;
  yearsActive?: number;
  members?: string;
  artisticName?: string;
  labels?: string;
  biography?: string;
  cover?: any;
  avatar?: any;
}
