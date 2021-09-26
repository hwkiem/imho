import { Box, Button, Flex, Stack } from '@chakra-ui/react';
import { Formik, FormikFormProps, FormikProps } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
    LaundryType,
    StoveType,
    useWriteReviewMutation,
    WriteReviewInput,
} from '../../../generated/graphql';
import { FormLayout } from '../layout';
import { AddressForm } from './steps/address';
import { AmmenityForm } from './steps/ammenities';
import { NpsForm } from './steps/nps';
import { RentTermForm } from './steps/rent_lease';

const SubFormRouter: React.FC<FormikProps<WriteReviewInput>> = (props) => {
    const [step, setStep] = useState(0);

    return (
        <Stack>
            {step == 0 && <AddressForm {...props} />}
            {step == 1 && <RentTermForm {...props} />}
            {step == 2 && <AmmenityForm {...props} />}
            {step == 3 && <NpsForm {...props} />}
            {step == 4 && (
                <Box>
                    <pre>{JSON.stringify(props.values, undefined, 2)}</pre>
                </Box>
            )}
            {step != 4 && (
                <Button
                    onClick={() => {
                        setStep((val) => ++val);
                    }}
                >
                    Next
                </Button>
            )}
            {step == 4 && (
                <Button
                    onClick={() => {
                        props.submitForm();
                    }}
                >
                    Submit!
                </Button>
            )}
        </Stack>
    );
};

export const RetroForm: React.FC = () => {
    const defaultReview: WriteReviewInput = {
        google_place_id: '',
        unit: '0',
        air_conditioning: false,
        backyard: false,
        bath_count: 0,
        bedroom_count: 0,
        dishwasher: false,
        doorman: false,
        garbage_disposal: false,
        gym: false,
        heat: false,
        laundry: undefined,
        lease_term: undefined,
        parking: false,
        pet_friendly: false,
        pool: false,
        rating: 3,
        rent: 0,
        stove: undefined,
    };

    const [writeReview] = useWriteReviewMutation();
    const router = useRouter();

    return (
        <FormLayout>
            <Stack spacing={2}>
                <Formik
                    initialValues={defaultReview}
                    onSubmit={(values) => {
                        writeReview({ variables: { options: values } });
                        router.push('/diver');
                    }}
                >
                    {(props) => <SubFormRouter {...props} />}
                </Formik>
            </Stack>
        </FormLayout>
    );
};
