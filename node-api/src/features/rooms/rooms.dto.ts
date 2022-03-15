export class NewRoomDTO {
  name: string;
  limit: number;
  genres: Array<string>;
  queue: Array<any>;
}

export class UpdateUserListDTO {
  userId: number;
}

export class UpdateQueueDTO {
  key: string;
  queue: Array<any>;
}
