"use client";

import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { AppDispatch } from "@/utils/redux/store";
import { setHeaderData } from "@/utils/redux/slices/headerSlice";
import Inventory from "@/components/Inventory";
import { Suspense } from "react";

function Page() {
    const dispatch: AppDispatch = useDispatch();
    useEffect(() => {
        dispatch(setHeaderData({ title: "Consultation Bookings " }));
    }, []);
    return (
        <div>
            <Suspense fallback={<div>Loading inventory...</div>}>
                {/* <Inventory /> */}
            </Suspense>
        </div>
    );
}

export default Page;  