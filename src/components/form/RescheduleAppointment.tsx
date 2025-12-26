"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { InputSelect, InputSelectMultiSelect } from "../ui/InputSelect";
import Button from "../ui/Button";
import { Col, ProgressBar, Row } from "react-bootstrap";
import { DatePickerFieldGroup } from "../ui/CustomDatePicker";
import { TimePickerFieldGroup } from "../ui/CustomTimePicker";
import Modal from "../ui/Modal";
import Image from "next/image";
import SuccessImage from "@/assets/images/rescheduleAppointment.png";
import simpleEditPro from "@/assets/images/Simpleeditpro.png";
import Textarea from "../ui/Textarea";
import { rescheduleappointment } from "@/utils/apis/apiHelper";
import toast from "react-hot-toast";
import { BsInfoCircle } from "react-icons/bs";
import { RescheduleAppointmentForm } from "@/utils/types/interfaces";

interface RescheduleAppointmentProps {
    setRescheduleModal?: React.Dispatch<React.SetStateAction<boolean>>;
    onSuccess?: () => void;
    showSuccessModal?: boolean;
    setShowSuccessModal?: React.Dispatch<React.SetStateAction<boolean>>;
    selectedPatient?: any;
}

export function RescheduleAppointment({
    setRescheduleModal,
    setShowSuccessModal,
    selectedPatient,

}: RescheduleAppointmentProps) {
    console.log("selectedPatient", selectedPatient);

    const reasonOptions = [
        { id: "1", value: "Fertility Support", label: "Fertility Support" },
        { id: "2", value: "IUI", label: "IUI" },
        { id: "3", value: "IVF", label: "IVF" },
        { id: "4", value: "ICSI", label: "ICSI" },
        { id: "5", value: "Other", label: "Other" },
    ]

    type FormError = Partial<Record<keyof RescheduleAppointmentForm, string>>;

    const initialFormData: RescheduleAppointmentForm = {
        reason: "",
        type: "",
        reasonForVisit:
            Array.isArray(selectedPatient?.reason)
                ? selectedPatient.reason.map((item: any) => ({
                    id: reasonOptions.find(opt => opt.value === item)?.id || item,
                    value: item,
                    label: item
                }))
                : [],

        newDate: "",
        newTime: "",
        forTime: "",
        additionalNote: selectedPatient?.additionalNote || "",
    };

    const initialFormError: FormError = {};

    const [formData, setFormData] = useState<RescheduleAppointmentForm>(initialFormData);
    const [formError, setFormError] = useState<FormError>(initialFormError);
    const [step, setStep] = useState<number>(1);
    const [stepper, setStepper] = useState(1);
    const totalSteps = 2;

    const handleChange = (
        e:
            | ChangeEvent<HTMLInputElement>
            | ChangeEvent<HTMLTextAreaElement>
            | ChangeEvent<HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormError((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = (data: RescheduleAppointmentForm): FormError => {
        const errors: FormError = {};
        if (!data.reason.trim()) errors.reason = "Reason is required";
        return errors;
    };

    const validateForm2 = (data: RescheduleAppointmentForm): FormError => {
        const errors: FormError = {};
        // if (!data.type.trim()) errors.type = "Type is required";
        // if (!data.reasonForVisit.length)
        //     errors.reasonForVisit = "Reason for visit is required";
        if (!data.newDate.trim())
            errors.newDate = "Appointment date is required";
        if (!data.newTime.trim())
            errors.newTime = "Appointment time is required";
        return errors;
    };

    const handelNext = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = validateForm(formData);
        setFormError(errors);
        if (Object.keys(errors).length === 0) {
            setStep(2);
            setStepper((prev) => Math.max(1, prev + 1)); // stepper
        }
    };

    const handelSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = validateForm2(formData);
        setFormError(errors);

        if (Object.keys(errors).length === 0) {

            const updatedFormData = {
                appointmentId: selectedPatient?.id,
                reason: formData.reason,
                newDate: formData.newDate,
                newTime: formData.newTime
            }

            console.log("Reschedule form", updatedFormData);

            setStepper((prev) => Math.max(1, prev + 1)); // stepper
            setRescheduleModal?.(false);  // close main modal
            setShowSuccessModal?.(true); // show success modal
            setFormError(initialFormError);
            toast.success("test toast", {
                icon: <BsInfoCircle size={22} color="white" />,
            });

            rescheduleappointment(updatedFormData).then((response) => {
                console.log("Reschedule response ", response);

                setStepper((prev) => Math.max(1, prev + 1)); // stepper
                setRescheduleModal?.(false);  // close main modal
                setShowSuccessModal?.(true); // show success modal
                setFormError(initialFormError);
                toast.success(response.data.message, {
                    icon: <BsInfoCircle size={22} color="white" />,
                });

            }).catch((err) => {
                console.log("error", err?.response);

                const apiError = err?.response?.data;

                // extract dynamic error message
                const fieldError =
                    apiError?.details?.errors
                        ? Object.values(apiError.details.errors)[0]   // pick first field error
                        : null;

                const message =
                    fieldError ||
                    apiError?.details?.message ||
                    apiError?.message ||
                    "Something went wrong";

                toast.error(message);
            });

        }
    };

    const handelPrevious = () => {
        setStep(1);
        setStepper((prev) => Math.max(1, prev - 1));
    };

    // console.log("selectedPatient--- : ", selectedPatient);

    return (
        <>
            {/* Progress */}
            <div className="d-flex align-items-center mb-4">
                <div className="flex-grow-1 d-flex">
                    {[...Array(totalSteps)].map((_, index) => (
                        <div key={index} className="flex-fill mx-1">
                            <ProgressBar
                                now={100}
                                className={
                                    index < stepper
                                        ? "progress-bar progressbar-step-success"
                                        : "progress-bar progressbar-step-secondary"
                                }
                            />
                        </div>
                    ))}
                </div>
                <span className="ms-2 progressbar-step">
                    {step} of {totalSteps}
                </span>
            </div>

            {/* Appointment Info */}
            {/* <AppointmentProfile tempProfileData={tempAppointmentProfileData} /> */}

            <div className="appointment-reschedule-profile-box">
                <div className="d-flex justify-content-between">
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <Image src={selectedPatient?.profileImage || simpleEditPro} width={52} height={52} alt="appointment-profile" />
                        <div>
                            <span className="appointment-reschedule-profile-name mb-2">{selectedPatient?.name}</span>

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

                <div className="d-flex flex-column flex-wrap gap-2 mt-3">
                    <div className="d-flex gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                            <path d="M13.875 2H12.375V1.5C12.375 1.36739 12.3223 1.24021 12.2286 1.14645C12.1348 1.05268 12.0076 1 11.875 1C11.7424 1 11.6152 1.05268 11.5214 1.14645C11.4277 1.24021 11.375 1.36739 11.375 1.5V2H6.375V1.5C6.375 1.36739 6.32232 1.24021 6.22855 1.14645C6.13479 1.05268 6.00761 1 5.875 1C5.74239 1 5.61521 1.05268 5.52145 1.14645C5.42768 1.24021 5.375 1.36739 5.375 1.5V2H3.875C3.60978 2 3.35543 2.10536 3.16789 2.29289C2.98036 2.48043 2.875 2.73478 2.875 3V13C2.875 13.2652 2.98036 13.5196 3.16789 13.7071C3.35543 13.8946 3.60978 14 3.875 14H13.875C14.1402 14 14.3946 13.8946 14.5821 13.7071C14.7696 13.5196 14.875 13.2652 14.875 13V3C14.875 2.73478 14.7696 2.48043 14.5821 2.29289C14.3946 2.10536 14.1402 2 13.875 2ZM5.375 3V3.5C5.375 3.63261 5.42768 3.75979 5.52145 3.85355C5.61521 3.94732 5.74239 4 5.875 4C6.00761 4 6.13479 3.94732 6.22855 3.85355C6.32232 3.75979 6.375 3.63261 6.375 3.5V3H11.375V3.5C11.375 3.63261 11.4277 3.75979 11.5214 3.85355C11.6152 3.94732 11.7424 4 11.875 4C12.0076 4 12.1348 3.94732 12.2286 3.85355C12.3223 3.75979 12.375 3.63261 12.375 3.5V3H13.875V5H3.875V3H5.375ZM13.875 13H3.875V6H13.875V13Z" fill="#8A8D93" />
                        </svg>
                        <span className="appointment-reschedule-profile-schedule-detail">{selectedPatient?.appointmentDate || "15 Jun 2025 Static"}</span>
                        {/* </div>

                    <div className="d-flex gap-2"> */}
                        <div className="d-flex gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                <path d="M8.875 1.5C7.58942 1.5 6.33272 1.88122 5.2638 2.59545C4.19488 3.30968 3.36176 4.32484 2.86979 5.51256C2.37782 6.70028 2.24909 8.00721 2.4999 9.26809C2.7507 10.529 3.36977 11.6872 4.27881 12.5962C5.18785 13.5052 6.34604 14.1243 7.60692 14.3751C8.86779 14.6259 10.1747 14.4972 11.3624 14.0052C12.5502 13.5132 13.5653 12.6801 14.2796 11.6112C14.9938 10.5423 15.375 9.28558 15.375 8C15.3732 6.27665 14.6878 4.62441 13.4692 3.40582C12.2506 2.18722 10.5984 1.50182 8.875 1.5ZM8.875 13.5C7.78721 13.5 6.72384 13.1774 5.81937 12.5731C4.9149 11.9687 4.20995 11.1098 3.79367 10.1048C3.37738 9.09977 3.26847 7.9939 3.48068 6.927C3.6929 5.86011 4.21673 4.8801 4.98592 4.11091C5.7551 3.34172 6.73511 2.8179 7.80201 2.60568C8.8689 2.39346 9.97477 2.50238 10.9798 2.91866C11.9848 3.33494 12.8437 4.03989 13.4481 4.94436C14.0524 5.84883 14.375 6.9122 14.375 8C14.3733 9.45818 13.7934 10.8562 12.7623 11.8873C11.7312 12.9184 10.3332 13.4983 8.875 13.5ZM12.875 8C12.875 8.13261 12.8223 8.25979 12.7286 8.35355C12.6348 8.44732 12.5076 8.5 12.375 8.5H8.875C8.74239 8.5 8.61522 8.44732 8.52145 8.35355C8.42768 8.25979 8.375 8.13261 8.375 8V4.5C8.375 4.36739 8.42768 4.24021 8.52145 4.14645C8.61522 4.05268 8.74239 4 8.875 4C9.00761 4 9.13479 4.05268 9.22856 4.14645C9.32232 4.24021 9.375 4.36739 9.375 4.5V7.5H12.375C12.5076 7.5 12.6348 7.55268 12.7286 7.64645C12.8223 7.74021 12.875 7.86739 12.875 8Z" fill="#8A8D93" />
                            </svg>
                            <span className="appointment-reschedule-profile-schedule-detail">{selectedPatient?.appointmentTime || "3:15 PM Static"}</span>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <div className="d-flex gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                <path d="M14.375 3.5H11.875V3C11.875 2.60218 11.717 2.22064 11.4357 1.93934C11.1544 1.65804 10.7728 1.5 10.375 1.5H7.375C6.97718 1.5 6.59564 1.65804 6.31434 1.93934C6.03304 2.22064 5.875 2.60218 5.875 3V3.5H3.375C3.10978 3.5 2.85543 3.60536 2.66789 3.79289C2.48036 3.98043 2.375 4.23478 2.375 4.5V12.5C2.375 12.7652 2.48036 13.0196 2.66789 13.2071C2.85543 13.3946 3.10978 13.5 3.375 13.5H14.375C14.6402 13.5 14.8946 13.3946 15.0821 13.2071C15.2696 13.0196 15.375 12.7652 15.375 12.5V4.5C15.375 4.23478 15.2696 3.98043 15.0821 3.79289C14.8946 3.60536 14.6402 3.5 14.375 3.5ZM6.875 3C6.875 2.86739 6.92768 2.74021 7.02145 2.64645C7.11521 2.55268 7.24239 2.5 7.375 2.5H10.375C10.5076 2.5 10.6348 2.55268 10.7286 2.64645C10.8223 2.74021 10.875 2.86739 10.875 3V3.5H6.875V3ZM14.375 12.5H3.375V4.5H14.375V12.5ZM10.875 8.5C10.875 8.63261 10.8223 8.75979 10.7286 8.85355C10.6348 8.94732 10.5076 9 10.375 9H9.375V10C9.375 10.1326 9.32232 10.2598 9.22855 10.3536C9.13479 10.4473 9.00761 10.5 8.875 10.5C8.74239 10.5 8.61521 10.4473 8.52145 10.3536C8.42768 10.2598 8.375 10.1326 8.375 10V9H7.375C7.24239 9 7.11521 8.94732 7.02145 8.85355C6.92768 8.75979 6.875 8.63261 6.875 8.5C6.875 8.36739 6.92768 8.24021 7.02145 8.14645C7.11521 8.05268 7.24239 8 7.375 8H8.375V7C8.375 6.86739 8.42768 6.74021 8.52145 6.64645C8.61521 6.55268 8.74239 6.5 8.875 6.5C9.00761 6.5 9.13479 6.55268 9.22855 6.64645C9.32232 6.74021 9.375 6.86739 9.375 7V8H10.375C10.5076 8 10.6348 8.05268 10.7286 8.14645C10.8223 8.24021 10.875 8.36739 10.875 8.5Z" fill="#8A8D93" />
                            </svg>
                            <span className="appointment-reschedule-profile-schedule-detail">{"Fertility assessment Static"}</span>
                        </div>
                        <div className="d-flex gap-1">
                            <svg width="17" height="16" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.25 8C11.25 8.14834 11.206 8.29334 11.1236 8.41668C11.0412 8.54001 10.9241 8.63614 10.787 8.69291C10.65 8.74967 10.4992 8.76453 10.3537 8.73559C10.2082 8.70665 10.0746 8.63522 9.96967 8.53033C9.86478 8.42544 9.79335 8.2918 9.76441 8.14632C9.73547 8.00083 9.75033 7.85003 9.80709 7.71299C9.86386 7.57594 9.95999 7.45881 10.0833 7.3764C10.2067 7.29399 10.3517 7.25 10.5 7.25C10.6989 7.25 10.8897 7.32902 11.0303 7.46967C11.171 7.61032 11.25 7.80109 11.25 8ZM10.9656 10.4556C10.8558 11.1636 10.4966 11.8091 9.95284 12.2757C9.40906 12.7422 8.71648 12.9991 8 13H6.5C5.7046 12.9992 4.94202 12.6828 4.37959 12.1204C3.81716 11.558 3.50083 10.7954 3.5 10V7.46813C2.53346 7.34635 1.64457 6.87604 1.00017 6.14544C0.355758 5.41484 0.000122253 4.47418 0 3.5V0.5C0 0.367392 0.0526785 0.240215 0.146447 0.146447C0.240215 0.0526785 0.367392 0 0.5 0H2C2.13261 0 2.25979 0.0526785 2.35355 0.146447C2.44732 0.240215 2.5 0.367392 2.5 0.5C2.5 0.632608 2.44732 0.759785 2.35355 0.853553C2.25979 0.947321 2.13261 1 2 1H1V3.5C0.999965 3.89735 1.07887 4.29076 1.23213 4.65737C1.38539 5.02397 1.60995 5.35648 1.89277 5.63559C2.1756 5.91469 2.51106 6.13483 2.87966 6.28322C3.24827 6.43161 3.64268 6.5053 4.04 6.5C5.67188 6.47875 7 5.10937 7 3.44812V1H6C5.86739 1 5.74021 0.947321 5.64645 0.853553C5.55268 0.759785 5.5 0.632608 5.5 0.5C5.5 0.367392 5.55268 0.240215 5.64645 0.146447C5.74021 0.0526785 5.86739 0 6 0H7.5C7.63261 0 7.75979 0.0526785 7.85355 0.146447C7.94732 0.240215 8 0.367392 8 0.5V3.44812C8 5.50062 6.46687 7.21625 4.5 7.4675V10C4.5 10.5304 4.71071 11.0391 5.08579 11.4142C5.46086 11.7893 5.96957 12 6.5 12H8C8.45418 11.9992 8.89463 11.8442 9.24915 11.5603C9.60368 11.2764 9.85123 10.8805 9.95125 10.4375C9.3474 10.3019 8.81532 9.94706 8.45798 9.44174C8.10063 8.93643 7.94343 8.31653 8.01678 7.70199C8.09013 7.08745 8.38882 6.52197 8.85505 6.11495C9.32129 5.70794 9.92193 5.48833 10.5407 5.49862C11.1596 5.50892 11.7526 5.74838 12.205 6.17068C12.6574 6.59298 12.9372 7.16809 12.99 7.78472C13.0429 8.40136 12.8651 9.01569 12.4912 9.50884C12.1172 10.002 11.5737 10.3389 10.9656 10.4544V10.4556ZM12 8C12 7.70333 11.912 7.41332 11.7472 7.16665C11.5824 6.91997 11.3481 6.72771 11.074 6.61418C10.7999 6.50065 10.4983 6.47094 10.2074 6.52882C9.91639 6.5867 9.64912 6.72956 9.43934 6.93934C9.22956 7.14912 9.0867 7.41639 9.02882 7.70736C8.97094 7.99834 9.00065 8.29994 9.11418 8.57403C9.22771 8.84811 9.41997 9.08238 9.66665 9.2472C9.91332 9.41203 10.2033 9.5 10.5 9.5C10.8978 9.5 11.2794 9.34196 11.5607 9.06066C11.842 8.77936 12 8.39782 12 8Z" fill="#8A8D93" />
                            </svg>

                            <span className="appointment-reschedule-profile-schedule-detail">{"Dr. Ashok Kumar Static"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 1 */}
            {step === 1 && (
                <form className="mt-3" onSubmit={handelNext}>
                    <InputSelect
                        label="Reason of Rescheduling Appointment"
                        className="input-select"
                        name="reason"
                        value={formData.reason}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            handleChange(e);
                        }}
                        required={true}
                        error={formError.reason}
                        placeholder="Select reason"
                        options={[
                            { id: "1", value: "Doctor Unavailability", label: "Doctor Unavailability" },
                            { id: "2", value: "Patient Request", label: "Patient Request" },
                            { id: "3", value: "Clinic Emergency", label: "Clinic Emergency" },
                            { id: "4", value: "Scheduling Conflicts", label: "Scheduling Conflicts" },
                            { id: "5", value: "Cycle changes", label: "Cycle changes" },
                            { id: "6", value: "Other", label: "Other" },
                        ]}
                    />

                    <div className="d-flex gap-3 mt-4">
                        <Button variant="outline" className="w-100" type="button">
                            Previous
                        </Button>
                        <Button variant="default" type="submit" className="w-100">
                            Next
                        </Button>
                    </div>
                </form>
            )}

            {/* Step 2 */}
            {step === 2 && (
                <>
                    <form className="mt-3" onSubmit={handelSubmit}>
                        <Row className="g-3">
                            <Col md={12}>
                                <InputSelect
                                    label="Type"
                                    name="type"
                                    value={formData.type}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        handleChange(e);
                                    }}
                                    required={true}
                                    error={formError.type}
                                    placeholder="Select type"
                                    options={[
                                        { id: "1", value: "Follow - Up", label: "Follow - Up" },
                                        { id: "2", value: "other", label: "other" },
                                    ]}
                                    disabled={true}
                                />
                            </Col>

                            <Col md={12}>

                                <InputSelectMultiSelect
                                    label="Reason for visit"
                                    name="reasonForVisit"
                                    values={formData.reasonForVisit}
                                    onChange={(values) => { setFormData((prev: any) => ({ ...prev, reasonForVisit: values })); setFormError((prev) => ({ ...prev, reasonForVisit: "" })); }}
                                    options={reasonOptions}
                                    placeholder="Select Services"
                                    addPlaceholder="Add Services"
                                    required={true}
                                    dropdownHandle={false} // open close arrow icon show hide
                                    selectedOptionColor="var(--border-box)"
                                    selectedOptionBorderColor="var(--border-box)"
                                    error={formError.reasonForVisit}
                                    disabled={true}

                                />

                            </Col>
                            <Col md={4}>
                                <DatePickerFieldGroup
                                    label="Appointment Date"
                                    name="newDate"
                                    placeholder="Select Date"
                                    value={formData.newDate}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        handleChange(e);
                                    }}
                                    required={true}
                                    error={formError.newDate}
                                    iconColor="var(--color-radio)"
                                    min={new Date().toISOString().split("T")[0]} // previous day not select
                                />
                            </Col>
                            <Col md={4}>
                                <TimePickerFieldGroup
                                    label="Appointment Time"
                                    name="newTime"
                                    placeholder="Select Time"
                                    value={formData.newTime}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        handleChange(e);
                                    }}
                                    required={true}
                                    error={formError.newTime}
                                />
                            </Col>
                            <Col md={4}>
                                <InputSelect
                                    label="For"
                                    name="forTime"
                                    value={formData.forTime}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        handleChange(e);
                                    }}
                                    required={false}
                                    error={formError.forTime}
                                    placeholder="Select duration"
                                    options={[
                                        { id: "1", value: "30minutes", label: "30minutes" },
                                        { id: "2", value: "1hour", label: "1hour" },
                                        { id: "3", value: "2hours", label: "2hours" },
                                    ]}
                                    disabled={true}
                                />
                            </Col>
                            <Col md={12}>
                                <Textarea
                                    label="Additional Note"
                                    name="additionalNote"
                                    value={formData.additionalNote}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                        handleChange(e);
                                    }}
                                    onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => { }}
                                    required={false}
                                    error={formError.additionalNote}
                                    maxLength={100}
                                    readOnly={true}
                                />
                            </Col>
                        </Row>
                        <div className="d-flex gap-3 mt-3">
                            <Button
                                variant="outline"
                                className="w-100"
                                type="button"
                                onClick={handelPrevious}
                            >
                                Previous
                            </Button>
                            <Button variant="default" type="submit" className="w-100">
                                Submit
                            </Button>
                        </div>
                    </form>
                </>
            )}
        </>
    );
}

export function SuccessModalReschedule({
    showSuccessModal,
    setShowSuccessModal,
}: {
    showSuccessModal: boolean;
    setShowSuccessModal: (show: boolean) => void;
}) {
    return (
        <Modal
            show={showSuccessModal}
            onHide={() => setShowSuccessModal(false)}
            closeButton={true}
        >
            <div className="text-center">
                <Image src={SuccessImage} alt="successImg" width={200} height={200} />
                <h3 className="modal-custom-header mt-2">
                    Reschedule Request Submitted!
                </h3>
                <p className="modal-custom-content">
                    Maicare will contact you shortly to confirm your request
                </p>
            </div>

            <div className="d-flex justify-content-center gap-3">
                <Button
                    variant="outline"
                    className="w-100"
                    onClick={() => setShowSuccessModal(false)}
                >
                    Okay
                </Button>
            </div>
        </Modal>
    );
}

