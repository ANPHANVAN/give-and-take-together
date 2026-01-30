export enum ETokenType {
  accessToken = 'accessToken',
  refreshToken = 'refreshToken',
}

export type TToken = keyof typeof ETokenType;
