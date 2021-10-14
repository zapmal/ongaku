export class RegisterDTO {
  fullName: string;
  username: string;
  email: string;
  password: string;
  birthdate: Date;
  avatar?: string;
  role: 'ADMIN' | 'MODERATOR' | 'MANAGER' | 'USER';
}

export class LoginDTO {
  email: string;
  password: string;
}
