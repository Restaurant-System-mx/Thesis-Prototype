import {
    fetchWithCsrf,
    refreshCsrfToken
} from "./csrf";

const API_URL = "http://localhost:3000/api";

let refreshPromise = null;

const refreshAccessToken = async () => {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async () => {
        try {
            let response = await fetchWithCsrf(
                `${API_URL}/auth/refresh`,
                {
                    method: "POST"
                }
            );

            if (
                response.status === 403
            ) {
                await refreshCsrfToken();

                response = await fetchWithCsrf(
                    `${API_URL}/auth/refresh`,
                    {
                        method: "POST"
                    }
                );
            }

            return response.ok;
        } catch (error) {
            console.error(
                "Token refresh error:",
                error
            );

            return false;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};

const apiFetch = async (
    endpoint,
    options = {}
) => {
    const url = `${API_URL}${endpoint}`;

    const response = await fetchWithCsrf(
        url,
        options
    );

    if (response.status !== 401) {
        return response;
    }

    const isAuthEndpoint =
        endpoint.startsWith("/auth/refresh") ||
        endpoint.startsWith("/auth/login") ||
        endpoint.startsWith("/auth/logout");

    if (isAuthEndpoint) {
        return response;
    }

    const refreshed =
        await refreshAccessToken();

    if (!refreshed) {
        return response;
    }

    return fetchWithCsrf(
        url,
        options
    );
};

export {
    apiFetch,
    refreshAccessToken
};