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
import { useState } from 'react'

interface MapProps {
    withResidences?: boolean
    withAutoComplete?: boolean
    withSearchBar?: boolean
    withSideBar?: boolean
    fixed?: boolean
}

const DAVIS_CENTER: GoogleMap.Coords = { lat: 38.5449, lng: -121.7405 }
const DEFAULT_ZOOM = 14

export const Map: React.FC<MapProps> = ({
    withAutoComplete = false,
    withResidences = false,
    withSearchBar = false,
    withSideBar = false,
    fixed = false,
}) => {
    // Used for panning the map to target residence or search res
    const [center, setCenter] = useState(DAVIS_CENTER)
    // Used for zooming to target residence or search res
    const [zoom, setZoom] = useState(DEFAULT_ZOOM)
    // Used for displaying or hiding a center marker (search res marker)
    const [centerMarker, setCenterMarker] = useState(false)

    return (
        <GoogleMap
            bootstrapURLKeys={{
                key: process.env.NEXT_PUBLIC_MAPS_API_KEY,
                libraries: 'places',
            }}
            center={center}
            zoom={zoom}
            options={() => ({
                panControl: false,
                fullscreenControl: false,
                zoomControl: false,
                scrollwheel: fixed,
                mapTypeControl: false,
                minZoom: 12,
            })}
        ></GoogleMap>
    )
}
