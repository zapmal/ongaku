export class UpdateUserDTO {
  id: number;
  fullName?: string;
  email?: string;
  password?: string;
}

export class GetProfileDataDTO {
  username: string;
}
