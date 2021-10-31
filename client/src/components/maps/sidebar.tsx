import { Box, ChakraProps, Heading, VStack } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { RegularLocationFragment } from '../../generated/graphql';
import { LocationCard } from './loccard';
import GoogleMap from 'google-map-react';

interface SideBarProps extends ChakraProps {
    locations: RegularLocationFragment[];
    hover: number;
    setHover: Dispatch<SetStateAction<number>>; // updating the hovered id
    setCenter: Dispatch<SetStateAction<GoogleMap.Coords>>;
    setDetailLocation: Dispatch<SetStateAction<null | RegularLocationFragment>>;
}

export const SideBar: React.FC<SideBarProps> = ({
    locations,
    hover,
    setHover,
    setCenter,
    setDetailLocation,
}: SideBarProps) => {
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
            <Heading mt={2} size={'md'}>
                Locations
            </Heading>
            <VStack padding={3}>
                {locations.map((loc) => (
                    <LocationCard
                        key={loc.loc_id}
                        location={loc}
                        hover={loc.loc_id == hover}
                        setHover={setHover}
                        onClick={() => {
                            setCenter({ ...loc.coords });
                            setDetailLocation(loc);
                        }}
                    />
                ))}
            </VStack>
        </Box>
    );
};

export default SideBar;
