import {
    Box,
    Button,
    ChakraProps,
    Heading,
    Icon,
    Stack,
    VStack,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { RegularResidenceFragment } from '../../generated/graphql';
import { ResidenceCard } from './rescard';
import GoogleMap from 'google-map-react';

interface SideBarProps extends ChakraProps {
    residences: RegularResidenceFragment[];
    hover: number;
    setHover: Dispatch<SetStateAction<number>>; // updating the hovered id
    setCenter: Dispatch<SetStateAction<GoogleMap.Coords>>;
}

export const SideBar: React.FC<SideBarProps> = ({
    residences,
    hover,
    setHover,
    setCenter,
}) => {
    return (
        <Box
            bg={'gray.100'}
            px={4}
            boxShadow={'2xl'}
            rounded={'md'}
            position={'absolute'}
            zIndex={2}
            mt={20}
            ml={1}
            h={'85%'}
            w={'20%'}
            overflowY={'scroll'}
            style={{ scrollbarWidth: 'none' }}
        >
            <Heading mt={2}>Residences</Heading>
            <VStack padding={3}>
                {residences.map((res) => (
                    <ResidenceCard
                        residence={res}
                        hover={res.res_id == hover}
                        setHover={setHover}
                        onClick={() => {
                            setCenter({ ...res.coords });
                        }}
                    />
                ))}
            </VStack>
        </Box>
    );
};

export default SideBar;
