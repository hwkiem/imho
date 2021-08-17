import { Formik, Form } from "formik";
import {
  useWriteReviewMutation,
  WriteReviewInput,
} from "../../generated/graphql";
import {
  Box,
  FormControl,
  HStack,
  CheckboxGroup,
  chakra,
  Icon,
} from "@chakra-ui/react";
import React from "react";
import { SliderInput } from "../utils/sliderInput";
import { RiMoneyDollarCircleFill, RiStarSmileFill } from "react-icons/ri";

interface ReviewFormProps {
  variant?: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({}) => {
  const [writeReview] = useWriteReviewMutation();

  const initialValues: WriteReviewInput = {
    rating: 0,
    rent: 0,
    res_id: 0,
  };

  const [rating, setRating] = React.useState(3);
  const [rent, setRent] = React.useState(2000);

  return (
    <Box>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          writeReview({ variables: { options: values } });
        }}
      >
        <Form>
          <FormControl as="fieldset">
            <Box>
              <SliderInput
                defaultValue={3}
                precision={1}
                step={0.5}
                min={0}
                max={5}
                value={rating}
                handleChange={setRating}
              >
                <Icon as={chakra(RiStarSmileFill)} w={6} h={6} color={"teal"} />
              </SliderInput>
            </Box>
            <Box>
              <SliderInput
                defaultValue={2000}
                precision={0}
                step={100}
                min={0}
                max={50000}
                value={rent}
                handleChange={setRent}
              >
                <Icon
                  as={chakra(RiMoneyDollarCircleFill)}
                  w={6}
                  h={6}
                  color={"teal"}
                />
              </SliderInput>
            </Box>
          </FormControl>
        </Form>
      </Formik>
    </Box>
  );
};
