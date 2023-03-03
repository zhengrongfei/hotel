import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import useRefresh from "../../hooks/useRefresh";
import useAuth from "../../hooks/useAuth";
import Loading from "../interfaces/Loading";

function Login() {
  const [loading, setLoading] = useState(true);
  const refresh = useRefresh();
  const { auth, persist } = useAuth();

  useEffect(() => {
    let mounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        mounted && setLoading(false);
      }
    }
    // avoids not persistent calls to verifyRefreshToken
    !auth?.accessToken && persist ? verifyRefreshToken() : setLoading(false);

    return () => mounted = false;
  }, [])

  useEffect(() => {
    console.log(`loading: ${loading}`)
    console.log(`access token: ${JSON.stringify(auth?.accessToken)}`)
  }, [loading])

  return (
    !persist
      ? <Outlet />
      : loading
        ? <><Outlet /><Loading /></>
        : <Outlet />
  )
}

export default Login