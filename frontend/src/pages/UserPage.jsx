import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
    return (
        <div>
            <UserHeader/>
            <UserPost likes={1200} replies={401} postImg="/post1.png" postTitle="Let's talk about Skylark."/>
            <UserPost likes={1200} replies={401} postImg="/post1.png" postTitle="Let's talk about Skylark."/>
            <UserPost likes={1200} replies={401} postImg="/post1.png" postTitle="Let's talk about Skylark."/>
        </div>
    )
};

export default UserPage;