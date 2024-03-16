import { Avatar, Box, Flex, Text, Image ,Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import Actions from './Actions'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
  } from '@chakra-ui/react'

function UserPost({ likes, replies, postImg, postTitle }) {

    const[liked , setLiked] = useState(false);

    return (
        <Link to={"/mark/post/1"}>

            <Flex gap={3} mb={4} py={5}>

                {/* left part */}
                <Flex flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                    <Avatar size={"md"} name={"Harsh Raj"} src="/harsh.png"></Avatar>
                    <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
                    <Box position={"relative"} w={"full"} >

                        <Avatar size={"sm"} name='John doe' src='https://bit.ly/dan-abramov' pos={"absolute"} top={"0px"} left={"15px"} padding={"2px"}></Avatar>
                        <Avatar size={"sm"} name='John doe' src='https://bit.ly/dan-abramov' pos={"absolute"} bottom={"0px"} right={"-5px"} padding={"2px"}></Avatar>
                        <Avatar size={"sm"} name='John doe' src='https://bit.ly/dan-abramov' pos={"absolute"} bottom={"0px"} left={"4px"} padding={"2px"}></Avatar>

                    </Box>
                </Flex>

                {/* right part */}

                <Flex flex={1} flexDirection={"column"} gap={2} >

                    {/* for top right part */}
                    <Flex justifyContent={"space-between"} w={"full"} alignItems={"center"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text fontSize={"sm"} fontWeight={"bold"} >Harsh Raj</Text>
                            <Image src="/verified.png" w={4} h={4} ml={1} ></Image>
                        </Flex>

                        <Flex gap={4} alignItems={"center"}>
                            <Text fontSize={"sm"} color={"gray.light"}>1d</Text>
                            <Menu>
                                <MenuButton>
                                 <BsThreeDots/>
                                </MenuButton>
                                <MenuList>
                                    <MenuItem>Delete Post</MenuItem>
                                    <MenuItem>Edit Post</MenuItem>
                                </MenuList>
                            </Menu>
                        </Flex>
                    </Flex>

                    {/* right bottom part */}
                    {/* Post title */}
                    <Text fontSize={"sm"}>   {postTitle}    </Text>

                    {/* post image */}
                    {postImg && <Box borderRadius={6} overflow={"hidden"} >
                        <Image src={postImg} w={"full"}></Image>
                    </Box>}



                    <Flex gap={3} my={2}>
                        <Actions liked={liked} setLiked={setLiked} />
                    </Flex>

                    <Flex gap={2} alignItems={"center"}>
                        <Text color={"gray.light"} fontSize={"sm"}>{replies} replies</Text>
                        <Box w={1} h={1} borderRadius={"full"} bg={"gray.light"}></Box>
                        <Text color={"gray.light"} fontSize={"sm"}> {likes} likes</Text>
                    </Flex>

                </Flex>

            </Flex>

        </Link>
    )
}

export default UserPost
