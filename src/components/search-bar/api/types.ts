import type { GeolocationData } from "../../../api/types";

interface GetGeolocationDataNameProps {
    name: string,
    language: string,
}

interface GeolocationDataWithFavourite extends GeolocationData {
    is_favourite: boolean,
}

export type { GetGeolocationDataNameProps, GeolocationDataWithFavourite }