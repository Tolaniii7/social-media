import type { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";

interface AuthContextType {
    user: User | null;
    signInWithGithub: ()=> void;
    signOut: ()=> void ;
}

const AuthContext = createContext<AuthContextType | undefined > (undefined) 

export const AuthProvider = ({children}  : {children: React.ReactNode}) => {

    const [user, setUser] = useState < User | null> (null)


    // getting data about the user 

    useEffect(()=>{
        supabase.auth.getSession().then(({data : {session}})=>{
            setUser(session?.user ?? null)
        })


        // listening for any changes in the authentication 
        const {data: listener} = supabase.auth.onAuthStateChange((_, session)=>{
             setUser(session?.user ?? null)
        })

        return () => {
            listener.subscription.unsubscribe();
        }
    }, [])

    const signInWithGithub = () => {
        supabase.auth.signInWithOAuth({provider:"github"})
    }

    const signOut = ( ) => {
        supabase.auth.signOut();
    }

    return (
        <AuthContext.Provider value={{
            user,
            signInWithGithub,
            signOut,
       }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType  => {
    const context = useContext(AuthContext);
    
    if (context === undefined) {
        throw new Error ('useAuth must be used within the Auth-provider')
    }
    return context ;
}