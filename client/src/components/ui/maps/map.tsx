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

import GoogleMap from 'google-map-react'
import { useState, Fragment, useEffect } from 'react'
import {
    RegularResidenceFragment,
    ResidenceGql,
    useGetResidencesLimitQuery,
} from '../../../generated/graphql'
import { MarkerList } from './markerlist'
import { SearchBar } from './searchbar'
import { SideBar } from './sidebar'

type SearchTypes = 'geocode' | 'full_address'

interface CommonMapProps {
    fixed?: boolean
}

type ResidenceProps =
    | {
          withResidences: false
          withSideBar?: never
      }
    | { withResidences?: boolean; withSideBar?: boolean }

type AutoCompleteProps =
    | {
          withAutoComplete?: false
          withSearchBar?: false
          searchTypes?: never
      }
    | {
          withAutoComplete: true
          withSearchBar?: never
          searchTypes: SearchTypes[]
      }
    | {
          withAutoComplete?: never
          withSearchBar: true
          searchTypes: SearchTypes[]
      }

type MapProps = CommonMapProps & ResidenceProps & AutoCompleteProps

const DAVIS_CENTER: GoogleMap.Coords = { lat: 38.5449, lng: -121.7405 }
const DEFAULT_ZOOM = 14

export const Map: React.FC<MapProps> = ({
    withAutoComplete,
    withResidences,
    withSearchBar,
    searchTypes,
    withSideBar,
    fixed,
}) => {
    // Used for panning the map to target residence or search res
    const [center, setCenter] = useState(DAVIS_CENTER)
    // Used for zooming to target residence or search res
    const [zoom, setZoom] = useState(DEFAULT_ZOOM)
    // Used for displaying or hiding a center marker (search res marker)
    const [centerMarker, setCenterMarker] = useState(false)
    // Used to render components that need API conditionally
    const [apiFlag, setApiFlag] = useState(false)
    // Residence management
    const [residences, setResidences] = useState<RegularResidenceFragment[]>([])

    useEffect(() => {
        if (withResidences) {
            const { data, loading, error } = useGetResidencesLimitQuery({
                variables: { limit: 10 },
            })
            if (!loading && data?.getResidencesLimit.residences) {
                setResidences(data.getResidencesLimit.residences)
            } else if (!loading && data?.getResidencesLimit.errors) {
                console.log('Error fetching residences...')
            } else {
                console.log('loading...')
            }
        } else {
            setResidences([]) // wipe residences
        }
    }, [withResidences])

    return (
        <Fragment>
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
                        fields: ['place_id'],
                    }}
                />
            )}
            {withSideBar && <SideBar residences={residences} />}
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
            >
                {withResidences && <MarkerList residences={residences} />}
            </GoogleMap>
        </Fragment>
    )
}
