import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from "../components/Actions"
import Comment from '../components/Comment';
import useShowtoast from '../hooks/useShowToast';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow as formatDistanceFromNow } from "date-fns";

function PostPage() {


    const[user , setUser] = useState([]);
    const[post , setPost] = useState(null);
    const {username} = useParams();
    const {pid} = useParams();
    const showToast = useShowtoast();
    const [loading , setLoading] = useState(true);
    const [postLoading , setPostLoading] = useState(true);

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

    },[])

    useState(()=>{

        const getPost = async()=>{
            try{
                const res = await axios({
                    method : "get",
                    url : `/api/posts/${pid}`,
                })
                const data = res.data;
                if(data.error){
                    showToast("Error" , data.error , "error");
                    return;
                }
                setPost(data.post);
            }catch(error){
                showToast("Error" , error , "error");
                return;
            }finally{
                setPostLoading(false);
            }
        }
        getPost();

    },[])

    if(loading || postLoading){
        return <Flex justifyContent={"center"}>
            <Spinner size={"xl"} />
        </Flex>
    }

    
    return (
        <>
            {/* top part */}
            <Flex>

                <Flex flex={1} alignItems={"center"} width={"full"} gap={"3"}>
                    <Avatar src={user.profilePic} size={"md"} name={user.name} />

                    <Flex>
                        <Text fontSize={"small"} fontWeight={"bold"}>  {user.username} </Text>
                        <Image src='/verified.png' w={4} ml={4} />
                    </Flex>

                </Flex>

                <Flex gap={4} alignItems={"center"}>
                    <Text fontSize={"sm"} color={"gray.light"}>  {formatDistanceFromNow(new Date(post.createdAt))} ago </Text>
                    <BsThreeDots />
                </Flex>

            </Flex>

            <Text my={3}> {post.text} </Text>

            <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"} >
                <Image src={post.img} w={"full"}></Image>
            </Box>


            <Flex gap={3} my={3}>
                <Actions  post={post} />
            </Flex>

          


            <Divider my={4} borderWidth={"1px"} />


            <Flex justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={{base : "md" , md : "2xl"}}> emoji </Text>
                    <Text fontSize={{base : "sm" , md : "xl"}} color={"gray.light"}> get the app to like , reply and post </Text>
                </Flex>
                <Button>Get</Button>
            </Flex>

            <Divider my={4} borderWidth={"1px"} />

          {post.replies.map(reply=>{
            return <Comment post={post} reply={reply} />
          })}


        </>
    )
}

export default PostPage
