import React, { memo } from "react";
import firebase from "firebase";
import { FormGroup, Input, Label } from "reactstrap";
import sphereKnn from 'sphere-knn'

import { Buddy, RegisteredUser } from "../../types";

import classNames from "./ParticipantsField.module.css";
import { getDistanceBetweenCoords } from "../../utils";

interface BuddyItem extends Buddy {
  uid: string;
}

interface BuddyUser extends RegisteredUser {
  buddyId: string;
  uid: string;
}

interface Coords {
  lat: string;
  lng: string;
}

interface ParticipantsFieldProps {
  handleChange: ({ target: { name, value } }) => any;
  coords: {[key:string]:{placeName:String,location:Coords} };
}

const getBuddies = async (): Promise<Array<BuddyItem>> => {
  const { uid } = firebase.auth().currentUser;

  // get data from firestore buddies
  const db = firebase.firestore();
  const docRef = await db
    .collection("buddies")
    .where("ownerUid", "==", uid)
    .get();

  if (docRef.empty) return [];
  const buddies = [];
  docRef.forEach((itm) => {
    const buddy = itm.data();
    const uid = itm.id;
    buddies.push({ ...buddy, uid } as BuddyItem);
  });
  return buddies;
};

const getBuddyUsers = async (
  buddies: Array<BuddyItem>
): Promise<Array<BuddyUser>> => {
  const db = firebase.firestore();
  const buddyUsers = await Promise.all(
    buddies.map(async (itm) => {
      const docRef = await db
        .collection("registered-users")
        .doc(itm.buddyUid)
        .get();
      const data = docRef.data();
      const uid = docRef.id;
      const lastLoggedInAt = data.lastLoggedInAt.toDate();
      return {
        uid,
        ...data,
        lastLoggedInAt,
        buddyId: itm.uid,
      } as BuddyUser;
    })
  );
  return buddyUsers;
};

const ParticipantsField: React.FC<ParticipantsFieldProps> = ({
  handleChange,
  coords={}
}) => {
  const [buddies, setBuddies] = React.useState<Array<BuddyUser>>([]);

  React.useEffect(() => {
    const initializeBuddies = async () => {
      const buddies = await getBuddies();
      const buddyUsers = await getBuddyUsers(buddies);
      setBuddies(buddyUsers);
    };
    initializeBuddies();
  }, []);


  React.useEffect(()=>{
      if(Object.keys(coords).length){
        const userCords= Object.values(coords);
        const lookup    = sphereKnn(userCords)
        //  const nearestCoord= lookup(someLatitude, someLongitude, 10000, 1000000)
        console.log("buddies",buddies)
      }
      
  })

  if (!buddies.length) return <></>;

  return (
    <FormGroup tag="fieldset" className={classNames.container}>
      {buddies.map(({ uid, displayName,latitude,longitude }, idx) => {
        let distance;
        let placeName;
        if(Object.keys(coords).length){
          const userCords= Object.values(coords).map(v=>v.location);
          const lookup    = sphereKnn(userCords)
          const sortedCords= lookup(latitude, longitude, 10000, 1000000)
          const nearestCoord=sortedCords[0];
          const location=Object.values(coords).find(v=>v.location===nearestCoord)
          placeName= location.placeName
         distance= getDistanceBetweenCoords({latitude,longitude},{latitude:nearestCoord.lat,longitude:nearestCoord.lng})
          
        }
       return (<FormGroup check key={`ParticipantsField-${uid}-${idx}`}>
          <Label check>
            <Input
              type="checkbox"
              name="participants"
              value={uid}
              onChange={handleChange}
            />
            {displayName}
            {
              
              distance && (<b> - {Math.round(distance)} km</b>)

            }  {placeName && (<p>({placeName})</p>)}
                 

          </Label>
        </FormGroup>
      )})}
    </FormGroup>
  );
};

export default memo(ParticipantsField);
