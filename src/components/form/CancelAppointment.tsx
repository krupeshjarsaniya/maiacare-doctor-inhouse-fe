"use client"

import { ChangeEvent, FormEvent, useState } from "react";
import { InputSelect } from "../ui/InputSelect"
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";

import Modal from "../ui/Modal";
import Image from "next/image";
import SuccessImageCancel from '../../assets/images/CancelAppointment.png'
import toast from "react-hot-toast";
import { BsInfoCircle } from "react-icons/bs";
import { CancelAppointmentForm } from "@/utils/types/interfaces";

type FormError = Partial<Record<keyof CancelAppointmentForm, string>>;

// Initial state
const initialFormData: CancelAppointmentForm = {
    reason: "",
    notes: "",
};

const initialFormError: FormError = {};

export function CancelAppointment({
    setCancelModal,
    setShowSuccessModalCancel,
    selectedPatient,
}: {
    setCancelModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowSuccessModalCancel: React.Dispatch<React.SetStateAction<boolean>>;
    selectedPatient?: any;
}) {
    const [formData, setFormData] = useState<CancelAppointmentForm>(initialFormData);
    const [formError, setFormError] = useState<FormError>(initialFormError);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormError((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = (formData: CancelAppointmentForm) => {
        const errors: FormError = {};
        if (!formData.reason) {
            errors.reason = "Reason for cancelling appointment is required";
        }
        return errors;
    };

    const handelSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = validateForm(formData);
        setFormError(errors);

        if (Object.keys(errors).length === 0) {

            const updatedFormData = {
                ...formData,
                appointmentId: selectedPatient?.id,
            }
            // Inside on success :-
            setCancelModal(false);
            setShowSuccessModalCancel(true);
            setFormError(initialFormError);


            // console.log("CancelModal form : ", updatedFormData);

            // cancelappointment(updatedFormData).then((response) => {
            //     if (response.data.status) {
            //         console.log("cancelappointment response : ", response);

            //         setCancelModal(false);
            //         setShowSuccessModalCancel(true);
            //         setFormError(initialFormError);
            //         toast.success(response.data.message, {
            //             icon: <BsInfoCircle size={22} color="white" />,
            //         });

            //     } else {
            //         console.log("error");
            //     }
            // }).catch((err) => {
            //     console.log("error", err?.response);

            //     const apiError = err?.response?.data;

            //     // extract dynamic error message
            //     const fieldError =
            //         apiError?.details?.errors
            //             ? Object.values(apiError.details.errors)[0]   // pick first field error
            //             : null;

            //     const message =
            //         fieldError ||
            //         apiError?.details?.message ||
            //         apiError?.message ||
            //         "Something went wrong";

            //     toast.error(message);
            // });
        }
    };

    // console.log("selectedPatient : ", selectedPatient);

    return (
        <>
            <form onSubmit={handelSubmit}>
                <div className="d-flex flex-column gap-3">
                    {/* <h6 className="dashboard-chart-heading m-0">Are you sure you want to cancel the appointment?</h6> */}
                    {/* <AppointmentProfile tempProfileData={tempAppointmentProfileData} /> */}

                    {/* <div className="appointment-reschedule-profile-box">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex justify-content-center align-items-center gap-2">
                                <Image src={selectedPatient?.patient?.profileImage} width={52} height={52} alt="appointment-profile" />
                                <div>
                                    <span className="appointment-reschedule-profile-name mb-2">{selectedPatient?.patient?.name}</span>
                                    <div className="d-flex flex-wrap gap-2">
                                        <div className="d-flex gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                                                <path d="M6.1618 13.95C6.22091 13.9944 6.28821 14.0268 6.35984 14.0452C6.43147 14.0636 6.50602 14.0676 6.57923 14.0572C6.65244 14.0467 6.72287 14.022 6.78649 13.9843C6.85011 13.9466 6.90567 13.8967 6.95 13.8375C7.29057 13.3834 7.73219 13.0148 8.23988 12.761C8.74757 12.5072 9.30738 12.375 9.875 12.375C10.4426 12.375 11.0024 12.5072 11.5101 12.761C12.0178 13.0148 12.4594 13.3834 12.8 13.8375C12.8443 13.8966 12.8998 13.9464 12.9634 13.984C13.027 14.0217 13.0973 14.0464 13.1705 14.0568C13.2436 14.0673 13.318 14.0632 13.3896 14.0449C13.4612 14.0266 13.5284 13.9943 13.5875 13.95C13.6466 13.9057 13.6964 13.8502 13.734 13.7866C13.7717 13.723 13.7964 13.6527 13.8068 13.5795C13.8173 13.5064 13.8132 13.432 13.7949 13.3604C13.7766 13.2888 13.7443 13.2216 13.7 13.1625C13.2019 12.4947 12.5377 11.9689 11.7734 11.6374C12.1923 11.255 12.4857 10.7549 12.6153 10.2028C12.7448 9.6506 12.7044 9.07218 12.4993 8.54341C12.2942 8.01463 11.9341 7.56021 11.4661 7.23978C10.9982 6.91935 10.4443 6.74788 9.87711 6.74788C9.30996 6.74788 8.75606 6.91935 8.2881 7.23978C7.82014 7.56021 7.45999 8.01463 7.25491 8.54341C7.04984 9.07218 7.00941 9.6506 7.13895 10.2028C7.26849 10.7549 7.56194 11.255 7.98078 11.6374C7.21496 11.9683 6.54925 12.4941 6.05 13.1625C5.96041 13.2818 5.92187 13.4317 5.94283 13.5794C5.9638 13.7271 6.04256 13.8604 6.1618 13.95ZM9.875 7.875C10.2088 7.875 10.535 7.97397 10.8125 8.1594C11.09 8.34482 11.3063 8.60837 11.434 8.91672C11.5618 9.22507 11.5952 9.56437 11.5301 9.89172C11.465 10.2191 11.3042 10.5197 11.0682 10.7557C10.8322 10.9917 10.5316 11.1525 10.2042 11.2176C9.87687 11.2827 9.53757 11.2493 9.22922 11.1215C8.92087 10.9938 8.65732 10.7775 8.4719 10.5C8.28647 10.2225 8.1875 9.89626 8.1875 9.5625C8.1875 9.11495 8.36529 8.68572 8.68176 8.36926C8.99822 8.05279 9.42745 7.875 9.875 7.875ZM14.9375 1.6875H4.8125C4.51413 1.6875 4.22798 1.80603 4.017 2.017C3.80603 2.22798 3.6875 2.51413 3.6875 2.8125V15.1875C3.6875 15.4859 3.80603 15.772 4.017 15.983C4.22798 16.194 4.51413 16.3125 4.8125 16.3125H14.9375C15.2359 16.3125 15.522 16.194 15.733 15.983C15.944 15.772 16.0625 15.4859 16.0625 15.1875V2.8125C16.0625 2.51413 15.944 2.22798 15.733 2.017C15.522 1.80603 15.2359 1.6875 14.9375 1.6875ZM14.9375 15.1875H4.8125V2.8125H14.9375V15.1875ZM7.0625 4.5C7.0625 4.35082 7.12176 4.20774 7.22725 4.10225C7.33274 3.99676 7.47582 3.9375 7.625 3.9375H12.125C12.2742 3.9375 12.4173 3.99676 12.5227 4.10225C12.6282 4.20774 12.6875 4.35082 12.6875 4.5C12.6875 4.64918 12.6282 4.79226 12.5227 4.89775C12.4173 5.00324 12.2742 5.0625 12.125 5.0625H7.625C7.47582 5.0625 7.33274 5.00324 7.22725 4.89775C7.12176 4.79226 7.0625 4.64918 7.0625 4.5Z" fill="#8A8D93" />
                                            </svg>
                                            <span className="appointment-reschedule-profile-detail">{selectedPatient?.appointId || "123"}</span>
                                        </div>
                                        <div className="d-flex gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                                                <path d="M15.5 7.31243C15.5 6.2239 15.1841 5.15875 14.5907 4.24617C13.9974 3.33359 13.1519 2.61279 12.157 2.17119C11.1621 1.72958 10.0604 1.58615 8.98553 1.75827C7.91069 1.9304 6.90888 2.4107 6.10161 3.14092C5.29434 3.87113 4.71628 4.81989 4.43754 5.87214C4.1588 6.92438 4.19137 8.03489 4.53128 9.06899C4.87119 10.1031 5.50385 11.0164 6.35252 11.698C7.20119 12.3797 8.22942 12.8005 9.3125 12.9093V16.3124C9.3125 16.4616 9.37176 16.6047 9.47725 16.7102C9.58274 16.8157 9.72582 16.8749 9.875 16.8749C10.0242 16.8749 10.1673 16.8157 10.2727 16.7102C10.3782 16.6047 10.4375 16.4616 10.4375 16.3124V12.9093C11.8243 12.7682 13.1095 12.1178 14.0446 11.084C14.9797 10.0502 15.4983 8.70641 15.5 7.31243ZM9.875 11.8124C8.98498 11.8124 8.11496 11.5485 7.37493 11.054C6.63491 10.5596 6.05814 9.85678 5.71754 9.03451C5.37695 8.21224 5.28783 7.30744 5.46147 6.43453C5.6351 5.56161 6.06368 4.75979 6.69302 4.13045C7.32236 3.50112 8.12418 3.07253 8.99709 2.8989C9.87001 2.72527 10.7748 2.81438 11.5971 3.15497C12.4193 3.49557 13.1221 4.07235 13.6166 4.81237C14.1111 5.55239 14.375 6.42242 14.375 7.31243C14.3737 8.50551 13.8992 9.64934 13.0555 10.493C12.2119 11.3366 11.0681 11.8111 9.875 11.8124Z" fill="#8A8D93" />
                                            </svg>
                                            <span className="appointment-reschedule-profile-detail">{selectedPatient?.patient?.gender || "static"}</span>
                                        </div>
                                        <div className="d-flex gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                                                <g clipPath="url(#clip0_2362_385256)">
                                                    <path d="M10.1001 17.8127C9.16256 17.8127 8.18756 17.6627 7.21256 17.3252C2.63756 15.7502 0.200061 10.7252 1.77506 6.11271C3.35006 1.53771 8.37506 -0.899793 12.9876 0.675207C15.1251 1.42521 16.8876 2.92521 17.9001 4.91271C18.0501 5.17521 17.9376 5.51271 17.6751 5.62521C17.4126 5.77521 17.0751 5.66271 16.9626 5.40021C16.0626 3.63771 14.5251 2.32521 12.6501 1.68771C8.60006 0.300207 4.17506 2.43771 2.78756 6.48771C1.40006 10.5377 3.53756 14.9252 7.55006 16.3127C11.5626 17.7002 15.9876 15.5627 17.3751 11.5502C17.4876 11.2502 17.7876 11.1377 18.0501 11.2127C18.3501 11.3252 18.4626 11.6252 18.3876 11.8877C17.1876 15.5252 13.7376 17.8127 10.1001 17.8127Z" fill="#8A8D93" />
                                                    <path d="M17.5626 5.85039L14.45 5.81289C14.15 5.81289 13.925 5.55039 13.925 5.25039C13.925 4.95039 14.1875 4.72539 14.4875 4.72539L17.0751 4.76289L17.1125 2.17539C17.1125 1.87539 17.3375 1.65039 17.675 1.65039C17.975 1.65039 18.2001 1.91289 18.2001 2.21289L18.1251 5.28789C18.1251 5.43789 18.05 5.55039 17.975 5.66289C17.8625 5.77539 17.7125 5.85039 17.5626 5.85039Z" fill="#8A8D93" />
                                                    <path d="M7.77505 10.2377L7.43755 9.4502H5.93755L5.60005 10.2377H4.73755L6.31255 6.6377H7.10005L8.67505 10.2377H7.77505ZM6.68755 7.7252L6.23755 8.7752H7.13755L6.68755 7.7252ZM11 9.7877C10.7375 10.0502 10.4375 10.2002 10.1 10.2002C9.72505 10.2002 9.42505 10.0877 9.20005 9.8252C8.93755 9.5627 8.82505 9.2627 8.82505 8.8502C8.82505 8.4377 8.93755 8.1002 9.20005 7.8377C9.46255 7.57519 9.76255 7.42519 10.0625 7.42519C10.4 7.42519 10.6625 7.57519 10.8875 7.8377V7.46269H11.675V9.86269C11.675 10.1252 11.6375 10.3127 11.5625 10.5377C11.4875 10.7252 11.375 10.8752 11.225 10.9877C10.925 11.2127 10.5875 11.3252 10.2125 11.3252C9.98755 11.3252 9.80005 11.2877 9.57505 11.2127C9.35005 11.1377 9.16255 11.0627 9.01255 10.9127L9.31255 10.3127C9.57505 10.5002 9.83755 10.6127 10.1375 10.6127C10.4375 10.6127 10.6625 10.5377 10.8125 10.3877C10.925 10.3127 11 10.0877 11 9.7877ZM10.8875 8.8127C10.8875 8.5877 10.8125 8.4002 10.7 8.2877C10.5875 8.1752 10.4375 8.1002 10.25 8.1002C10.0625 8.1002 9.91255 8.1752 9.76255 8.2877C9.61255 8.4002 9.57505 8.5877 9.57505 8.8127C9.57505 9.0377 9.65005 9.2252 9.76255 9.3377C9.87505 9.4877 10.0625 9.5252 10.25 9.5252C10.4375 9.5252 10.5875 9.4502 10.7 9.3377C10.85 9.2252 10.8875 9.0377 10.8875 8.8127ZM14.7875 9.86269C14.4875 10.1627 14.1125 10.3127 13.7 10.3127C13.2875 10.3127 12.9125 10.2002 12.65 9.9377C12.3875 9.6752 12.2375 9.3377 12.2375 8.8877C12.2375 8.4377 12.3875 8.1002 12.65 7.8377C12.9125 7.57519 13.25 7.46269 13.625 7.46269C14 7.46269 14.3375 7.57519 14.6 7.80019C14.8625 8.02519 15.0125 8.36269 15.0125 8.73769V9.1502H12.9875C13.025 9.30019 13.1 9.4127 13.2125 9.5252C13.3625 9.6377 13.5125 9.67519 13.6625 9.67519C13.925 9.67519 14.15 9.6002 14.3375 9.4127L14.7875 9.86269ZM14.075 8.2127C13.9625 8.13769 13.85 8.0627 13.7 8.0627C13.55 8.0627 13.4 8.1002 13.2875 8.2127C13.175 8.2877 13.1 8.4377 13.0625 8.5877H14.2625C14.225 8.4377 14.15 8.2877 14.075 8.2127Z" fill="#8A8D93" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_2362_385256">
                                                        <rect width="18" height="18" fill="white" transform="translate(0.875)" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <span className="appointment-reschedule-profile-detail">{selectedPatient?.patient?.year || "31 Years static"} </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <div className="appointment-reschedule-profile-icon-box">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 25 25" fill="none">
                                        <path d="M18.914 6.33984V16.0898C18.914 16.2888 18.835 16.4795 18.6943 16.6202C18.5537 16.7608 18.3629 16.8398 18.164 16.8398C17.9651 16.8398 17.7743 16.7608 17.6337 16.6202C17.493 16.4795 17.414 16.2888 17.414 16.0898V8.15016L6.69462 18.8705C6.55389 19.0112 6.36301 19.0903 6.16399 19.0903C5.96497 19.0903 5.7741 19.0112 5.63337 18.8705C5.49264 18.7297 5.41357 18.5389 5.41357 18.3398C5.41357 18.1408 5.49264 17.9499 5.63337 17.8092L16.3537 7.08984H8.41399C8.21508 7.08984 8.02431 7.01083 7.88366 6.87017C7.74301 6.72952 7.66399 6.53876 7.66399 6.33984C7.66399 6.14093 7.74301 5.95017 7.88366 5.80951C8.02431 5.66886 8.21508 5.58984 8.41399 5.58984H18.164C18.3629 5.58984 18.5537 5.66886 18.6943 5.80951C18.835 5.95017 18.914 6.14093 18.914 6.33984Z" fill="#2B4360" />
                                    </svg>
                                </div>
                                <div className="appointment-reschedule-profile-icon-box">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                        <path d="M14.375 3H11.875V2.5C11.875 2.10218 11.717 1.72064 11.4357 1.43934C11.1544 1.15804 10.7728 1 10.375 1H7.375C6.97718 1 6.59564 1.15804 6.31434 1.43934C6.03304 1.72064 5.875 2.10218 5.875 2.5V3H3.375C3.24239 3 3.11521 3.05268 3.02145 3.14645C2.92768 3.24021 2.875 3.36739 2.875 3.5C2.875 3.63261 2.92768 3.75979 3.02145 3.85355C3.11521 3.94732 3.24239 4 3.375 4H3.875V13C3.875 13.2652 3.98036 13.5196 4.16789 13.7071C4.35543 13.8946 4.60978 14 4.875 14H12.875C13.1402 14 13.3946 13.8946 13.5821 13.7071C13.7696 13.5196 13.875 13.2652 13.875 13V4H14.375C14.5076 4 14.6348 3.94732 14.7286 3.85355C14.8223 3.75979 14.875 3.63261 14.875 3.5C14.875 3.36739 14.8223 3.24021 14.7286 3.14645C14.6348 3.05268 14.5076 3 14.375 3ZM6.875 2.5C6.875 2.36739 6.92768 2.24021 7.02145 2.14645C7.11521 2.05268 7.24239 2 7.375 2H10.375C10.5076 2 10.6348 2.05268 10.7286 2.14645C10.8223 2.24021 10.875 2.36739 10.875 2.5V3H6.875V2.5ZM12.875 13H4.875V4H12.875V13ZM7.875 6.5V10.5C7.875 10.6326 7.82232 10.7598 7.72855 10.8536C7.63479 10.9473 7.50761 11 7.375 11C7.24239 11 7.11521 10.9473 7.02145 10.8536C6.92768 10.7598 6.875 10.6326 6.875 10.5V6.5C6.875 6.36739 6.92768 6.24021 7.02145 6.14645C7.11521 6.05268 7.24239 6 7.375 6C7.50761 6 7.63479 6.05268 7.72855 6.14645C7.82232 6.24021 7.875 6.36739 7.875 6.5ZM10.875 6.5V10.5C10.875 10.6326 10.8223 10.7598 10.7286 10.8536C10.6348 10.9473 10.5076 11 10.375 11C10.2424 11 10.1152 10.9473 10.0214 10.8536C9.92768 10.7598 9.875 10.6326 9.875 10.5V6.5C9.875 6.36739 9.92768 6.24021 10.0214 6.14645C10.1152 6.05268 10.2424 6 10.375 6C10.5076 6 10.6348 6.05268 10.7286 6.14645C10.8223 6.24021 10.875 6.36739 10.875 6.5Z" fill="#2B4360" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex flex-wrap gap-2 mt-3">
                            <div className="d-flex gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                    <path d="M13.875 2H12.375V1.5C12.375 1.36739 12.3223 1.24021 12.2286 1.14645C12.1348 1.05268 12.0076 1 11.875 1C11.7424 1 11.6152 1.05268 11.5214 1.14645C11.4277 1.24021 11.375 1.36739 11.375 1.5V2H6.375V1.5C6.375 1.36739 6.32232 1.24021 6.22855 1.14645C6.13479 1.05268 6.00761 1 5.875 1C5.74239 1 5.61521 1.05268 5.52145 1.14645C5.42768 1.24021 5.375 1.36739 5.375 1.5V2H3.875C3.60978 2 3.35543 2.10536 3.16789 2.29289C2.98036 2.48043 2.875 2.73478 2.875 3V13C2.875 13.2652 2.98036 13.5196 3.16789 13.7071C3.35543 13.8946 3.60978 14 3.875 14H13.875C14.1402 14 14.3946 13.8946 14.5821 13.7071C14.7696 13.5196 14.875 13.2652 14.875 13V3C14.875 2.73478 14.7696 2.48043 14.5821 2.29289C14.3946 2.10536 14.1402 2 13.875 2ZM5.375 3V3.5C5.375 3.63261 5.42768 3.75979 5.52145 3.85355C5.61521 3.94732 5.74239 4 5.875 4C6.00761 4 6.13479 3.94732 6.22855 3.85355C6.32232 3.75979 6.375 3.63261 6.375 3.5V3H11.375V3.5C11.375 3.63261 11.4277 3.75979 11.5214 3.85355C11.6152 3.94732 11.7424 4 11.875 4C12.0076 4 12.1348 3.94732 12.2286 3.85355C12.3223 3.75979 12.375 3.63261 12.375 3.5V3H13.875V5H3.875V3H5.375ZM13.875 13H3.875V6H13.875V13Z" fill="#8A8D93" />
                                </svg>
                                <span className="appointment-reschedule-profile-schedule-detail">{selectedPatient?.appointmentDate}</span>
                            </div>

                            <div className="d-flex gap-2">
                                <div className="d-flex gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                        <path d="M8.875 1.5C7.58942 1.5 6.33272 1.88122 5.2638 2.59545C4.19488 3.30968 3.36176 4.32484 2.86979 5.51256C2.37782 6.70028 2.24909 8.00721 2.4999 9.26809C2.7507 10.529 3.36977 11.6872 4.27881 12.5962C5.18785 13.5052 6.34604 14.1243 7.60692 14.3751C8.86779 14.6259 10.1747 14.4972 11.3624 14.0052C12.5502 13.5132 13.5653 12.6801 14.2796 11.6112C14.9938 10.5423 15.375 9.28558 15.375 8C15.3732 6.27665 14.6878 4.62441 13.4692 3.40582C12.2506 2.18722 10.5984 1.50182 8.875 1.5ZM8.875 13.5C7.78721 13.5 6.72384 13.1774 5.81937 12.5731C4.9149 11.9687 4.20995 11.1098 3.79367 10.1048C3.37738 9.09977 3.26847 7.9939 3.48068 6.927C3.6929 5.86011 4.21673 4.8801 4.98592 4.11091C5.7551 3.34172 6.73511 2.8179 7.80201 2.60568C8.8689 2.39346 9.97477 2.50238 10.9798 2.91866C11.9848 3.33494 12.8437 4.03989 13.4481 4.94436C14.0524 5.84883 14.375 6.9122 14.375 8C14.3733 9.45818 13.7934 10.8562 12.7623 11.8873C11.7312 12.9184 10.3332 13.4983 8.875 13.5ZM12.875 8C12.875 8.13261 12.8223 8.25979 12.7286 8.35355C12.6348 8.44732 12.5076 8.5 12.375 8.5H8.875C8.74239 8.5 8.61522 8.44732 8.52145 8.35355C8.42768 8.25979 8.375 8.13261 8.375 8V4.5C8.375 4.36739 8.42768 4.24021 8.52145 4.14645C8.61522 4.05268 8.74239 4 8.875 4C9.00761 4 9.13479 4.05268 9.22856 4.14645C9.32232 4.24021 9.375 4.36739 9.375 4.5V7.5H12.375C12.5076 7.5 12.6348 7.55268 12.7286 7.64645C12.8223 7.74021 12.875 7.86739 12.875 8Z" fill="#8A8D93" />
                                    </svg>
                                    <span className="appointment-reschedule-profile-schedule-detail">{selectedPatient?.appointmentTime}</span>
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <div className="d-flex gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                        <path d="M14.375 3.5H11.875V3C11.875 2.60218 11.717 2.22064 11.4357 1.93934C11.1544 1.65804 10.7728 1.5 10.375 1.5H7.375C6.97718 1.5 6.59564 1.65804 6.31434 1.93934C6.03304 2.22064 5.875 2.60218 5.875 3V3.5H3.375C3.10978 3.5 2.85543 3.60536 2.66789 3.79289C2.48036 3.98043 2.375 4.23478 2.375 4.5V12.5C2.375 12.7652 2.48036 13.0196 2.66789 13.2071C2.85543 13.3946 3.10978 13.5 3.375 13.5H14.375C14.6402 13.5 14.8946 13.3946 15.0821 13.2071C15.2696 13.0196 15.375 12.7652 15.375 12.5V4.5C15.375 4.23478 15.2696 3.98043 15.0821 3.79289C14.8946 3.60536 14.6402 3.5 14.375 3.5ZM6.875 3C6.875 2.86739 6.92768 2.74021 7.02145 2.64645C7.11521 2.55268 7.24239 2.5 7.375 2.5H10.375C10.5076 2.5 10.6348 2.55268 10.7286 2.64645C10.8223 2.74021 10.875 2.86739 10.875 3V3.5H6.875V3ZM14.375 12.5H3.375V4.5H14.375V12.5ZM10.875 8.5C10.875 8.63261 10.8223 8.75979 10.7286 8.85355C10.6348 8.94732 10.5076 9 10.375 9H9.375V10C9.375 10.1326 9.32232 10.2598 9.22855 10.3536C9.13479 10.4473 9.00761 10.5 8.875 10.5C8.74239 10.5 8.61521 10.4473 8.52145 10.3536C8.42768 10.2598 8.375 10.1326 8.375 10V9H7.375C7.24239 9 7.11521 8.94732 7.02145 8.85355C6.92768 8.75979 6.875 8.63261 6.875 8.5C6.875 8.36739 6.92768 8.24021 7.02145 8.14645C7.11521 8.05268 7.24239 8 7.375 8H8.375V7C8.375 6.86739 8.42768 6.74021 8.52145 6.64645C8.61521 6.55268 8.74239 6.5 8.875 6.5C9.00761 6.5 9.13479 6.55268 9.22855 6.64645C9.32232 6.74021 9.375 6.86739 9.375 7V8H10.375C10.5076 8 10.6348 8.05268 10.7286 8.14645C10.8223 8.24021 10.875 8.36739 10.875 8.5Z" fill="#8A8D93" />
                                    </svg>
                                    <span className="appointment-reschedule-profile-schedule-detail">{selectedPatient?.reason[0]}</span>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    <InputSelect
                        label="Reason for Cancelling Appointment "
                        name="reason"
                        value={formData.reason}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            handleChange(e);
                        }}
                        onBlur={() => { }}
                        required={true}
                        disabled={false}
                        error={formError.reason}
                        placeholder="Select reason for visit"
                        options={[
                            { id: "1", value: "reason-1", label: "reason-1" },
                            { id: "2", value: "reason-2", label: "reason-2" },
                            { id: "3", value: "reason-3", label: "reason-3" },
                            { id: "4", value: "other", label: "other" },

                        ]}
                    />
                    <Textarea
                        label="Additional Note"
                        name="notes"
                        value={formData.notes}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            handleChange(e);
                        }}
                        onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => { }}
                        required={false}
                        disabled={false}
                        error={formError.notes}
                        maxLength={100}
                    />

                    <Button variant="default" disabled={false} type="submit" className="w-100">
                        Request Cancel Appointment
                    </Button>
                </div>
            </form>

            {/* <Modal
                show={showSuccessModal}
                onHide={() => setShowSuccessModal(false)}
                closeButton={true}
            >
                <div className="text-center">
                    <Image src={SuccessImageCancel} alt="dummyPatientImg" width={200} height={200} />

                    <h3 className="modal-custom-header mt-2">Cancellation Request Sent!</h3>
                    <p className="modal-custom-content">Maiacare will contact you shortly to confirm your request</p>
                </div>

                <div className="d-flex justify-content-center gap-3">
                    <Button variant="outline" disabled={false} className="w-100" >
                        Okay
                    </Button>
                    <Button variant="default" disabled={false} className="w-100" >
                        Book New Appointment
                    </Button>

                </div>
            </Modal> */}
        </>
    )
}

export function SuccessModalCancel({
    showSuccessModalCancel,
    setShowSuccessModalCancel,
    setBookAppointmentModal,
}: {
    showSuccessModalCancel: boolean;
    setShowSuccessModalCancel: React.Dispatch<React.SetStateAction<boolean>>;
    setBookAppointmentModal?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <Modal
            show={showSuccessModalCancel}
            onHide={() => setShowSuccessModalCancel(false)}
            closeButton={true}
        >
            <div className="text-center">
                <Image src={SuccessImageCancel} alt="dummyPatientImg" width={200} height={200} />

                <h3 className="modal-custom-header mt-2">Cancellation Request Sent!</h3>
                <p className="modal-custom-content">Maiacare will contact you shortly to confirm your request</p>
            </div>

            <div className="d-flex justify-content-center gap-3">
                <Button variant="outline" disabled={false} className="w-100" onClick={() => { setShowSuccessModalCancel(false) }} >
                    Okay
                </Button>
                <Button variant="default" disabled={false} className="w-100" onClick={() => {
                    setShowSuccessModalCancel(false);
                    setBookAppointmentModal?.(true)
                }}
                >
                    Book New Appointment
                </Button>

            </div>
        </Modal>
    )
}