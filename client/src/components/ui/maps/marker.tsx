import { chakra } from '@chakra-ui/react'
import { RiHomeSmileFill } from 'react-icons/ri'

const HomeIcon = chakra(RiHomeSmileFill)

interface MarkerProps {
    lat: number
    lng: number
}

export const Marker: React.FC<MarkerProps> = (props) => {
    return <RiHomeSmileFill {...props} />
}
