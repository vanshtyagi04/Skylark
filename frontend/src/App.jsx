import { Container, Box } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import userAtom from "../atoms/userAtom.js";
import UserPage from "./pages/UserPage.jsx";
import PostPage from "./pages/PostPage.jsx";
import Header from "./components/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import LogoutButton from "./components/LogoutButton.jsx";
import UpdateProfilePage from "./pages/UpdateProfilePage.jsx";
import CreatePost from "./components/CreatePost.jsx";
import ChatPage from "./pages/ChatPage.jsx";

function App() {
  const user = useRecoilValue(userAtom);

  return (
    <Box position="relative" w="full">
      <Container maxW="620px">
        <Header />
        <Routes>
          <Route
            path="/update"
            element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          />
          <Route path="/:username" element={<UserPage />} />
          <Route path="/:username/post/:pid" element={<PostPage />} />
          <Route
            path="/chat"
            element={user ? <ChatPage /> : <Navigate to="/auth" />}
          />
        </Routes>
        {user && <LogoutButton />}
        {user && <CreatePost />}
      </Container>
    </Box>
  );
}

export default App;
