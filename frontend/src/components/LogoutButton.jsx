import { Button } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import authScreenAtom from "../../atoms/authAtom";
import { FiLogOut } from "react-icons/fi"
import { useNavigate } from "react-router-dom";
import { conversationsAtom, selectedConversationAtom } from "../../atoms/messagesAtom";

const LogoutButton = () => {
    const setUser = useSetRecoilState(userAtom);
    const setSelectedConversation = useSetRecoilState(selectedConversationAtom);
    const setConversations = useSetRecoilState(conversationsAtom);
    const setLogin = useSetRecoilState(authScreenAtom);
    const showToast = useShowToast();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try{
            const res = await fetch("/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const data = await res.json();
            console.log(data);
            if(data.error){
                showToast("Error",data.error, "error");
                return;
            }
            localStorage.removeItem("user-info");
            setUser(null);
            setConversations([]);
            setSelectedConversation({
                _id: "",
                userId: "",
                username: "",
                userProfilePic: "",
            })
            setLogin("login");
            showToast("Success", "Logged out successfully", "success")
            navigate("/auth")
        }
        catch(error) {
            showToast("Error",error, "error");
        }
    }
    return(
        <Button position={"fixed"} top={"30px"} right={"30px"} size={"sm"} onClick={handleLogout}>
            <FiLogOut size={20}/>
        </Button>
    )
}

export default LogoutButton;