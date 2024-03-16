import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	HStack,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
    useColorMode,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useRecoilValue, useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtoms";
import axios from "axios";
import userAtom from "../atoms/userAtom";
import useShowtoast from "../hooks/useShowToast";
import {useNavigate} from "react-router-dom";

export default function LoginCard() {

	const showToast = useShowtoast();
	const navigate = useNavigate();

	const [showPassword, setShowPassword] = useState(false);
	const [inputs, setInputs] = useState({
		username: "",
		password: "",
	});
	const[loading , setLoading] = useState(false);

const setAuthScreen = useSetRecoilState(authScreenAtom);
const setUser = useSetRecoilState(userAtom);


	const handleLogin = async () => {

		setLoading(true);
		try {

			const res = await axios({
				method : "post",
				url : "/api/users/login",
				data : inputs,
			})

			const data = res.data;
			if(data.error){
				showToast("Error" , data.error , "error");
				return;
			}

			setUser(data.user);
			localStorage.setItem("user-threads" , JSON.stringify(data?.user));
			showToast("Success" , data.success , "success");
			navigate("/_harsh");
			
		} catch (error) {
			showToast("Error" , error , "error");
			return;
		}finally{
			setLoading(false);
		}
	};

	return (
		<Flex align={"center"} justify={"center"}>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Login
					</Heading>
				</Stack>
				<Box rounded={"lg"} bg={useColorModeValue("white", "black")} boxShadow={"lg"} p={8} w={{base : "full",sm : "400px"}}>
					<Stack spacing={4}>
						
						<FormControl isRequired>
							<FormLabel>Username</FormLabel>
							<Input
								type='text'
								onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
								value={inputs.username}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
									value={inputs.password}
								/>
								<InputRightElement h={"full"}>
									<Button
										variant={"ghost"}
										onClick={() => setShowPassword((showPassword) => !showPassword)}
									>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>
						<Stack spacing={10} pt={2}>
							<Button
								loadingText='logging in'
								isLoading = {loading}
								size='lg'
								bg={useColorModeValue("gray.600", "gray.700")}
								color={"white"}
								_hover={{
									bg: useColorModeValue("gray.700", "gray.800"),
								}}
								onClick={handleLogin}
							>
								Login
							</Button>
						</Stack>
						<Stack pt={6}>
							<Text align={"center"}>
								Don't have an account?{" "}
								<Link color={"blue.400"} onClick={()=> setAuthScreen('signup')}>
									Signup
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}
