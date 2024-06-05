import { useEffect, useState } from "react";
import { firebaseApp } from "@firebaseConfig";
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";

const auth = getAuth(firebaseApp);

export default function useAuthService() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });

        return () => unsubscribe(); // Desuscribirse cuando el componente se desmonte
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await userCredential.user.getIdToken();
        } catch (error) {
            console.error("Error al hacer login", error);
            throw error; // Propagar el error para manejarlo en componentes que llaman a signIn
        }
    };

    const signUp = async (email: string, password: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User signed up successfully:', userCredential.user.uid);
        } catch (error) {
            console.error('Error signing up:', error);
            throw error; // Propagar el error para manejarlo en componentes que llaman a signUp
        }
    };

    const logout = async () => {
        return await signOut(auth);
    };

    const verifyToken = async (token: string) => {
        const baseUrl = "http://localhost:8000/verify-token/";
        const url = new URL(baseUrl);
        url.searchParams.append('token', token);

        const payload = {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            }
        };

        try {
            const response = await fetch(url.href, payload);

            if (!response.ok) {
                const errorText = await response.text(); // Obtener cuerpo de error de la respuesta
                throw new Error(`Network response was not ok: ${errorText}`);
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Fetch error:", error);
            throw error; // Propagar el error para manejarlo en componentes que llaman a verifyToken
        }
    };

    return { user, signIn, signUp, logout, verifyToken };
}
