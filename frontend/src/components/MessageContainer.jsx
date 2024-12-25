import { useColorModeValue, Flex, Text, Image, Divider, SkeletonCircle, Skeleton } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import Message from "./Message.jsx";
import MessageInput from "./MessageInput.jsx";
import { useEffect } from "react";
import useShowToast from "../hooks/useShowToast.js";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom.js";
import { useState, useRef } from "react";
import userAtom from "../atoms/userAtom.js";
import { useSocket } from "../context/SocketContext.jsx";

const MessageContainer = () => {
    const showToast = useShowToast();
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const [loadingMessages ,setLoadingMessages] = useState(true);
    const [messages , setMessages] = useState([]);
    const currentUser = useRecoilValue(userAtom);
    const {socket} = useSocket()
    const setConversations = useSetRecoilState(conversationsAtom)
    const messageEndRef = useRef(null)

    useEffect(() => {
        socket.on("newMessage", (message) => {
            if(selectedConversation._id === message.conversationId) {
                setMessages((prevMessages) => [...prevMessages, message])
            }

            setConversations((prev) => {
                const updatedConversations = prev.map(conversation => {
                    if(conversation._id === message.conversationId) {
                        return {
                            ...conversation, 
                            lastMessage: {
                                text: message.text, 
                                sender: message.sender
                            }
                        }
                    }
                    return conversation
                })
                return updatedConversations
            })
        })

        return () => socket.off("newMessage")
    }, [socket])

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

    useEffect(() => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		const getMessages = async () => {
			setLoadingMessages(true);
			setMessages([]);
			try {
				if (selectedConversation.mock) return;
				const res = await fetch(`/api/messages/${selectedConversation.userId}`);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setMessages(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoadingMessages(false);
			}
		};

		getMessages();
	}, [showToast, selectedConversation.userId, selectedConversation.mock]);

    return(
        <Flex flex="70"
        bg={useColorModeValue("gray.200", "gray.700")}
        p={2}
        borderRadius={"md"}
        flexDirection={"column"}>
            <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
                <Avatar src={selectedConversation.userProfilePic} size={"sm"}  name={selectedConversation.username}/>
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
                        <Flex key={message._id} direction={"column"}
                        ref={messages.length -1 === messages.indexOf(message) ? messageEndRef : null}>
                            <Message key={message._id} message={message} ownMessage={currentUser._id === message.sender}/>
                        </Flex>
                    ))
                )}
                
            </Flex>
            <MessageInput setMessages={setMessages}/>
        </Flex>
    )
}

export default MessageContainer;