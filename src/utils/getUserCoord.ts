const getUserCoord = (): Promise<{
  coords: { latitude: number | null; longitude: number | null };
}> =>
  new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, () =>
        resolve({ coords: { latitude: null, longitude: null } })
      );
    } else resolve({ coords: { latitude: null, longitude: null } });
  });

export default getUserCoord;
