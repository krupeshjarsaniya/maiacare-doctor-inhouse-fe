"use client";

import { AppDispatch } from "@/utils/redux/store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setHeaderData } from "@/utils/redux/slices/headerSlice";
import { Suspense } from "react";
import Consultation from "@/components/Consultation";

export default function PatientsPage() {
  const dispatch: AppDispatch = useDispatch();


  useEffect(() => {
   dispatch(setHeaderData({ title: "Appointments  ", }));
  }, []);

  return (
   <div>
      <Suspense fallback={<div>Loading consultations...</div>}>
        <Consultation />
      </Suspense>
    </div>
  );
  
}

