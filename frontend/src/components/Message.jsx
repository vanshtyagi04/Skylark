import { Avatar, Text, Flex } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom.js";
import userAtom from "../atoms/userAtom.js";

const Message = ({ownMessage, message}) => {
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const user = useRecoilValue(userAtom);
    return(
       <>
       {ownMessage ? (
        <Flex 
        gap={2}
        alignSelf={"flex-end"}
        >
            <Text maxW={"350px"} bg={"blue.400"} p={1} borderRadius={"md"}>
                {message.text}
            </Text>
            <Avatar src={user.profilePic} w={7} h={7}  name={user.username}/>
        </Flex>
       ) : (<Flex 
        gap={2}
        >
            <Avatar src={user.profilePic} w={7} h={7}  name={user.username}/>
            <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"}>
                {message.text}
            </Text>
        </Flex>)}
       </>
    )
}

export default Message;