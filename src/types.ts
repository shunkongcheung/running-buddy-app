export interface RegisteredUser {
  displayName: string;
  email: string;
  photoURL: string;
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
  startingPoint:string;
  endingPoint:string;
  createdAt: Date;
  stopPoints:Array<string>;
  coordinates:Array<Coords>;
}

export interface Coords{
  lat:string;
  lng:string;
}

export type InviteRequestStatus = "pending" | "accepted" | "rejected";

export interface InviteRequest {
  invitedUserUid: string;
  status: InviteRequestStatus;
  tripUid: string;
  createdByUid: string;
  createdAt: Date;
}
