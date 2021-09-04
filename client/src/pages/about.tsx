import { Spacer, VStack } from '@chakra-ui/react';
import { Layout } from '../components/layout/layout';
import SplitWithImage from '../components/ui/features';
import BasicStatistics from '../components/ui/stats';
import WithSpeechBubbles from '../components/ui/testimonials';
import { Page } from '../types/page';

const About: Page = () => {
    return (
        <VStack spacing={20}>
            <Spacer />
            <BasicStatistics />
            <WithSpeechBubbles />
            <SplitWithImage />
            <Spacer />
        </VStack>
    );
};

About.layout = Layout;

export default About;
