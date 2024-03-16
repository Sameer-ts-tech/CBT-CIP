import React, { useState } from 'react'
import SignupCard from '../components/SignupCard'
import LoginCard from '../components/LoginCard'
import authScreenAtom from '../atoms/authAtoms'
import { useRecoilValue, useSetRecoilState } from 'recoil'

function Auth() {

    const authScreenState = useRecoilValue(authScreenAtom);

  return (
    <div>
        {authScreenState === "login" ? <LoginCard/> : <SignupCard/>}
    </div>
  )
}

export default Auth
