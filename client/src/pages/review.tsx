import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Center,
    Container,
    Dialog,
    Popover,
    Radio,
    RadioGroup,
    SimpleGrid,
    Slider,
    Stepper,
    Text,
    Textarea,
    TextInput,
    Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Field, FieldProps, Form, Formik } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaEdit, FaSearchLocation } from 'react-icons/fa';
import { SuggestionList } from '../components/SuggestionList';
import {
    ConFlagTypes,
    DbkFlagTypes,
    ProFlagTypes,
    useAddReviewMutation,
    WriteReviewInput,
} from '../generated/graphql';

/**
 *
 * STEPS
 *
 * 1) address
 * 2) rating / unit type
 * 3) pros (first)
 * 4) cons (first)
 * 5) pros (second)
 * 6) cons (second)
 * 7) dbks (if necessary)
 * 8) feedback + submit
 */

export default function ReviewPage() {
    const router = useRouter();
    let curStep = -1;
    if (typeof router.query.step !== 'string') {
        router.push('/review?step=1');
    } else {
        curStep = +router.query.step;
    }

    const initialValues: WriteReviewInput = {
        placeInput: {
            formatted_address: '',
            google_place_id: '',
        },
        residenceInput: {
            unit: undefined,
        },
        reviewInput: {
            rating: 50,
            flagInput: { pros: [], cons: [], dbks: [] },
            feedback: '',
        },
    };

    const [addReview] = useAddReviewMutation();

    const [activeStep, setActiveStep] = useState(0);

    const onStepClick = (idx: number) => {
        console.log(idx);
        if (idx == 3) {
            router.push('/review?step=8');
        } else {
            router.push(`/review?step=${idx + 1}`);
        }
        setActiveStep(idx);
    };

    const [placeType, setPlaceType] = useState('multi');

    useEffect(() => {
        if ([3, 4, 5, 6, 7].includes(curStep)) {
            setActiveStep(2);
        } else if (curStep == 8) {
            setActiveStep(3);
        } else {
            setActiveStep(curStep - 1);
        }
    }, [curStep]);

    const [subErrDialog, setSubErrDialog] = useState<string | null>(null);

    const smallScreen = useMediaQuery('(max-width: 755px)');

    return (
        <Container>
            {!smallScreen && (
                <Stepper
                    active={activeStep}
                    onStepClick={onStepClick}
                    radius="md"
                    color="pink"
                >
                    <Stepper.Step label="The whereabouts" />
                    <Stepper.Step
                        label="The logistics"
                        allowStepSelect={curStep > 1}
                    />
                    <Stepper.Step
                        label="the good, the bad, the ugly"
                        allowStepSelect={curStep > 2}
                    />
                    <Stepper.Step
                        label="comments"
                        allowStepSelect={curStep > 2}
                    />
                </Stepper>
            )}
            <Title
                sx={{
                    fontSize: 40,
                    fontWeight: 900,
                    letterSpacing: -2,
                    '@media (max-width: 755px)': {
                        fontSize: 30,
                    },
                }}
                align="center"
                mt={20}
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
            <Formik
                initialValues={initialValues}
                onSubmit={async (values) => {
                    addReview({
                        variables: { input: { ...values } },
                    })
                        .then((res) => {
                            if (res.data?.addReview.result) {
                                router.push('/success');
                            } else if (res.data?.addReview.errors) {
                                setSubErrDialog(
                                    res.data.addReview.errors[0].error
                                );
                            } else {
                                console.log(
                                    'failed for some other weird reason...'
                                );
                                router.push('/error');
                            }
                        })
                        .catch((err) => {
                            console.log('caught an error.');
                            console.log(err);
                            router.push('/error');
                        });
                }}
            >
                {({ handleSubmit, setFieldValue, values }) => {
                    return (
                        <Form onSubmit={handleSubmit}>
                            <AnimatePresence exitBeforeEnter>
                                <motion.div
                                    key={curStep}
                                    initial={{ x: 300, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -300, opacity: 0 }}
                                >
                                    {curStep > 1 && (
                                        <Center mt={20}>
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
                                                            router.push(
                                                                '/review?step=1'
                                                            )
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
                                    )}
                                    {curStep == 1 && (
                                        <>
                                            <Text
                                                color="dimmed"
                                                align="center"
                                                size="lg"
                                                sx={{ maxWidth: 580 }}
                                                mx="auto"
                                                mt="xl"
                                            >
                                                Anonymously review your current
                                                or former apartment.
                                            </Text>
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

                                            <Field
                                                name={
                                                    'placeInput.formatted_address'
                                                }
                                            >
                                                {({
                                                    field,
                                                    meta,
                                                }: FieldProps) => (
                                                    <>
                                                        <TextInput
                                                            {...field}
                                                            error={
                                                                meta.touched &&
                                                                meta.error
                                                            }
                                                            placeholder={
                                                                '123 Mushroom Way, Davis, CA '
                                                            }
                                                            required
                                                            mt={20}
                                                            size="lg"
                                                            icon={
                                                                <FaSearchLocation
                                                                    size={16}
                                                                />
                                                            }
                                                        />
                                                        <SuggestionList
                                                            hidden={false}
                                                            address={
                                                                field.value
                                                            }
                                                            onSelect={(
                                                                place
                                                            ) => {
                                                                setFieldValue(
                                                                    'placeInput.google_place_id',
                                                                    place.place_id
                                                                );
                                                                setFieldValue(
                                                                    'placeInput.formatted_address',
                                                                    place.description
                                                                );
                                                                router.push(
                                                                    '/review?step=2'
                                                                );
                                                            }}
                                                            key={'suggestions'}
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </>
                                    )}
                                    <AnimatePresence exitBeforeEnter>
                                        <motion.div key={curStep}>
                                            {curStep == 2 && (
                                                <>
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
                                                            value={placeType}
                                                            onChange={
                                                                setPlaceType
                                                            }
                                                        >
                                                            <Radio
                                                                value={'multi'}
                                                            >
                                                                Multi Unit
                                                            </Radio>
                                                            <Radio
                                                                value={'single'}
                                                            >
                                                                Single Family
                                                            </Radio>
                                                        </RadioGroup>
                                                    </Center>
                                                    <Center mt={20}>
                                                        {placeType ==
                                                            'multi' && (
                                                            <TextInput
                                                                size="sm"
                                                                placeholder="What unit do you live in?"
                                                                variant="filled"
                                                                value={
                                                                    values
                                                                        .residenceInput
                                                                        .unit as string
                                                                }
                                                                onChange={(
                                                                    evt
                                                                ) => {
                                                                    setFieldValue(
                                                                        'residenceInput.unit',
                                                                        evt
                                                                            .currentTarget
                                                                            .value
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
                                                        Would you recommend this
                                                        place to a{' '}
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
                                                        sx={{
                                                            '@media (max-width: 755px)':
                                                                {
                                                                    paddingLeft: 5,
                                                                    paddingRight: 5,
                                                                },
                                                        }}
                                                        color="pink"
                                                        size="xl"
                                                        radius="xs"
                                                        step={25}
                                                        value={
                                                            values.reviewInput
                                                                .rating
                                                        }
                                                        onChange={(v) =>
                                                            setFieldValue(
                                                                'reviewInput.rating',
                                                                v
                                                            )
                                                        }
                                                        marks={[
                                                            {
                                                                value: 0,
                                                                label: 'Heck No!',
                                                            },
                                                            {
                                                                value: 25,
                                                                label: 'Nope.',
                                                            },
                                                            {
                                                                value: 50,
                                                                label: 'Meh',
                                                            },
                                                            {
                                                                value: 75,
                                                                label: 'Yep.',
                                                            },
                                                            {
                                                                value: 100,
                                                                label: 'Oh Yes!',
                                                            },
                                                        ]}
                                                    />
                                                    <Center>
                                                        <Button
                                                            mt={60}
                                                            mb={5}
                                                            size="lg"
                                                            variant="gradient"
                                                            gradient={{
                                                                from: 'violet',
                                                                to: 'pink',
                                                                deg: 65,
                                                            }}
                                                            onClick={() => {
                                                                if (
                                                                    values
                                                                        .reviewInput
                                                                        .rating >=
                                                                    50
                                                                )
                                                                    router.push(
                                                                        '/review?step=3'
                                                                    );
                                                                else
                                                                    router.push(
                                                                        '/review?step=4'
                                                                    );
                                                            }}
                                                        >
                                                            Next
                                                        </Button>
                                                    </Center>
                                                </>
                                            )}
                                            {(curStep == 3 || curStep == 5) && (
                                                <>
                                                    <Title
                                                        sx={{
                                                            fontSize: 30,
                                                            fontWeight: 500,
                                                            letterSpacing: -2,
                                                        }}
                                                        align="center"
                                                        mt={20}
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
                                                        mt={20}
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
                                                                cols: 1,
                                                                spacing: 'sm',
                                                            },
                                                        ]}
                                                    >
                                                        {Object.values(
                                                            ProFlagTypes
                                                        ).map((key) => {
                                                            if (
                                                                key ==
                                                                    ProFlagTypes.GoodLandlord &&
                                                                values.reviewInput.flagInput.cons.includes(
                                                                    ConFlagTypes.BadLandlord
                                                                )
                                                            )
                                                                return <></>;
                                                            return (
                                                                <Field
                                                                    name={
                                                                        'reviewInput.flagInput.pros'
                                                                    }
                                                                    type={
                                                                        'checkbox'
                                                                    }
                                                                    key={key}
                                                                    value={key}
                                                                >
                                                                    {({
                                                                        field,
                                                                    }: FieldProps) => (
                                                                        <Button
                                                                            component="label"
                                                                            styles={(
                                                                                theme
                                                                            ) => ({
                                                                                root: {
                                                                                    color:
                                                                                        theme.colorScheme ==
                                                                                        'dark'
                                                                                            ? theme
                                                                                                  .colors
                                                                                                  .gray[2]
                                                                                            : theme
                                                                                                  .colors
                                                                                                  .dark[5],
                                                                                    backgroundColor:
                                                                                        field.checked
                                                                                            ? '#32a852'
                                                                                            : theme.colorScheme ==
                                                                                              'dark'
                                                                                            ? theme
                                                                                                  .colors
                                                                                                  .dark[4]
                                                                                            : theme
                                                                                                  .colors
                                                                                                  .gray[2],
                                                                                    '@media: (hover: hover)':
                                                                                        {
                                                                                            '&:hover':
                                                                                                {
                                                                                                    backgroundColor:
                                                                                                        theme.fn.darken(
                                                                                                            '#32a852',
                                                                                                            0.2
                                                                                                        ),
                                                                                                },
                                                                                        },
                                                                                    border: 0,
                                                                                    height: 100,
                                                                                    paddingLeft: 20,
                                                                                    paddingRight: 20,
                                                                                },

                                                                                leftIcon:
                                                                                    {
                                                                                        marginRight: 15,
                                                                                        fontSize: 30,
                                                                                        color: theme
                                                                                            .colors
                                                                                            .gray[4],
                                                                                    },
                                                                            })}
                                                                        >
                                                                            <input
                                                                                type={
                                                                                    'checkbox'
                                                                                }
                                                                                {...field}
                                                                                style={{
                                                                                    display:
                                                                                        'none',
                                                                                }}
                                                                            />
                                                                            <Text>
                                                                                {key
                                                                                    .toLocaleLowerCase()
                                                                                    .replace(
                                                                                        '_',
                                                                                        ' '
                                                                                    )}
                                                                            </Text>
                                                                        </Button>
                                                                    )}
                                                                </Field>
                                                            );
                                                        })}
                                                    </SimpleGrid>
                                                    <Center>
                                                        <Button
                                                            mt={60}
                                                            mb={5}
                                                            size="lg"
                                                            variant="gradient"
                                                            gradient={{
                                                                from: 'green',
                                                                to: 'turqoise',
                                                                deg: 65,
                                                            }}
                                                            onClick={() => {
                                                                // pros came second - go to submit
                                                                if (
                                                                    curStep == 5
                                                                ) {
                                                                    router.push(
                                                                        '/review?step=8'
                                                                    ); // submit + feedback
                                                                    // rating was above 50
                                                                } else {
                                                                    router.push(
                                                                        '/review?step=6'
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            Next
                                                        </Button>
                                                    </Center>
                                                </>
                                            )}
                                            {(curStep == 4 || curStep == 6) && (
                                                <>
                                                    <Title
                                                        sx={{
                                                            fontSize: 30,
                                                            fontWeight: 500,
                                                            letterSpacing: -2,
                                                        }}
                                                        align="center"
                                                        mt={20}
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
                                                        mt={20}
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
                                                        {Object.values(
                                                            ConFlagTypes
                                                        ).map((key) => {
                                                            if (
                                                                key ==
                                                                    ConFlagTypes.BadLandlord &&
                                                                values.reviewInput.flagInput.pros.includes(
                                                                    ProFlagTypes.GoodLandlord
                                                                )
                                                            )
                                                                return <></>;
                                                            return (
                                                                <Field
                                                                    name={
                                                                        'reviewInput.flagInput.cons'
                                                                    }
                                                                    type={
                                                                        'checkbox'
                                                                    }
                                                                    key={key}
                                                                    value={key}
                                                                >
                                                                    {({
                                                                        field,
                                                                    }: FieldProps) => (
                                                                        <Button
                                                                            component="label"
                                                                            styles={(
                                                                                theme
                                                                            ) => ({
                                                                                root: {
                                                                                    color:
                                                                                        theme.colorScheme ==
                                                                                        'dark'
                                                                                            ? theme
                                                                                                  .colors
                                                                                                  .gray[2]
                                                                                            : theme
                                                                                                  .colors
                                                                                                  .dark[5],
                                                                                    backgroundColor:
                                                                                        field.checked
                                                                                            ? '#85581b'
                                                                                            : theme.colorScheme ==
                                                                                              'dark'
                                                                                            ? theme
                                                                                                  .colors
                                                                                                  .dark[4]
                                                                                            : theme
                                                                                                  .colors
                                                                                                  .gray[2],

                                                                                    '@media (hover: hover)':
                                                                                        {
                                                                                            '&:hover':
                                                                                                {
                                                                                                    backgroundColor:
                                                                                                        theme.fn.darken(
                                                                                                            '#85581b',
                                                                                                            0.2
                                                                                                        ),
                                                                                                },
                                                                                        },

                                                                                    border: 0,
                                                                                    height: 100,
                                                                                    paddingLeft: 20,
                                                                                    paddingRight: 20,
                                                                                },

                                                                                leftIcon:
                                                                                    {
                                                                                        marginRight: 15,
                                                                                        fontSize: 30,
                                                                                        color: theme
                                                                                            .colors
                                                                                            .gray[4],
                                                                                    },
                                                                            })}
                                                                        >
                                                                            <input
                                                                                type={
                                                                                    'checkbox'
                                                                                }
                                                                                {...field}
                                                                                style={{
                                                                                    display:
                                                                                        'none',
                                                                                }}
                                                                            />
                                                                            <Text>
                                                                                {key
                                                                                    .toLocaleLowerCase()
                                                                                    .replace(
                                                                                        '_',
                                                                                        ' '
                                                                                    )}
                                                                            </Text>
                                                                        </Button>
                                                                    )}
                                                                </Field>
                                                            );
                                                        })}
                                                    </SimpleGrid>
                                                    <Center>
                                                        <Button
                                                            mt={60}
                                                            mb={5}
                                                            size="lg"
                                                            variant="gradient"
                                                            gradient={{
                                                                from: 'yellow',
                                                                to: 'pink',
                                                                deg: 35,
                                                            }}
                                                            onClick={() => {
                                                                if (
                                                                    values.reviewInput.flagInput.cons.includes(
                                                                        ConFlagTypes.BadLandlord
                                                                    ) ||
                                                                    values.reviewInput.flagInput.cons.includes(
                                                                        ConFlagTypes.Maintenance
                                                                    ) ||
                                                                    values.reviewInput.flagInput.cons.includes(
                                                                        ConFlagTypes.Unsafe
                                                                    )
                                                                ) {
                                                                    router.push(
                                                                        '/review?step=7'
                                                                    );
                                                                } else {
                                                                    if (
                                                                        curStep ==
                                                                        4
                                                                    ) {
                                                                        router.push(
                                                                            '/review?step=5'
                                                                        );
                                                                    } else {
                                                                        router.push(
                                                                            '/review?step=8'
                                                                        );
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            Next
                                                        </Button>
                                                    </Center>
                                                </>
                                            )}
                                            {curStep == 7 && (
                                                <>
                                                    <Title
                                                        sx={{
                                                            fontSize: 30,
                                                            fontWeight: 500,
                                                            letterSpacing: -2,
                                                        }}
                                                        align="center"
                                                        mt={20}
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
                                                        mt={20}
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
                                                        {Object.values(
                                                            DbkFlagTypes
                                                        ).map((key) => {
                                                            return (
                                                                <Field
                                                                    name={
                                                                        'reviewInput.flagInput.dbks'
                                                                    }
                                                                    type={
                                                                        'checkbox'
                                                                    }
                                                                    key={key}
                                                                    value={key}
                                                                >
                                                                    {({
                                                                        field,
                                                                    }: FieldProps) => (
                                                                        <Button
                                                                            component="label"
                                                                            styles={(
                                                                                theme
                                                                            ) => ({
                                                                                root: {
                                                                                    color:
                                                                                        theme.colorScheme ==
                                                                                        'dark'
                                                                                            ? theme
                                                                                                  .colors
                                                                                                  .gray[2]
                                                                                            : theme
                                                                                                  .colors
                                                                                                  .dark[5],
                                                                                    backgroundColor:
                                                                                        field.checked
                                                                                            ? '#940c1e'
                                                                                            : theme.colorScheme ==
                                                                                              'dark'
                                                                                            ? theme
                                                                                                  .colors
                                                                                                  .dark[4]
                                                                                            : theme
                                                                                                  .colors
                                                                                                  .gray[2],
                                                                                    '@media (hover: hover)':
                                                                                        {
                                                                                            '&:hover':
                                                                                                {
                                                                                                    backgroundColor:
                                                                                                        theme.fn.darken(
                                                                                                            '#940c1e',
                                                                                                            0.2
                                                                                                        ),
                                                                                                },
                                                                                        },
                                                                                    border: 0,
                                                                                    height: 100,
                                                                                    paddingLeft: 20,
                                                                                    paddingRight: 20,
                                                                                },

                                                                                leftIcon:
                                                                                    {
                                                                                        marginRight: 15,
                                                                                        fontSize: 30,
                                                                                        color: theme
                                                                                            .colors
                                                                                            .gray[4],
                                                                                    },
                                                                            })}
                                                                        >
                                                                            <input
                                                                                type={
                                                                                    'checkbox'
                                                                                }
                                                                                {...field}
                                                                                style={{
                                                                                    display:
                                                                                        'none',
                                                                                }}
                                                                            />
                                                                            <Text>
                                                                                {key
                                                                                    .toLocaleLowerCase()
                                                                                    .replace(
                                                                                        '_',
                                                                                        ' '
                                                                                    )}
                                                                            </Text>
                                                                        </Button>
                                                                    )}
                                                                </Field>
                                                            );
                                                        })}
                                                    </SimpleGrid>
                                                    <Center>
                                                        <Button
                                                            mt={60}
                                                            mb={5}
                                                            size="lg"
                                                            variant="gradient"
                                                            gradient={{
                                                                from: 'orange',
                                                                to: 'pink',
                                                                deg: 35,
                                                            }}
                                                            onClick={() => {
                                                                router.push(
                                                                    '/review?step=8'
                                                                );
                                                            }}
                                                        >
                                                            Next
                                                        </Button>
                                                    </Center>
                                                </>
                                            )}
                                            {curStep == 8 && (
                                                <>
                                                    <SimpleGrid
                                                        cols={3}
                                                        breakpoints={[
                                                            {
                                                                maxWidth: 980,
                                                                cols: 3,
                                                                spacing: 'md',
                                                            },
                                                            {
                                                                maxWidth: 755,
                                                                cols: 1,
                                                                spacing: 'sm',
                                                            },
                                                        ]}
                                                    >
                                                        <Box>
                                                            <Title
                                                                sx={{
                                                                    fontSize: 26,
                                                                    fontWeight: 300,
                                                                    marginTop: 40,
                                                                    '@media (max-width: 755px)':
                                                                        {
                                                                            marginTop: 10,
                                                                        },
                                                                }}
                                                                align="center"
                                                            >
                                                                Pros
                                                            </Title>
                                                            {values.reviewInput
                                                                .flagInput.pros
                                                                .length == 0 ? (
                                                                <Center>
                                                                    <Text>
                                                                        Can't
                                                                        think of
                                                                        anything
                                                                        nice to
                                                                        say?
                                                                    </Text>
                                                                </Center>
                                                            ) : (
                                                                <SimpleGrid
                                                                    cols={1}
                                                                    spacing="sm"
                                                                >
                                                                    {values.reviewInput.flagInput.pros.map(
                                                                        (f) => {
                                                                            return (
                                                                                <Badge
                                                                                    key={
                                                                                        f
                                                                                    }
                                                                                    color={
                                                                                        'green'
                                                                                    }
                                                                                    variant={
                                                                                        'filled'
                                                                                    }
                                                                                    size={
                                                                                        'xl'
                                                                                    }
                                                                                    radius={
                                                                                        'sm'
                                                                                    }
                                                                                >
                                                                                    {f.replace(
                                                                                        '_',
                                                                                        ' '
                                                                                    )}
                                                                                </Badge>
                                                                            );
                                                                        }
                                                                    )}
                                                                </SimpleGrid>
                                                            )}
                                                        </Box>
                                                        <Box>
                                                            <Title
                                                                sx={{
                                                                    fontSize: 26,
                                                                    fontWeight: 300,
                                                                    marginTop: 40,
                                                                    '@media (max-width: 755px)':
                                                                        {
                                                                            marginTop: 10,
                                                                        },
                                                                }}
                                                                align="center"
                                                            >
                                                                Cons
                                                            </Title>
                                                            {values.reviewInput
                                                                .flagInput.cons
                                                                .length == 0 ? (
                                                                <Center>
                                                                    <Text>
                                                                        We're
                                                                        thrilled
                                                                        you had
                                                                        a great
                                                                        experience!
                                                                    </Text>
                                                                </Center>
                                                            ) : (
                                                                <SimpleGrid
                                                                    cols={1}
                                                                    spacing="sm"
                                                                >
                                                                    {values.reviewInput.flagInput.cons.map(
                                                                        (f) => {
                                                                            return (
                                                                                <Badge
                                                                                    key={
                                                                                        f
                                                                                    }
                                                                                    color={
                                                                                        'orange'
                                                                                    }
                                                                                    variant={
                                                                                        'filled'
                                                                                    }
                                                                                    size={
                                                                                        'xl'
                                                                                    }
                                                                                    radius={
                                                                                        'sm'
                                                                                    }
                                                                                >
                                                                                    {f.replace(
                                                                                        '_',
                                                                                        ' '
                                                                                    )}
                                                                                </Badge>
                                                                            );
                                                                        }
                                                                    )}
                                                                </SimpleGrid>
                                                            )}
                                                        </Box>
                                                        <Box>
                                                            <Title
                                                                sx={{
                                                                    fontSize: 26,
                                                                    fontWeight: 300,
                                                                    marginTop: 40,
                                                                    '@media (max-width: 755px)':
                                                                        {
                                                                            marginTop: 10,
                                                                        },
                                                                }}
                                                                align="center"
                                                            >
                                                                Dealbreakers
                                                            </Title>

                                                            {values.reviewInput
                                                                .flagInput.dbks
                                                                .length == 0 ? (
                                                                <Center>
                                                                    <Text>
                                                                        Lucky
                                                                        you.
                                                                    </Text>
                                                                </Center>
                                                            ) : (
                                                                <SimpleGrid
                                                                    cols={1}
                                                                    spacing="sm"
                                                                >
                                                                    {values.reviewInput.flagInput.dbks.map(
                                                                        (f) => {
                                                                            return (
                                                                                <Badge
                                                                                    key={
                                                                                        f
                                                                                    }
                                                                                    color={
                                                                                        'red'
                                                                                    }
                                                                                    variant={
                                                                                        'filled'
                                                                                    }
                                                                                    size={
                                                                                        'xl'
                                                                                    }
                                                                                    radius={
                                                                                        'sm'
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        f
                                                                                    }
                                                                                </Badge>
                                                                            );
                                                                        }
                                                                    )}
                                                                </SimpleGrid>
                                                            )}
                                                        </Box>
                                                    </SimpleGrid>
                                                    <Title
                                                        sx={{
                                                            fontSize: 26,
                                                            fontWeight: 300,
                                                            marginTop: 40,
                                                            '@media (max-width: 755px)':
                                                                {
                                                                    marginTop: 10,
                                                                },
                                                        }}
                                                        align="center"
                                                    >
                                                        Comments
                                                    </Title>
                                                    <Field
                                                        name={
                                                            'reviewInput.feedback'
                                                        }
                                                    >
                                                        {({
                                                            field,
                                                        }: FieldProps) => (
                                                            <Textarea
                                                                {...field}
                                                                mt={10}
                                                                placeholder="Don't worry! These are anonymous."
                                                                description="Does your review describe your experience living at this address? what else would you tell a person looking to rent here?"
                                                                radius="md"
                                                                size="md"
                                                                autosize
                                                                minRows={
                                                                    smallScreen
                                                                        ? 3
                                                                        : 6
                                                                }
                                                                maxRows={10}
                                                            />
                                                        )}
                                                    </Field>

                                                    <Center>
                                                        <Popover
                                                            radius="lg"
                                                            shadow="lg"
                                                            opened={
                                                                subErrDialog
                                                                    ? true
                                                                    : false
                                                            }
                                                            onClose={() => {
                                                                setSubErrDialog(
                                                                    null
                                                                );
                                                                console.log(
                                                                    'closed dialog'
                                                                );
                                                            }}
                                                            target={
                                                                <Button
                                                                    type={
                                                                        'submit'
                                                                    }
                                                                    mt={60}
                                                                    size="lg"
                                                                    variant="gradient"
                                                                    gradient={{
                                                                        from: 'teal',
                                                                        to: 'lime',
                                                                        deg: 35,
                                                                    }}
                                                                >
                                                                    Ready to
                                                                    Submit?
                                                                </Button>
                                                            }
                                                            width={260}
                                                            position="bottom"
                                                            withArrow
                                                        >
                                                            <Text
                                                                size="sm"
                                                                style={{
                                                                    marginBottom: 10,
                                                                }}
                                                                weight={500}
                                                                align="center"
                                                            >
                                                                {subErrDialog}
                                                            </Text>

                                                            <Center>
                                                                <Button
                                                                    onClick={() =>
                                                                        console.log(
                                                                            'clicked edit.'
                                                                        )
                                                                    }
                                                                >
                                                                    Edit
                                                                    Existing
                                                                    Review?
                                                                </Button>
                                                            </Center>
                                                        </Popover>
                                                    </Center>
                                                </>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </motion.div>
                            </AnimatePresence>
                        </Form>
                    );
                }}
            </Formik>
        </Container>
    );
}
