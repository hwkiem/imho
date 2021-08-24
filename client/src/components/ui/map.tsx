import {
    Box,
    Center,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
} from '@chakra-ui/react'
import { Residence } from 'entities'
import GoogleMap from 'google-map-react'
import { chakra } from '@chakra-ui/react'
import { RiHomeSmile2Fill, RiHomeSmile2Line } from 'react-icons/ri'
import { Icon } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'

import ReviewModal from './reviewModal'
import { RegularResidenceFragment } from '../../generated/graphql'

const CRiHomeSmileFill = chakra(RiHomeSmile2Fill)
const CRiHomeSmileLine = chakra(RiHomeSmile2Line)

interface MapProps {
    residences: RegularResidenceFragment[]
    hover: number
    setHover: Dispatch<SetStateAction<number>> // updating the hovered id
    center: { lat: number; lng: number }
}

interface MarkerProps {
    res_id: number
    lat: number
    lng: number
    address: string
    hover: boolean
    setHover: Dispatch<SetStateAction<number>> // updating the hovered id
}

const Marker: React.FC<MarkerProps> = ({ res_id, hover, setHover }) => (
    <Icon
        as={hover ? RiHomeSmile2Fill : RiHomeSmile2Line}
        h={8}
        w={8}
        style={{ transform: 'translate(-50%, -100%)' }}
        color={'teal'}
        onMouseEnter={() => {
            setHover(res_id)
        }}
        onMouseLeave={() => {
            setHover(-1)
        }}
        cursor={'pointer'}
    />
)

export const Map: React.FC<MapProps> = ({
    residences,
    center,
    hover,
    setHover,
}) => {
    return (
        <Box w="100%" h="100%">
            <ReviewModal />
            <GoogleMap
                bootstrapURLKeys={{
                    key: process.env.NEXT_PUBLIC_MAPS_API_KEY!,
                }}
                defaultCenter={center}
                defaultZoom={14}
                options={(map) => ({
                    panControl: false,
                    fullscreenControl: false,
                    zoomControl: false,
                    scrollwheel: true,
                    mapTypeControl: false,
                    minZoom: 12,
                })}
            >
                {residences.map((res) => (
                    <Marker
                        res_id={res.res_id}
                        key={res.res_id}
                        lat={res.coords.lat}
                        lng={res.coords.lng}
                        address={res.full_address}
                        hover={res.res_id == hover}
                        setHover={setHover}
                    />
                ))}
            </GoogleMap>
        </Box>
    )
}
