export interface JwtPayload {
  id: string;
  email: string;
  fullname: string;
  iat: number;
  exp: number;
}
