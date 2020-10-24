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

export type TripStatus = "created" | "started" | "finished";

export interface Trip {
  name: string;
  // path: any; // TODO: not decided yet
  startAt: Date;
  status: TripStatus;

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
