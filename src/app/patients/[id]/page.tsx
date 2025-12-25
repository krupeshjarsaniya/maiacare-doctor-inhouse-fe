"use client";

import { useParams } from "next/navigation";
import PatientDetailPageComponent from "@/components/PatientDetailPage";
import { AppDispatch } from "@/utils/redux/store";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { setHeaderData } from "@/utils/redux/slices/headerSlice";

export default function PatientDetailPage() {
    const dispatch: AppDispatch = useDispatch();

    // receives patient name from child & updates header
    const handleHeaderUpdate = useCallback((name: string) => {
        dispatch(setHeaderData({ title: name }));
    }, [dispatch]);

    return (
        <div>
            <PatientDetailPageComponent onPatientLoaded={handleHeaderUpdate} />
        </div>
    );
}
