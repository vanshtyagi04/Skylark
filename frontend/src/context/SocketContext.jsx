import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketContextProvider");
    }
    return context;
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const user = useRecoilValue(userAtom);

    useEffect(() => {
        if (user?._id) {
            const socketInstance = io("http://localhost:5000", {
                query: { userId: user._id },
            });
            setSocket(socketInstance);

            socketInstance.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            return () => socketInstance && socketInstance.close();
        } else {
            setSocket(null); 
        }
    }, [user?._id]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
