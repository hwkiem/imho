import { Box, FormControl, FormHelperText, FormLabel } from '@chakra-ui/react';
import { FormikProps } from 'formik';
import { useState } from 'react';
import { WriteReviewInput } from '../../../../generated/graphql';
import { SliderInput } from '../../../utils/sliderInput';

export const NpsForm: React.FC<FormikProps<WriteReviewInput>> = ({
    setFieldValue,
}: FormikProps<WriteReviewInput>) => {
    const [rating, setRating] = useState(3);
    return (
        <Box>
            <FormControl>
                <FormLabel>
                    Would you recommend this place to a friend?
                </FormLabel>
                <SliderInput
                    value={rating}
                    max={5}
                    min={0}
                    step={1}
                    handleChange={(val) => {
                        setRating(val);
                        setFieldValue('review_details.rating', val);
                    }}
                />
                <FormHelperText>
                    0 meaning not at all, 5 meaning certainly!
                </FormHelperText>
            </FormControl>
        </Box>
    );
};
