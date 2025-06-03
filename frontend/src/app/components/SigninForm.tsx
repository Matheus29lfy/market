"use client";

import { Card, CardFooter, CardHeader, Input } from "@nextui-org/react";
import Link from "next/link";

export function SigninForm() {
  return (
    <div className="w-full max-w-md">
      <form>
        <Card>
          <CardHeader className="space-y-1">
            <div className="text-3xl font-bold">Sign In</div>
            <div>Enter your details to sign in to your account</div>
          </CardHeader>
          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <label htmlFor="identifier" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="username or email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
              />
            </div>
          </div>
          <CardFooter className="flex flex-col">
            <button className="w-full">Sign In</button>
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?
          <Link className="underline ml-2" href="signup">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}