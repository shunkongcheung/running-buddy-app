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

export interface Round {
  tripUid: string;
  startAt: Date;
  endAt: Date;
  distanceKm: number;
  calories: number;
  maxKmPerHour: number;
  minKmPerHour: number;

  createdByUid: string;
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
