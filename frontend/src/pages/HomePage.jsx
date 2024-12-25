import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast.js";
import Post from "../components/Post.jsx";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom.js";
import { CiCamera } from "react-icons/ci";

const HomePage = () => {
    const [posts, setPosts] = useRecoilState(postsAtom)
    const [loading, setLoading] = useState(true)
    const showToast = useShowToast()
    useEffect(() => {
        const getFeedPosts = async() => {
            setLoading(true)
            setPosts([])
            try {
                const res = await fetch("/api/posts/feed")
                const data = await res.json()
                if(data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setPosts(data)
            } catch(error) {
                showToast("Error", error.message, "error")
            } finally {
                setLoading(false)
            }
        }
        getFeedPosts()
    }, [showToast, setPosts])
    return (
            <Flex justifyContent={"center"} alignItems={"center"}>
                <Box >
                    {!loading && posts.length === 0 && <Flex flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                        <CiCamera size={200}/>
                        <h1>Follow users to see their posts ...</h1>
                        </Flex>}

                    {loading && (
                        <Flex justify="center">
                            <Spinner size="xl" />
                        </Flex>
                    )}

                    {posts.map((post) => (
                            <Post key={post._id} post={post} postedBy={post.postedBy} />
                    ))}
                </Box>
            </Flex>
            
        
    )
};

export default HomePage;