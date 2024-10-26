export interface IJWTAccessPayload {
  public_id: string;
  role: string;
}

export interface IJWTRefreshPayload {
  public_id: string;
}
