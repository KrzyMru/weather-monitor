import type { GeolocationData } from "../../../api/types";
import type { GetGeolocationDataNameProps } from "./types";

const getGeolocationDataName = async (props: GetGeolocationDataNameProps): Promise<GeolocationData[]> => {
    const { name, language } = { ...props }
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${name}&addressdetails=1&featureType=city&accept-language=${language}&format=json`, {
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

export default getGeolocationDataName;