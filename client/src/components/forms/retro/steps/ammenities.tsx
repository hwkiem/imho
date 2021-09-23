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
import { StoveType, WriteReviewInput } from '../../../../generated/graphql';

export const AmmenityForm: React.FC<FormikProps<WriteReviewInput>> = ({
    values,
    setFieldValue,
}) => {
    const {
        google_place_id,
        bath_count,
        bedroom_count,
        heat,
        lease_term,
        rating,
        rent,
        recommend_score,
        ...ammenities
    } = values;

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
                                            {k}
                                        </FormLabel>
                                        <Switch
                                            id={k}
                                            onChange={() => {
                                                if (k == 'laundry')
                                                    laundryDisclosure.onOpen();
                                                else if (k == 'stove')
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
                            <ModalHeader>Laundy Type?</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Button>Some button</Button>
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    colorScheme="blue"
                                    mr={3}
                                    onClick={laundryDisclosure.onClose}
                                >
                                    Close
                                </Button>
                            </ModalFooter>
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
                                    }}
                                >
                                    {StoveType.Electric}
                                </Button>
                                <Button
                                    onClick={() => {
                                        setFieldValue('stove', StoveType.Gas);
                                    }}
                                >
                                    {StoveType.Gas}
                                </Button>
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    colorScheme="blue"
                                    mr={3}
                                    onClick={stoveDisclosure.onClose}
                                >
                                    Close
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Form>
            </Box>
        </Stack>
    );
};
