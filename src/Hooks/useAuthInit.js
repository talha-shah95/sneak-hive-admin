import { useEffect } from "react";
import useUserStore from "../Store/UserStore";

const useAuthInit = () => {
  const { setToken, setUser, setRole, setIsLoggedIn } = useUserStore();

  useEffect(() => {
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    const userString =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    const userRole =
      localStorage.getItem("role") || sessionStorage.getItem("role");

    if (token && userString && userRole) {
      const parsedUser = JSON.parse(userString);
      setToken(token);
      setUser(parsedUser);
      setRole(userRole);
      setIsLoggedIn(true);
    } else {
      setToken(null);
      setUser(null);
      setRole(null);
      setIsLoggedIn(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useAuthInit;
