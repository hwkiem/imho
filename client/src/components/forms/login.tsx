import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  Stack,
  useColorModeValue,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Form, Formik, Field, useFormik } from "formik";
import React from "react";
import {
  useLoginMutation,
  LoginMutationVariables,
} from "../../generated/graphql";
import { object, string, SchemaOf } from "yup";
import { loadGetInitialProps } from "next/dist/shared/lib/utils";
import { useRouter } from "next/router";

interface LoginFormProps {
  variant?: string;
}

export const LoginForm: React.FC<LoginFormProps> = () => {
  const router = useRouter();

  // Use the codegen login mutation and data state
  const [login, { loading, data, error }] = useLoginMutation();

  // Define validation schema for login form using Yup
  const validationSchema: SchemaOf<LoginMutationVariables> = object({
    email: string().email("Enter a valid email").required("Email is required"),
    password: string()
      .min(8, "Password should be of minimum 8 characters length")
      .required("Password is required"),
  });

  const init: LoginMutationVariables = {
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues: init,
    validationSchema: validationSchema,
    onSubmit: async (values, actions) => {
      actions.setSubmitting(true);
      login({ variables: values });
      while (loading); // wait for loading to finish
      if (data) {
        console.log(data);
        router.push("/");
      } else if (error) {
        console.error(error);
        router.push("/error");
      }
    },
  });

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool <Link color={"blue.400"}>features</Link> ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <form onSubmit={formik.handleSubmit}>
              <FormControl
                id="email"
                isRequired
                isInvalid={formik.touched.email && Boolean(formik.errors.email)}
              >
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              </FormControl>
              <FormControl
                id="password"
                isRequired
                isInvalid={
                  formik.touched.password && Boolean(formik.errors.password)
                }
              >
                <FormLabel>Password</FormLabel>
                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                <Input
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox>Remember me</Checkbox>
                  <Link color={"blue.400"} href={"/register"}>
                    Create Account
                  </Link>
                </Stack>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  type="submit"
                >
                  Sign in
                </Button>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};
