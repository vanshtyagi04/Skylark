import { Avatar, Text, Flex } from "@chakra-ui/react";

const Message = ({ownMessage}) => {
    return(
       <>
       {ownMessage ? (
        <Flex 
        gap={2}
        alignSelf={"flex-end"}
        >
            <Text maxW={"350px"} bg={"blue.400"} p={1} borderRadius={"md"}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Non laboriosam tenetur distinctio? Blanditiis, nesciunt dolores deleniti perspiciatis tempore sequi asperiores.
            </Text>
            <Avatar src="" w="?" h={7} />
        </Flex>
       ) : (<Flex 
        gap={2}
        >
            <Avatar src="" w="?" h={7} />
            <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Non laboriosam tenetur distinctio? Blanditiis, nesciunt dolores deleniti perspiciatis tempore sequi asperiores.
            </Text>
        </Flex>)}
       </>
    )
}

export default Message;