import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    VStack,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { SliderInput } from '../../../utils/sliderInput';
import { FormikProps } from 'formik';
import { WriteReviewInput } from '../../../../generated/graphql';
import { Picker } from '../../../utils/monthPicker';

const MonthBox: React.FC = () => {
    return <Box>{}</Box>;
};

export const RentTermForm: React.FC<FormikProps<WriteReviewInput>> = ({
    setFieldValue,
}) => {
    const [rent, setRent] = useState(1500);

    return (
        <Box>
            <VStack>
                <FormControl>
                    <FormLabel>Rent?</FormLabel>
                    <SliderInput
                        min={400}
                        max={6000}
                        step={100}
                        value={rent}
                        handleChange={(val) => {
                            setRent(val);
                            setFieldValue('rent', val);
                        }}
                    />
                    <FormHelperText>
                        Dont worry. We will not share this information with
                        anyone!
                    </FormHelperText>
                </FormControl>
                <FormControl>
                    <FormLabel>How long is this home?</FormLabel>
                    <Picker
                        onChange={(startDate: Date, endDate: Date) => {
                            setFieldValue('review_details.lease_term', {
                                start_date: startDate,
                                end_date: endDate,
                            });
                        }}
                    />
                </FormControl>
            </VStack>
        </Box>
    );
};
