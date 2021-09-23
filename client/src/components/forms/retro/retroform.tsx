import { Box, Button, Flex, Stack } from '@chakra-ui/react';
import { Formik, FormikFormProps, FormikProps } from 'formik';
import { useState } from 'react';
import {
    LaundryType,
    StoveType,
    WriteReviewInput,
} from '../../../generated/graphql';
import { FormLayout } from '../layout';
import { AddressForm } from './steps/address';
import { AmmenityForm } from './steps/ammenities';
import { DealbreakerForm } from './steps/dealbreakers';

const SubFormRouter: React.FC<FormikProps<WriteReviewInput>> = (props) => {
    const [step, setStep] = useState(0);

    return (
        <Stack>
            {step == 0 && <AddressForm {...props} />}
            {step == 1 && <AmmenityForm {...props} />}
            <Button
                onClick={() => {
                    setStep((val) => ++val);
                }}
            >
                Next
            </Button>
        </Stack>
    );
};

export const RetroForm: React.FC = () => {
    const defaultReview: WriteReviewInput = {
        google_place_id: '',
        air_conditioning: false,
        backyard: false,
        bath_count: 0,
        bedroom_count: 0,
        dishwasher: false,
        doorman: false,
        garbage_disposal: false,
        gym: false,
        heat: false,
        laundry: LaundryType.None,
        lease_term: undefined,
        parking: false,
        pet_friendly: false,
        pool: false,
        rating: 3,
        recommend_score: 3,
        rent: 0,
        stove: undefined,
    };

    return (
        <FormLayout>
            <Stack spacing={2}>
                <Formik
                    initialValues={defaultReview}
                    onSubmit={() => {
                        console.log('submitting');
                    }}
                >
                    {(props) => <SubFormRouter {...props} />}
                </Formik>
            </Stack>
        </FormLayout>
    );
};
