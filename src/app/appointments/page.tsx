"use client";

import { AppDispatch } from "@/utils/redux/store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setHeaderData } from "@/Hook/Redux/Slice/headerSlice";
import AppointmentPatientDetailPage from "@/components/AppointmentPatientDetailPage";

function Page() {
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(setHeaderData({ title: "Appointments", subtitle: "Appointments List" }));
  }, []);
  return (
    <div>
      {/* Pass the data to the component */}
      {/* <AppointmentPatientDetailPage /> */}
      <h4>AppointmentPatient</h4>
    </div>
  )
}

export default Page;