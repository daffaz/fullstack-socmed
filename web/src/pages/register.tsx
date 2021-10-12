import { Box, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React from "react";
import Wrapper from "../components/Wrapper";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  return (
    <Wrapper variant="small">
      <Box maxW="800px" w="100%" pt={8}>
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ values, handleChange }) => (
            <Form>
              <Field>
                {() => (
                  <FormControl>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Input
                      value={values.username}
                      onChange={handleChange}
                      id="username"
                      placeholder="username"
                    />
                    {/* <FormErrorMessage>err</FormErrorMessage> */}
                  </FormControl>
                )}
              </Field>
            </Form>
          )}
        </Formik>
      </Box>
    </Wrapper>
  );
};

export default Register;
