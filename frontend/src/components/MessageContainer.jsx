import { useColorModeValue, Flex, Text, Image, Divider, SkeletonCircle, Skeleton } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import Message from "./Message.jsx";
import MessageInput from "./MessageInput.jsx";
import { useEffect } from "react";
import useShowToast from "../hooks/useShowToast.js";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom.js";
import { useState } from "react";
import userAtom from "../atoms/userAtom.js";

const MessageContainer = () => {
    const showToast = useShowToast();
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const [loadingMessages ,setLoadingMessages] = useState(true);
    const [messages , setMessages] = useState([]);
    const currentUser = useRecoilValue(userAtom);

    useEffect(() => {
        const getMessages = async () => {
            setLoadingMessages(true);
            setMessages([]);
            try{
                if(selectedConversation.mock) return;
                const res = await fetch(`/api/messages/${selectedConversation.userId}`)
                const data = await res.json();
                if(data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setMessages(data);
            } catch(error) {
                showToast("Error" , error.message, "error");
            } finally{
                setLoadingMessages(false);
            }
        };

        getMessages();
    },[showToast,selectedConversation.userId])

    return(
        <Flex flex="70"
        bg={useColorModeValue("gray.200", "gray.700")}
        p={2}
        borderRadius={"md"}
        flexDirection={"column"}>
            <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
                <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
                <Text display={"flex"} alignItems={"center"}>
                    {selectedConversation.username} 
                </Text>
            </Flex>
            <Divider/>

            <Flex flexDir={"column"} gap={4} my={4} p={2}
            height={"400px"} overflowY={"auto"}>
                {loadingMessages && (
                    [...Array(5)].map((_,i) => (
                        <Flex key={i}
                            gap={2}
                            alignItems={"center"}
                            p={1}
                            borderRadius={"md"}
                            alignSelf={i%2 === 0 ? "flex-start" : "flex-end"}
                        >
                            {i % 2 === 0 && <SkeletonCircle size={7} />}
                            <Flex flexDirection={"column"} gap={2}>
                                <Skeleton h="8px" w="250px" />
                                <Skeleton h="8px" w="250px" />
                                <Skeleton h="8px" w="250px" />
                            </Flex>
                            {i % 2 !== 0 && <SkeletonCircle size={7} />}
                        </Flex>
                    ))
                )}

                {!loadingMessages && (
                    messages.map((message) => (
                        <Message key={message._id} message={message} ownMessage={currentUser._id === message.sender}/>
                    ))
                )}
                
            </Flex>
            <MessageInput setMessages={setMessages}/>
        </Flex>
    )
}

export default MessageContainer;