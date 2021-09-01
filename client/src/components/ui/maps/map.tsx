/**
 * MAP REFACTOR
 *
 * Props:
 *  withResidences: true | false
 *      Fetches and renders any relevant residences.
 *          true: used for diver to display residences. Searching will update
 *          these residences in sidebar
 *  withAutoComplete: true | false (exclusive w search bar?)
 *      used for referencing autocomplete to map in a different component
 *  withSearchBar: true | false (exclusive w AutoComplete? Restricted to large)
 *      Renders a search bar ON the map
 *  withSideBar: true | false
 *      Renders a sidebar ON the map
 *  fixed: true | false
 *      Established controls - panning/zooming/dragging are disabled when fixed
 *
 */

import { Box, Icon } from '@chakra-ui/react'
import GoogleMap from 'google-map-react'
import { useState, Fragment, useEffect } from 'react'
import {
    RegularResidenceFragment,
    ResidenceGql,
    useGetResidencesLimitQuery,
} from '../../../generated/graphql'
import { Marker } from './marker'
import { SearchBar } from './searchbar'
import { SideBar } from './sidebar'
import { RiHomeSmileFill } from 'react-icons/ri'

type SearchTypes = 'geocode' | 'full_address'

interface CommonMapProps {
    fixed?: boolean
    variant?: 'small' | 'large'
    valueHook?: (place: google.maps.places.PlaceResult) => void
}

type ResidenceProps =
    | {
          withResidences?: false
          withSideBar?: never
      }
    | {
          withResidences: true
          withSideBar?: boolean
      }

type AutoCompleteProps =
    | {
          withAutoComplete?: false
          withSearchBar?: false
          searchTypes?: never
          ref?: never
      }
    | {
          withAutoComplete: true
          ref: HTMLInputElement | null
          withSearchBar?: never
          searchTypes: SearchTypes[]
      }
    | {
          withAutoComplete?: never
          withSearchBar: true
          ref?: never
          searchTypes: SearchTypes[]
      }

type MapProps = CommonMapProps & ResidenceProps & AutoCompleteProps

const DAVIS_CENTER: GoogleMap.Coords = { lat: 38.5449, lng: -121.7405 }
const DEFAULT_ZOOM = 14

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
    const [center, setCenter] = useState(DAVIS_CENTER)
    // Used for zooming to target residence or search res
    const [zoom, setZoom] = useState(DEFAULT_ZOOM)
    // Used for displaying or hiding a center marker (search res marker)
    const [centerMarker, setCenterMarker] = useState(false)
    // Used to render components that need API conditionally
    const [apiFlag, setApiFlag] = useState(false)

    const [residences, setResidences] = useState<RegularResidenceFragment[]>([])

    const { loading, data, error } = useGetResidencesLimitQuery({
        variables: { limit: 10 },
    })

    useEffect(() => {
        if (data?.getResidencesLimit.residences)
            setResidences(data?.getResidencesLimit.residences)
    }, [data])

    const searchHandler = (place: google.maps.places.PlaceResult) => {
        if (valueHook) valueHook(place)
        const loc = place.geometry?.location
        if (loc) {
            setCenter({ lat: loc.lat(), lng: loc.lng() })
            setCenterMarker(true)
        }
    }

    const [hover, setHover] = useState(-1)

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
                    setApiFlag(true)
                }}
                onChange={(value) => {
                    console.log(value.bounds)
                }}
            >
                {withResidences &&
                    residences &&
                    residences.map((res) => {
                        console.log('!')
                        return (
                            <Marker
                                res_id={res.res_id}
                                lat={res.coords.lat}
                                lng={res.coords.lng}
                                address={res.full_address}
                                hover={hover == res.res_id}
                                setHover={setHover}
                                onClick={() => {
                                    setCenter(res.coords)
                                }}
                            />
                        )
                    })}
                {centerMarker && residences.length == 0 && (
                    <Icon
                        {...center}
                        as={RiHomeSmileFill}
                        color={'orange.400'}
                        style={{ transform: 'translate(-50%, -100%)' }}
                        w={8}
                        h={8}
                    />
                )}
            </GoogleMap>
        </Box>
    )
}
