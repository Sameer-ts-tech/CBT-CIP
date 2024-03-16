import React, { useEffect, useState } from 'react'
import useShowtoast from '../hooks/useShowToast';
import axios from 'axios';
import { Avatar, Button, Flex, Spinner , Text, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function SeeAllUsers() {

    const showToast = useShowtoast();
    const [allUsers , setAllUsers] = useState([]);
    const [loading , setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(()=>{

        const getAllUsers = async()=>{
            try{
                const res = await axios({
                    method : "get",
                    url : "/api/users/all/users",
                })
                const data = res.data;
                setAllUsers(data);
            }catch(error){
                console.log(error);
                showToast("Error" , error , "error");
            }finally{
                setLoading(false);
            }
        }
        getAllUsers();

    },[])

    if(loading){
        return <Flex justifyContent={"center"}>
            <Spinner size={"xl"} />
        </Flex>
    }

  return (
    <Flex className='all_users_container' maxHeight={"400px"} overflow={"auto"}  mt={"10px"} width={"full"} flexDirection={"column"} >
        <Flex h={"full"}  width={"full"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
        {allUsers.map(user=>{
            return <>
            <Flex  bg={useColorModeValue("gray.200" , "gray.800")} borderRadius={"md"} width={"full"} gap={"20px"} alignItems={"center"} justifyContent={"space-evenly"}  padding={"20px"} margin={"10px"}>
                <Avatar src={user.profilePic} name={user.name} />
                <Text> {user.followers.length} followers</Text>
                <Text> {user.following.length} following</Text>
                <Button onClick={()=> navigate(`/${user.username}`)} > {user.username} </Button>
            </Flex>
            </>
        })}
        </Flex>
    </Flex>
  )
}

export default SeeAllUsers
