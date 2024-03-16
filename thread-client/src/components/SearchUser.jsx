import { Avatar, Flex, Input,Text ,useColorModeValue } from '@chakra-ui/react'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function SearchUser() {

    const[input , setinput] = useState("");
    const[users , setUsers] = useState([]);
    const[searchedUser , setSearchedUser] = useState([]);
    const[inputClicked , setInputClicked] = useState(true);
    const navigate = useNavigate();

    useEffect(()=>{
        (async()=>{
            const res = await axios({
                method : "get",
                url : "/api/users/all/users"
            })
            const data = res.data;
            setUsers(data);
        })()
    },[])

    const searchUserHandler = async(e)=>{
        setInputClicked(true);
        setinput(e.target.value);
        const search = users.filter(user=>{
            return user.username.toLowerCase().includes(e.target.value.toLowerCase());
        })
        setSearchedUser(search);
    }

    const handleBlur = async()=>{
        setTimeout(()=>{
            setInputClicked(false);
        },500)
    }

  return ( 
    <Flex flex={1} flexDirection={"column"} zIndex={"100"}  maxHeight={"400px"} overflow={"auto"} className='all_users_container' >
            <Input  onFocus={()=> setInputClicked(true)} onBlur={handleBlur}  placeholder='enter uername to search' bg={useColorModeValue("gray.200" , "gray.800")} onChange={searchUserHandler}/>
        <Flex className='all_users_container' maxH={"400px"} overflow={"auto"} position={"absolute"} top={"45px"} flexDirection={"column"}>

            {  inputClicked && input.length > 0 && searchedUser.map(e=>{
                return <>
                <Flex  onClick={()=> navigate(`/${e.username}`)} cursor={"pointer"} gap={"10px"} maxWidth={"400px"} alignItems={"center"} justifyContent={"space-evenly"} borderRadius={"md"} key={e._id} padding={"10px"} margin={"1px"} border={"1px solid gray"} bg={e.username == "_harsh" ?  useColorModeValue("green.200" , "green.400") :  useColorModeValue(  "gray.200" , "gray.800") }>
                    <Avatar mr={"auto"} src={e.profilePic} name={e.name} />
                    <Text ml={"auto"}> {e.username} </Text>
                </Flex>
                </>
            })}
        </Flex>
    </Flex>
  )
}

export default SearchUser



