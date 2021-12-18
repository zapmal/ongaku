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
  labels: string; // should be Array<string>
  yearsActive: number;
  bandFlag: boolean;
  artisticName?: string;
  bandName?: string;
  members?: string; // should be Array<string>
}

export class LoginDTO {
  email: string;
  password: string;
}
