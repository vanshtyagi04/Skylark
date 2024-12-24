import { Avatar } from "@chakra-ui/react";
import { Box, Flex, Link, Text, VStack, Button} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { FaCopy } from "react-icons/fa";
import userAtom from '../../atoms/userAtom.js'
import useShowToast from '../hooks/useShowToast.js';
import { useRecoilValue } from "recoil";
import { Link as RouterLink } from "react-router-dom"
import { useState } from 'react'
import { useEffect } from "react";

const UserHeader = ({user}) => {
    const toast = useToast();
    const currentUser = useRecoilValue(userAtom)
    const [following, setFollowing] = useState(user.followers.includes(currentUser?._id))
    const showToast = useShowToast()
    const [updating, setUpdating] = useState(false)

    const copyURL = () => {
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL).then(() => {
            toast({
                title: "Success.",
                status: "success",
                description: "Profile link copied.",
                duration: 3000,
                isClosable: true,
            });
        });
    };

    useEffect(() => {
        if (user && currentUser) {
            setFollowing(user.followers.includes(currentUser._id));
        }
    }, [user, currentUser]);

    const handleFollowUnfollow = async() => {
        if(!currentUser) {
            showToast("Error", "Please login to follow", "error")
            return
        }
        if(updating) return
        
        setUpdating(true)
        try {
            const res = await fetch(`/api/users/follow/${user._id}`, {
                method : "POST", 
                headers: {
                    "Content-Type" : "application/json",
                },
            })
            const data = await res.json()
            if(data.error) {
                showToast("Error", data.error, "error")
                return;
            }

            if(following) {
                showToast("Success", `Unfollowed ${user.name}`, "success")
                user.followers.pop()
            } else {
                showToast("Success", `Followed ${user.name}`, "success")
                user.followers.push(currentUser?._id)
            }
            setFollowing(!following)
        } catch (error) {
            showToast("Error", error, "error")
        } finally {
            setUpdating(false)
        }
    }

    return (
        <VStack gap={4} alignItems={"start"}>
            <Flex justifyContent={"space-between"} w={"full"}>
                <Box>
                    <Text fontSize={"2xl"} fontWeight={"bold"}>
                        {user.name}
                    </Text>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"sm"}>{user.username}</Text>
                    </Flex>
                </Box>
                <Box>
                    {user.profilePic && (
                        <Avatar
                        name={user.name}
                        src={user.profilePic}
                        size={{
                            base: "md",
                            md: "xl",
                        }}
                    />
                    )}
                    {!user.profilePic && (
                        <Avatar
                        name={user.name}
                        src="https://bit.ly/broken-link"
                        size={{
                            base: "md",
                            md: "xl",
                        }}
                    />
                    )}
                </Box>
            </Flex>

            <Text>{user.bio}</Text>
            
            {currentUser?._id === user._id && (
                <Link as={RouterLink} to="/update">
                    <Button size="sm">Update Profile</Button>
                </Link>
            )}
            {currentUser?._id !== user._id &&
                <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>{following ? "Unfollow" : "Follow"}</Button>
            }
            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"}>{user.followers.length} followers</Text>
                    <Box w='1' h='1' bg={"gray.light"} borderRadius={"full"}></Box>
                </Flex>
                <Flex>
                    <Box className="icon-container">
                        <Button onClick={copyURL}>
                            <FaCopy size={24} cursor={"pointer"}/>
                        </Button>
                    </Box>
                </Flex>
            </Flex>
            <Flex w={"full"}>
                <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb="3" cursor={"pointer"}>
                    <Text fontWeight={"bold"}> Posts</Text>
                </Flex>
                <Flex 
                    flex={1}
                    borderBottom={"1px solid gray"}
                    justifyContent={"center"}
                    color={"gray.light"}
                    pb="3"
                    cursor={"pointer"}>
                        <Text fontWeight={"bold"}> Replies</Text>
                    </Flex>
            </Flex>
        </VStack>
    );
};

export default UserHeader; 