import {Container } from "@chakra-ui/react";
import { Routes , Route, Navigate } from "react-router-dom";
import UserPage from "./pages/UserPage.jsx";
import PostPage from "./pages/PostPage.jsx";
import Header from "./components/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom.js";
import LogoutButton from "./components/LogoutButton.jsx";

function App() {
  const user = useRecoilValue(userAtom);
  return (
    <Container maxW="620px">
        <Header/>
        <Routes>
          <Route path='/' element={user ? <HomePage/> : <Navigate to="/auth/signup"/>}/>
          <Route path='/auth/signup' element={!user ? <AuthPage /> : <Navigate to="/"/>}/>
          <Route path='/:username' element={<UserPage />} />
				  <Route path='/:username/post/:pid' element={<PostPage />} />
        </Routes>
        {user && <LogoutButton />}
    </Container>
  )
}

export default App;

