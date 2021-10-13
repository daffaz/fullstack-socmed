import { Box, Button } from "@chakra-ui/react";
import { OperationResult } from "@urql/core";
import { Form, Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { toErrorMap } from "../../utils/toErrorMap";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { LoginMutation, useLoginMutation } from "../generated/graphql";

const Login: React.FC<{}> = ({}) => {
  const [, login] = useLoginMutation();
  const router = useRouter();
  return (
    <Wrapper variant="small">
      <Box maxW="800px" w="100%" pt={8}>
        <DarkModeSwitch />
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response: OperationResult<LoginMutation> = await login({
              username: values.username,
              password: values.password,
            });
            if (response.data?.login.errors) {
              setErrors(toErrorMap(response.data.login.errors));
            } else if (response.data?.login.user) {
              router.push("/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="username"
                placeholder="username"
                label="Username"
              />
              <Box pt={5}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
              </Box>
              <Box pt={5}>
                <Button
                  type="submit"
                  colorScheme="teal"
                  isLoading={isSubmitting}
                >
                  Login
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Wrapper>
  );
};

export default Login;
