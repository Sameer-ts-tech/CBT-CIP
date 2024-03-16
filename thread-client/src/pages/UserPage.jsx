import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'
import axios from "axios";
import { useRecoilValue } from "recoil";
import userAtom from '../atoms/userAtom';
import { useParams } from 'react-router-dom';
import useShowtoast from '../hooks/useShowToast';
import { Flex, Heading, Spinner } from '@chakra-ui/react';
import Post from "../components/Post"
import useGetUserProfile from '../hooks/useGetUserProfile';
import SeeAllUsers from '../components/SeeAllUsers';
import NotFoundPage from '../components/NotFoundPage';

function UserPage() {

  
  const[posts , setPosts] = useState([]);
  const[postLoading , setPostLoading] = useState(true);
  const showToast =  useShowtoast();

  const[isPostClicked , setIsPostClicked] = useState(true);
  
  const{username} = useParams();

  const[user , setUser] = useState(null);
  const[loading , setLoading] = useState(true);

  useEffect(()=>{

    const getUser = async()=>{
      try{
        const res = await axios({
          method : "get",
          url : `/api/users/profile/${username}`,
        })

        const data = res.data;
        if(data.error){
          showToast("Error" , data.error , "error");
          return;
        }
        setUser(data.user);
      }catch(error){
        showToast("Error" , error , "error");
        return;
      }finally{
        setLoading(false);
      }

    }
    getUser();

  },[username])


  useEffect(()=>{


    const getPost = async()=>{
      try{
        const res = await axios({
          method : "post",
          url: `/api/posts/user/${username}`
        })
        const data = res.data;
        if(data.error){
          showToast("Error" , data.error , "error");
          return;
        }

        setPosts(data.posts);
      }catch(error){
        console.log(error);
        showToast("Error" , error , "error");
        setPosts([]);
        return;
      }finally{
        setPostLoading(false);
      }
    }
    getPost();

  },[username])

  if(loading || postLoading){
    return <Flex justifyContent={"center"} alignItems={"center"} >
      <Spinner size={"xl"} />
    </Flex>
  }

  if(!user){
    return <NotFoundPage/>
  }

  return (
    <>
    
    <UserHeader isPostClicked={isPostClicked} setIsPostClicked={setIsPostClicked} user={user}/>

    {isPostClicked && <>

      {/* {postLoading && <>
    <Flex mt={"20px"} justifyContent={"center"}>
      <Spinner size={"xl"}/>
    </Flex>
    </>
    } */}

    {!postLoading && posts.length == 0 && <>
    <Heading textAlign={"center"} fontSize={"medium"} color={"gray.500"} mt={"20px"}>  <i> No post </i> </Heading>
    </>}

    {!postLoading && posts.length > 0 && <>
    {posts.map(post=>{
      return <Post post={post} postedBy={post.postedBy} />
    })}
    </>}
    </>}

    {!isPostClicked &&  <>
    <SeeAllUsers/>
    </>}
    
    </>
  )
}

export default UserPage
