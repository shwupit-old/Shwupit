"use client"

import Link from "next/link";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { useMutation } from "@tanstack/react-query";
import { attemptLogin } from "~/actions";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";


const LoginDialog = ({ setDialogState, setEmail, setPassword }) => {
    return (
    <>
    <div className="input--group">
        <Label
          className="block cursor-pointer pb-2.5 font-normal text-dark/70 dark:text-light/70 rtl:text-right"
          htmlFor="email"
        >
          Email
        </Label>
        <Input id="email" placeholder="email" onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="input--group">
        <Label
          className="block cursor-pointer pb-2.5 font-normal text-dark/70 dark:text-light/70 rtl:text-right"
          htmlFor="password"
        >
          Password
        </Label>
        <Input type="password" id="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div className="flex justify-between">
        <div className="input--group flex items-center gap-2">
          <Checkbox id="remember-me" />
          <Label
            htmlFor="remember-me"
            className="text-dark/70 dark:text-light/70 ltr:ml-2.5 rtl:mr-2.5"
          >
            Remember me
          </Label>
        </div>
        <Button onClick={() => setDialogState('reset')}>
          <p className="text-accent">Forgot Password?</p>
        </Button>
      </div>
      </>
    )
}

const SignupDialog = () => {
    return (
    <>
        <div className="grid grid-cols-2 gap-4">
            <div className="input--group">
                <Label className="block cursor-pointer pb-2.5 font-normal text-dark/70 dark:text-light/70 rtl:text-right" htmlFor="first_name">First Name</Label>
                <Input id="first_name" placeholder="First name" />
            </div>

            <div className="input--group">
                <Label className="block cursor-pointer pb-2.5 font-normal text-dark/70 dark:text-light/70 rtl:text-right" htmlFor="last_name">Last Name</Label>
                <Input id="last_name" placeholder="Last name" />
            </div>
        </div>
        <div className="input--group">
            <Label className="block cursor-pointer pb-2.5 font-normal text-dark/70 dark:text-light/70 rtl:text-right" htmlFor="username">Username</Label>
            <Input id="username" placeholder="Username" />
        </div>
        <div className="input--group">
            <Label className="block cursor-pointer pb-2.5 font-normal text-dark/70 dark:text-light/70 rtl:text-right" htmlFor="email">Email</Label>
            <Input id="email" placeholder="Email" />
        </div>
        <div className="input--group">
            <Label className="block cursor-pointer pb-2.5 font-normal text-dark/70 dark:text-light/70 rtl:text-right" htmlFor="password">Password</Label>
            <Input id="password" placeholder="Password" />
        </div>
    </>
    )
}

const ResetDialog = () => {
    return (
    <>
        <div className="input--group">
            <Label className="block cursor-pointer pb-2.5 font-normal text-dark/70 dark:text-light/70 rtl:text-right" htmlFor="email">Email</Label>
            <Input id="email" placeholder="Email" />
        </div>
    </>
    )
}

const AuthenticationDialog = () => {
    const [dialogState, setDialogState] = useState('login');
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    // const router = useRouter();

const HandleSubmit = async (state, data) => {
  if (state === 'login') {
      const email = data.email;
      const password = data.password;

      console.log(email, password)
      try {
        const res = await signIn('credentials', { email, password, redirect: true });
        if (res.error)
        {
          // set error
          // console.log('error')
          return
        }
        console.log(res)
        // router.replace('/');
      } catch (err) {
        // console.log(err)
      }
      
      // data.server_loginUser({email, password});
      // IGNORE THIS ^
  }
}

    const { mutate: server_loginUser, isError, isPending } = useMutation({
      mutationFn: attemptLogin,
    })

  return (
    <>
      <DialogHeader>
        <DialogTitle>Start Swapping Today</DialogTitle>
        <DialogDescription>
            {/* {dialogState === 'login' && <p>Already have an account? <Button onClick={() => setDialogState('signup')}>Sign up now</Button></p>} */}
            {/* {dialogState === 'signup' && <p>Dont have an account? <Button onClick={() => setDialogState('login')}>Login here</Button></p>} */}
            {/* {dialogState === 'reset' && <p>Remembered your password? <Button onClick={() => setDialogState('login')}>Login here</Button></p>} */}
        </DialogDescription>
      </DialogHeader>
      {/* <form onSubmit={(e) => HandleSubmit(e, dialogState)}> */}
        {dialogState === 'login' && <LoginDialog setDialogState={setDialogState} setEmail={setEmail} setPassword={setPassword} />}
        {dialogState === 'signup' && <SignupDialog />}
        {dialogState === 'reset' && <ResetDialog />}

        <Button onClick={() => HandleSubmit(dialogState, { server_loginUser, email, password })} className="transition-fill-colors pointer-events-auto !mt-5 flex min-h-[46px] w-full cursor-pointer items-center justify-center gap-2 bg-brand px-4 py-3 text-sm font-semibold tracking-[0.2px] text-white opacity-100 duration-200 hover:bg-brand-dark focus:bg-brand-dark sm:h-12 md:px-5 lg:!mt-7">
            {dialogState === 'signup' && "Sign up"}  
            {dialogState === 'login' && "Login"}  
            {dialogState === 'reset' && "Reset Password"}  
        </Button>
      {/* </form> */}
    </>
  );
};

export default AuthenticationDialog;
