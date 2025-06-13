import type { LocationGeocodingData } from "../../api/types";
import type { ModalProps } from "../types";

interface ChooseLocationProps extends ModalProps {
    locations: LocationGeocodingData[];
    onLocationClick: (location: LocationGeocodingData) => void;
    onLocationFavouriteClick: (location: LocationGeocodingData) => void;
}

export type { ChooseLocationProps }