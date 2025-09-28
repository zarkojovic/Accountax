export enum Role {
  Admin = 2,
  User = 1,
  Guest = 0
}

export interface SessionUser {
  id: string;
  email: string;
  role_id: Role;
  first_name: string;
  last_name: string;
}
