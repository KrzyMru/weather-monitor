import type { GeolocationDataWithFavourite } from "./api/types";

interface SearchBarProps {
    onLocationClick: (location: GeolocationDataWithFavourite) => void,
    onLocationFavouriteClick: (location: GeolocationDataWithFavourite) => void,
    favouriteLocations: GeolocationDataWithFavourite[],
}

export type { SearchBarProps }