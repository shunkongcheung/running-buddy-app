import React, { memo, useRef, useEffect } from "react";

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

  const midPoint = (trackingLocation, deliveryLocation) => {
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

  let iconMarker = new window.google.maps.MarkerImage(
    "https://img.favpng.com/6/7/4/computer-icons-google-map-maker-clip-art-png-favpng-Wgm1Jhqup5qqDE6CdZAK9yJdY.jpg",
    null /* size is determined at runtime */,
    null /* origin is 0,0 */,
    null /* anchor is bottom center of the scaled image */,
    new window.google.maps.Size(32, 32)
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

  const bounds = new window.google.maps.LatLngBounds();
  coordinates.map((cord, i) => {
    bounds.extend(new window.google.maps.LatLng(cord.lat, cord.lng));
  });

  React.useEffect(() => {
    if (map && map.current) {
      map.current.fitBounds(bounds);
    }
  });

  return (
    <>
      <GoogleMap
        defaultZoom={15}
        ref={map}
        defaultCenter={{ lat: centerPoint[0], lng: centerPoint[1] }}
      >
        {coordinates.map((coord, i) => (
          <Marker
            {...(i < coordinates.length - 1 && { icon: iconMarker })}
            position={coord}
          />
        ))}

        <Polyline path={coordinates} options={{ strokeColor: "#FF0000 " }} />
      </GoogleMap>
    </>
  );
};

export default withScriptjs(withGoogleMap(Map));
