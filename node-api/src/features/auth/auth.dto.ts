export class UserRegisterDTO {
  fullName: string;
  password: string;
  email: string;
  username: string;
  birthdate: Date;
  role: 'ADMIN' | 'MODERATOR' | 'MANAGER' | 'USER';
}

export class ArtistRegisterDTO {
  email: string;
  birthdate: Date;
  password: string;
  country: string;
  genres: Array<string>;
  labels: Array<string>;
  yearsActive: number;
  isBand: boolean;
  artisticName?: string;
  bandName?: string;
  members?: Array<string>;
}

export class LoginDTO {
  email: string;
  password: string;
  isArtist: boolean;
}
