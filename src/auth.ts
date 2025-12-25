import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"
import WebAuthn from "next-auth/providers/webauthn"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        WebAuthn({
            enableConditionalUI: true
        }),
    ],
    experimental: {
        enableWebAuthn: true,
    },
    debug: true,
})
