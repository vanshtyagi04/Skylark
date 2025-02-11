import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader.jsx";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast.js";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post.jsx";
import useGetUserProfile from "../hooks/useGetUserProfile.js";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom.js";
import { CiCamera } from "react-icons/ci";

const UserPage = () => {
    const { user, loading } = useGetUserProfile();
    const { username } = useParams()
    const showToast = useShowToast()
    const [posts, setPosts] = useRecoilState(postsAtom)
    const [fetchingPosts, setFetchingPosts] = useState(true);

    useEffect(() => {


        const getPosts = async () => {
            setFetchingPosts(true);
            try {
                const res = await fetch(`/api/posts/user/${username}`)
                const data = await res.json()
                setPosts(data)
            } catch (error) {
                showToast("Error", error.message, "error");
                setPosts([]);
            } finally {
                setFetchingPosts(false);
            }

        }

        getPosts();
    }, [username, showToast, setPosts])

    if (!user && loading) {
        return (
            <Flex justifyContent={"center"}>
                <Spinner size="xl" />
            </Flex>
        )
    }

    if (!user && !loading) return <Flex flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
        <CiCamera size={200} />
        <h1>User not found</h1>
    </Flex>

    return (
        <>
            <UserHeader user={user} />
            {!fetchingPosts && posts.length === 0 && <Flex flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                <CiCamera size={200} />
                <h1>No post yet...</h1>
            </Flex>}
            {fetchingPosts && (
                <Flex justifyContent={"center"} my={12}>
                    <Spinner size={"x1"} />
                </Flex>
            )
            }
            {posts.map((post) => (
                <Post key={post._id} post={post} postedBy={post.postedBy} />
            ))}
        </>
    )
};

export default UserPage;