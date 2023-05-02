"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import Input from "../components/Input";
import axios from "axios";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [variant, setVariant] = useState("login");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "register" : "login"
    );
  }, []);

  const login = () => {
    console.log("login...........");
    setLoading(true);
    signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    })
      .then((cb) => {
        if (cb?.ok) {
          toast.success(`${name} Logged In`);
          router.push("/");
        }
        if (cb?.error) {
          toast.error(cb.error);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Server error...");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const register = () => {
    setLoading(true);
    console.log("registering...");
    axios
      .post("/api/register", { email, name, password })
      .then((res) => {
        console.log(res);
        if (res.data?.error) {
          toast.error(res.data.error);
        }
        if (res.data?.user) {
          toast.success(`${res.data?.user.name} registered...`);
          router.refresh();
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-cover bg-fixed">
      <div className="bg-black w-full h-full lg:bg-opacity-50">
        <div className="px-12 py-5">
          <div className="h-12 flex relative w-32">
            <Link href="/">
              <Image
                fill
                src="/images/logo.png"
                alt="logo"
                className="object-contain h-full w-full justify-start"
              />
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-3/5 lg:max-w-md rounded-md w-full">
            <h2 className="text-white text-3xl mb-8 font-semibold text-center">
              {variant === "login" ? "Sign In" : "Register"}
            </h2>

            <div className="flex flex-col gap-4">
              {variant === "register" && (
                <Input
                  label="Username"
                  onChange={(e: any) => setName(e.target.value)}
                  id="name"
                  type="text"
                  value={name}
                />
              )}
              <Input
                label="Email"
                onChange={(e: any) => setEmail(e.target.value)}
                id="email"
                type="email"
                value={email}
              />
              <Input
                label="Password"
                onChange={(e: any) => setPassword(e.target.value)}
                id="password"
                type="password"
                value={password}
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              disabled={loading}
              onClick={variant === "login" ? login : register}
              className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition"
            >
              {variant === "login" ? "Log In" : "Sign Up"}
            </button>

            <div>TEST</div>

            <p className="text-neutral-500 mt-12 text-center">
              {variant === "login"
                ? "First time using Netflix?"
                : "Already have an Account?"}
              <span
                onClick={toggleVariant}
                className="text-wite ml-1 cursor-pointer hover:underline block text-center"
              >
                {variant === "login" ? "Create and Account" : "Log In"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
