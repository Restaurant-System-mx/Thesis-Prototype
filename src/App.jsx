import { useEffect, useState } from "react";
import Login from "./components/Login";

import {
    apiFetch
} from "./services/api";

import {
    fetchWithCsrf,
    clearCsrfToken
} from "./services/csrf";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await apiFetch(
                    "/auth/me"
                );

                if (!response.ok) {
                    setUser(null);
                    return;
                }

                const data = await response.json();

                setUser(data.user);

            } catch (error) {
                console.error(
                    "Session verification error:",
                    error
                );

                setUser(null);

            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
    };

    const handleLogout = async () => {
        try {
            await fetchWithCsrf(
                "http://localhost:3000/api/auth/logout",
                {
                    method: "POST"
                }
            );

        } catch (error) {
            console.error(
                "Logout error:",
                error
            );

        } finally {
            clearCsrfToken();
            setUser(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#86BEDA]" />

                    <p className="mt-4 text-sm text-slate-500">
                        Cargando...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">

            {!user ? (
                <Login onLogin={handleLogin} />
            ) : (
                <div className="min-h-screen">

                    <header className="border-b border-slate-200 bg-white">
                        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                            <div>
                                <h1 className="text-xl font-black text-slate-800">
                                    SysteMAE
                                </h1>

                                <p className="text-sm text-slate-500">
                                    Sistema de gestión
                                </p>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                                Cerrar sesión
                            </button>

                        </div>
                    </header>

                    <main className="mx-auto max-w-7xl px-6 py-10">

                        <div className="mb-8">

                            <p className="text-sm font-medium text-slate-500">
                                Bienvenido de nuevo
                            </p>

                            <h2 className="mt-1 text-3xl font-black text-slate-800">
                                Hola, {user.first_name}
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Aquí comenzará tu espacio de trabajo.
                            </p>

                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-sm text-slate-500">
                                    Usuario
                                </p>

                                <p className="mt-2 font-bold text-slate-800">
                                    {user.username}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-sm text-slate-500">
                                    Rol
                                </p>

                                <p className="mt-2 font-bold text-slate-800">
                                    {user.role}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-sm text-slate-500">
                                    Estado
                                </p>

                                <p className="mt-2 font-bold text-emerald-600">
                                    Sesión activa
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-sm text-slate-500">
                                    Seguridad
                                </p>

                                <p className="mt-2 font-bold text-slate-800">
                                    Protegida
                                </p>
                            </div>

                        </div>

                    </main>

                </div>
            )}

        </div>
    );
}

export default App;