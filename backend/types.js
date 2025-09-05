import * as zod from "zod"

const RegisterUser = zod.object({
    name:zod.string("Invalid Name"),
    email:zod.email("Invalid email address"),
    password:zod.string(6, "Password too short")
})

const LoginUser = zod.object({
    email:zod.email(),
    password:zod.string()
})

export {
    RegisterUser,
    LoginUser
}
