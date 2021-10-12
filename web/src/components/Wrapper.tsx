import { Box, useColorMode } from "@chakra-ui/react";
import React from "react";

interface WrapperProps {
  variant?: "regular" | "small";
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = "regular" }) => {
  const { colorMode } = useColorMode();
  const bgColor = { light: "gray.50", dark: "gray.900" };
  const color = { light: "black", dark: "white" };

  return (
    <Box
      h="100vh"
      w="100%"
      bg={bgColor[colorMode]}
      color={color[colorMode]}
      display="flex"
      flexDir="column"
      alignItems="center"
      px={variant === "regular" ? "300px" : "550px"}
    >
      {children}
    </Box>
  );
};

export default Wrapper;
