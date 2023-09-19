export interface Volume {
  CreatedAt: string;
  Driver: string;
  Labels?: Record<string, string>;
  Mountpoint: string;
  Name: string;
  Options: any;
  Scope: string;
}
