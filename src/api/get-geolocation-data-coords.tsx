import type { GeolocationData, GetGeolocationDataCoordsProps } from "./types";

const getGeolocationDataCoords = async (props: GetGeolocationDataCoordsProps): Promise<GeolocationData> => {
    const { coords, language } = { ...props }
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?&lat=${coords[0]}&lon=${coords[1]}&addressdetails=1&zoom=10&accept-language=${language}&format=json`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
    });
    const data = await response.json();
    if (!response.ok || data?.error) // If unable to geocode API returns 200
        throw new Error(data?.reason);
    return data;
}

export default getGeolocationDataCoords;