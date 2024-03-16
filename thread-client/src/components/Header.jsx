import { Button, Flex , Image , Text} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useColorMode } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link, useNavigate } from 'react-router-dom';
import {AiFillHome} from "react-icons/ai"
import {RxAvatar} from "react-icons/rx"
import SearchUser from './SearchUser';

function Header() {

    const {colorMode , toggleColorMode} = useColorMode();
    const user = useRecoilValue(userAtom);
    const navigate = useNavigate();

  return (

    <Flex gap={{base : "20px" , md : "45px"}}  alignItems={"center"} justifyContent={"space-between"} mt={6} mb={12}>


      {user?.username !== "_harsh" && <>
      <Flex justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
      <Image onClick={()=> navigate("_harsh")} onMouseEnter={()=> setHover(true)} onMouseLeave={()=> setHover(false)} cursor={"pointer"} src="./_harsh.png" h={"auto"} w={"50px"} borderRadius={"full"}/>
      </Flex>
      </>}


      {user && <>
      <Link to={"/"}>
      <AiFillHome  size={24}/>
      </Link>
      </>}

      <Image maxH={{base : "18px" , md : "25"}}
        cursor={"pointer"}
        src={colorMode == "dark" ? "./light-logo.svg" : "./dark-logo.svg"}
        alt='logo'
        onClick={toggleColorMode}
         />

{!user && <>
<Button onClick={()=> navigate("/auth")}>
Login/Signup
</Button>
</>}

<SearchUser />


{user && <>
      <Link to={`/${user.username}`}>
      <RxAvatar size={24}/>
      </Link>
      </>}

    </Flex>

  )
}

export default Header
