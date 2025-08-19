import { useTranslation } from "react-i18next";
import type { SearchBarProps } from "./types";
import React from "react";
import { ChooseLocation } from "../../modals";
import getGeolocationDataName from "./api/get-geolocation-data-name";
import FavouriteControl from "./favourite-control/favourite-control";
import type { GeolocationDataWithFavourite } from "./api/types";
import { createPortal } from "react-dom";

const SearchBar = (props: SearchBarProps) => {
    const { onLocationClick, onLocationFavouriteClick, favouriteLocations } = { ...props }
    const { t, i18n } = useTranslation();

    const [searchResults, setSearchResults] = React.useState<GeolocationDataWithFavourite[]>([]);
    const [openFavouriteLocations, setOpenFavouriteLocations] = React.useState<boolean>(false);
    const [searchText, setSearchText] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleSearch = async (locationName: string) => {
        const startTime = Date.now();
        try {
            setLoading(true);
            const response = await getGeolocationDataName({ name: locationName, language: i18n.language });
            // Mark favourite locations
            const favouriteIds = new Set(favouriteLocations.map(loc => loc.osm_id));
            const locations: GeolocationDataWithFavourite[] = response.map((location) => ({
                ...location, is_favourite: favouriteIds.has(location.osm_id)
            }));
            setSearchResults(locations);
        } catch (e) { }
        finally {
            const delay = Math.max(0, 600 - (Date.now() - startTime));
            setTimeout(() => setLoading(false), delay);
        }
    }

    const handleUpdateFavourites = (location: GeolocationDataWithFavourite) => {
        onLocationFavouriteClick(location);
        setSearchResults(prevLocations =>
            prevLocations.map(loc =>
                loc.osm_id === location.osm_id
                ? { ...loc, is_favourite: !loc.is_favourite }
                : loc
            )
        );
    }

    return (
        <div className="absolute top-4 right-4 left-4 xs:right-20 lg:inset-x-24 z-999 transition-[left_right] duration-350">
            <div className="flex rounded-xl shadow-xl border-1 border-gray-300 bg-slate-100 dark:bg-gray-600">
                <input
                    className="flex-1 bg-transparent rounded-l-xl p-2 disabled:pointer-events-none disabled:cursor-default disabled:text-gray-300 dark:disabled:text-gray-500 dark:text-white dark:focus-visible:outline-sky-300 focus-visible:outline-3 focus-visible:outline-sky-600"
                    type="text"
                    placeholder={t('searchBarPlaceholder')}
                    autoComplete="off"
                    autoFocus={true}
                    value={searchText}
                    disabled={loading}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter') 
                            handleSearch(searchText)
                    }}
                />
                <FavouriteControl 
                    onClick={() => setOpenFavouriteLocations(true)}
                    disabled={loading}
                    loading={loading}
                />
            </div>
            {
                searchResults.length !== 0 &&
                createPortal(
                    <ChooseLocation
                        open={searchResults.length !== 0 && !loading}
                        onClose={() => setSearchResults([])}
                        locations={searchResults}
                        onLocationClick={onLocationClick}
                        onLocationFavouriteClick={handleUpdateFavourites}
                    />, document.getElementById("mainDiv") ?? document.body
                )
            }
            {
                openFavouriteLocations &&
                createPortal(
                    <ChooseLocation
                        open={openFavouriteLocations}
                        onClose={() => setOpenFavouriteLocations(false)}
                        locations={favouriteLocations}
                        onLocationClick={onLocationClick}
                        onLocationFavouriteClick={handleUpdateFavourites}
                    />, document.getElementById("mainDiv") ?? document.body
                )
            }
        </div>
    );
}

export default SearchBar;