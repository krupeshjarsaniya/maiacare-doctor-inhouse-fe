"use client";

import { AppDispatch } from "@/utils/redux/store";
import { useDispatch } from "react-redux";
import { Suspense, useEffect } from "react";
import { setHeaderData } from "@/Hook/Redux/Slice/headerSlice";
import EditProfile from "../../components/Edit-Profile";

function Page() {
    const dispatch: AppDispatch = useDispatch();

    
  useEffect(() => {
    dispatch(setHeaderData({ title: "EditProfile", subtitle: " profile >  EditProfile" })); 
  }, []);
  
  return (
        <Suspense fallback={<div></div>}>
          <EditProfile/>
        </Suspense>
    
  );

}

export default Page;