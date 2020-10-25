import React, { useRef } from "react";

import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  Polyline
} from "react-google-maps";

interface Coords {
  lat: string;
  lng: string;
}

interface MapProps {
  coordinates: Array<Coords>;
}

const Map: React.FC<MapProps> = ({ coordinates }) => {
  const map = useRef();

  const midPoint = (trackingLocation: any, deliveryLocation: any) => {
    if (deliveryLocation) {
      return [
        trackingLocation.lat +
          (deliveryLocation.lat - trackingLocation.lat) * 0.5,
        trackingLocation.lng +
          (deliveryLocation.lng - trackingLocation.lng) * 0.5
      ];
    } else {
      return trackingLocation;
    }
  };

  let iconMarker = new (window as any).google.maps.MarkerImage(
    "/pin.png",
    null /* size is determined at runtime */,
    null /* origin is 0,0 */,
    null /* anchor is bottom center of the scaled image */,
    new (window as any).google.maps.Size(32, 32)
  );

  const getMinAndMaxBounds = () => {
    const minLat = Math.min.apply(
      null,
      coordinates.map(coords => coords.lat)
    );
    const minLang = Math.min.apply(
      null,
      coordinates.map(item => item.lng)
    );
    const maxLat = Math.max.apply(
      null,
      coordinates.map(coords => coords.lat)
    );
    const maxLang = Math.max.apply(
      null,
      coordinates.map(item => item.lng)
    );
    return {
      minCords: {
        lat: minLat,
        lng: minLang
      },
      maxCords: {
        lat: maxLat,
        lng: maxLang
      }
    };
  };
  const { minCords, maxCords } = getMinAndMaxBounds();
  const centerPoint = midPoint(minCords, maxCords);

  const bounds = new (window as any).google.maps.LatLngBounds();
  coordinates.map(cord => {
    bounds.extend(new (window as any).google.maps.LatLng(cord.lat, cord.lng));
  });

  React.useEffect(() => {
    if (map && map.current) {
      // comment out to get a better zoom size
      (map as any).current.fitBounds(bounds);
    }
  });

  return (
    <>
      <GoogleMap
        defaultZoom={15}
        ref={map}
        defaultCenter={{
          lat: centerPoint[0] || 43.65107,
          lng: centerPoint[1] || -79.347015
        }}
      >
        {coordinates.map((coord, i) => (
          <Marker icon={iconMarker} key={`Marker-${i}`} position={coord} />
        ))}

        <Polyline path={coordinates} options={{ strokeColor: "#FF0000 " }} />
      </GoogleMap>
    </>
  );
};

export default withScriptjs(withGoogleMap(Map));
