import { Box } from '@chakra-ui/react';
import { NavBar } from '../section/navbar';

interface LayoutProps {
    children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
    console;
    return (
        <Box height={'100vh'}>
            <NavBar />
            <Box h={'100%'}>{props.children}</Box>
        </Box>
    );
};
