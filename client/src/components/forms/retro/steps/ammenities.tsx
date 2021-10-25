import {
    Box,
    Button,
    FormControl,
    FormLabel,
    GridItem,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    Stack,
    Switch,
    useDisclosure,
} from '@chakra-ui/react';
import {
    Field,
    Form,
    Formik,
    FormikContextType,
    FormikProps,
    FormikProvider,
} from 'formik';
import React, { useState } from 'react';
import {
    LaundryType,
    StoveType,
    WriteReviewInput,
} from '../../../../generated/graphql';

export const AmmenityForm: React.FC<FormikProps<WriteReviewInput>> = ({
    values,
    setFieldValue,
}) => {
    const { review_details } = values;

    const {
        bath_count,
        bedroom_count,
        heat,
        lease_term,
        rating,
        rent,
        ...ammenities
    } = review_details;

    const laundryDisclosure = useDisclosure();
    const stoveDisclosure = useDisclosure();

    return (
        <Stack align={'center'}>
            <Heading fontSize={'2xl'}>Tell us about your home!</Heading>
            <Box>
                <Form>
                    <SimpleGrid columns={3}>
                        {Object.entries(ammenities).map(([k, v]) => {
                            return (
                                <GridItem key={k}>
                                    <FormControl
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                    >
                                        <FormLabel htmlFor={k} mb="0">
                                            {k.replaceAll('_', ' ')}
                                        </FormLabel>
                                        <Switch
                                            id={k}
                                            onChange={() => {
                                                if (
                                                    k == 'laundry' &&
                                                    !values.review_details
                                                        .laundry
                                                ) {
                                                    laundryDisclosure.onOpen();
                                                } else if (k == 'stove' && !v)
                                                    stoveDisclosure.onOpen();
                                                else setFieldValue(k, !v);
                                            }}
                                        />
                                    </FormControl>
                                </GridItem>
                            );
                        })}
                    </SimpleGrid>
                    <Modal
                        isOpen={laundryDisclosure.isOpen}
                        onClose={laundryDisclosure.onClose}
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Laundry Type?</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Button
                                    onClick={() => {
                                        setFieldValue(
                                            'laundry',
                                            LaundryType.InUnit
                                        );
                                        laundryDisclosure.onClose();
                                    }}
                                >
                                    {LaundryType.InUnit}
                                </Button>
                                <Button
                                    onClick={() => {
                                        setFieldValue(
                                            'laundry',
                                            LaundryType.Building
                                        );
                                        laundryDisclosure.onClose();
                                    }}
                                >
                                    {LaundryType.Building}
                                </Button>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                    <Modal
                        isOpen={stoveDisclosure.isOpen}
                        onClose={stoveDisclosure.onClose}
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Stove Type?</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Button
                                    onClick={() => {
                                        setFieldValue(
                                            'stove',
                                            StoveType.Electric
                                        );
                                        stoveDisclosure.onClose();
                                    }}
                                >
                                    {StoveType.Electric}
                                </Button>
                                <Button
                                    onClick={() => {
                                        setFieldValue('stove', StoveType.Gas);
                                        stoveDisclosure.onClose();
                                    }}
                                >
                                    {StoveType.Gas}
                                </Button>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </Form>
            </Box>
        </Stack>
    );
};
