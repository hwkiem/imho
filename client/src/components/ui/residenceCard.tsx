import {
    Box,
    Center,
    useColorModeValue,
    Heading,
    Text,
    Stack,
    Image,
} from '@chakra-ui/react';
import { RegularResidenceFragment } from '../../generated/graphql';
import { Dispatch, SetStateAction } from 'react';

const IMAGE =
    'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';

interface ResidenceCardProps {
    residence: RegularResidenceFragment;
    hover: boolean;
    setHover: Dispatch<SetStateAction<number>>;
}

export const ResidenceCard: React.FC<ResidenceCardProps> = ({
    hover,
    setHover,
    residence,
}) => {
    return (
        <Center py={12}>
            <Box
                role={'group'}
                p={2}
                maxW={'330px'}
                w={'full'}
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow={hover ? '2xl' : 'none'}
                rounded={'lg'}
                pos={'relative'}
                zIndex={1}
                cursor={'pointer'}
                onMouseEnter={() => {
                    setHover(residence.res_id);
                }}
                onMouseLeave={() => {
                    setHover(-1);
                }}
            >
                <Stack pt={10} align={'center'}>
                    <Text
                        color={'gray.500'}
                        fontSize={'sm'}
                        textTransform={'uppercase'}
                    >
                        {residence.full_address.split(',')[0]}
                    </Text>

                    <Stack direction={'row'} align={'center'}>
                        <Text fontWeight={800} fontSize={'xl'}>
                            ${residence.avg_rent}
                        </Text>
                        <Text color={'gray.600'}>
                            {residence.avg_rating} stars
                        </Text>
                    </Stack>
                </Stack>
            </Box>
        </Center>
    );
};
