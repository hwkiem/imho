import { Box } from '@chakra-ui/react';
import { NavBar } from '../section/navbar';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
    console;
    return (
        <Box height={'100vh'}>
            <NavBar />
            <Box h={'100%'}>{children}</Box>
        </Box>
    );
};
