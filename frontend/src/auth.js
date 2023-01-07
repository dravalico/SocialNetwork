export const state = {
    user: {},
    isAuthenticated: false
};

export async function verifyAuth() {
    const url = "http://localhost:3000/api/social/whoami";
    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (res.ok) {
        let user = await res.json();
        state.user = user;
        state.isAuthenticated = true;
        console.log(state);
    } else {
        state.user = {};
        state.isAuthenticated = false;
    }
}
