export interface RegisteredUser {
  displayName: string;
  email: string;
  latitude: number | null;
  longitude: number | null;
  lastLoggedInAt: Date;
}

export interface Buddy {
  ownerUid: string;
  meetings: Array<string>;
  buddyUid: string;
}
