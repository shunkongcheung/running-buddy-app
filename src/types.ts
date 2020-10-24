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

export interface Trip {
  name: string;
  // path: any; // TODO: not decided yet
  startAt: Date;

  isFinished: boolean;

  participants: Array<string>;
  createdByUid: string;

  createdAt: Date;
}

export type InviteRequestStatus = "pending" | "accepted" | "rejected";

export interface InviteRequest {
  invitedUserUid: string;
  status: InviteRequestStatus;
  tripUid: string;
  createdByUid: string;
}
