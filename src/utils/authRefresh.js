export const refreshToken = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/auth/refresh-token", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Không thể làm mới token");
    }

    const data = await res.json();
    const newAccessToken = data?.data?.accessToken || data?.accessToken;
    if (!newAccessToken) {
      throw new Error("Không nhận được accessToken mới");
    }

    localStorage.setItem("accessToken", newAccessToken);
    return { accessToken: newAccessToken };
  } catch (err) {
    throw err;
  }
};