import { Button } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import authScreenAtom from "../../atoms/authAtom";

const LogoutButton = () => {
    const setUser = useSetRecoilState(userAtom);
    const setLogin = useSetRecoilState(authScreenAtom);
    const showToast = useShowToast();
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
            setLogin("login");
        }
        catch(error) {
            showToast("Error",error, "error");
        }
    }
    return(
        <Button position={"fixed"} top={"30px"} right={"30px"} size={"sm"} onClick={handleLogout}>
            Logout
        </Button>
    )
}

export default LogoutButton;