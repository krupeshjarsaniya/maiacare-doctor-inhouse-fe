import React, { useEffect, useState } from 'react'
import Button from './ui/Button'
import Image from 'next/image'
import { FiLogOut } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import deviceWindowsImg from "@/assets/images/device-windows.png";
import deviceMobileImg from "@/assets/images/device-mobile.png";;
import { getLoggedInDevice, logout } from "@/utils/apis/apiHelper";
import { useRouter } from 'next/navigation';
import { setLogoutState } from '@/utils/redux/slices/logout';
import { useDispatch } from 'react-redux';
import { removeTokenCookie } from '@/utils/Helper';
import { clearToken } from '@/Hook/Redux/Slice/tokenSlice';
import { setAuthData } from '@/Hook/Redux/Slice/authSlice';

type Device = {
    _id: string;
    deviceId: string;
    userAgent: string;
    lastLogin: string;
    isActive: boolean;
};
const SettingsDevices = () => {
    const router = useRouter();
    // const dispatch = useDispatch();

    const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
  const token = localStorage.getItem("token");

  getLoggedInDevice({ token })
    .then((response) => {
      if (response.data?.status) {
        setDevices(response.data.data); // <-- Correct
      } else {
        console.log("Error fetching devices");
      }
    })
    .catch((err) => console.log(err));
}, []);

    // Based on userAgent, decide image
    const getDeviceImage = (userAgent: string) => {
        if (userAgent.toLowerCase().includes("windows")) return deviceWindowsImg;
        if (userAgent.toLowerCase().includes("android")) return deviceMobileImg;
        return deviceWindowsImg;
    };


    // Logout api // 

    const dispatch = useDispatch();
    const handleLogout = async () => {
        try {
            const response = await logout(); // call API

            // Check for successful logout
            if (response.data?.status) {
                console.log("Logout successful:", response.data.message);

                // Clear all local data
                removeTokenCookie();
                dispatch(clearToken());
                dispatch(setAuthData({}));
                dispatch(setLogoutState(true));
                localStorage.clear();

                router.push("/login"); // redirect to home or login
            }
            // Check for error returned inside 'details'
            else if (response.data?.details?.status === false) {
                console.error("Logout failed:", response.data.details.message);
            }
            else {
                console.error("Logout failed:", response.data.message || "Unknown error");
            }

        } catch (error: unknown) {
            // Catch network or unexpected errors
            console.error("Logout API error:", error);
        }
    };

    return (
        <>
            <p className="settings-accordion-subtitle my-4">Where you're signed in</p>
            <div className="d-flex flex-column gap-4 ">
            {devices.map(device => (
  <div key={device._id} className="your-device-box d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-start align-items-lg-center">
    
    <div className="d-flex justify-content-center align-items-center gap-xl-3 gap-2">
      <Image 
        src={getDeviceImage(device.userAgent)} 
        width={70}
        height={70}
        alt="device"
        className="your-device-box-img"
      />

      <div>
        <h6 className="your-device-box-title mb-1">
          {device.userAgent.includes("Postman") ? "Postman Client" : device.userAgent}
        </h6>

        <p className="your-device-box-subtitle mb-0">
          Device ID: {device.deviceId}
        </p>

        <p className="your-device-box-subtitle mb-0">
          Last Login: {new Date(device.lastLogin).toLocaleString()}
        </p>
      </div>
    </div>

    <div className="d-flex flex-row flex-lg-column gap-2">
      <Button variant="default" contentSize="small" onClick={handleLogout}>
        <div className="d-flex align-items-center gap-2">
          <FiLogOut color="#FFFFFF" fontSize={16} /> Log Out
        </div>
      </Button>

      <Button variant="outline" contentSize="small">
        <div className="d-flex align-items-center gap-2">
          <RiDeleteBin6Line color="#2B4360" fontSize={16} /> Delete Device
        </div>
      </Button>
    </div>
  </div>
))}

            </div>
        </>
    )
}

export default SettingsDevices