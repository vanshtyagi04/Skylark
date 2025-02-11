import userAtom from "../atoms/userAtom";
import { useSetRecoilState } from "recoil";
import useShowToast from "./useShowToast";
import { useNavigate } from "react-router-dom";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import authScreenAtom from "../atoms/authAtom";

const useLogout = () => {
	const setUser = useSetRecoilState(userAtom);
	const setSelectedConversation = useSetRecoilState(selectedConversationAtom);
	const setConversations = useSetRecoilState(conversationsAtom);
	const setLogin = useSetRecoilState(authScreenAtom);
	const showToast = useShowToast();
	const navigate = useNavigate();

	const logout = async () => {
		try {
			const res = await fetch("/api/users/logout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
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
			navigate("/auth");

		} catch (error) {
			showToast("Error", error, "error");
		}
	};

	return logout;
};

export default useLogout;