"use client";

import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { AppDispatch } from "@/utils/redux/store";
import { setHeaderData } from "@/Hook/Redux/Slice/headerSlice";
import Dashboard from "@/components/Dashboard";

function Page() {
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(setHeaderData({ title: "Doctors", subtitle: "Doctor - Dashboard" }));
  }, []);
  return (
    <div>
      {/* <h1 className="font-geist-sans">a Doctors</h1> */}
      <Dashboard/>
    </div>
  );
}

export default Page;  
