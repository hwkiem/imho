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
import { Formik } from 'formik';
import {
    useAddReviewMutation,
    WriteReviewInput,
    ProFlagTypes,
    ConFlagTypes,
    DbkFlagTypes,
    PlaceType,
} from '../generated/graphql';
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

    const [writeReview, { error }] = useAddReviewMutation();

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

    const [rating, setRating] = useState(50);

    const initialState: WriteReviewInput = {
        placeInput: {
            google_place_id: '',
            formatted_address: '',
            type: PlaceType.Single,
        },
        residenceInput: {
            unit: '',
        },
        reviewInput: {
            feedback: '',
            flags: { pros: [], cons: [], dbks: [] },
            rating: 75,
        },
    };
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
                sx={{ fontSize: 60, fontWeight: 900, letterSpacing: -2 }}
                align="center"
                mt={100}
            >
                renters help renters make{' '}
                <Text
                    inherit
                    variant="gradient"
                    gradient={{ from: 'cyan', to: 'lime', deg: 45 }}
                    component="span"
                >
                    informed
                </Text>{' '}
                decisions.
            </Title>
            <Text
                color="dimmed"
                align="center"
                size="lg"
                sx={{ maxWidth: 580 }}
                mx="auto"
                mt="xl"
            >
                Anonymously review your current or former apartment.
            </Text>
            <Formik
                initialValues={initialState}
                validate={(values) => {
                    const errors = {};

                    // if (!values.email) {
                    //     errors.email = 'Required';
                    // } else if (
                    //     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                    //         values.email
                    //     )
                    // ) {
                    //     errors.email = 'Invalid email address';
                    // }

                    return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    const response = await writeReview({
                        variables: { input: values },
                    });
                    if (response.data?.addReview.result) {
                        console.log(
                            `Review created at: ${response.data.addReview.result.createdAt}`
                        );
                    } else if (response.data?.addReview.errors) {
                        console.log('failed to create review.');
                        console.log(response.data.addReview.errors);
                    } else if (response.errors) {
                        console.log('client error.');
                        console.log(response.errors);
                    } else {
                        console.log('uh oh...');
                    }
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue,
                }) => (
                    <>
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
                                                gradient={{
                                                    from: 'pink',
                                                    to: 'violet',
                                                }}
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
                                                                color: theme
                                                                    .colors
                                                                    .gray[4],
                                                            },
                                                        })}
                                                        onClick={() =>
                                                            setStepIdx(0)
                                                        }
                                                    >
                                                        <FaEdit />
                                                    </ActionIcon>
                                                }
                                            >
                                                {
                                                    values.placeInput
                                                        .formatted_address
                                                }
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
                                        value={
                                            values.placeInput.formatted_address
                                        }
                                        onChange={(evt) => {
                                            setFieldValue(
                                                'placeInput.formatted_address',
                                                evt.currentTarget.value
                                            );
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
                                    address={
                                        values.placeInput.formatted_address
                                    }
                                    onSelect={(place) => {
                                        setFieldValue(
                                            'placeInput.google_place_id',
                                            place.place_id
                                        );
                                        setFieldValue(
                                            'placeInput.formatted_address',
                                            place.description
                                        );
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
                                            value={values.placeInput.type}
                                            onChange={(v) => {
                                                setFieldValue(
                                                    'placeInput.type',
                                                    v
                                                );
                                            }}
                                        >
                                            <Radio value={PlaceType.Multi}>
                                                Multi Unit
                                            </Radio>
                                            <Radio value={PlaceType.Single}>
                                                Single Family
                                            </Radio>
                                        </RadioGroup>
                                    </Center>
                                    <Center mt={20}>
                                        {values.placeInput.type ===
                                            PlaceType.Multi && (
                                            <TextInput
                                                size="sm"
                                                placeholder="What unit do you live in?"
                                                variant="filled"
                                                value={
                                                    values.residenceInput.unit
                                                }
                                                onChange={(evt) => {
                                                    setFieldValue(
                                                        'residenceInput.unit',
                                                        evt.currentTarget.value
                                                    );
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
                                        onChange={(v) => setRating(v)}
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
                                                setFieldValue(
                                                    'reviewInput.rating',
                                                    rating
                                                );
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
                                            {
                                                maxWidth: 980,
                                                cols: 3,
                                                spacing: 'md',
                                            },
                                            {
                                                maxWidth: 755,
                                                cols: 2,
                                                spacing: 'sm',
                                            },
                                            {
                                                maxWidth: 600,
                                                cols: 1,
                                                spacing: 'sm',
                                            },
                                        ]}
                                    >
                                        {(
                                            Object.keys(ProFlagTypes) as Array<
                                                keyof typeof ProFlagTypes
                                            >
                                        ).map((key) => {
                                            return (
                                                <Button
                                                    key={key}
                                                    onClick={() => {
                                                        let copy =
                                                            values.reviewInput.flags.pros.map(
                                                                (m) => m
                                                            );
                                                        if (
                                                            copy.includes(
                                                                ProFlagTypes[
                                                                    key
                                                                ]
                                                            )
                                                        ) {
                                                            copy = copy.filter(
                                                                (f) => {
                                                                    return (
                                                                        f !==
                                                                        ProFlagTypes[
                                                                            key
                                                                        ]
                                                                    );
                                                                }
                                                            );
                                                        } else {
                                                            copy.push(
                                                                ProFlagTypes[
                                                                    key
                                                                ]
                                                            );
                                                        }

                                                        setFieldValue(
                                                            `reviewInput.flags.pros`,
                                                            copy
                                                        );
                                                    }}
                                                    styles={(theme) => ({
                                                        root: {
                                                            backgroundColor:
                                                                values.reviewInput.flags.pros.includes(
                                                                    ProFlagTypes[
                                                                        key
                                                                    ]
                                                                )
                                                                    ? '#32a852'
                                                                    : theme.colorScheme ==
                                                                      'dark'
                                                                    ? theme
                                                                          .colors
                                                                          .dark[4]
                                                                    : theme
                                                                          .colors
                                                                          .gray[2],
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    theme.fn.darken(
                                                                        '#32a852',
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
                                                            color: theme.colors
                                                                .gray[4],
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
                                                if (
                                                    values.reviewInput.rating >=
                                                    50
                                                )
                                                    _nxt();
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
                                            {
                                                maxWidth: 980,
                                                cols: 3,
                                                spacing: 'md',
                                            },
                                            {
                                                maxWidth: 755,
                                                cols: 2,
                                                spacing: 'sm',
                                            },
                                            {
                                                maxWidth: 600,
                                                cols: 1,
                                                spacing: 'sm',
                                            },
                                        ]}
                                    >
                                        {(
                                            Object.keys(ConFlagTypes) as Array<
                                                keyof typeof ConFlagTypes
                                            >
                                        ).map((key) => {
                                            return (
                                                <Button
                                                    key={key}
                                                    onClick={() => {
                                                        let copy =
                                                            values.reviewInput.flags.cons.map(
                                                                (m) => m
                                                            );
                                                        if (
                                                            copy.includes(
                                                                ConFlagTypes[
                                                                    key
                                                                ]
                                                            )
                                                        ) {
                                                            copy = copy.filter(
                                                                (f) => {
                                                                    return (
                                                                        f !==
                                                                        ConFlagTypes[
                                                                            key
                                                                        ]
                                                                    );
                                                                }
                                                            );
                                                        } else {
                                                            copy.push(
                                                                ConFlagTypes[
                                                                    key
                                                                ]
                                                            );
                                                        }

                                                        setFieldValue(
                                                            `reviewInput.flags.cons`,
                                                            copy
                                                        );
                                                    }}
                                                    styles={(theme) => ({
                                                        root: {
                                                            backgroundColor:
                                                                values.reviewInput.flags.cons.includes(
                                                                    ConFlagTypes[
                                                                        key
                                                                    ]
                                                                )
                                                                    ? '#85581b'
                                                                    : theme.colorScheme ==
                                                                      'dark'
                                                                    ? theme
                                                                          .colors
                                                                          .dark[4]
                                                                    : theme
                                                                          .colors
                                                                          .gray[2],
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    theme.fn.darken(
                                                                        '#85581b',
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
                                                            color: theme.colors
                                                                .gray[4],
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
                                                    values.reviewInput.rating >=
                                                    50
                                                )
                                                    setStepIdx(5);
                                                else if (
                                                    values.reviewInput.flags.cons.includes(
                                                        ConFlagTypes.BadLandlord
                                                    ) ||
                                                    values.reviewInput.flags.cons.includes(
                                                        ConFlagTypes.Unsafe
                                                    )
                                                )
                                                    _nxt();
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
                                            {
                                                maxWidth: 980,
                                                cols: 3,
                                                spacing: 'md',
                                            },
                                            {
                                                maxWidth: 755,
                                                cols: 2,
                                                spacing: 'sm',
                                            },
                                            {
                                                maxWidth: 600,
                                                cols: 1,
                                                spacing: 'sm',
                                            },
                                        ]}
                                    >
                                        {(
                                            Object.keys(DbkFlagTypes) as Array<
                                                keyof typeof DbkFlagTypes
                                            >
                                        ).map((key) => {
                                            return (
                                                <Button
                                                    key={key}
                                                    onClick={() => {
                                                        let copy =
                                                            values.reviewInput.flags.dbks.map(
                                                                (m) => m
                                                            );
                                                        if (
                                                            copy.includes(
                                                                DbkFlagTypes[
                                                                    key
                                                                ]
                                                            )
                                                        ) {
                                                            copy = copy.filter(
                                                                (f) => {
                                                                    return (
                                                                        f !==
                                                                        DbkFlagTypes[
                                                                            key
                                                                        ]
                                                                    );
                                                                }
                                                            );
                                                        } else {
                                                            copy.push(
                                                                DbkFlagTypes[
                                                                    key
                                                                ]
                                                            );
                                                        }

                                                        setFieldValue(
                                                            `reviewInput.flags.dbks`,
                                                            copy
                                                        );
                                                    }}
                                                    styles={(theme) => ({
                                                        root: {
                                                            backgroundColor:
                                                                values.reviewInput.flags.dbks.includes(
                                                                    DbkFlagTypes[
                                                                        key
                                                                    ]
                                                                )
                                                                    ? '#940c1e'
                                                                    : theme.colorScheme ==
                                                                      'dark'
                                                                    ? theme
                                                                          .colors
                                                                          .dark[4]
                                                                    : theme
                                                                          .colors
                                                                          .gray[2],
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    theme.fn.darken(
                                                                        '#940c1e',
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
                                                            color: theme.colors
                                                                .gray[4],
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
                                        Pros
                                    </Title>
                                    <SimpleGrid
                                        mt={30}
                                        cols={5}
                                        spacing="lg"
                                        breakpoints={[
                                            {
                                                maxWidth: 980,
                                                cols: 3,
                                                spacing: 'md',
                                            },
                                            {
                                                maxWidth: 755,
                                                cols: 2,
                                                spacing: 'sm',
                                            },
                                            {
                                                maxWidth: 600,
                                                cols: 1,
                                                spacing: 'sm',
                                            },
                                        ]}
                                    >
                                        {values.reviewInput.flags.pros.map(
                                            (f) => {
                                                return (
                                                    <Badge
                                                        key={f}
                                                        color={'#32a852'}
                                                        variant={'filled'}
                                                        size={'xl'}
                                                        radius={'sm'}
                                                    >
                                                        {f}
                                                    </Badge>
                                                );
                                            }
                                        )}
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
                                            {
                                                maxWidth: 980,
                                                cols: 3,
                                                spacing: 'md',
                                            },
                                            {
                                                maxWidth: 755,
                                                cols: 2,
                                                spacing: 'sm',
                                            },
                                            {
                                                maxWidth: 600,
                                                cols: 1,
                                                spacing: 'sm',
                                            },
                                        ]}
                                    >
                                        {values.reviewInput.flags.cons.map(
                                            (f) => {
                                                return (
                                                    <Badge
                                                        key={f}
                                                        color={'#85581b'}
                                                        variant={'filled'}
                                                        size={'xl'}
                                                        radius={'sm'}
                                                    >
                                                        {f}
                                                    </Badge>
                                                );
                                            }
                                        )}
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
                                            {
                                                maxWidth: 980,
                                                cols: 3,
                                                spacing: 'md',
                                            },
                                            {
                                                maxWidth: 755,
                                                cols: 2,
                                                spacing: 'sm',
                                            },
                                            {
                                                maxWidth: 600,
                                                cols: 1,
                                                spacing: 'sm',
                                            },
                                        ]}
                                    >
                                        {values.reviewInput.flags.dbks.map(
                                            (f) => {
                                                return (
                                                    <Badge
                                                        key={f}
                                                        color={'#940c1e'}
                                                        variant={'filled'}
                                                        size={'xl'}
                                                        radius={'sm'}
                                                    >
                                                        {f}
                                                    </Badge>
                                                );
                                            }
                                        )}
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
                                        value={values.reviewInput.feedback}
                                        onChange={(evt) => {
                                            setFieldValue(
                                                'reviewInput.feedback',
                                                evt.currentTarget.value
                                            );
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
                                        Flags
                                    </Title>
                                    <SimpleGrid
                                        mt={30}
                                        cols={5}
                                        spacing="lg"
                                        breakpoints={[
                                            {
                                                maxWidth: 980,
                                                cols: 3,
                                                spacing: 'md',
                                            },
                                            {
                                                maxWidth: 755,
                                                cols: 2,
                                                spacing: 'sm',
                                            },
                                            {
                                                maxWidth: 600,
                                                cols: 1,
                                                spacing: 'sm',
                                            },
                                        ]}
                                    >
                                        {values.reviewInput.flags.pros.map(
                                            (f) => {
                                                return (
                                                    <Badge
                                                        key={f}
                                                        color={'#32a852'}
                                                        variant={'filled'}
                                                        size={'xl'}
                                                        radius={'sm'}
                                                    >
                                                        {f}
                                                    </Badge>
                                                );
                                            }
                                        )}
                                        {values.reviewInput.flags.cons.map(
                                            (f) => {
                                                return (
                                                    <Badge
                                                        key={f}
                                                        color={'#85581b'}
                                                        variant={'filled'}
                                                        size={'xl'}
                                                        radius={'sm'}
                                                    >
                                                        {f}
                                                    </Badge>
                                                );
                                            }
                                        )}
                                        {values.reviewInput.flags.dbks.map(
                                            (f) => {
                                                return (
                                                    <Badge
                                                        key={f}
                                                        color={'#940c1e'}
                                                        variant={'filled'}
                                                        size={'xl'}
                                                        radius={'sm'}
                                                    >
                                                        {f}
                                                    </Badge>
                                                );
                                            }
                                        )}
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
                                        {values.reviewInput.feedback}
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
                                                handleSubmit();
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
                                            onClick={() =>
                                                router.push('/login')
                                            }
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
                                            onClick={() =>
                                                router.push('/signup')
                                            }
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
                    </>
                )}
            </Formik>
        </MotionContainer>
    );
}
