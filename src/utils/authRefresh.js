export const refreshToken = async () => {
  try {
    console.log("Sending refresh token request...");
    const res = await fetch("http://localhost:8080/api/auth/refresh-token", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log("Refresh token response:", res.status, data);

    if (!res.ok) {
      throw new Error(data.message || "Không thể làm mới token");
    }

    const newAccessToken = data?.data?.accessToken || data?.accessToken;
    if (!newAccessToken) {
      throw new Error("Không nhận được accessToken mới");
    }

    localStorage.setItem("accessToken", newAccessToken);
    return { accessToken: newAccessToken };
  } catch (err) {
    console.error("Refresh token error:", err.message);
    throw err;
  }
};