import { Icon } from '@chakra-ui/react';
import GoogleMap from 'google-map-react';
import { Dispatch, SetStateAction } from 'react';
import { RiHomeSmile2Fill, RiHomeSmile2Line } from 'react-icons/ri';

interface MarkerProps {
    loc_id: number;
    lat: number;
    lng: number;
    address: string;
    hover: boolean;
    setHover: Dispatch<SetStateAction<number>>; // updating the hovered id
    onClick: () => void;
}

export const Marker: React.FC<MarkerProps> = ({
    loc_id,
    hover,
    setHover,
    onClick,
}) => (
    <Icon
        as={hover ? RiHomeSmile2Fill : RiHomeSmile2Line}
        h={8}
        w={8}
        style={{ transform: 'translate(-50%, -100%)' }}
        color={'teal'}
        onMouseEnter={() => {
            setHover(loc_id);
        }}
        onMouseLeave={() => {
            setHover(-1);
        }}
        onClick={onClick}
        cursor={'pointer'}
    />
);
