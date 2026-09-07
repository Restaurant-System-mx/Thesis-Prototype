let csrfToken = null;

const getCsrfToken = async () => {
    if (csrfToken) {
        return csrfToken;
    }

    const response = await fetch(
        "http://localhost:3000/api/auth/csrf",
        {
            method: "GET",
            credentials: "include"
        }
    );

    if (!response.ok) {
        throw new Error(
            "Unable to obtain CSRF token"
        );
    }

    const data = await response.json();

    csrfToken = data.csrfToken;

    return csrfToken;
};

const refreshCsrfToken = async () => {
    csrfToken = null;

    return getCsrfToken();
};

const clearCsrfToken = () => {
    csrfToken = null;
};

const fetchWithCsrf = async (
    url,
    options = {}
) => {
    const token = await getCsrfToken();

    const headers = {
        ...(options.headers || {}),
        "X-CSRF-Token": token
    };

    return fetch(url, {
        ...options,
        headers,
        credentials: "include"
    });
};

export {
    getCsrfToken,
    refreshCsrfToken,
    clearCsrfToken,
    fetchWithCsrf
};