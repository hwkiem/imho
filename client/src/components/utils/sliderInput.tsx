import {
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Icon,
} from "@chakra-ui/react";
import React from "react";

interface SliderInputProps extends NumberInputProps {
  handleChange: (val: number) => void;
}

export const SliderInput: React.FC<SliderInputProps> = (props) => {
  return (
    <Flex>
      <NumberInput
        maxW="100px"
        mr="2rem"
        value={props.value}
        onChange={(str, num) => {
          props.handleChange(num);
        }}
        defaultValue={props.defaultValue}
        min={props.min}
        max={props.max}
        precision={props.precision}
        step={props.step}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Slider
        flex="1"
        defaultValue={props.defaultValue as number}
        min={props.min}
        max={props.max}
        precision={props.precision}
        step={props.step}
        focusThumbOnChange={false}
        value={props.value as number}
        onChange={props.handleChange}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb fontSize="sm" boxSize="32px" children={props.children} />
      </Slider>
    </Flex>
  );
};
