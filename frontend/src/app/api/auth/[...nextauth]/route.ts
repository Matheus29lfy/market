import NextAuth, { DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const nextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				username: { label: 'username', type: 'text' },
				password: { label: 'password', type: 'password' }
			},

			async authorize(credentials, req) {
				console.log(credentials)
				const url = 'http://localhost:8080/products'
			
				const response = await fetch(url , {
					method: 'GET',
					headers: {
						'Content-type': 'application/json'
					},
				})
				// const response = await fetch(url , {
				// 	method: 'POST',
				// 	headers: {
				// 		'Content-type': 'application/json'
				// 	},
				// 	body: JSON.stringify({
				// 		username: credentials?.username,
				// 		password: credentials?.password
				// 	})
				// })

		
				const user = await response.json()
				// const user = '';
				// const response = {ok:''};

				if (user && response.ok) {
					return user
				}

				return null
			},
		})
	],
	pages: {
		signIn: '/'
	},
	// callbacks: {
	// 	async jwt({ token, user }) {
	// 		user && (token.user = user)
	// 		return token
	// 	},
	// 	async session({ session, token }){
	// 		session = token.user as any
	// 		return session
	// 	}
	// }
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST, nextAuthOptions }