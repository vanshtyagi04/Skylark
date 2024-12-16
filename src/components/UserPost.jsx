import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from './Actions'
import { useState } from 'react'

const UserPost = ({postImg, postTitle, likes, replies}) => {
    const [liked, setLiked] = useState(false)
  return (
    <Link to = {"/markzuckerburg/post/1"}>
        <Flex gap={3} mb={4} py={5}>
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Avatar size="md" name="Mark Zuckerberg" src="/zuck-avatar.png" />
                <Box w="1px" h={"full"} bg="gray.500" my={2}></Box>
                <Box position={"relative"} w={"full"}>
                    <Avatar 
                    size="xs"
                    name="John Doe"
                    src="https://bit.ly/dan-abramov"
                    position={"absolute"}
                    top={"0px"}
                    left="15px"
                    padding={"2px"}
                    />
                    <Avatar 
                    size="xs"
                    name="John Doe"
                    src="https://bit.ly/dan-abramov"
                    position={"absolute"}
                    bottom={"0px"}
                    right="-5px"
                    padding={"2px"}
                    />
                    <Avatar 
                    size="xs"
                    name="John Doe"
                    src="https://bit.ly/dan-abramov"
                    position={"absolute"}
                    bottom={"0px"}
                    left="4px"
                    padding={"2px"}
                    />
                </Box>
            </Flex>
            <Flex flex={1} flexDirection={"column"} gap={2}>
                <Flex justifyContent={"space-between"} w={"full"}>
                    <Flex w={"full"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"bold"}>
                            markzuckerburg
                        </Text>
                        <Image src='/verified.png' w={4} h={4} ml={1}/>
                    </Flex>
                    <Flex gap={4} alignItems={"center"}>
                        <Text fontStyle={"sm"} color={"gray.500"}>
                            1d
                        </Text>
                        <BsThreeDots />
                    </Flex>
                </Flex>

                <Text fontSize={"sm"}>{postTitle}</Text>
                {postImg &&
                    (<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.500"}>
                        <Image src={postImg} w={"full"}/>
                    </Box>)
                }

                <Flex gap={3} my={1}>
                    <Actions liked={liked} setLiked={setLiked}/>
                </Flex>

                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.500"} fontSize={"sm"}>{replies} replies</Text>
                    <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.500"}></Box>
                    <Text color={"gray.500"} fontSize={"sm"}>{likes} likes</Text>
                </Flex>
            </Flex>
        </Flex>
    </Link>
  )
}

export default UserPost
