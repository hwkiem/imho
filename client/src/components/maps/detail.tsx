import {
    Box,
    Button,
    ChakraProps,
    Heading,
    VStack,
    HStack,
    useColorModeValue,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { RegularLocationFragment } from '../../generated/graphql';

interface SideBarProps extends ChakraProps {
    location: RegularLocationFragment;
    setLocation: Dispatch<SetStateAction<null | RegularLocationFragment>>;
}

export const DetailModal: React.FC<SideBarProps> = ({
    location,
    setLocation,
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
            right={'0px'}
            mr={1}
            h={'85%'}
            w={'20%'}
            overflowY={'scroll'}
            style={{ scrollbarWidth: 'none' }}
        >
            <Heading mt={2} size={'sm'}>
                {location.full_address.split(',')[0]}
                <VStack padding={2}>
                    <Button
                        onClick={() => {
                            setLocation(null);
                        }}
                    >
                        Close
                    </Button>
                    <HStack>
                        <Box
                            bg={useColorModeValue('white', 'gray.800')}
                            width={'30%'}
                            height={'20px'}
                        >
                            ID: {location.loc_id}
                        </Box>
                        <Box
                            bg={useColorModeValue('white', 'gray.800')}
                            width={'30%'}
                            height={'60px'}
                        >
                            Rent: {location.avg_rent?.toFixed(0)}
                        </Box>
                        <Box
                            bg={useColorModeValue('white', 'gray.800')}
                            width={'30%'}
                            height={'20px'}
                        >
                            Rating: {location.avg_rating?.toFixed(2)}
                        </Box>
                    </HStack>
                </VStack>
            </Heading>
        </Box>
    );
};

export default DetailModal;
