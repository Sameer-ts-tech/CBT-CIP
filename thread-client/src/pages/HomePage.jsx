import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Button, Divider, Flex, Spinner } from '@chakra-ui/react'
import useShowtoast from '../hooks/useShowToast'
import axios from 'axios';
import Post from '../components/Post';


function HomePage() {
  const showToast = useShowtoast();
  const[loading , setLoading] = useState(true);
  const[posts , setPosts] = useState([]);

  useEffect(()=>{

    const getFeedPosts = async()=>{
      try{
        const res = await axios({
          method : "get",
          url : "/api/posts/feed/posts",
        })
        const data = res.data;

        if(data.error){
          showToast("Error" , data.error , "error");
          return;
        }

        setPosts(data.feedPosts);

      }catch(error){
        showToast("Error" , error , "error");
        return;
      }finally{
        setLoading(false);
      }
    }

    getFeedPosts();

  },[])

  if(loading){
    return <Flex justifyContent={"center"}>
      <Spinner size={"lg"} />
    </Flex>
  }

  if(!loading && posts.length == 0 ){
    return <Flex justifyContent={"center"}>
      <h1> Follow some users to see their posts </h1>
    </Flex>
  }

  return (
      <Flex gap={"20px"} flexDirection={"column"}>
        {posts.map((post)=>{
        return <>
        <Post key={post._id} post={post}  postedBy = {post.postedBy} />
        </>
      })}
      </Flex>
  )
}

export default HomePage
