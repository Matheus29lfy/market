// 'use client'
"use client"

import { signIn } from "next-auth/react";
import { useState, SyntheticEvent, useEffect } from "react";
import { redirect } from "next/navigation";
import { user } from "@nextui-org/react";
// import { getSession, login, logout } from "";
import { useRouter } from 'next/navigation'
import { setTokenSession } from "../lib";

export default  function LoginForm() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

   const route =  useRouter();

   async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault()

        const response = await fetch('http://localhost:8080/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
        // console.log(response.json())

    if (response.ok) {

      const body = await response.json()
  
      setTokenSession(body)
      
      route.push('/')
    }

    return
  }


  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-3xl mb-6">Login</h1>

      <form className="w-[400px] flex flex-col gap-6" onSubmit={handleSubmit}>
        <input 
          className="h-12 rounded-md p-2 bg-transparent border border-gray-300"
          type="text" 
          name="username" 
          placeholder="Digite seu e-mail" 
          onChange={(e) => setUsername(e.target.value)}
        />

        <input 
          className="h-12 rounded-md p-2 bg-transparent border border-gray-300"
          type="password" 
          name="password" 
          placeholder="Digite sua senha" 
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="h-12 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
        >
          Entrar
        </button>
      </form>
    </div>
    )
}