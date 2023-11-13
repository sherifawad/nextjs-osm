import NextAuth, { DefaultSession } from "next-auth";
import "next-auth/jwt";
import { REPUTATIONType } from "../validations/generated-zod-schemas/inputTypeSchemas/REPUTATIONSchema";
import { RoleType } from "../validations/generated-zod-schemas/inputTypeSchemas/RoleSchema";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            role: RoleType;
            reputation: REPUTATIONType;
            id: string;
        } & DefaultSession["user"];
    }
    interface token {
        // id: string;
    }
}

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth/jwt" {
    interface JWT {
        /** The user's role. */
        role: RoleType;
        reputation: REPUTATIONType;
        id: string;
    }
}
