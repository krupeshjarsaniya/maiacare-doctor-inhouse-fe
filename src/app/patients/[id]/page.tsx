"use client";

import PatientDetailPageComponent from "@/components/PatientDetailPage";
import { AppDispatch } from "@/utils/redux/store";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { setHeaderData } from "@/utils/redux/slices/headerSlice";

export default function PatientDetailPage() {
  const dispatch: AppDispatch = useDispatch();

  // receives patient name from child & updates header
  const handleHeaderUpdate = useCallback(
    (name: string) => {
      dispatch(
        setHeaderData({
          title: name,
          subtitle: `Appointments > ${name}`,
          showBack: true, // 👈 THIS IS THE KEY
        })
      );
    },
    [dispatch]
  );

  return (
    <PatientDetailPageComponent onPatientLoaded={handleHeaderUpdate} />
  );
}
