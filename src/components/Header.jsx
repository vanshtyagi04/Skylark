import { Flex , Image , useColorMode, Button } from "@chakra-ui/react";
import { MdOutlineLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";

const Header = () => {
    const {colorMode , toggleColorMode}= useColorMode();
    return (
        <Flex justifyContent={"flex-end"} mt={6} mb={12}>
            <Button onClick={toggleColorMode} cursor = {"pointer"}>
            {colorMode === "dark" && <MdDarkMode size={24} />}
            {colorMode === "light" && <MdOutlineLightMode size={24} />}
            </Button>
        </Flex>
    )
};

export default Header;
