import { Avatar, Box, Flex, Text, Image ,Button, useShortcut, Spinner, Heading, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import Actions from './Actions'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
  } from '@chakra-ui/react'
import axios from 'axios'
import useShowtoast from '../hooks/useShowToast'
import { formatDistanceToNow as formatDistanceFromNow } from "date-fns";
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { DeleteIcon } from '@chakra-ui/icons'

function UserPost({ post , postedBy }) {

    const showToast = useShowtoast();
    const [user , setUser] = useState(null);
    const[loading , setLoading] = useState(true);
    const currentUser = useRecoilValue(userAtom);
    const[deleteLoading , setDeleteLoading] = useState(false);

    // getting the profile of the user who posted the post
    useEffect(()=>{
        const getUser = async()=>{
            try{
                const res = await axios({
                    method : "get",
                    url : `/api/users/profile/${postedBy}`
                })
                const data = res.data;
                setUser(data.user);
            }catch(error){
                showToast("Error" , error , "error");
                setUser(null);
                return;
            }
            finally{
                setLoading(false);
            }
        }
        getUser();
    },[postedBy])


    const navigate = useNavigate();

    const avatarClickHandler = async(e)=>{
        e.preventDefault();
        navigate(`/${user?.username}`);
    }

    const handleDeltePost = async(e)=>{
        setDeleteLoading(true);
        e.preventDefault();
        try{
            const res = await axios({
                method : "delete",
                url : `/api/posts/${post._id}`,
            })
            const data = res.data;

            if(data.error){
                showToast("Error" , error , "error");
                return;
            }

            showToast("Success" , data.success , "success");

        }catch(error){
            showToast("Error" , error , "error");
            return;
        }finally{
            setDeleteLoading(false);
        }
    }

    const threeDotClickHandler = async(e)=>{
        e.preventDefault();
    }


    // if(loading){
    //     return <Flex justifyContent={"center"} alignItems={"center"}>
    //         <Spinner size={"lg"}/>
    //     </Flex>
    // }

    if(!loading && user == null){
        return ;
    }


    return (
       <>
       {!loading && user && <>
        <Link to={`/${user?.username}/post/${post._id}`}>

            <Flex gap={3} mb={4} py={5}>

                {/* left part */}
                <Flex flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                    <Avatar onClick={avatarClickHandler} size={"md"} name={user?.name} src={user?.profilePic}></Avatar>
                    <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
                    <Box position={"relative"} w={"full"} >

                        {post.replies.length == 0 && <> <Text textAlign={"center"}>😪</Text> </>}

                       {post.replies[0] && <>
                        <Avatar size={"sm"} name={post.replies[0].username} src={post.replies[0].profilePic} pos={"absolute"} top={"-3px"} left={"12px"} padding={"2px"}></Avatar>
                       </>}

                       {post.replies[1] && <>
                        <Avatar size={"sm"} name={post.replies[1].username} src={post.replies[1].profilePic} pos={"absolute"} bottom={"0px"} right={"-5px"} padding={"2px"}></Avatar>
                       </>}

                       {post.replies[2] && <>
                       <Avatar size={"sm"} name={post.replies[2].username}  src={post.replies[2].profilePic} pos={"absolute"} bottom={"0px"} left={"2px"} padding={"2px"}></Avatar>
                       </>}

                    </Box>
                </Flex>

                {/* right part */}

                <Flex flex={1} flexDirection={"column"} gap={2} >

                    {/* for top right part */}
                    <Flex justifyContent={"space-between"} w={"full"} alignItems={"center"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text onClick={avatarClickHandler} fontSize={"sm"} fontWeight={"bold"} > {user.username} </Text>
                            <Image src="/verified.png" w={4} h={4} ml={1} ></Image>
                        </Flex>

                        <Flex justifyContent={"flex-end"}   width={"full"} gap={4} alignItems={"center"}>
                            <Text fontSize={{base : "xs" , md : "sm"}} color={"gray.light"}> {formatDistanceFromNow(new Date(post.createdAt))} ago </Text>


                            {(currentUser?._id === postedBy || currentUser?.role == "admin") && <>
                               
                                <Button bg={useColorModeValue("gray.200" , "gray.800")}  isLoading={deleteLoading}   onClick={handleDeltePost}>
                                    <DeleteIcon fontSize={"medium"} />
                                </Button>
                               
                            </>}
                            
                        </Flex>
                    </Flex>

                    {/* right bottom part */}
                    {/* Post title */}
                    <Text fontSize={"sm"}>   {post.text}    </Text>

                    {/* post image */}
                    {post.img && <Box borderRadius={6} overflow={"hidden"} >
                        <Image src={post.img} w={"full"}></Image>
                    </Box>}



                    <Flex gap={3} my={2}>
                        <Actions  post={post} />
                    </Flex>


                </Flex>

            </Flex>

        </Link>
       </>}
       
       </>
    )
}

export default UserPost
