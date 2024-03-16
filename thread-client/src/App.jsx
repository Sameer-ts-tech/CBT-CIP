import { useState } from 'react'
import './App.css'
import { Button, Container } from '@chakra-ui/react'
import {Routes , Route, Link, useNavigate} from "react-router-dom";
import UserPage from './pages/UserPage';
import PostPage from './pages/PostPage';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import userAtom from './atoms/userAtom';
import { useRecoilValue } from 'recoil';
import HomePage from './pages/HomePage';
import LogoutButton from './components/LogoutButton';
import UpdateProfiePage from './pages/UpdateProfiePage';
import CreatePost from './components/CreatePost';
import NotFoundPage from './components/NotFoundPage';

function App() {

  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();

  return (
    <Container  maxW={"620px"} >


{/* <Button  position={"fixed"} top={10} left={10} onClick={()=> navigate("/_harsh")}> Creator </Button> */}

      <Header/>

      <Routes>
        <Route path='/' element={user ? <HomePage/> : <AuthPage/>} />
        <Route path='/:username' element={<UserPage/>} />
        <Route path='/:username/post/:pid' element={<PostPage/>} />
        <Route path='/auth' element={<AuthPage/>} />
        <Route path='/update' element={user ? <UpdateProfiePage/> : <AuthPage/>} />
        <Route path='*' element={<NotFoundPage/>} />
      </Routes>

      {user && <LogoutButton/>}
      {user && <CreatePost/>}

    </Container>
  )
}

export default App
