import React, { useCallback } from 'react'
import { useToast } from '@chakra-ui/react'


    function useShowtoast() {
        const toast = useToast();
        const showToast = useCallback((title ,  description ,status)=>{
            toast({
                title : title,
                description,
                status,
                duration : 3000,
                isClosable : true,
                position : "top-right"
            })
        },[toast])
        return showToast
}

export default useShowtoast