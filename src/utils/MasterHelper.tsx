"use client";
import React, { FC, ReactNode, useEffect, useState } from "react";
import SiteLayout from "@/components/layout/SiteLayout";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/Hook/Redux/Store/store";
import { usePathname } from "next/navigation";
import { getLoginUser } from "./apis/apiHelper";
import { setAuthData } from "@/Hook/Redux/Slice/authSlice";
import { setToken } from "@/Hook/Redux/Slice/tokenSlice";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { getTokenFromCookie } from "./Helper";
import { RootState } from "@/Hook/Redux/Store/store";
import { ToastContainer } from "react-bootstrap";

interface MasterProps {
  children: ReactNode;
}

const Master: React.FC<MasterProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <MasterHelper>{children}</MasterHelper>
      <ToastContainer />
    </Provider>
  );
};

export default Master;

function MasterHelper({ children }: MasterProps) {
  const [collapsed, setCollapsed] = useState(true);
  const authPages = ["/login", "/register", "/forgotppassword", "/resetpassword", "/verification"];
  const pathName = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const token = useSelector((state: RootState) => state.token.token);

  const getUser = async () => {
    const response = await getLoginUser();
    if (response.status) {
      dispatch(setAuthData(response?.data?.data));
    }
  }

  useEffect(() => {
    // const localToken = localStorage.getItem("token");
    const localToken = getTokenFromCookie();
    // console.log("localToken", localToken);

    if (localToken) {
      if (authPages.includes(pathName)) {
        router.push("/dashboard")
      }
      dispatch(setToken(localToken));
      getUser();
    } else {
      if (pathname == "/dashboard") {
        // router.push("/");
      }
    }
  }, [pathname, token]);

  return (
    <main>
      {authPages.includes(pathName) ? (
        children //Implement auth layout here 
      ) : (
        <div className="d-flex">
          <SiteLayout collapsed={collapsed} setCollapsed={setCollapsed}>
            {children}
          </SiteLayout>
        </div>
      )}
    </main>
  )
}
