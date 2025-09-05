import React, { useState, useNavigate } from 'react'
import { useForm } from "react-hook-form"
import Input from '../components/Input'
import Button from '../components/Button'



const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false)
  // const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    const {name,email,password} = data;
    if (!name) {
      console.log("for login")
    }

    if (name && email && password) {
      console.log("For Signup")
    }
    console.log(name,email,password)

  }


  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 '>
      <div className="w-full max-w-md bg-white rounded-2xl p-6">
        <div className=' rounded-3xl flex'>
          <Button text={"Sign Up"} isLogin={!isLogin} onclick={() => setIsLogin(false)} />
          <Button text={"Login"} isLogin={isLogin} onclick={() => setIsLogin(true)} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {!isLogin && (
            <div className='space-y-6'>
              <div className='flex flex-col items-center space-y-6 mt-4'>
                <h1 className='text-3xl font-bold text-black mb-2'>Create Account</h1>
                <p className='text-gray-600'>Sign up for a new account</p>
              </div>

              <div className='w-full flex-col '>
                <Input name='name' placeholder='Full Name' registerProp={register("name", {
                  required: "Name is required",
                  minLength: { value: 3, message: "Name must be at least 3 characters" }
                })}
                  error={errors.name}
                />
                <Input name='email' placeholder='Email Address' registerProp={register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                })} error={errors.email} />

                <Input
                  name="password"
                  placeholder="Password"
                  registerProp={register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^_&*]).{6,}$/,
                      message:
                        "Password must be at least 6 characters, include 1 uppercase letter, 1 number, and 1 special character"
                    },
                  })}
                  error={errors.password}
                />
                <Button type='submit' classNametext={'mt-6 !bg-black !text-white'} text={"Create Account"} />
              </div>
            </div>

          )}

          {isLogin && (
            <div className='space-y-6'>
              <div className='flex flex-col items-center space-y-6 mt-4'>
                <h1 className='text-3xl font-bold text-black mb-2'>Welcome Back</h1>
                <p className='text-gray-600'>Sign in to your account</p>
              </div>

              <div className='w-full flex-col transition'>
                {/* <Input label='Email' name='email' placeholder='Email Address' onchange={(e) => setPassword(e.currentTarget.value)} />
                <Input label='Password' name='password' placeholder='Password' onchange={(e) => setPassword(e.currentTarget.value)} />
                <Button onclick={clickHandlerSignIn} classNametext={'mt-6 !bg-black !text-white'} text={"Sign In"} /> */}
              </div>
            </div>

          )}


        </form>




      </div>
    </div>
  )
}

export default AuthPage

