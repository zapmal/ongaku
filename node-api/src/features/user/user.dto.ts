export class UpdateUserDTO {
  id: number;
  fullName?: string;
  email?: string;
  password?: string;
  avatar?: any;
}

export class GetProfileDataDTO {
  username: string;
}
