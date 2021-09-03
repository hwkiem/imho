import { Box } from '@chakra-ui/react';
import { NavBar } from '../section/navbar';

export const Layout: React.FC = ({ children }) => {
    console;
    return (
        <Box height={'100vh'}>
            <NavBar />
            <Box h={'100%'}>{children}</Box>
        </Box>
    );
};
