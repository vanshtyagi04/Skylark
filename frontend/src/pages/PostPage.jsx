import {Avatar,Flex,Image, Text,Box,Divider,Button, Spinner} from '@chakra-ui/react';
import Actions from '../components/Actions.jsx';
import { useEffect } from 'react';
import Comment from '../components/Comment.jsx';
import useGetUserProfile from '../hooks/useGetUserProfile.js';
import useShowToast from '../hooks/useShowToast.js';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import userAtom from '../atoms/userAtom.js';
import { DeleteIcon } from '@chakra-ui/icons';
import { useRecoilState, useRecoilValue } from 'recoil';
import postsAtom from '../atoms/postsAtom.js';


const PostPage = () => {
    const {user,loading} = useGetUserProfile();
    const [posts,setPosts] = useRecoilState(postsAtom);
    const showToast = useShowToast();
    const {pid} = useParams();
    const currentUser = useRecoilValue(userAtom);
    const navigate = useNavigate();
    const currentPost = posts[0]
    useEffect(()=> {
        const getPost = async()=>{
            setPosts([])
            try {
                const res = await fetch(`/api/posts/${pid}`);
                const data = await res.json();
                if(data.error){
                    showToast("Error",data.error,"error");
                    return ;
                }
                setPosts([data])
            } catch (error) {
                showToast("Error", error.message, "error");
            }
        }
        getPost();
    }, [showToast,pid, setPosts]);

    const handleDeletePost = async()=>{
        try {
            if(!window.confirm("Are you sure you want to delete this post?")) return ;
            const res = await fetch(`/api/posts/${currentPost._id}`,{
                method: "DELETE",
            });
                const data = await res.json();
                if(data.error){
                    showToast("Error",data.error,"error");
                    return ;
                }
                showToast("Success","Post deleted","success");
                navigate(`/${user.username}`);
            
        } catch (error) {
            showToast("Error",error.message,"error");
        }
    }
    if(!user && loading){
        return(
            <Flex justifyContent={"center"}>
                <Spinner size={"xl"} />
            </Flex>
    )
    }

    if(!currentPost) return null;
    return <>
        <Flex>
            <Flex w={"full"} alignItems={"center"} gap={3} >
                <Avatar src={user.profilePic} size={"md"} name={user.username}/>
                <Flex>
                    <Text fontSize={"sm"} fontWeight={"bold"}>
                        {user.username}
                    </Text>
                </Flex>
            </Flex>
            <Flex gap={4} alignItems={"center"}>
                                    <Text fontSize={"sm"} width={36} textAlign={"right"} color={"gray.500"}>
                                        {formatDistanceToNow(new Date(currentPost.createdAt))} ago
                                    </Text>
            
                                    {currentUser?._id === user._id && (
                                        <DeleteIcon size={20}
                                            cursor={"pointer"}
                                        onClick={handleDeletePost} />
                                    )}
                                </Flex>
        </Flex>
        <Text my={3}>{currentPost.text}.</Text>

        {currentPost.img && (
            <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.500"}>
            <Image src={currentPost.img} w={"full"}/>
        </Box>
        )}
        <Flex gap={3} my={3}>
            <Actions post={currentPost} />
        </Flex>

        
        <Divider my={4}/>

        {currentPost.replies.map((reply) =>(
          <Comment 
            key={reply._id}
            reply={reply}
            lastReply= {reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
          />
        ))}
         
        
        
    </>;
    
};

export default PostPage;