import { User } from "./User";

export type Auth = {
  authenticated: boolean;
  user: User | null;
  abilities?: any[] | undefined;
};
