export type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
};
export type User = {
  id: string;
  name: string;
  email: string;
  created_at: Date;
};
