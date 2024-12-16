import {Container } from "@chakra-ui/react";
import { Routes , Route } from "react-router-dom";
import UserPage from "./pages/UserPage.jsx";
import PostPage from "./pages/PostPage.jsx";
import Header from "./components/Header.jsx";
import HomePage from "./pages/HomePage.jsx";

function App() {
  return (
    <Container maxW="620px">
        <Header/>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/:username' element={<UserPage />} />
				  <Route path='/:username/post/:pid' element={<PostPage />} />
        </Routes>
    </Container>
  )
}

export default App;

