import {
    Flex,
    useColorMode,
    Button,
    Box,
    Input,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Avatar,
    Text,
} from "@chakra-ui/react";
import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";

const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [search, setSearch] = useState({
        name: ""
    });
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();
    const user = useRecoilValue(userAtom);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!search.name.trim()) {
            showToast("Error", "Please enter something in search", "warning");
            return;
        }
        try {
            setLoading(true);
            const res = await fetch("/api/users/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(search),
            })
            const data = await res.json();
            if(data.err){
                showToast("Error","No user found", "error");
                return;
            }
            setSearchResult(data)
        } catch (error){
            showToast("Error","Unable to  fetch data", "Error")
        } finally{
            setLoading(false);
        }
    }

    return (
        <Flex justifyContent={"flex-start"} mt={6} mb={12}>
            {user && (
                <Box>
                    <Button cursor={"pointer"} onClick={onOpen}>
                        <CiSearch size={24} />
                    </Button>
                    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                        <DrawerOverlay />
                        <DrawerContent>
                            <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                            <DrawerBody>
                                <Box display="flex" pb={2}>
                                    <Input
                                        placeholder="Search by username"
                                        mr={2}
                                        value={search.name}
                                        onChange={(e) => setSearch({name: e.target.value})}
                                    />
                                    <Button onClick={handleSearch} isLoading={loading}>
                                        Go
                                    </Button>
                                </Box>
                                {searchResult?.map((user) => (
                                    <Button
                                        key={user.username}
                                        w={"full"}
                                        cursor={"pointer"}
                                        onClick={() => navigate(`/${user.username}`)}
                                        mb="10px"
                                        alignContent={"left"}
                                    >
                                        <Flex alignItems={"left"} justifyContent={"space-between"}>
                                            <Avatar size="xs" name={user.name} src={user.profilePic} />
                                            <Text ml= "5px"
                                            mt = "2px">
                                                {user.username}
                                            </Text>
                                         </Flex>
                                    </Button>
                                ))}
                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>
                </Box>
            )}
            <Button ml = "20px" aria-label="Toggle color mode" onClick={toggleColorMode} cursor={"pointer"}>
                {colorMode === "dark" ? <MdDarkMode size={24} /> : <MdOutlineLightMode size={24} />}
            </Button>
        </Flex>
    );
};

export default Header;