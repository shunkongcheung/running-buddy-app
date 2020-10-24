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

export type RoundStatus = "created" | "started" | "finished";

export interface Round {
  tripUid: string;
  status: RoundStatus;
  startAt: Date;
  endAt: Date;
  distanceKm: number;
  maxSpeed: number;
  minSpeed: number;
}

export interface Trip {
  name: string;

  rounds: Array<string>;

  participants: Array<string>;
  createdByUid: string;
  startingPoint: string;
  endingPoint: string;
  createdAt: Date;
  stopPoints: Array<string>;
  coordinates: Array<Coords>;
}

export interface Coords {
  lat: string;
  lng: string;
}

export type InviteRequestStatus = "pending" | "accepted" | "rejected";

export interface InviteRequest {
  invitedUserUid: string;
  status: InviteRequestStatus;
  tripUid: string;
  createdByUid: string;
  createdAt: Date;
}
