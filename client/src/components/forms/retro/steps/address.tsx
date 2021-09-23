import { Box, Button, Flex, Heading, Stack } from '@chakra-ui/react';
import { FormikProps } from 'formik';
import { useState } from 'react';
import { WriteReviewInput } from '../../../../generated/graphql';
import { Map } from '../../../maps/map';

export const AddressForm: React.FC<FormikProps<WriteReviewInput>> = ({
    setFieldValue,
}) => {
    return (
        <Stack align={'center'}>
            <Heading fontSize={'2xl'}>Where do you call home?</Heading>
            <Box h={'300px'} w={'800px'}>
                <Map
                    withSearchBar
                    valueHook={async (place) => {
                        if (place.place_id)
                            setFieldValue('google_place_id', place.place_id);
                    }}
                    variant="small"
                    searchTypes={['address']}
                />
            </Box>
        </Stack>
    );
};
