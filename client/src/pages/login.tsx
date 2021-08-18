import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useLoginMutation, MeDocument, MeQuery } from "../generated/graphql";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import { LoginForm } from "../components/forms/login";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      errors {
        field
        message
      }
      user {
        userId
        firstName
        lastName
      }
    }
  }
`;

const Login: React.FC = () => {
  return <LoginForm />;
};

export default Login;
