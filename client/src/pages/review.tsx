import {
    ArrowLeftIcon,
    ArrowRightIcon,
    DeleteIcon,
    SunIcon,
} from '@chakra-ui/icons';
import {
    Box,
    Container,
    Heading,
    Stack,
    useColorModeValue,
    Text,
    Button,
    SimpleGrid,
    IconButton,
    ContainerProps,
    Spacer,
    Flex,
    BoxProps,
    StyleProps,
    ButtonGroup,
    Center,
    Icon,
} from '@chakra-ui/react';

import {
    FaBacteria,
    FaHiking,
    FaLockOpen,
    FaMoneyCheck,
    FaParking,
    FaShower,
    FaSun,
    FaSwimmingPool,
    FaTrashAlt,
    FaTree,
    FaVolumeUp,
} from 'react-icons/fa';
import { MdPestControlRodent } from 'react-icons/md';
import { BsFillTelephoneXFill } from 'react-icons/bs';
import { RiTempColdLine } from 'react-icons/ri';
import {
    GiOverlordHelm,
    GiPartyPopper,
    GiWashingMachine,
} from 'react-icons/gi';

import { AnimatePresence, motion, Variants } from 'framer-motion';
import next, { NextPage } from 'next';
import Head from 'next/head';
import router from 'next/router';
import React, { useState } from 'react';
import { GoogleBar } from '../components/googlebar';
import { Layout } from '../components/layout';
import { IconType } from 'react-icons';

interface StepProps {
    prv: () => void;
    nxt: () => void;
}

const variants: Variants = {
    hidden: { opacity: 0, x: -200, y: 0 },
    enter: {
        opacity: 1,
        x: 0,
        y: 0,
    },
    exit: { opacity: 0, x: 200, y: 0 },
};

const MotionContainer = motion<ContainerProps>(Container);
const ReviewSplash: React.FC<StepProps> = ({ nxt }) => {
    return (
        <MotionContainer
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{ type: 'spring' }}
            maxW={'3xl'}
            key={'index'}
        >
            <Stack
                as={Box}
                textAlign={'center'}
                spacing={{ base: 8, md: 14 }}
                py={{ base: 20, md: 36 }}
            >
                <Heading
                    fontWeight={600}
                    fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                    lineHeight={'110%'}
                >
                    Reviews are the backbone of{' '}
                    <Text as={'span'} color={'pink.400'}>
                        IMHO.
                    </Text>
                </Heading>
                <Text color={'gray.500'}>
                    Its reviews written by people you that make all the
                    difference! Do your community a solid and tell us what you
                    love (or don't) about your home.
                </Text>
                <Stack
                    direction={'column'}
                    spacing={3}
                    align={'center'}
                    alignSelf={'center'}
                    position={'relative'}
                >
                    <Button
                        colorScheme={'pink'}
                        bg={'pink.400'}
                        rounded={'full'}
                        px={6}
                        _hover={{
                            bg: 'pink.500',
                        }}
                        onClick={nxt}
                    >
                        Write Review
                    </Button>
                </Stack>
            </Stack>
        </MotionContainer>
    );
};

const LocationStep: React.FC<StepProps> = ({ prv, nxt }) => {
    return (
        <MotionContainer
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{ type: 'spring' }}
            maxW={'3xl'}
            key={'index'}
        >
            <Stack
                as={Box}
                textAlign={'center'}
                spacing={{ base: 8, md: 14 }}
                py={{ base: 20, md: 36 }}
            >
                <Heading
                    fontWeight={600}
                    fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                    lineHeight={'110%'}
                >
                    Where do you call{' '}
                    <Text as={'span'} color={'pink.400'}>
                        home?
                    </Text>
                </Heading>
                <Stack
                    direction={'column'}
                    spacing={3}
                    align={'center'}
                    alignSelf={'center'}
                    position={'relative'}
                >
                    <GoogleBar
                        onSelect={(placeid) => {
                            console.log(placeid);
                            nxt();
                        }}
                    />
                </Stack>
            </Stack>
        </MotionContainer>
    );
};

interface FlagCardProps {
    flag: Flag;
    idx: number;
    color: string;
    onSeverityChange: (idx: number, severity: number) => void;
}

const MotionBox = motion<BoxProps>(Box);

const FlagCard: React.FC<FlagCardProps> = ({
    flag,
    idx,
    color,
    onSeverityChange,
}) => {
    const [isBack, setIsBack] = useState(false);
    const variants: Variants = {
        hidden: { rotateY: -180, transition: { duration: 1 } },
        enter: { rotateY: 0, transition: { duration: 1 } },
        exit: { rotateY: 180, transition: { duration: 1 } },
    };
    const { topic, severity, icon } = flag;

    const [isHover, setIsHover] = useState(false);

    const primaryColor = color == 'green' ? 'green.300' : 'red.300';
    const secondaryColor = color == 'green' ? 'green.500' : 'red.500';
    const tertiaryColor = color == 'green' ? 'green.100' : 'red.100';

    return (
        <MotionBox
            style={{
                width: 200,
                height: 200,
                margin: 8,
                float: 'left',
                position: 'relative',
            }}
            onHoverStart={() => {
                setIsHover(true);
                console.log('hovering');
            }}
            onHoverEnd={() => setIsHover(false)}
            cursor={'pointer'}
        >
            <AnimatePresence>
                {!isBack && (
                    <MotionBox
                        position={'absolute'}
                        width={'100%'}
                        height={'100%'}
                        bg={severity == 0 ? 'gray.200' : tertiaryColor}
                        rounded={'md'}
                        boxShadow={'md'}
                        style={{ WebkitBackfaceVisibility: 'hidden' }}
                        variants={variants}
                        initial={'hidden'}
                        animate={'enter'}
                        exit={'exit'}
                        onClick={() => {
                            setIsBack(true);
                        }}
                        key={'front'}
                    >
                        <Center w={'100%'} h={'100%'}>
                            <Stack direction={'column'} alignItems={'center'}>
                                <Text>{topic}</Text>
                                <Icon
                                    as={icon}
                                    boxSize={8}
                                    color={
                                        isHover ? secondaryColor : primaryColor
                                    }
                                />
                            </Stack>
                        </Center>
                    </MotionBox>
                )}
                {isBack && (
                    <MotionBox
                        position={'absolute'}
                        width={'100%'}
                        height={'100%'}
                        bg={'white'}
                        rounded={'md'}
                        boxShadow={'md'}
                        style={{ WebkitBackfaceVisibility: 'hidden' }}
                        variants={variants}
                        initial={'hidden'}
                        animate={'enter'}
                        exit={'exit'}
                        onClick={() => {
                            setIsBack(false);
                        }}
                        key={'back'}
                    >
                        <Center w={'100%'} h={'100%'}>
                            <Stack direction={'column'}>
                                <Button
                                    variant={
                                        severity == 1 ? 'solid' : 'outline'
                                    }
                                    borderColor={primaryColor}
                                    bg={severity == 1 ? primaryColor : 'white'}
                                    onClick={() =>
                                        onSeverityChange(
                                            idx,
                                            severity == 1 ? 0 : 1
                                        )
                                    }
                                >
                                    Mild
                                </Button>
                                <Button
                                    variant={
                                        severity == 2 ? 'solid' : 'outline'
                                    }
                                    borderColor={primaryColor}
                                    bg={severity == 2 ? primaryColor : 'white'}
                                    onClick={() =>
                                        onSeverityChange(
                                            idx,
                                            severity == 2 ? 0 : 2
                                        )
                                    }
                                >
                                    Medium
                                </Button>
                                <Button
                                    variant={
                                        severity == 3 ? 'solid' : 'outline'
                                    }
                                    borderColor={primaryColor}
                                    bg={severity == 3 ? primaryColor : 'white'}
                                    onClick={() =>
                                        onSeverityChange(
                                            idx,
                                            severity == 3 ? 0 : 3
                                        )
                                    }
                                >
                                    Hot
                                </Button>
                            </Stack>
                        </Center>
                    </MotionBox>
                )}
            </AnimatePresence>
        </MotionBox>
    );
};

interface Flag {
    topic: string;
    severity: number;
    icon: IconType;
}

const TEMP_RED_FLAGS: Flag[] = [
    { topic: 'stinky', severity: 0, icon: FaTrashAlt },
    { topic: 'mold', severity: 0, icon: FaBacteria },
    { topic: 'pests', severity: 0, icon: MdPestControlRodent },
    { topic: 'noisy', severity: 0, icon: FaVolumeUp },
    { topic: 'privacy', severity: 0, icon: FaLockOpen },
    {
        topic: 'unresponsive',
        severity: 0,
        icon: BsFillTelephoneXFill,
    },
    { topic: 'temperature', severity: 0, icon: RiTempColdLine },
    { topic: 'water pressure', severity: 0, icon: FaShower },
    { topic: 'appliances', severity: 0, icon: GiWashingMachine },
    { topic: 'security deposit', severity: 0, icon: FaMoneyCheck },
];

const TEMP_GREEN_FLAGS: Flag[] = [
    { topic: 'light', severity: 0, icon: FaSun },
    { topic: 'water pressure', severity: 0, icon: FaShower },
    { topic: 'outdoor space', severity: 0, icon: FaTree },
    { topic: 'neighborhood', severity: 0, icon: GiPartyPopper },
    { topic: 'pool', severity: 0, icon: FaSwimmingPool },
    {
        topic: 'landlord',
        severity: 0,
        icon: GiOverlordHelm,
    },
    { topic: 'parking', severity: 0, icon: FaParking },
    { topic: 'appliances', severity: 0, icon: GiWashingMachine },
];

const FlagsStep: React.FC<StepProps> = ({ nxt }) => {
    const [redFlags, setRedFlags] = useState(TEMP_RED_FLAGS);
    const [greenFlags, setGreenFlags] = useState(TEMP_GREEN_FLAGS);

    const [isRed, setIsRed] = useState(false);

    const handleRedClick = (idx: number, severity: number) => {
        setRedFlags((redFlags) => {
            redFlags[idx].severity = severity;
            return redFlags;
        });
    };

    const handleGreenClick = (idx: number, severity: number) => {
        setGreenFlags((greenFlags) => {
            greenFlags[idx].severity = severity;
            return greenFlags;
        });
    };

    return (
        <MotionContainer
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{ type: 'spring' }}
            maxW={'6xl'}
            key={'index'}
        >
            <Stack
                as={Box}
                textAlign={'center'}
                spacing={{ base: 8, md: 10 }}
                py={{ base: 20, md: 20 }}
            >
                {!isRed && (
                    <Heading
                        fontWeight={600}
                        fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                        lineHeight={'110%'}
                    >
                        What did you{' '}
                        <Text as={'span'} color={'green.300'}>
                            love?
                        </Text>
                    </Heading>
                )}
                {isRed && (
                    <Heading
                        fontWeight={600}
                        fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                        lineHeight={'110%'}
                    >
                        What could have been{' '}
                        <Text as={'span'} color={'red.300'}>
                            better?
                        </Text>
                    </Heading>
                )}
                {!isRed && (
                    <SimpleGrid spacing={4} minChildWidth={'200px'}>
                        {greenFlags.map((flag, idx) => (
                            <FlagCard
                                flag={flag}
                                onSeverityChange={handleGreenClick}
                                idx={idx}
                                key={idx}
                                color={'green'}
                            />
                        ))}
                    </SimpleGrid>
                )}
                {isRed && (
                    <SimpleGrid spacing={4} minChildWidth={'200px'}>
                        {redFlags.map((flag, idx) => (
                            <FlagCard
                                flag={flag}
                                onSeverityChange={handleRedClick}
                                idx={idx}
                                key={idx}
                                color={'red'}
                            />
                        ))}
                    </SimpleGrid>
                )}
                <Button
                    colorScheme={'red'}
                    rounded={'full'}
                    px={6}
                    _hover={{
                        bg: isRed ? 'red.500' : 'green.500',
                    }}
                    onClick={() => {
                        if (!isRed) setIsRed(true);
                        if (isRed) nxt();
                    }}
                    bg={isRed ? 'red.300' : 'green.300'}
                >
                    Next
                </Button>
            </Stack>
        </MotionContainer>
    );
};

const ReviewPage: NextPage = () => {
    const [step, setStep] = useState(0);

    const next = () => {
        setStep((step) => step + 1);
    };

    const prev = () => {
        setStep((step) => step - 1);
    };

    const steps = [
        <ReviewSplash prv={prev} nxt={next} key={'splash'} />,
        <LocationStep prv={prev} nxt={next} key={'first'} />,
        <FlagsStep prv={prev} nxt={next} key={'flags'} />,
    ];

    return (
        <>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <Layout title={'Review'} description={'Write a Review'}>
                <AnimatePresence exitBeforeEnter>{steps[step]}</AnimatePresence>
            </Layout>
        </>
    );
};

export default ReviewPage;
