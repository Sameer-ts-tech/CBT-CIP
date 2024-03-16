import { Avatar, Divider, Flex , Text} from '@chakra-ui/react';
import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs';
import Actions from './Actions';
import { DeleteIcon } from '@chakra-ui/icons';
import useShowtoast from '../hooks/useShowToast';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { useNavigate } from 'react-router-dom';

function Comment({post , reply}) {

  const showToast = useShowtoast();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const delteReplyHandler = async()=>{
    try{

      const res = await axios({
        method : "delete",
        url : `/api/posts/reply/${post._id}/`,
        data : {replyId : reply._id}
      })

      const data = res.data;
      showToast("Success" , data.success , "success");
    }catch(error){
      showToast("Error" , error , "error");
      return;
    }
  }

  return (
    <>
    <Flex gap={4} py={2} my={2} w={"full"} >

        {/* avatar of comment */}
        <Avatar  cursor={"pointer"} onClick={()=> navigate(`/${reply?.username}`)} src={reply?.userProfilePic} size={'sm'} />

        <Flex gap={1} w={"full"} flexDirection={"column"}>

{/* top right part of the comment */}
            <Flex w={"full"} justifyContent={"space-between"} alignItems={'center'}>

                {/* username */}
                <Text cursor={"pointer"} onClick={()=> navigate(`/${reply?.username}`) } fontWeight={"bold"} fontSize={"sm"}> {reply?.username}  </Text>

{/* top right to right part of comment */}
                {currentUser?.username === reply.username  || currentUser?.role == "admin" && <Flex gap={2} alignItems={'center'}>
                  <DeleteIcon cursor={"pointer"} onClick={delteReplyHandler} />
                </Flex>}

            </Flex>

<Text> {reply?.text} </Text>

        </Flex>

    </Flex>

    <Divider/>

    </>
  )
}

export default Comment
