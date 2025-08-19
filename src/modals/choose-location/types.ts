import type { GeolocationDataWithFavourite } from "../../components/search-bar/api/types";
import type { ModalProps } from "../../modals/base-modal/types";

interface ChooseLocationProps extends ModalProps {
    locations: GeolocationDataWithFavourite[];
    onLocationClick: (location: GeolocationDataWithFavourite) => void;
    onLocationFavouriteClick: (location: GeolocationDataWithFavourite) => void;
}

export type { ChooseLocationProps }