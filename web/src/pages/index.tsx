import { Box, useColorMode } from "@chakra-ui/react";
import React from "react";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import Navbar from "../components/Navbar";

const Index = () => {
  const { colorMode } = useColorMode();

  const bgColor = { light: "gray.50", dark: "gray.900" };

  const color = { light: "black", dark: "white" };
  return (
    <Box h="100vh" bg={bgColor[colorMode]} color={color[colorMode]}>
      <Navbar />
      <DarkModeSwitch />
      <div>Hello world</div>
    </Box>
  );
};
export default Index;
