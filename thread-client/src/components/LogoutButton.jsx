import { Button } from '@chakra-ui/react'
import React from 'react'
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import axios from 'axios';
import useShowToast from "../hooks/useShowToast";
import { FiLogOut } from "react-icons/fi";

function LogoutButton() {

    const setUser = useSetRecoilState(userAtom);

    const showToast = useShowToast();


    const handleLogout = async()=>{
        try{
            const res = await axios({
                method : "post",
                url : "/api/users/logout",
            })

            const data = res.data;
            if(data.error){
                showToast("Error" , data.error , "error");
                return;
            }
            localStorage.removeItem("user-threads");
            setUser(null);
        }catch(error){
            console.log(error);
        }
    }

  return (
    <Button 
    onClick={handleLogout}
    position={"fixed"}
    bottom={"20px"}
    left={"10px"}
    size={"md"}
    >
        <FiLogOut size={"22px"} />
    </Button>
  )
}

export default LogoutButton
