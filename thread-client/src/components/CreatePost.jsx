import { AddIcon } from '@chakra-ui/icons'
import { Button, FormControl, Textarea, Text, useColorMode, useColorModeValue , useDisclosure, Input, Flex , Image, CloseButton} from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'

import usePreviewImage from '../hooks/usePreviewImage'
import { BsFillImageFill } from 'react-icons/bs'
import axios from 'axios'
import useShowtoast from '../hooks/useShowToast'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'

const MAX_CHAR = 500;

function CreatePost() {


    const { isOpen, onOpen, onClose } = useDisclosure()
    const[postText , setPostText] = useState("");
    const {handleImageChange ,  imageUrl : imgUrl ,setImageUrl : setImgUrl} = usePreviewImage();
    const fileRef = useRef(null);
    const[remainingChar , setRemainingChar] = useState(500);
    const showToast = useShowtoast();
    const user = useRecoilValue(userAtom);
    const[loading , setLoading] = useState(false);


    const handleTextChange = async(e)=>{
        const inputText = e.target.value;
        if(inputText.length > MAX_CHAR){
            const truncatedText = inputText.slice(0 , MAX_CHAR);
            // setPostText(truncatedText);
            setRemainingChar(0);
        }else{
            setPostText(inputText);
            setRemainingChar(MAX_CHAR - inputText.length);
        }
    }

    const handleCreatePost = async()=>{
        const postedBy = user._id;
        try{
            setLoading(true);
            const res = await axios({
                method : "post",
                url : "/api/posts/create",
                data : {text : postText , img : imgUrl , postedBy},
            })

            const data = res.data;
            if(data.error){
                showToast("Error" , data.error , "error");
                return;
            }

            showToast("Success" , data.success ,  "success");
            setPostText("");
            setImgUrl(null);
            onClose();
          

        }catch(error){
            showToast("Error" , error , "error");
        }finally{
            setLoading(false);
        }
    }

    return (
        <>
            <Button onClick={onOpen}  position={"fixed"} bottom={"10px"} right={"10px"} leftIcon={<AddIcon />} bg={useColorModeValue("gray.300", "gray.dark")}>
                Post
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                        <FormControl>
                            <Textarea value={postText} placeholder='post content' onChange={handleTextChange}/>
                            <Text fontSize={"xs"} fontWeight={"bold"} textAlign={"right"} m={1} color={"gray.400"}> {remainingChar}/500</Text>

                            <Input ref={fileRef} type='file' onChange={handleImageChange} hidden/>
                            <BsFillImageFill size={16} style={{cursor : "pointer" , marginLeft : "5px"}} onClick={()=> fileRef.current.click()} />
                        </FormControl>

                        {imgUrl && <>
                        <Flex mt={5} w={"full"} position={"relative"}>
                            <Image src={imgUrl} alt='selected img' />
                            <CloseButton color={"gray.600"} onClick={()=> setImgUrl(null)} position={"absolute"} top={2} right={2} />
                        </Flex>
                        </>}

                    </ModalBody>

                    <ModalFooter>
                        <Button isLoading={loading} colorScheme='blue' mr={3} onClick={handleCreatePost}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}

export default CreatePost
