import {
    ActionIcon,
    Badge,
    Button,
    Center,
    Container,
    MantineTheme,
    Radio,
    RadioGroup,
    SimpleGrid,
    Slider,
    Text,
    Textarea,
    TextInput,
    Title,
} from '@mantine/core';
import { AnimatePresence, Variants } from 'framer-motion';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaEdit, FaSearchLocation } from 'react-icons/fa';
import { SuggestionList } from '../components/SuggestionList';
import { MotionContainer } from '../utils/motion';

/**
 *
 * STEP KEY
 *
 * stepIdx keeps track of the form's dynamic/reactive nature
 *
 * Initially only an address entry field is available
 * If the user ever returns to the address form the other fields
 * clear out but their state remains.
 *
 * When an address is selected stepIdx++
 *
 * 1) Unit type and rating
 * 2) pros
 * 3) cons
 * 4) dealbreakers
 * 5) comments
 * 6) submit
 */

export default function ReviewPage() {
    // framer motion animation variants
    const variants: Variants = {
        hidden: { opacity: 0, x: -200, y: 0 },
        enter: {
            opacity: 1,
            x: 0,
            y: 0,
        },
        exit: { opacity: 0, x: 200, y: 0 },
    };

    const router = useRouter();

    const [stepIdx, setStepIdx] = useState(0);

    const _nxt = () => {
        setStepIdx((idx) => idx + 1);
    };

    const _prv = () => {
        setStepIdx((idx) => idx - 1);
    };

    const fieldVariants: Variants = {
        initial: { opacity: 0, x: -400 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 400 },
    };

    const [address, setAddress] = useState('');
    const [rating, setRating] = useState(50);
    const [type, setType] = useState('single');
    const [unit, setUnit] = useState<string | undefined>(undefined);

    // replace with a reduce implementation after backend changes
    const [flags, setFlags] = useState({
        pros: {
            PET_FRIENDLY: false,
            STORAGE: false,
            SHOWER: false,
            NATURAL_LIGHT: false,
            NEIGHBORHOOD_VIBE: false,
            AMENITIES: false,
            APPLIANCES: false,
            LANDLORD: false,
        },
        cons: {
            LANDLORD: false,
            SAFETY: false,
            PET_FRIENDLY: false,
            SHOWER: false,
            FALSE_ADVERTISING: false,
            MOLD_OR_MILDEW: false,
            PESTS: false,
            NOISE: false,
            MAINTENANCE_ISSUES: false,
            CONNECTIVITY: false,
        },
        dlbs: {
            LEASE_ISSUES: false,
            BURGLARY: false,
            ILLEGAL_MUSHROOM_ACTIVITY: false,
            SECURITY_DEPOSIT: false,
            CONSTRUCTION_HARASSMENT: false,
            PRIVACY: false,
            UNRESPONSIVE: false,
        },
    });

    const [comments, setComments] = useState('');

    return (
        <MotionContainer
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{ type: 'spring' }}
            key={'review'}
        >
            <Title
                sx={{ fontSize: 80, fontWeight: 900, letterSpacing: -2 }}
                align="center"
                mt={100}
            >
                Reviews are the backbone of{' '}
                <Text
                    inherit
                    variant="gradient"
                    gradient={{ from: 'cyan', to: 'lime', deg: 45 }}
                    component="span"
                >
                    IMHO
                </Text>
            </Title>
            <Text
                color="dimmed"
                align="center"
                size="lg"
                sx={{ maxWidth: 580 }}
                mx="auto"
                mt="xl"
            >
                Its reviews written by people you that make all the difference!
                Do your community a solid and tell us what you love (or don't)
                about your home.
            </Text>
            <Container sx={{ minHeight: 32, marginTop: 40 }}>
                <AnimatePresence>
                    {stepIdx > 0 && stepIdx < 6 && (
                        <MotionContainer
                            variants={{
                                initial: { opacity: 0, x: -400 },
                                animate: {
                                    opacity: 1,
                                    x: 0,
                                    transition: {
                                        type: 'spring',
                                        delay: 1,
                                    },
                                },
                                exit: {
                                    opacity: 0,
                                    x: 400,
                                    transition: {
                                        type: 'spring',
                                    },
                                },
                            }}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            key={'address-badge'}
                        >
                            <Center>
                                <Badge
                                    variant="gradient"
                                    gradient={{ from: 'pink', to: 'violet' }}
                                    size={'xl'}
                                    leftSection={
                                        <ActionIcon
                                            size="xs"
                                            color="blue"
                                            radius="xl"
                                            variant="transparent"
                                            mr={20}
                                            sx={(theme) => ({
                                                color: 'white',
                                                '&:hover': {
                                                    color: theme.colors.gray[4],
                                                },
                                            })}
                                            onClick={() => setStepIdx(0)}
                                        >
                                            <FaEdit />
                                        </ActionIcon>
                                    }
                                >
                                    {address}
                                </Badge>
                            </Center>
                        </MotionContainer>
                    )}
                </AnimatePresence>
            </Container>

            <AnimatePresence exitBeforeEnter>
                {stepIdx == 0 && (
                    <MotionContainer
                        variants={{
                            initial: { opacity: 0, x: -400 },
                            animate: { opacity: 1, x: 0 },
                            exit: { opacity: 0 },
                        }}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        key={'addy'}
                    >
                        <Title
                            sx={{
                                fontSize: 30,
                                fontWeight: 500,
                                letterSpacing: -2,
                            }}
                            align="center"
                            mt={50}
                        >
                            Where do you call{' '}
                            <Text
                                inherit
                                variant="gradient"
                                gradient={{
                                    from: 'violet',
                                    to: 'cyan',
                                    deg: -65,
                                }}
                                component="span"
                            >
                                home?
                            </Text>
                        </Title>

                        <TextInput
                            mt={20}
                            size="lg"
                            icon={<FaSearchLocation size={16} />}
                            placeholder="Your address"
                            variant="default"
                            value={address}
                            onChange={(evt) => {
                                setAddress(evt.currentTarget.value);
                            }}
                            autoFocus
                            onFocus={() => {
                                setStepIdx(0);
                            }}
                        />
                    </MotionContainer>
                )}
                {stepIdx == 0 && (
                    <SuggestionList
                        hidden={false}
                        address={address}
                        onSelect={(place) => {
                            setAddress(place.description);
                            _nxt();
                        }}
                        key={'suggestions'}
                    />
                )}

                {stepIdx == 1 && (
                    <MotionContainer
                        variants={fieldVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        key={'rating'}
                    >
                        <Title
                            sx={{
                                fontSize: 30,
                                fontWeight: 500,
                                letterSpacing: -2,
                            }}
                            align="center"
                            mt={50}
                        >
                            What kind of{' '}
                            <Text
                                inherit
                                variant="gradient"
                                gradient={{
                                    from: 'grape',
                                    to: 'pink',
                                    deg: 35,
                                }}
                                component="span"
                            >
                                residence
                            </Text>{' '}
                            is this?
                        </Title>
                        <Center mt={20}>
                            <RadioGroup
                                required
                                color="pink"
                                size="lg"
                                spacing="xl"
                                value={type}
                                onChange={setType}
                            >
                                <Radio value="multi">Multi Unit</Radio>
                                <Radio value="single">Single Family</Radio>
                            </RadioGroup>
                        </Center>
                        <Center mt={20}>
                            {type == 'multi' && (
                                <TextInput
                                    size="sm"
                                    placeholder="What unit do you live in?"
                                    variant="filled"
                                    value={unit}
                                    onChange={(evt) => {
                                        setUnit(evt.currentTarget.value);
                                    }}
                                />
                            )}
                        </Center>

                        <Title
                            sx={{
                                fontSize: 30,
                                fontWeight: 500,
                                letterSpacing: -2,
                            }}
                            align="center"
                            mt={50}
                        >
                            Would you recommend this place to a{' '}
                            <Text
                                inherit
                                variant="gradient"
                                gradient={{
                                    from: 'grape',
                                    to: 'pink',
                                    deg: 35,
                                }}
                                component="span"
                            >
                                friend?
                            </Text>
                        </Title>
                        <Slider
                            label={null}
                            mt={40}
                            color="pink"
                            size="xl"
                            radius="xs"
                            step={25}
                            value={rating}
                            onChange={setRating}
                            marks={[
                                { value: 0, label: 'Heck No!' },
                                { value: 25, label: 'Nope.' },
                                { value: 50, label: 'Meh' },
                                { value: 75, label: 'Yep.' },
                                { value: 100, label: 'Oh Yes!' },
                            ]}
                        />
                        <Center>
                            <Button
                                mt={60}
                                size="lg"
                                variant="gradient"
                                gradient={{
                                    from: 'violet',
                                    to: 'pink',
                                    deg: 65,
                                }}
                                onClick={() => {
                                    if (rating >= 50) setStepIdx(2);
                                    else setStepIdx(3);
                                }}
                            >
                                Next
                            </Button>
                        </Center>
                    </MotionContainer>
                )}
                {stepIdx == 2 && (
                    <MotionContainer
                        variants={fieldVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        key={'love'}
                    >
                        <Title
                            sx={{
                                fontSize: 30,
                                fontWeight: 500,
                                letterSpacing: -2,
                            }}
                            align="center"
                            mt={50}
                        >
                            What did you absolutely{' '}
                            <Text
                                inherit
                                variant="gradient"
                                gradient={{
                                    from: 'lime',
                                    to: 'turqoise',
                                    deg: 20,
                                }}
                                component="span"
                            >
                                love?
                            </Text>
                        </Title>
                        <SimpleGrid
                            mt={60}
                            cols={5}
                            spacing="lg"
                            breakpoints={[
                                { maxWidth: 980, cols: 3, spacing: 'md' },
                                { maxWidth: 755, cols: 2, spacing: 'sm' },
                                { maxWidth: 600, cols: 1, spacing: 'sm' },
                            ]}
                        >
                            {(
                                Object.keys(flags.pros) as Array<
                                    keyof typeof flags.pros
                                >
                            ).map((key) => {
                                const getBackgroundColor = (
                                    theme: MantineTheme
                                ) => {
                                    if (flags.pros[key]) return '#1ca600';
                                    if (theme.colorScheme === 'dark')
                                        return theme.colors.dark[4];
                                    return theme.colors.gray[2];
                                };
                                return (
                                    <Button
                                        key={key}
                                        onClick={() => {
                                            setFlags((flags) => {
                                                flags.pros[key] =
                                                    !flags.pros[key];
                                                return { ...flags };
                                            });
                                        }}
                                        styles={(theme) => ({
                                            root: {
                                                backgroundColor:
                                                    getBackgroundColor(theme),
                                                '&:hover': {
                                                    backgroundColor:
                                                        theme.fn.darken(
                                                            '#1ca600',
                                                            0.2
                                                        ),
                                                },
                                                border: 0,
                                                height: 200,
                                                paddingLeft: 20,
                                                paddingRight: 20,
                                            },

                                            leftIcon: {
                                                marginRight: 15,
                                                fontSize: 30,
                                                color: theme.colors.gray[4],
                                            },
                                        })}
                                    >
                                        <Text>{key}</Text>
                                    </Button>
                                );
                            })}
                        </SimpleGrid>
                        <Center>
                            <Button
                                mt={60}
                                size="lg"
                                variant="gradient"
                                gradient={{
                                    from: 'green',
                                    to: 'turqoise',
                                    deg: 65,
                                }}
                                onClick={() => {
                                    if (rating >= 50) _nxt();
                                    else setStepIdx(5);
                                }}
                            >
                                Next
                            </Button>
                        </Center>
                    </MotionContainer>
                )}
                {stepIdx == 3 && (
                    <MotionContainer
                        variants={fieldVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        key={'hate'}
                    >
                        <Title
                            sx={{
                                fontSize: 30,
                                fontWeight: 500,
                                letterSpacing: -2,
                            }}
                            align="center"
                            mt={50}
                        >
                            What{' '}
                            <Text
                                inherit
                                variant="gradient"
                                gradient={{
                                    from: 'orange',
                                    to: 'yellow',
                                    deg: 20,
                                }}
                                component="span"
                            >
                                was not
                            </Text>{' '}
                            the best?
                        </Title>
                        <SimpleGrid
                            mt={60}
                            cols={5}
                            spacing="lg"
                            breakpoints={[
                                { maxWidth: 980, cols: 3, spacing: 'md' },
                                { maxWidth: 755, cols: 2, spacing: 'sm' },
                                { maxWidth: 600, cols: 1, spacing: 'sm' },
                            ]}
                        >
                            {(
                                Object.keys(flags.cons) as Array<
                                    keyof typeof flags.cons
                                >
                            ).map((key) => {
                                const getBackgroundColor = (
                                    theme: MantineTheme
                                ) => {
                                    if (flags.cons[key]) return '#c46f00';
                                    if (theme.colorScheme === 'dark')
                                        return theme.colors.dark[4];
                                    return theme.colors.gray[2];
                                };
                                return (
                                    <Button
                                        key={key}
                                        onClick={() => {
                                            setFlags((flags) => {
                                                flags.cons[key] =
                                                    !flags.cons[key];
                                                return { ...flags };
                                            });
                                        }}
                                        styles={(theme) => ({
                                            root: {
                                                backgroundColor:
                                                    getBackgroundColor(theme),
                                                '&:hover': {
                                                    backgroundColor:
                                                        theme.fn.darken(
                                                            '#c46f00',
                                                            0.2
                                                        ),
                                                },
                                                border: 0,
                                                height: 200,
                                                paddingLeft: 20,
                                                paddingRight: 20,
                                            },

                                            leftIcon: {
                                                marginRight: 15,
                                                fontSize: 30,
                                                color: theme.colors.gray[4],
                                            },
                                        })}
                                    >
                                        <Text>{key}</Text>
                                    </Button>
                                );
                            })}
                        </SimpleGrid>
                        <Center>
                            <Button
                                mt={60}
                                size="lg"
                                variant="gradient"
                                gradient={{
                                    from: 'yellow',
                                    to: 'pink',
                                    deg: 35,
                                }}
                                onClick={() => {
                                    if (
                                        flags.cons.LANDLORD ||
                                        flags.cons.SAFETY
                                    )
                                        _nxt();
                                    else if (rating >= 50) setStepIdx(5);
                                    else _prv();
                                }}
                            >
                                Next
                            </Button>
                        </Center>
                    </MotionContainer>
                )}
                {stepIdx == 4 && (
                    <MotionContainer
                        variants={fieldVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        key={'dealbreakers'}
                    >
                        <Title
                            sx={{
                                fontSize: 30,
                                fontWeight: 500,
                                letterSpacing: -2,
                            }}
                            align="center"
                            mt={50}
                        >
                            Any huge{' '}
                            <Text
                                inherit
                                variant="gradient"
                                gradient={{
                                    from: 'red',
                                    to: 'orange',
                                    deg: 20,
                                }}
                                component="span"
                            >
                                dealbreakers?
                            </Text>
                        </Title>
                        <SimpleGrid
                            mt={60}
                            cols={5}
                            spacing="lg"
                            breakpoints={[
                                { maxWidth: 980, cols: 3, spacing: 'md' },
                                { maxWidth: 755, cols: 2, spacing: 'sm' },
                                { maxWidth: 600, cols: 1, spacing: 'sm' },
                            ]}
                        >
                            {(
                                Object.keys(flags.dlbs) as Array<
                                    keyof typeof flags.dlbs
                                >
                            ).map((key) => {
                                const getBackgroundColor = (
                                    theme: MantineTheme
                                ) => {
                                    if (flags.dlbs[key]) return '#cf4100';
                                    if (theme.colorScheme === 'dark')
                                        return theme.colors.dark[4];
                                    return theme.colors.gray[2];
                                };
                                return (
                                    <Button
                                        key={key}
                                        onClick={() => {
                                            setFlags((flags) => {
                                                flags.dlbs[key] =
                                                    !flags.dlbs[key];
                                                return { ...flags };
                                            });
                                        }}
                                        styles={(theme) => ({
                                            root: {
                                                backgroundColor:
                                                    getBackgroundColor(theme),
                                                '&:hover': {
                                                    backgroundColor:
                                                        theme.fn.darken(
                                                            '#cf4100',
                                                            0.2
                                                        ),
                                                },
                                                border: 0,
                                                height: 200,
                                                paddingLeft: 20,
                                                paddingRight: 20,
                                            },

                                            leftIcon: {
                                                marginRight: 15,
                                                fontSize: 30,
                                                color: theme.colors.gray[4],
                                            },
                                        })}
                                    >
                                        <Text>{key}</Text>
                                    </Button>
                                );
                            })}
                        </SimpleGrid>
                        <Center>
                            <Button
                                mt={60}
                                size="lg"
                                variant="gradient"
                                gradient={{
                                    from: 'orange',
                                    to: 'pink',
                                    deg: 35,
                                }}
                                onClick={() => {
                                    _nxt();
                                }}
                            >
                                Next
                            </Button>
                        </Center>
                    </MotionContainer>
                )}
                {stepIdx == 5 && (
                    <MotionContainer
                        variants={fieldVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        key={'comments'}
                    >
                        <Title
                            sx={{
                                fontSize: 26,
                                fontWeight: 300,
                            }}
                            align="left"
                            mt={50}
                        >
                            Flags
                        </Title>
                        <SimpleGrid
                            mt={30}
                            cols={5}
                            spacing="lg"
                            breakpoints={[
                                { maxWidth: 980, cols: 3, spacing: 'md' },
                                { maxWidth: 755, cols: 2, spacing: 'sm' },
                                { maxWidth: 600, cols: 1, spacing: 'sm' },
                            ]}
                        >
                            {Object.entries(flags.pros)
                                .map((entry) => entry.concat('pro'))
                                .concat(
                                    Object.entries(flags.cons).map((entry) =>
                                        entry.concat('con')
                                    )
                                )
                                .concat(
                                    Object.entries(flags.dlbs).map((entry) =>
                                        entry.concat('dlb')
                                    )
                                )
                                .map(([key, val, type]) => {
                                    const bgColor = () => {
                                        if (type == 'pro') return 'green';
                                        else if (type == 'con') return 'orange';
                                        else return 'red';
                                    };
                                    return val ? (
                                        <Badge
                                            color={bgColor()}
                                            variant={'filled'}
                                            size={'xl'}
                                            radius={'sm'}
                                        >
                                            {key}
                                        </Badge>
                                    ) : (
                                        <></>
                                    );
                                })}
                        </SimpleGrid>
                        <Title
                            sx={{
                                fontSize: 26,
                                fontWeight: 300,
                            }}
                            align="left"
                            mt={50}
                        >
                            Comments
                        </Title>
                        <Textarea
                            mt={20}
                            placeholder="Anything else to add?"
                            description="Don't worry! These are anonymous."
                            radius="md"
                            size="md"
                            autosize
                            minRows={6}
                            maxRows={10}
                            value={comments}
                            onChange={(evt) => {
                                setComments(evt.currentTarget.value);
                            }}
                        />
                        <Center>
                            <Button
                                mt={60}
                                size="lg"
                                variant="gradient"
                                gradient={{
                                    from: 'teal',
                                    to: 'lime',
                                    deg: 35,
                                }}
                                onClick={() => {
                                    _nxt();
                                }}
                            >
                                Next
                            </Button>
                        </Center>
                    </MotionContainer>
                )}
                {stepIdx == 6 && (
                    <MotionContainer
                        variants={fieldVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        key={'submit'}
                    >
                        <Title
                            sx={{
                                fontSize: 30,
                                fontWeight: 500,
                                letterSpacing: -2,
                            }}
                            align="center"
                            mt={50}
                        >
                            Ready to{' '}
                            <Text
                                inherit
                                variant="gradient"
                                gradient={{
                                    from: 'grape',
                                    to: 'violet',
                                    deg: 20,
                                }}
                                component="span"
                            >
                                submit
                            </Text>{' '}
                            this review?
                        </Title>
                        <Title
                            sx={{
                                fontSize: 26,
                                fontWeight: 300,
                            }}
                            align="left"
                            mt={50}
                        >
                            Pros
                        </Title>
                        <SimpleGrid
                            mt={30}
                            cols={5}
                            spacing="lg"
                            breakpoints={[
                                { maxWidth: 980, cols: 3, spacing: 'md' },
                                { maxWidth: 755, cols: 2, spacing: 'sm' },
                                { maxWidth: 600, cols: 1, spacing: 'sm' },
                            ]}
                        >
                            {Object.entries(flags.pros).map(([key, val]) => {
                                return val ? (
                                    <Badge
                                        color={'green'}
                                        variant={'filled'}
                                        size={'xl'}
                                        radius={'sm'}
                                    >
                                        {key}
                                    </Badge>
                                ) : (
                                    <></>
                                );
                            })}
                        </SimpleGrid>
                        <Title
                            sx={{
                                fontSize: 26,
                                fontWeight: 300,
                            }}
                            align="left"
                            mt={50}
                        >
                            Cons
                        </Title>
                        <SimpleGrid
                            mt={30}
                            cols={5}
                            spacing="lg"
                            breakpoints={[
                                { maxWidth: 980, cols: 3, spacing: 'md' },
                                { maxWidth: 755, cols: 2, spacing: 'sm' },
                                { maxWidth: 600, cols: 1, spacing: 'sm' },
                            ]}
                        >
                            {Object.entries(flags.cons).map(([key, val]) => {
                                return val ? (
                                    <Badge
                                        color={'orange'}
                                        variant={'filled'}
                                        size={'xl'}
                                        radius={'sm'}
                                    >
                                        {key}
                                    </Badge>
                                ) : (
                                    <></>
                                );
                            })}
                        </SimpleGrid>
                        <Title
                            sx={{
                                fontSize: 26,
                                fontWeight: 300,
                            }}
                            align="left"
                            mt={50}
                        >
                            Dealbreakers
                        </Title>
                        <SimpleGrid
                            mt={30}
                            cols={5}
                            spacing="lg"
                            breakpoints={[
                                { maxWidth: 980, cols: 3, spacing: 'md' },
                                { maxWidth: 755, cols: 2, spacing: 'sm' },
                                { maxWidth: 600, cols: 1, spacing: 'sm' },
                            ]}
                        >
                            {Object.entries(flags.dlbs).map(([key, val]) => {
                                return val ? (
                                    <Badge
                                        color={'red'}
                                        variant={'filled'}
                                        size={'xl'}
                                        radius={'sm'}
                                    >
                                        {key}
                                    </Badge>
                                ) : (
                                    <></>
                                );
                            })}
                        </SimpleGrid>
                        <Title
                            sx={{
                                fontSize: 26,
                                fontWeight: 300,
                            }}
                            align="left"
                            mt={50}
                        >
                            Comments
                        </Title>
                        <Text size="md" lineClamp={5}>
                            {comments}
                        </Text>
                        <Center>
                            <Button
                                mt={60}
                                size="lg"
                                variant="gradient"
                                gradient={{
                                    from: 'teal',
                                    to: 'lime',
                                    deg: 35,
                                }}
                                onClick={() => {
                                    _nxt();
                                }}
                            >
                                Submit
                            </Button>
                        </Center>
                    </MotionContainer>
                )}
                {stepIdx == 7 && (
                    <MotionContainer
                        variants={fieldVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        key={'submit'}
                    >
                        <Title
                            sx={{
                                fontSize: 30,
                                fontWeight: 500,
                                letterSpacing: -2,
                            }}
                            align="center"
                            mt={50}
                        >
                            Would you like to{' '}
                            <Button
                                variant="subtle"
                                radius="md"
                                sx={{
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    marginLeft: 4,
                                    marginRight: 4,
                                }}
                                onClick={() => router.push('/login')}
                            >
                                <Text
                                    variant="gradient"
                                    gradient={{
                                        from: 'grape',
                                        to: 'violet',
                                        deg: 20,
                                    }}
                                    sx={{ fontSize: 26 }}
                                >
                                    login
                                </Text>
                            </Button>
                            or
                            <Button
                                variant="subtle"
                                radius="md"
                                sx={{
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    marginLeft: 4,
                                    marginRight: 4,
                                }}
                                onClick={() => router.push('/signup')}
                            >
                                <Text
                                    variant="gradient"
                                    gradient={{
                                        from: 'lime',
                                        to: 'teal',
                                        deg: 20,
                                    }}
                                    sx={{ fontSize: 26 }}
                                >
                                    sign up
                                </Text>
                            </Button>
                            to save this review to your{' '}
                            <Text
                                inherit
                                variant="gradient"
                                gradient={{
                                    from: 'purple',
                                    to: 'pink',
                                    deg: 35,
                                }}
                                component="span"
                            >
                                IMHO
                            </Text>{' '}
                            profile?
                        </Title>
                    </MotionContainer>
                )}
            </AnimatePresence>
        </MotionContainer>
    );
}
