"use client";

import axios from "axios";
import AuthSocialButton from "@/app/components/AuthSocialButton";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/input";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
type Varient = "login" | "register";

function AuthForm() {
  const [varient, setVarient] = useState<Varient>("login");
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/users");
    }
  }, [session?.status, router]);

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
      axios
        .post("/api/register", data)
        .then(() => {
          signIn("credentials", data);
        })
        .catch(() => {
          toast("Something Went Wrong", { icon: "❌" });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    if (varient === "login") {
      // login user
      signIn("credentials", { ...data, redirect: false })
        .then((callback) => {
          if (callback?.error) {
            toast.error(callback.error, { icon: "❌" }); // More specific error message
          }
          if (callback?.ok && !callback.error) {
            toast.success("Login Successful", { icon: "🚀" });
            router.push("/users");
            router.refresh()
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("Login failed. Please try again.", { icon: "❌" }); // Generic error message
        })

        .finally(() => {
          setIsLoading(false);
        });
    }
    // setIsLoading(false);
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error(callback.error, { icon: "❌" });
        }
        if (callback?.ok && !callback.error) {
          toast.success("Login Successful", { icon: "🚀" });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
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
