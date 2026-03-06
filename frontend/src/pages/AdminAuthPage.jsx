import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../components/Input";
import Button from "../components/Button";
import { admin_login, admin_signup, clear_admin_error } from "../features/admin/adminAuthSlice";

const AdminAuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.adminAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    const payload = isLogin
      ? { email: data.email, password: data.password }
      : { username: data.username, email: data.email, password: data.password };

    const action = isLogin ? admin_login : admin_signup;
    const result = await dispatch(action(payload));

    if (action.fulfilled.match(result)) {
      toast.success(isLogin ? "Admin login successful" : "Admin account created");
      dispatch(clear_admin_error());
      reset();
      navigate("/admin");
      return;
    }

    toast.error(result.payload?.message || "Admin authentication failed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6">
        <div className="rounded-3xl flex">
          <Button
            text="Login"
            isLogin={isLogin}
            onclick={() => {
              setIsLogin(true);
              dispatch(clear_admin_error());
            }}
          />
          <Button
            text="Sign Up"
            isLogin={!isLogin}
            onclick={() => {
              setIsLogin(false);
              dispatch(clear_admin_error());
            }}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col items-center space-y-3 mt-4">
            <h1 className="text-3xl font-bold text-black">
              {isLogin ? "Admin Login" : "Create Admin"}
            </h1>
            <p className="text-gray-600">
              {isLogin ? "Sign in as administrator" : "Register a new admin account"}
            </p>
          </div>

          <div className="w-full flex-col">
            {!isLogin && (
              <Input
                name="username"
                placeholder="Username"
                registerProp={register("username", {
                  required: "Username is required",
                  minLength: { value: 3, message: "Username must be at least 3 characters" }
                })}
                error={errors.username}
              />
            )}

            <Input
              name="email"
              placeholder="Email Address"
              registerProp={register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" }
              })}
              error={errors.email}
            />

            <Input
              name="password"
              type="password"
              placeholder="Password"
              registerProp={register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" }
              })}
              error={errors.password}
            />

            <Button
              type="submit"
              classNametext="mt-6 !bg-black !text-white disabled:opacity-70"
              text={loading ? "Please wait..." : isLogin ? "Login" : "Create Admin"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAuthPage;
