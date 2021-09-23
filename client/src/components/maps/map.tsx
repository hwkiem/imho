import { Box, Button, Icon } from '@chakra-ui/react';
import GoogleMap from 'google-map-react';
import { useState, useEffect } from 'react';
import {
    RegularResidenceFragment,
    useGetResidencesBoundingBoxQuery,
    useGetResidencesByGeoScopeLazyQuery,
} from '../../generated/graphql';
import { Marker } from './marker';
import { SearchBar } from './searchbar';
import { SideBar } from './sidebar';
import { RiHomeSmileFill } from 'react-icons/ri';

type SearchTypes = 'geocode' | 'address';

interface CommonMapProps {
    fixed?: boolean;
    variant?: 'small' | 'large';
    valueHook?: (place: google.maps.places.PlaceResult) => void;
}

type ResidenceProps =
    | {
          withResidences?: false;
          withSideBar?: never;
      }
    | {
          withResidences: true;
          withSideBar?: boolean;
      };

type AutoCompleteProps =
    | {
          withSearchBar?: false;
          searchTypes?: never;
      }
    | {
          withSearchBar: true;
          searchTypes: SearchTypes[];
      };

type MapProps = CommonMapProps & ResidenceProps & AutoCompleteProps;

const DAVIS_CENTER: GoogleMap.Coords = { lat: 38.5449, lng: -121.7405 };
const DEFAULT_ZOOM = 14;

export const Map: React.FC<MapProps> = ({
    withResidences,
    withSearchBar,
    searchTypes,
    valueHook,
    withSideBar,
    fixed,
    variant,
}) => {
    // Used for panning the map to target residence or search res
    const [center, setCenter] = useState(DAVIS_CENTER);
    // Used for zooming to target residence or search res
    const [zoom, setZoom] = useState(DEFAULT_ZOOM);
    // Used for displaying or hiding a center marker (search res marker)
    const [centerMarker, setCenterMarker] = useState(false);
    // Used to render components that need API conditionally
    const [apiFlag, setApiFlag] = useState(false);

    const [showRefresh, setShowRefresh] = useState(false);

    const [initialBounds, setInitialBounds] = useState<GoogleMap.Bounds | null>(
        null
    );

    const [currentBounds, setCurrentBounds] = useState<GoogleMap.Bounds | null>(
        null
    );

    const [residences, setResidences] = useState<RegularResidenceFragment[]>(
        []
    );

    const { loading, data, error, refetch } = useGetResidencesBoundingBoxQuery({
        variables: {
            perimeter: {
                xMin: initialBounds ? initialBounds.nw.lng : -180,
                xMax: initialBounds ? initialBounds.ne.lng : 180,
                yMin: initialBounds ? initialBounds.se.lat : -180,
                yMax: initialBounds ? initialBounds.ne.lat : 180,
            },
        },
    });

    const [geoscope, results] = useGetResidencesByGeoScopeLazyQuery();

    useEffect(() => {
        if (results.data?.getResidencesByGeoScope.residences)
            setResidences(results.data?.getResidencesByGeoScope.residences);
    }, [results]);

    useEffect(() => {
        if (data?.getResidencesBoundingBox.residences)
            setResidences(data?.getResidencesBoundingBox.residences);
    }, [data]);

    const searchHandler = (place: google.maps.places.PlaceResult) => {
        if (valueHook) valueHook(place);
        const loc = place.geometry?.location;
        const place_id = place.place_id;
        if (place_id) geoscope({ variables: { place_id: place_id } });
        if (loc) setCenter({ lat: loc.lat(), lng: loc.lng() });
    };

    const [hover, setHover] = useState(-1);

    return (
        <Box w={'100%'} h={'100%'} position="relative">
            {apiFlag && withSearchBar && (
                <SearchBar
                    options={{
                        // Bounds are always tied to the map
                        bounds: {
                            north: center.lat + 0.2,
                            south: center.lat - 0.2,
                            east: center.lng + 0.2,
                            west: center.lng - 0.2,
                        },
                        // Constant
                        componentRestrictions: { country: 'us' },
                        types: searchTypes,
                        fields: ['place_id', 'geometry'],
                    }}
                    searchHandler={searchHandler}
                    variant={variant}
                />
            )}
            {withSideBar && residences && (
                <SideBar
                    residences={residences}
                    hover={hover}
                    setHover={setHover}
                    setCenter={setCenter}
                />
            )}
            <GoogleMap
                bootstrapURLKeys={{
                    key: process.env.NEXT_PUBLIC_MAPS_API_KEY,
                    libraries: 'places',
                }}
                center={center}
                zoom={zoom}
                options={() => ({
                    draggable: !fixed,
                    panControl: false,
                    fullscreenControl: false,
                    zoomControl: false,
                    scrollwheel: fixed,
                    mapTypeControl: false,
                    minZoom: 12,
                })}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={() => {
                    setApiFlag(true);
                }}
                onChange={(value) => {
                    console.log(value.bounds);
                    setCurrentBounds(value.bounds);
                    if (!initialBounds) {
                        setInitialBounds(value.bounds);
                    } else {
                        setShowRefresh(initialBounds !== value.bounds);
                    }
                    setCenter(value.center);
                }}
            >
                {withResidences &&
                    residences &&
                    residences.map((res) => {
                        return (
                            <Marker
                                res_id={res.res_id}
                                lat={res.coords.lat}
                                lng={res.coords.lng}
                                address={res.full_address}
                                hover={hover == res.res_id}
                                setHover={setHover}
                                onClick={() => {
                                    console.log(center);
                                    console.log(res.coords);
                                    setCenter(res.coords);
                                }}
                            />
                        );
                    })}
                {residences.length == 0 && (
                    <Box>
                        <Icon
                            as={RiHomeSmileFill}
                            color={'orange.400'}
                            style={{ transform: 'translate(-50%, -100%)' }}
                            w={8}
                            h={8}
                        />
                    </Box>
                )}
            </GoogleMap>
            {showRefresh && (
                <Button
                    position={'absolute'}
                    bottom={5}
                    right={5}
                    variant={'ghost'}
                    colorScheme={'teal'}
                    onClick={() => {
                        refetch({
                            perimeter: {
                                xMin: currentBounds
                                    ? currentBounds.nw.lng
                                    : -180,
                                xMax: currentBounds
                                    ? currentBounds.ne.lng
                                    : 180,
                                yMin: currentBounds
                                    ? currentBounds.se.lat
                                    : -180,
                                yMax: currentBounds
                                    ? currentBounds.ne.lat
                                    : 180,
                            },
                        });
                        setInitialBounds(currentBounds);
                        setShowRefresh(false);
                    }}
                >
                    Search this area
                </Button>
            )}
        </Box>
    );
};
