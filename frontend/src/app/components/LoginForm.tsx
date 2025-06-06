'use client'

import { signIn } from "next-auth/react";
import { useState, SyntheticEvent } from "react";
import { useRouter } from "next/router";
// import { redirect } from "next/navigation";
// import { getSession, login, logout } from "";

export default function LoginForm() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const router = useRouter()

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault()

    // const result = await signIn('credentials', {
    //   username,
    //   password,
    //   redirect: false
    // })

    const result = {
      username,
      password,
      redirect: false
    }

    if (result.password) {
      console.log(result)
      return
    }

    router.replace('/')
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