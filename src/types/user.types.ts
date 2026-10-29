export type UserRow = {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: "customer" | "owner";
};

export type PublicUser = Omit<UserRow, "password_hash">;