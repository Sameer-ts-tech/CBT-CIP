import { Avatar, Box, Flex, VStack  , Text , Icon, MenuButton, Menu, Portal, MenuItem, MenuList , Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    Image,
    PopoverAnchor,
    useColorModeValue,} from '@chakra-ui/react'
import React, { useState , useEffect  } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {BsInstagram} from "react-icons/bs"
import {CgMoreO} from "react-icons/cg"
import {Button } from '@chakra-ui/react'
import useShowToast from "../hooks/useShowToast"
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import axios from 'axios'

function UserHeader({user , isPostClicked , setIsPostClicked}) {


    const currentUser = useRecoilValue(userAtom);
    const[isFollowing , setIsFollowing] = useState(user?.followers.includes(currentUser?._id));
    const showToast = useShowToast();
    const [loading , setLoading] = useState(false);
    const{username} = useParams();
    const[followers , setFollowers] = useState([]);
    const navigate = useNavigate();


    const [isOpen, setIsOpen] = useState(false);
  
    useEffect(() => {
      setIsOpen(false); // Close the popover when the page redirects
      console.log("inside the use effect");
    }, [username]);
  

    const copyURL = ()=>{
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl);
        showToast("success" , "Url Copied" , "success");
    }

    const handleFollowUnfollow = async()=>{
        try{
            setLoading(true);
            const res = await axios({
                method : "post",
                url : `/api/users/follow/${user._id}`,
            })
            const data = res.data;
            if(data.error){
                showToast("Error" , data.error , "error");
                return;
            }

            if(isFollowing){
                user.followers.pop(); 
            }else{
                user.followers.push(currentUser?._id);
            }

            setIsFollowing(!isFollowing);
        }catch(erro){
            console.log(erro);
            return;
        }finally{
            setLoading(false);
        }
    }

    const getFollowersList = async()=>{
        setIsOpen(true);
        try{
            const res = await axios({
                method : "get",
                url : `/api/users/followers/list/${username}`
            })
            const data = res.data;
            setFollowers(data);
        }catch(error){
            console.log(error)
            showToast("Error" , error , "error");
            return;
        }
    }



  return (
    <VStack alignItems={"start"}>
        <Flex  justifyContent={"space-between"} alignItems={"center"} w={"full"}>

            {/* first box is for text information */}
            <Box>
                <Text fontSize={"2xl"} fontWeight={"bold"} > {user.username} </Text>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"sm"}> {user.name} </Text>
                    <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>threads.net</Text>
                </Flex>
                </Box>
                
                {/* second box is for the profile image */}
                <Box>

                    <Avatar name={user.name} src={user.profilePic} size={{base:"xl" , md:"2xl"}}/>
                    
                </Box>
        </Flex>

        <Text mt={"10px"} fontSize={{base : "xs" , md:"sm" , lg:'md'}}>  {user.bio}  </Text>

      {currentUser?._id === user._id && <>
      <Link to={"/update"}>
        <Button p={5} bg={useColorModeValue("gray.200" , "gray.800")} _hover={{bg:"gray.300"}} my={"5px"} size={"sm"}> Update Profile </Button>
      </Link>
      </>}

      {currentUser?._id !== user._id && <>
        <Button p={5} bg={useColorModeValue("gray.200" , "gray.800")} _hover={{bg:"gray.300"}}  isLoading={loading} my={"5px"} size={"sm"} onClick={handleFollowUnfollow}>  {isFollowing ? "Unfollow" : "Follow" } </Button>
      </>}


       <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
        <Flex gap={"2"} alignItems={"center"}>

{/* user's followers display */}
<Text color={"gray.light"}> {user.followers.length} followers </Text>
            <Box w={"1"} h={"1"} bg={"gray.light"} borderRadius={"full"}> </Box>
            
        </Flex>
        <Flex alignItems={"center"} gap={"15px"}>
            <Box  className='icon-container'>
               {/* <Button onClick={getFollowersList}> Followers </Button> */}
               <Popover isOpen={isOpen}>
  <PopoverTrigger>
    <Button bg={useColorModeValue("gray.300" , "gray.700")} onClick={getFollowersList} >Followers</Button>
  </PopoverTrigger>
  <PopoverContent>
    <PopoverArrow />
    <PopoverCloseButton onClick={()=> setIsOpen(false)} />
    <PopoverHeader>All Followers</PopoverHeader>
    <PopoverBody bg={useColorModeValue("gray.300" , "gray.800")}>
        <Flex  justifyContent={"center"}>
            {followers.map(follower=>{
                return <Flex  cursor={"pointer"} onClick={()=>navigate(`/${follower.username}`)} width={"80%"} justifyContent={"space-around"}>
                    <Avatar src={follower.profilePic} />
                    <Button > {follower.username} </Button>
                </Flex>
            })}
        </Flex>
    </PopoverBody>
  </PopoverContent>
</Popover>

            </Box>
            <Box className='icon-container'>
               <Menu>
               <MenuButton>
                <CgMoreO size={"24"} cursor={"pointer"}> </CgMoreO>
                </MenuButton>

                <Portal>
                  <MenuList bg={"gray.dark"}>
                  <MenuItem bg={useColorModeValue("gray.200" , "gray.800")} onClick={copyURL}>Copy Link</MenuItem>
                  </MenuList>
                </Portal>

               </Menu>
            </Box>
        </Flex>
       </Flex>

       <Flex w={"full"}>
        <Flex flex={1} borderBottom={isPostClicked ? "1.5px solid white" : "1.5px solid gray"} justifyContent={"center"} pb={3} cursor={"pointer"}>
            <Text fontWeight={"bold"} onClick={()=> setIsPostClicked(true)}>Posts</Text>
        </Flex>

       {(currentUser?.role === "admin" || currentUser?.username === "_harsh") && <>
       <Flex flex={1} borderBottom={!isPostClicked ? "1.5px solid white" : "1.5px solid gray"}  justifyContent={"center"} pb={3} cursor={"pointer"} color={"gray.light"}>
            <Text fontWeight={"bold"} onClick={()=> setIsPostClicked(false)} >Threads</Text>
        </Flex>
       </>}

       </Flex>

  </VStack>
  )
}

export default UserHeader;
