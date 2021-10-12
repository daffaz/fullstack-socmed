import { Box } from "@chakra-ui/react";
import React from "react";

interface WrapperProps {
  variant?: "regular" | "small";
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = "regular" }) => {
  return (
    <Box
      w="100%"
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
