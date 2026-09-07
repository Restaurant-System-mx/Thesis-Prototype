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
                    "/auth/me", 
                );

                if (!response.ok) {
                    setUser(null);
                    return;
                }

                const data = await response.json();

                setUser(data.user);

            } catch (error) {
                console.error("Session verification error:", error);
                
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
                method: "POST",
            }
        );
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            clearCsrfToken();
            setUser(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">

            {!user ? (
                <Login onLogin={handleLogin} />
            ) : (
                <div className="min-h-screen flex items-center justify-center px-4">

                    <div className="text-center">

                        <h1 className="text-3xl font-bold text-slate-800">
                            Welcome, {user.first_name}
                        </h1>

                        <p className="mt-3 text-slate-600">
                            Role:{" "}
                            <span className="font-semibold">
                                {user.role}
                            </span>
                        </p>

                        <button
                            onClick={handleLogout}
                            className="mt-6 rounded-lg bg-[#86BEDA] px-5 py-3 font-bold text-slate-800 transition hover:brightness-95"
                        >
                            Sign out
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}

export default App;