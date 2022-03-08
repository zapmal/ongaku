export class UpdateUserDTO {
  id: number;
  isMetadataEdit?: string;
  ipAddress?: string;
  active?: string;
  verifiedEmail?: string;
  username?: string;
  fullName?: string;
  email?: string;
  password?: string;
  avatar?: any;
}

export class GetProfileDataDTO {
  username: string;
}
