import {
    Box,
    Center,
    useColorModeValue,
    Heading,
    Text,
    Stack,
    Image,
} from '@chakra-ui/react';
import { RegularLocationFragment } from '../../generated/graphql';
import { Dispatch, SetStateAction } from 'react';

const IMAGE =
    'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';

interface LocationCardProps {
    location: RegularLocationFragment;
    hover: boolean;
    setHover: Dispatch<SetStateAction<number>>;
    onClick: () => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({
    hover,
    setHover,
    location,
    onClick,
}) => {
    return (
        <Box
            role={'group'}
            p={2}
            maxW={'330px'}
            w={'100%'}
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow={hover ? '2xl' : 'none'}
            rounded={'lg'}
            pos={'relative'}
            zIndex={1}
            cursor={'pointer'}
            onMouseEnter={() => {
                setHover(location.loc_id);
            }}
            onMouseLeave={() => {
                setHover(-1);
            }}
            onClick={onClick}
        >
            <Stack pt={10} align={'center'}>
                <Text
                    color={'gray.500'}
                    fontSize={'sm'}
                    textTransform={'uppercase'}
                >
                    {location.full_address.split(',')[0]}
                </Text>

                <Stack direction={'row'} align={'center'}>
                    {location.avg_rent && (
                        <Text fontWeight={800} fontSize={'xl'}>
                            ${location.avg_rent}
                        </Text>
                    )}
                    {location.avg_rating && (
                        <Text color={'gray.600'}>
                            {location.avg_rating} stars
                        </Text>
                    )}
                </Stack>
            </Stack>
        </Box>
    );
};
