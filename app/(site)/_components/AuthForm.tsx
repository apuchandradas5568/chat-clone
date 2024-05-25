"use client";

import AuthSocialButton from "@/app/components/AuthSocialButton";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/input";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";
type Varient = "login" | "register";

function AuthForm() {
  const [varient, setVarient] = useState<Varient>("login");

  const [isLoading, setIsLoading] = useState(false);

  const toggleVarient = useCallback(() => {
    if (varient === "login") {
      setVarient("register");
    } else {
      setVarient("login");
    }
  }, [varient]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (varient === "register") {
      // register user
    }
    if (varient === "login") {
      // login user
    }
    console.log(data);
    setIsLoading(false);
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    // perform social action
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {varient === "register" && (
            <Input
              name="name"
              id="name"
              label="Name"
              errors={errors}
              register={register}
              disabled={isLoading}
            />
          )}
          <Input
            name="email"
            id="email"
            label="Email address"
            type="email"
            errors={errors}
            register={register}
              disabled={isLoading}

          />
          <Input
            name="password"
            id="password"
            label="Password"
            type="password"
            errors={errors}
            register={register}
              disabled={isLoading}

          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {varient === "login" ? "Sign in" : "Register"}
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>

            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
          </div>

          {/* toggling to register */}

          <div
            className="
          flex gap-2
          justify-center
          mt-6
          text-sm
          px-2
          text-gray-500
          "
          >
            {varient === "login"
              ? "New to Messanger?"
              : "Already have an Account?"}
            <div onClick={toggleVarient} className="underline cursor-pointer">
              {varient === "login" ? "Create an account" : "Login"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
