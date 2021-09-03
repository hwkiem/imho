import { Box, Heading, Button, Icon } from '@chakra-ui/react';
import { RiRefreshLine } from 'react-icons/ri';
import { chakra } from '@chakra-ui/react';

const CRiRefreshLine = chakra(RiRefreshLine);

const Sidebar: React.FC = ({ children }) => {
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
            {children}
            <Button
                position={'absolute'}
                bottom={2}
                right={2}
                leftIcon={<Icon as={CRiRefreshLine} />}
            >
                Refresh
            </Button>
        </Box>
    );
};

export default Sidebar;
