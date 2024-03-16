import React, { useState , useEffect} from 'react'
import useShowtoast from './useShowToast';
import { useParams } from 'react-router-dom';

function useGetUserProfile() {

    const[user , setUser] = useState(null);
    const[loading , setLoading] = useState(true);
    const {username} = useParams();
    const showToast = useShowtoast();

    useEffect(()=>{


        const getUser = async()=>{
          try{
            const res = await axios({
              method : "get",
              url : `/api/users/profile/${username}`,
            })
    
            const data = res.data;
            console.log(data);
            if(data.error){
              showToast("Error" , data.error , "error");
              return;
            }
            console.log(data.user);
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

        return {user , setUser , showToast , loading , setLoading , username}
}

export default useGetUserProfile;
