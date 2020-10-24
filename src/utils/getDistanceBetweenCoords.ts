interface Coord {
  latitude: number;
  longitude: number;
}
const getDistanceBetweenCoords = (coordA: Coord, coordB: Coord) => {
  const { latitude: lat1, longitude: lon1 } = coordA;
  const { latitude: lat2, longitude: lon2 } = coordB;

  let radlat1 = (Math.PI * lat1) / 180;
  let radlat2 = (Math.PI * lat2) / 180;
  let theta = lon1 - lon2;
  let radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;
  return dist;
};

export default getDistanceBetweenCoords;
