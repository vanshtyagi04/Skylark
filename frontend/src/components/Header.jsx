import {
    Flex,
    useColorMode,
    Button,
    Box,
    Link,
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
import { FiLogOut } from "react-icons/fi";
import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast.js";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom.js";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import {BsFillChatQuoteFill} from "react-icons/bs"
import useLogout from "../hooks/useLogout.js";
import authScreenAtom from "../atoms/authAtom.js";



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
    const logout = useLogout()
    const setAuthScreen = useSetRecoilState(authScreenAtom)

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
        <Flex justifyContent={"space-between"} mt={6} mb={12}>
            {user && (
                <Flex alignItems={"center"} justifyContent={"center"} gap={4}>
                    <CiSearch size={26} cursor={"pointer"} onClick={onOpen} left={"10px"}/>
                    <Drawer placement="left" onClose={() => {
                        onClose();
                        setSearch({
                            name: ""
                        });
                        setSearchResult([]);
                    }} isOpen={isOpen}>
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
                                            <Avatar size="xs" name={user.username} src={user.profilePic} />
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
                    <Link as={RouterLink} to="/">
                        <AiFillHome size={26}/>
                    </Link>
                </Flex>
            )}

            {user && (
                    <Flex alignItems={"center"} gap={4}>
                    <Link as={RouterLink} to={`/${user.username}`}>
                        <RxAvatar size={26}/>
                    </Link>
                    <Link as={RouterLink} to={'/chat'}>
                        <BsFillChatQuoteFill size={20}/>
                    </Link>
                    {colorMode === "dark" ? <MdDarkMode size={24}  onClick={toggleColorMode} cursor={"pointer"} /> : <MdOutlineLightMode size={24}  onClick={toggleColorMode} cursor={"pointer"} />}
                    <Button size={"xs"} onClick={logout}>
                        <FiLogOut size={20}/>
                    </Button>
                    </Flex>
            )}

        </Flex>
    );
};

export default Header;