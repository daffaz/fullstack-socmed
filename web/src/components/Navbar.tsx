import { Box, Flex, Link, Spacer, useColorMode } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  const { colorMode } = useColorMode();
  const bgColor = { light: "blue.500", dark: "purple.600" };

  let body;

  if (fetching) {
    body = null;
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = <Box>{data.me.username}</Box>;
  }

  return (
    <Flex bg={bgColor[colorMode]} p={4}>
      <Spacer />
      <Box color="white">{body}</Box>
    </Flex>
  );
};

export default Navbar;
