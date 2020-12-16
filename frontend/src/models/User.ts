export type User = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  preferred_username: string;
  email: string;
  picture: string;
  roles?: string[];
  groups?: string[];
};
