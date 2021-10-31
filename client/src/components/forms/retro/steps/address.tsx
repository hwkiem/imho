import {
    Box,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Stack,
    useRadio,
    useRadioGroup,
    UseRadioProps,
    VStack,
} from '@chakra-ui/react';
import { FormikProps } from 'formik';
import { ChangeEvent, useState } from 'react';
import { WriteReviewInput } from '../../../../generated/graphql';
import { Map } from '../../../maps/map';

interface RadioButtonProps extends UseRadioProps {
    children: React.ReactNode;
}

const RadioButton: React.FC<RadioButtonProps> = (props: RadioButtonProps) => {
    const { getInputProps, getCheckboxProps } = useRadio(props);

    const input = getInputProps();
    const checkbox = getCheckboxProps();

    return (
        <Box as="label">
            <input {...input} />
            <Box
                {...checkbox}
                cursor="pointer"
                borderWidth="1px"
                borderRadius="md"
                boxShadow="md"
                _checked={{
                    bg: 'teal.600',
                    color: 'white',
                    borderColor: 'teal.600',
                }}
                _focus={{
                    boxShadow: 'outline',
                }}
                px={5}
                py={3}
            >
                {props.children}
            </Box>
        </Box>
    );
};

interface LocationTypeSelectProps {
    onChange: (val: string) => void;
}

const LocationTypeSelect: React.FC<LocationTypeSelectProps> = ({
    onChange,
}: LocationTypeSelectProps) => {
    const options = ['house', 'multi-unit'];
    const [showUnit, setShowUnit] = useState(false);
    const [unit, setUnit] = useState('0');
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value;
        onChange(val);
        setUnit(val);
    };
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'loctype',
        defaultValue: 'house',
        onChange: (val) => {
            setShowUnit((cur) => !cur);
            if (val == 'house') onChange('0');
            else onChange(unit);
        },
    });

    const group = getRootProps();

    return (
        <VStack spacing={'2'}>
            <HStack {...group} spacing={4}>
                {options.map((value) => {
                    const radio = getRadioProps({ value });
                    return (
                        <RadioButton key={value} {...radio}>
                            {value}
                        </RadioButton>
                    );
                })}
            </HStack>
            {showUnit && (
                <FormControl>
                    <FormLabel>Apartment</FormLabel>
                    <Input
                        placeholder={'Which unit?'}
                        value={unit}
                        onChange={handleChange}
                    />
                </FormControl>
            )}
        </VStack>
    );
};

export const AddressForm: React.FC<FormikProps<WriteReviewInput>> = ({
    setFieldValue,
}: FormikProps<WriteReviewInput>) => {
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
            <LocationTypeSelect
                onChange={(val: string) => {
                    setFieldValue('unit', val);
                }}
            />
        </Stack>
    );
};
