import { useColorMode, Switch } from "@chakra-ui/react";

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark: boolean = colorMode === "dark";
  return (
    <Switch
      position="fixed"
      top="4rem"
      right="1rem"
      color="green"
      isChecked={isDark}
      onChange={toggleColorMode}
    />
  );
};
