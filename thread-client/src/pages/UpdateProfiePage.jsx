import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    Center,
    Text
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
// import usePreviewImage from "../hooks/usePreviewImage";
import useShowtoast from "../hooks/useShowToast";
import axios from "axios";
import usePreviewImage from "../hooks/usePreviewImage";
// import usePreviewImg from "../hooks/usePreviewImg";
// import useShowtoast from "../hooks/useShowtoast";

export default function UpdateProfilePage() {

    const [user , setUser] = useRecoilState(userAtom);
    const showToast = useShowtoast();
    const [updating , setUpdating] = useState();
    const[loading , setLoading] = useState(false);

    const {handleImageChange , imageUrl} = usePreviewImage();

    const fileRef = useRef(null);

    const[inputs , setInputs] = useState({
        name : user.name,
        username : user.username,
        email : user.email,
        bio : user.bio,
        password : '',
        profilePic : user.profilePic,
    })

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try{
            setLoading(true);
            const res = await axios({
                method : "post",
                url : ` /api/users/update/${user._id}`,
                data : {...inputs , profilePic : imageUrl},
            })
            const data = res.data;
            if(data.error){
                showToast("Error" , data.error , "error");
                return;
            }
            console.log(data.user);
            setUser(data.user);
            localStorage.setItem("user-threads" , JSON.stringify(data.user));
            showToast("Success" , data.success , "success");

        }catch(error){
            console.log(error);
            return;
        }finally{
            setLoading(false);
        }

    }


    return (
        <form onSubmit={handleSubmit}>
            <Flex  align={"center"} justify={"center"} my={6}>

                <Stack
                    spacing={4}
                    w={"full"}
                    maxW={"md"}
                    bg={useColorModeValue("white", "gray.900")}
                    rounded={"xl"}
                    boxShadow={"lg"}
                    p={10}
                >
                    <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
                        User Profile Edit
                    </Heading>
                    <FormControl >
                        <Stack direction={["column", "row"]} spacing={6}>
                            <Center>
                                <Avatar size='2xl' src={imageUrl || user.profilePic}  boxShadow={"md"} />
                            </Center>
                            <Center w='full'>
                                <Button w='full' onClick={()=> fileRef.current.click()} >
                                    Change Avatar
                                </Button>
                                <Input onChange={handleImageChange}  type='file'  hidden ref={fileRef} />
                            </Center>
                        </Stack>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Full name</FormLabel>
                        <Input
                            placeholder='John Doe'
                            _placeholder={{ color: "gray.500" }}
                            type='text'
                            value={inputs.name}
                            onChange={(e) => setInputs({...inputs , name : e.target.value})}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>User name</FormLabel>
                        <Input
                        value={inputs.username}
                            placeholder='johndoe'
                            _placeholder={{ color: "gray.500" }}
                            type='text'
                            onChange={(e) => setInputs({...inputs , username : e.target.value})}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Email address</FormLabel>
                        <Input
                        value={inputs.email}
                            placeholder='your-email@example.com'
                            _placeholder={{ color: "gray.500" }}
                            type='email'
                            onChange={(e) => setInputs({...inputs , email : e.target.value})}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Bio</FormLabel>
                        <Input
                        value={inputs.bio}
                            placeholder='Your bio.'
                            _placeholder={{ color: "gray.500" }}
                            type='text'
                            onChange={(e) => setInputs({...inputs , bio : e.target.value})}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Password</FormLabel>
                        <Input
                            placeholder='password'
                            _placeholder={{ color: "gray.500" }}
                            type='password'
                            onChange={(e) => setInputs({...inputs , password : e.target.value})}
                        />
                    </FormControl>
                    <Stack spacing={6} direction={["column", "row"]}>
                        <Button
                            bg={"red.400"}
                            color={"white"}
                            w='full'
                            _hover={{
                                bg: "red.500",
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            bg={"green.400"}
                            color={"white"}
                            w='full'
                            _hover={{
                                bg: "green.500",
                            }}
                            type='submit'
                            isLoading={loading}
                        >
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </form>
    );
}
