"use client";

import { useAuthActions } from "@convex-dev/auth/react";

export default function Home() {

    const { signOut } = useAuthActions();

    return (
        <div>
            Logged in!
            <button onClick={signOut}>sair</button>
        </div>
    );
}
