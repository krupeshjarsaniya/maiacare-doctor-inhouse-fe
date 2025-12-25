"use client"

import { FertilityAssessmentFormType, MedicalHistoryType, PhysicalAssessmentDataModel } from "@/utils/types/interfaces";
import { useState, useEffect } from "react";
import Button from "./ui/Button";
import { Card } from "react-bootstrap";
import { Accordion, Col, Row } from "react-bootstrap";
import Modal from './ui/Modal';
import PhisicalAssessmentForm from './form/PhisicalAssessmentForm';
import { FertilityAssessmentForm } from './form/FertilityAssessmentForm';
import MedicalHistory from './form/MedicalHistory';
import "@/style/PatientBasicDetail.css"
import ContentContainer from "@/components/ui/ContentContainer";
import { addphysicalassessment, addFertilityAssessment, addMedicalHistory, getFertilityAssessment, updatefertilityassessment, } from "@/utils/apis/apiHelper";
import { useParams } from "next/navigation";
import { getmedicalhistory, updatemedicalhistory, getPhysicalAssessment } from "@/utils/apis/apiHelper";
import { consultation } from "@/utils/apis/apiHelper"; // adjust your path
import Skeleton from 'react-loading-skeleton';
export default function PatientBasicDetail({ patient, patientId, loading }: any) {
    const [review, setReview] = useState(
        `Patient presented for an IVF consultation due to [reason, e.g., infertility, recurrent pregnancy loss].History reviewed, including obstetric, menstrual, and medical background, along with partner’s fertility evaluation.Recommended investigations include a hormonal panel, ultrasound, and genetic screening if needed.
The IVF process, success rates, potential risks, and next steps were discussed.Patient was advised on pre-treatment preparation, and a follow-up was scheduled.`
    );
    const handleSave = async () => {
        try {
            const payload = {
                patientId,
                consultReview: review,
            };

            const response = await consultation(payload);

            console.log("Saved:", response.data);
            alert("Review saved successfully!");
        } catch (error) {
            console.error("Error saving review:", error);
            alert("Failed to save review.");
        }
    };
    const [activeAccordion, setActiveAccordion] = useState<string[]>(['0', '1', '2']);
    const [showPhisicalAssessment, setShowPhisicalAssessment] = useState<boolean>(false);
    const [showFertilityAssessment, setShowFertilityAssessment] = useState<boolean>(false);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [medicalHistoryFormData, setMedicalHistoryFormData] = useState<MedicalHistoryType | any>([]);

    const [editingMedicalHistory, setEditingMedicalHistory] = useState<any>(null);

    const [modalFormPhisicalData, setModalFormPhisicalData] = useState<PhysicalAssessmentDataModel[]>([]);
    const [modalFormFertilityData, setModalFormFertilityData] = useState<FertilityAssessmentFormType | any>([]);

    const handleSavePhysicalAssessment = async (data: PhysicalAssessmentDataModel) => {

        if (!patientId) {
            alert("❌ Patient ID missing!");
            return;
        }

        const today = new Date().toISOString().split("T")[0];

        const payload = {
            ...data,
            patientId,
            height: convertHeightToCm(data.height),
            bloodGroup: data.bloodGroup || "Unknown",     // ⭐ FIXED HERE
            bloodPressureSystolic: data.systolic,
            bloodPressureDiastolic: data.diastolic,
            date: data.date || today
        };
        try {
            const res = await addphysicalassessment(payload);
            console.log("Saved:", res.data);

            // ⭐ USE API RESPONSE (it contains correct date)
            setModalFormPhisicalData((prev) => [...prev, res.data]);

            setShowPhisicalAssessment(false);
        } catch (e) {
            console.error("API error:", e);
        }
    };

    useEffect(() => {
        if (!patientId) return;

        const fetchPhysicalAssessment = async () => {
            try {
                // const res = await getPhysicalAssessment(patient.physicalAssessment._id);
                const assessmentId = patient?.physicalAssessment?._id;
                if (!assessmentId) return;

                const res = await getPhysicalAssessment(assessmentId);


                // res.data should be an array of assessments → match existing mapping
                if (Array.isArray(res.data)) {
                    const mapped = res.data.map((item: any) => ({
                        ...item,
                        systolic: item?.bloodPressure?.systolic || "",
                        diastolic: item?.bloodPressure?.diastolic || "",
                        date: new Date(item.createdAt).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        }),
                    }));

                    setModalFormPhisicalData(mapped);
                }

            } catch (err) {
                console.error("GET physical assessment error", err);
            }
        };

        try {
            fetchPhysicalAssessment();
        } catch (err) {
            console.log(err);
        }
    }, [patientId]);

    const handleSaveFertilityAssessment = async (data: FertilityAssessmentFormType) => {
        if (!patientId) {
            alert("❌ Patient ID missing!");
            return;
        }

        const today = new Date().toISOString().split("T")[0];

        const payload = {
            ...data,
            patientId,
            lastPeriodDate: data.date || today,
            menstrualIssues: data.menstrualIssues === "yes" ? "Yes" : "No",
            pregnantBefore: data.pregnancy === "yes" ? "Yes" : "No",
            miscarriageOrEctopicHistory: data.ectopicpregnancy === "yes" ? "Yes" : "No",
            tryingToConceiveDuration: data.timeduration
        };

        try {
            if (modalFormFertilityData?._id) {
                // ⭐ UPDATE
                const res = await updatefertilityassessment(modalFormFertilityData._id, payload);
                setModalFormFertilityData(res.data);
            } else {
                // ⭐ CREATE
                const res = await addFertilityAssessment(payload);
                setModalFormFertilityData(res.data);
            }

            setShowFertilityAssessment(false);

        } catch (e) {
            console.error("API error:", e);
        }
    };

    const mapFertilityDataForEdit = (data: any): FertilityAssessmentFormType => {
        return {
            ageAtFirstMenstruation: data?.menstrualCycle?.ageAtFirstMenstruation || "",
            cycleLength: data?.menstrualCycle?.cycleLength || "",
            periodLength: data?.menstrualCycle?.periodLength || "",
            date: data?.menstrualCycle?.lastPeriodDate || "",
            isCycleRegular: data?.menstrualCycle?.isCycleRegular || "Regular",
            menstrualIssues: data?.menstrualCycle?.menstrualIssues === "Yes" ? "yes" : "no",

            pregnancy: data?.pregnancy?.pregnantBefore === "Yes" ? "yes" : "no",
            timeduration: data?.pregnancy?.tryingToConceiveDuration || "",
            ectopicpregnancy:
                data?.pregnancy?.miscarriageOrEctopicHistory === "Yes" ? "yes" : "no",
        };
    };
    useEffect(() => {
        if (!patientId) return;
        const ID = patient?.fertilityassessment?._id;
        if (!ID) return;
        const fetchData = async () => {
            try {
                const res = await getFertilityAssessment(patient.fertilityassessment._id);

                setModalFormFertilityData(res.data);
            } catch (err) {
                console.error("GET fertility error", err);
            }
        };

        fetchData();
    }, [patientId]);


    useEffect(() => {
        if (!patientId) return;
        const ID = patient?.medicalHistoryId?._id
        if (!ID) return;

        const fetchMedicalHistory = async () => {
            try {
                const res = await getmedicalhistory(patient.medicalHistoryId._id);
                setMedicalHistoryFormData(res.data || {});
            } catch (err) {
                console.error("GET medical history error", err);
            }
        };

        fetchMedicalHistory();
    }, [patientId]);


    const handleSaveMedicalHistory = async (data: any) => {
        if (!patientId) {
            alert("❌ Patient ID missing!");
            return;
        }

        const payload = {
            patientId,
            medications: {
                status: data.medication === "yes" ? "Yes" : "No",
                medicationsDetails: data.medicationcontent ? data.medicationcontent : "", // always string
            },
            surgeries: {
                status: data.surgeries === "yes" ? "Yes" : "No",
                surgeriesDetails: data.surgeriescontent ? data.surgeriescontent : "", // always string
            },
            conditions: data.medicalCondition?.map((c: any) => c.value) || [],
            familyHistory: data.familyMedicalHistory || "",
            lifestyle: data.lifestyle?.map((l: any) => l.value) || [],
            exerciseFrequency: data.exercise || "",
            stressLevel: data.stress || "",
        };

        try {
            if (medicalHistoryFormData?._id) {
                // 🔄 Update existing record
                const res = await updatemedicalhistory(medicalHistoryFormData._id, payload);
                setMedicalHistoryFormData(res.data);
            } else {
                // ➕ Create new record
                const res = await addMedicalHistory(payload);
                setMedicalHistoryFormData(res.data);
            }

            setShowModal(false);
            setEditingMedicalHistory(null);

        } catch (err) {
            console.error("API error:", err);
        }
    };

    const mapMedicalHistoryForEdit = (data: any) => {
        return {
            medication: data?.medications?.status === "Yes" ? "yes" : "no",
            medicationcontent: data?.medications?.medicationsDetails || "",

            surgeries: data?.surgeries?.status === "Yes" ? "yes" : "no",
            surgeriescontent: data?.surgeries?.surgeriesDetails || "",

            medicalCondition: data?.conditions?.map((c: string) => ({
                label: c,
                value: c
            })) || [],

            familyMedicalHistory: data?.familyHistory || "",

            lifestyle: data?.lifestyle?.map((l: string) => ({
                label: l,
                value: l
            })) || [],

            exercise: data?.exerciseFrequency || "",
            stress: data?.stressLevel || "",
        };
    };

    useEffect(() => {
        if (!patient) return;

        // 1️⃣ Physical Assessment
        if (Array.isArray(patient.physicalAssesment)) {

            const mapped = patient.physicalAssesment.map((item: any) => ({
                ...item,
                systolic: item?.bloodPressure?.systolic || "",
                diastolic: item?.bloodPressure?.diastolic || "",

                // ⭐ Date Formatting (converted from ISO → readable)
                date: new Date(item.createdAt).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }),
            }));

            setModalFormPhisicalData(mapped);
        }

        // 2️⃣ Fertility Assessment
        if (patient.fertilityassessment) {
            setModalFormFertilityData(patient.fertilityassessment);
        }

        // 3️⃣ Medical History
        if (patient.medicalhistories) {
            setMedicalHistoryFormData(patient.medicalhistories);
        }
    }, [patient]);
    const [editFertilityAssessment, setEditFertilityAssessment] = useState<FertilityAssessmentFormType>({
        ageAtFirstMenstruation: "",
        cycleLength: "",
        periodLength: "",
        date: "",
        isCycleRegular: "Regular",
        menstrualIssues: "yes",
        pregnancy: "yes",
        timeduration: "",
        ectopicpregnancy: "yes"
    });

    const initialFormData: PhysicalAssessmentDataModel = {
        id: "",
        height: "",
        weight: "",
        bmi: "",
        bloodGroup: "",
        systolic: "",
        diastolic: "",
        heartRate: "",
        date: "",

    };
    const [editPhysicalAssessment, setEditPhysicalAssessment] = useState<PhysicalAssessmentDataModel>(initialFormData);

    const convertHeightToCm = (heightStr: any): string => {
        if (!heightStr) return '';

        // Force into string safely
        const cleanHeight = String(heightStr).trim();

        // Check if it's already in cm
        if (cleanHeight.toLowerCase().includes('cm')) {
            return cleanHeight.replace(/[^\d.]/g, '');
        }

        // Match feet and inches format (e.g., "5'8", "5'8\"", "5 ft 8 in")
        const feetInchesMatch = cleanHeight.match(/(\d+)['′]?\s*(\d+)["″]?/);
        if (feetInchesMatch) {
            const feet = parseInt(feetInchesMatch[1], 10);
            const inches = parseInt(feetInchesMatch[2], 10);
            const totalInches = feet * 12 + inches;
            return (totalInches * 2.54).toFixed(0);
        }

        // Match feet only format (e.g., "5'", "5 ft")
        const feetOnlyMatch = cleanHeight.match(/(\d+)['′]?\s*(ft|feet)?$/i);
        if (feetOnlyMatch) {
            const feet = parseInt(feetOnlyMatch[1], 10);
            const totalInches = feet * 12;
            return (totalInches * 2.54).toFixed(0);
        }

        // Numeric inputs (could be inches or feet)
        const numericValue = parseFloat(cleanHeight);
        if (!isNaN(numericValue)) {
            // Assume inches if in typical height range
            if (numericValue >= 24 && numericValue <= 96) {
                return (numericValue * 2.54).toFixed(0);
            }
            // Assume feet if between 3 and 8
            if (numericValue >= 3 && numericValue <= 8) {
                return (numericValue * 12 * 2.54).toFixed(0);
            }
        }

        return '';
    };


    const accordionData = [
        {
            id: '0',
            title: 'Physical Assessment',
            content: (
                <>
                    {modalFormPhisicalData.length === 0 ? (
                        <>
                            {
                                <>
                                    {loading ? (
                                        <>
                                            <Skeleton width={200} />
                                            <div className="p-2">
                                                {[...Array(2)].map((_, idx) => (
                                                    <div key={idx} className="mb-3">

                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                                            <Skeleton width={140} height={18} />
                                                            <Skeleton width={25} height={22} />
                                                        </div>


                                                        <div className="row g-3">
                                                            {[1, 2, 3].map((col) => (
                                                                <div className="col-md-4 col-sm-6" key={col}>
                                                                    <div className="d-flex gap-3 align-items-center">
                                                                        <Skeleton width={40} height={40} borderRadius={8} />
                                                                        <div className="d-flex flex-column gap-1">
                                                                            <Skeleton width={120} />
                                                                            <Skeleton width={70} height={14} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) :
                                        (<div className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 81 81" fill="none">
                                                <g clipPath="url(#clip0_3886_2587)">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M17.6439 4.10156C18.1236 4.10156 18.5143 4.49044 18.5143 4.97191C18.5143 5.45153 18.1254 5.84226 17.6439 5.84226H14.9292C14.4496 5.84226 14.0588 5.45338 14.0588 4.97191C14.0588 4.49229 14.4477 4.10156 14.9292 4.10156H17.6439ZM17.6439 8.75701C18.1236 8.75701 18.5143 9.14589 18.5143 9.62736C18.5143 10.107 18.1254 10.4977 17.6439 10.4977H14.9292C14.4496 10.4977 14.0588 10.1088 14.0588 9.62736C14.0588 9.14774 14.4477 8.75701 14.9292 8.75701H17.6439ZM17.6439 13.4125C18.1236 13.4125 18.5143 13.8013 18.5143 14.2828C18.5143 14.7643 18.1254 15.1532 17.6439 15.1532H14.9292C14.4496 15.1532 14.0588 14.7643 14.0588 14.2828C14.0588 13.8013 14.4477 13.4125 14.9292 13.4125H17.6439ZM17.6439 18.0679C18.1236 18.0679 18.5143 18.4568 18.5143 18.9383C18.5143 19.4179 18.1254 19.8086 17.6439 19.8086H14.9292C14.4496 19.8086 14.0588 19.4197 14.0588 18.9383C14.0588 18.4586 14.4477 18.0679 14.9292 18.0679H17.6439ZM17.6439 22.7234C18.1236 22.7234 18.5143 23.1122 18.5143 23.5937C18.5143 24.0733 18.1254 24.4641 17.6439 24.4641H14.9292C14.4496 24.4641 14.0588 24.0752 14.0588 23.5937C14.0588 23.1141 14.4477 22.7234 14.9292 22.7234H17.6439ZM17.6439 27.3788C18.1236 27.3788 18.5143 27.7677 18.5143 28.2492C18.5143 28.7288 18.1254 29.1195 17.6439 29.1195H14.9292C14.4496 29.1195 14.0588 28.7306 14.0588 28.2492C14.0588 27.7695 14.4477 27.3788 14.9292 27.3788H17.6439ZM17.6439 32.0342C18.1236 32.0342 18.5143 32.4231 18.5143 32.9046C18.5143 33.3842 18.1254 33.7749 17.6439 33.7749H14.9292C14.4496 33.7749 14.0588 33.3861 14.0588 32.9046C14.0588 32.425 14.4477 32.0342 14.9292 32.0342H17.6439ZM17.6439 36.6897C18.1236 36.6897 18.5143 37.0786 18.5143 37.56C18.5143 38.0415 18.1254 38.4304 17.6439 38.4304H14.9292C14.4496 38.4304 14.0588 38.0415 14.0588 37.56C14.0588 37.0786 14.4477 36.6897 14.9292 36.6897H17.6439ZM17.6439 41.3451C18.1236 41.3451 18.5143 41.734 18.5143 42.2155C18.5143 42.6951 18.1254 43.0858 17.6439 43.0858H14.9292C14.4496 43.0858 14.0588 42.697 14.0588 42.2155C14.0588 41.7359 14.4477 41.3451 14.9292 41.3451H17.6439ZM17.6439 46.0006C18.1236 46.0006 18.5143 46.3895 18.5143 46.8709C18.5143 47.3506 18.1254 47.7413 17.6439 47.7413H14.9292C14.4496 47.7413 14.0588 47.3524 14.0588 46.8709C14.0588 46.3913 14.4477 46.0006 14.9292 46.0006H17.6439ZM17.6439 50.656C18.1236 50.656 18.5143 51.0449 18.5143 51.5264C18.5143 52.006 18.1254 52.3967 17.6439 52.3967H14.9292C14.4496 52.3967 14.0588 52.0079 14.0588 51.5264C14.0588 51.0468 14.4477 50.656 14.9292 50.656H17.6439ZM17.6439 55.3115C18.1236 55.3115 18.5143 55.7004 18.5143 56.1818C18.5143 56.6615 18.1254 57.0522 17.6439 57.0522H14.9292C14.4496 57.0522 14.0588 56.6633 14.0588 56.1818C14.0588 55.7022 14.4477 55.3115 14.9292 55.3115H17.6439ZM17.6439 59.9669C18.1236 59.9669 18.5143 60.3558 18.5143 60.8373C18.5143 61.3169 18.1254 61.7076 17.6439 61.7076H14.9292C14.4496 61.7076 14.0588 61.3188 14.0588 60.8373C14.0588 60.3577 14.4477 59.9669 14.9292 59.9669H17.6439ZM17.6439 64.6224C18.1236 64.6224 18.5143 65.0113 18.5143 65.4927C18.5143 65.9724 18.1254 66.3631 17.6439 66.3631H14.9292C14.4496 66.3631 14.0588 65.9742 14.0588 65.4927C14.0588 65.0131 14.4477 64.6224 14.9292 64.6224H17.6439ZM17.6439 69.2778C18.1236 69.2778 18.5143 69.6667 18.5143 70.1482C18.5143 70.6278 18.1254 71.0185 17.6439 71.0185H14.9292C14.4496 71.0185 14.0588 70.6297 14.0588 70.1482C14.0588 69.6686 14.4477 69.2778 14.9292 69.2778H17.6439ZM17.6439 73.9333C18.1236 73.9333 18.5143 74.3222 18.5143 74.8036C18.5143 75.2833 18.1254 75.674 17.6439 75.674H14.9292C14.4496 75.674 14.0588 75.2851 14.0588 74.8036C14.0588 74.324 14.4477 73.9333 14.9292 73.9333H17.6439Z" fill="#8D929C" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M18.5141 79.4677C18.5141 79.9473 18.1253 80.338 17.6438 80.338C17.1642 80.338 16.7734 79.9491 16.7734 79.4677V1.21019C16.7734 0.730575 17.1623 0.339844 17.6438 0.339844C18.1234 0.339844 18.5141 0.728723 18.5141 1.21019V79.4677Z" fill="#8D929C" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M29.4528 42.6415C29.4565 42.173 30.1472 41.7971 30.5732 41.8008C40.684 41.886 36.1545 41.886 46.2654 41.8008C46.6913 41.7971 47.3802 42.173 47.382 42.6415L47.7857 71.3205C47.7987 72.1779 47.4228 73.5167 46.8376 74.1575C46.4709 74.5593 45.9691 74.8167 45.4136 74.8408C45.3839 74.8445 45.3562 74.8463 45.3265 74.8463H31.5083V74.8426H31.5046H31.4898H31.4861C30.9065 74.8352 30.3787 74.5741 29.9973 74.1556C29.3028 73.3945 29.038 72.0038 29.0528 70.9427L29.4528 42.6415Z" fill="#AFB6C3" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M36.9674 41.8582C39.2952 41.8767 39.6007 41.8564 46.2635 41.8008C46.6894 41.7971 47.3783 42.173 47.3801 42.6415L47.5968 57.9634C45.532 57.106 43.6358 55.8449 42.0173 54.2264C38.7729 50.9821 36.9656 46.6192 36.9656 42.0323C36.9674 41.9749 36.9674 41.9156 36.9674 41.8582Z" fill="#9DA4B0" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M39.2692 74.8468H37.5674V58.5453C37.5674 58.0749 37.9489 57.6953 38.4174 57.6953C38.8859 57.6953 39.2673 58.0768 39.2673 58.5453V74.8468H39.2692Z" fill="#9DA4B0" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M40.7155 21.2759C40.7192 21.2241 40.7266 21.1722 40.7395 21.1204C40.8525 20.6648 41.3154 20.3889 41.7691 20.5019L49.8578 22.5407C50.9004 22.8037 51.8837 23.2685 52.5856 23.9703C53.2392 24.624 53.6466 25.4647 53.6466 26.511V44.0495C53.6466 45.1494 53.1967 46.1476 52.4726 46.8716C51.7485 47.5957 50.7486 48.0457 49.6504 48.0457H48.6634H47.6764H29.1565H28.1713H27.1861C26.0862 48.0457 25.088 47.5957 24.364 46.8716C23.6399 46.1476 23.1899 45.1494 23.1899 44.0495V26.511C23.1899 25.4647 23.5973 24.624 24.251 23.9703C24.9529 23.2685 25.9362 22.8037 26.9787 22.5407L35.0674 20.5019C35.523 20.3889 35.9841 20.6648 36.097 21.1204C36.11 21.1722 36.1174 21.2241 36.1211 21.2759H40.7155Z" fill="#DDE1E8" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M53.2245 24.8125C53.4948 25.3032 53.6485 25.868 53.6485 26.5106V44.0491C53.6485 45.1491 53.1985 46.1472 52.4745 46.8712C51.7504 47.5953 50.7504 48.0453 49.6523 48.0453H48.6653H47.6783H38.0452C37.3378 46.1416 36.9656 44.1083 36.9656 42.0306C36.9656 37.4418 38.7729 33.079 42.0173 29.8365C45.0284 26.8254 49.0023 25.0532 53.2245 24.8125Z" fill="#D0D4DC" />
                                                    <path d="M34.423 20.057C34.423 19.5867 34.8045 19.207 35.273 19.207C35.4748 19.207 41.3617 19.207 41.5636 19.207C42.0339 19.207 42.4136 19.5885 42.4136 20.057V22.3347C42.4136 24.5347 40.6173 26.3309 38.4173 26.3309C37.3174 26.3309 36.3174 25.881 35.5952 25.1569C34.8711 24.4328 34.4211 23.4329 34.4211 22.3347V20.057H34.423Z" fill="#F3F4F6" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M32.5861 73.1445H34.4565C35.275 73.1445 36.0175 73.4779 36.5564 74.0167C37.0953 74.5556 37.4286 75.2982 37.4286 76.1167V78.237C37.4286 78.7074 37.0471 79.087 36.5786 79.087H30.4677C29.9973 79.087 29.6177 78.7055 29.6177 78.237V76.1167C29.6177 75.2982 29.951 74.5556 30.4899 74.0167C31.0251 73.4779 31.7676 73.1445 32.5861 73.1445ZM42.3822 73.1445H44.2525C45.071 73.1445 45.8136 73.4779 46.3525 74.0167C46.8914 74.5556 47.2247 75.2982 47.2247 76.1167V78.237C47.2247 78.7074 46.8432 79.087 46.3747 79.087H40.2637C39.7934 79.087 39.4137 78.7055 39.4137 78.237V76.1167C39.4137 75.2982 39.7471 74.5556 40.2859 74.0167C40.8211 73.4779 41.5637 73.1445 42.3822 73.1445Z" fill="#9CA3AF" />
                                                    <path d="M38.4173 4.97656C40.295 4.97656 42.0005 5.74321 43.2357 6.98022C44.4708 8.21723 45.2393 9.92274 45.2393 11.7986V14.9874C45.2393 16.8652 44.4727 18.5707 43.2357 19.8058C41.9987 21.0429 40.2932 21.8095 38.4173 21.8095C36.5395 21.8095 34.834 21.0429 33.5989 19.8058C32.3619 18.5707 31.5952 16.8633 31.5952 14.9874V11.7986C31.5952 9.92089 32.3619 8.21538 33.5989 6.98022C34.8359 5.74321 36.5414 4.97656 38.4173 4.97656Z" fill="#F3F4F6" />
                                                    <path d="M34.6989 22.3467C37.3081 22.6041 39.3673 22.3374 40.9303 21.893C41.4858 21.7356 41.9802 21.5541 42.4136 21.3671V20.6652V20.5078C42.3598 20.5467 42.3043 20.5856 42.2487 20.6245C41.7765 20.9467 41.2636 21.2115 40.7173 21.4078C39.9988 21.667 39.2229 21.8078 38.4173 21.8078C37.6118 21.8078 36.8378 21.667 36.1174 21.4078C35.5711 21.2115 35.0582 20.9467 34.586 20.6245C34.5304 20.5874 34.4748 20.5486 34.4211 20.5078V20.6652V22.3189C34.5156 22.3281 34.6063 22.3393 34.6989 22.3467Z" fill="#E8E8EA" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M23.1882 26.5096V32.6835H29.3714V21.9375L26.9789 22.5412C25.9363 22.8041 24.9512 23.269 24.2512 23.9708C23.5956 24.6245 23.1882 25.4633 23.1882 26.5096Z" fill="#C5C9D0" />
                                                    <path d="M23.1882 32.6875V44.0521C23.1882 45.152 23.6382 46.1502 24.3623 46.8742C25.0863 47.5983 26.0863 48.0483 27.1844 48.0483H28.1696H28.8603H29.1548H29.3696V41.9132V32.6875H23.1882Z" fill="#F3F4F6" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M53.6485 26.5096V32.6835H47.4653V21.9375L49.8579 22.5412C50.9004 22.8041 51.8856 23.269 52.5856 23.9708C53.2411 24.6245 53.6485 25.4633 53.6485 26.5096Z" fill="#C5C9D0" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M53.6485 26.5125V32.6864H47.4653V26.1551C49.2783 25.3847 51.2226 24.9273 53.2245 24.8125C53.4948 25.3069 53.6485 25.8699 53.6485 26.5125Z" fill="#B5B8BE" />
                                                    <path d="M53.6486 32.6875V44.0521C53.6486 45.152 53.1986 46.1502 52.4746 46.8742C51.7505 47.5983 50.7505 48.0483 49.6524 48.0483H48.6673H47.9765H47.6821H47.4673V41.9132V32.6875H53.6486Z" fill="#F9C5B8" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M31.5952 12.6208C32.5767 11.5227 34.6488 10.6246 39.0043 12.0931C41.6913 12.9986 43.7246 13.369 45.2393 13.4653V11.7986C45.2393 9.92089 44.4727 8.21538 43.2357 6.98022C41.9987 5.74506 40.2932 4.97656 38.4173 4.97656C36.6988 4.97656 35.1229 5.62099 33.9211 6.67837C33.81 6.77652 33.7026 6.87652 33.5989 6.98022C32.3637 8.21723 31.5952 9.92274 31.5952 11.7986V12.6208Z" fill="#9CA3AF" />
                                                    <path d="M70.0006 42.1403C70.0006 50.8391 62.9465 57.8899 54.2485 57.8899C45.5506 57.8899 38.5015 50.8391 38.5015 42.1403C38.5015 33.4414 45.5506 26.3906 54.2485 26.3906C62.9465 26.3906 70.0006 33.4414 70.0006 42.1403Z" fill="#DDE1E8" />
                                                    <path d="M70.0009 42.1392C70.0009 50.838 62.9468 57.8888 54.2488 57.8888C49.1259 57.8888 44.5777 55.4444 41.7036 51.6595C44.4389 53.7433 47.7842 54.8697 51.2234 54.8649C59.9214 54.8649 66.9755 47.8141 66.9755 39.1152C66.9755 35.5369 65.7805 32.2358 63.7686 29.5898C67.5554 32.4676 70.0009 37.0186 70.0009 42.1392Z" fill="#C9CFD8" />
                                                    <path d="M65.8811 31.5263C63.0826 28.9862 59.3715 27.4339 55.2923 27.4339C46.5943 27.4339 39.5452 34.4847 39.5452 43.1835C39.5452 47.2759 41.1033 51.0004 43.6597 53.7975C40.4932 50.9197 38.5015 46.7618 38.5015 42.1403C38.5015 33.4414 45.5506 26.3906 54.2485 26.3906C58.8572 26.3906 63.0019 28.3713 65.8811 31.5263Z" fill="#EEF2FB" />
                                                    <path d="M62.9233 32.8412L56.8726 38.889C56.177 39.5837 55.2339 39.9739 54.2506 39.9739C53.2673 39.9739 52.3242 39.5837 51.6286 38.889L45.5779 32.8412C47.852 30.7144 50.9025 29.4141 54.2506 29.4141C57.5936 29.4141 60.6493 30.7144 62.9233 32.8412Z" fill="#E8EBF1" />
                                                    <path d="M62.9214 32.8412L62.8457 32.9168C60.64 31.238 57.9438 30.3297 55.1714 30.3313C51.8233 30.3313 48.7727 31.6316 46.4987 33.7584L51.6267 38.889L45.5759 32.8412C47.85 30.7144 50.9006 29.4141 54.2487 29.4141C57.5917 29.4141 60.6473 30.7144 62.9214 32.8412Z" fill="#EEF2FB" />
                                                    <mask id="mask0_3886_2587" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="45" y="29" width="18" height="11">
                                                        <path d="M54.2507 29.9141C57.2764 29.9141 60.056 31.0236 62.1951 32.8613L56.5193 38.5352C55.9175 39.1362 55.1015 39.4736 54.2507 39.4736C53.3999 39.4736 52.584 39.1361 51.9822 38.5352L46.3054 32.8613C48.4442 31.0233 51.2202 29.9141 54.2507 29.9141Z" fill="#CBDFED" stroke="#C9CFD8" />
                                                    </mask>
                                                    <g mask="url(#mask0_3886_2587)">
                                                        <path d="M60.5997 31.1797L59.6479 32.7571" stroke="#9CA2AA" strokeWidth="0.7" strokeLinecap="round" />
                                                        <path d="M57.5674 29.8883L57.0682 31.6615" stroke="#9CA2AA" strokeWidth="0.7" strokeLinecap="round" />
                                                        <path d="M54.2451 29.4643L54.2483 31.3063" stroke="#9CA2AA" strokeWidth="0.7" strokeLinecap="round" />
                                                        <path d="M50.9521 29.8948L51.4659 31.6638" stroke="#9CA2AA" strokeWidth="0.7" strokeLinecap="round" />
                                                        <path d="M47.9145 31.1849L48.8424 32.7764" stroke="#9CA2AA" strokeWidth="0.7" strokeLinecap="round" />
                                                    </g>
                                                    <path d="M54.2509 38.3205C54.8585 38.3205 55.3511 37.8281 55.3511 37.2208C55.3511 36.6134 54.8585 36.1211 54.2509 36.1211C53.6432 36.1211 53.1506 36.6134 53.1506 37.2208C53.1506 37.8281 53.6432 38.3205 54.2509 38.3205Z" fill="#5E636C" />
                                                    <path d="M56.9016 32.9519C56.8595 32.9255 56.8126 32.9078 56.7636 32.8996C56.7146 32.8915 56.6645 32.8931 56.6161 32.9044C56.5677 32.9157 56.5221 32.9364 56.4818 32.9654C56.4415 32.9944 56.4073 33.0311 56.3812 33.0733L54.6799 35.814C54.5414 35.7692 54.3969 35.7454 54.2513 35.7435C53.436 35.7435 52.7729 36.4062 52.7729 37.2201C52.7729 38.0341 53.436 38.6978 54.2508 38.6978C55.0657 38.6978 55.7292 38.0351 55.7292 37.2206C55.7292 36.829 55.5729 36.4747 55.3238 36.2102L57.0236 33.4725C57.0498 33.4304 57.0675 33.3836 57.0756 33.3346C57.0837 33.2857 57.0821 33.2357 57.0709 33.1874C57.0597 33.1391 57.039 33.0935 57.0101 33.0531C56.9812 33.0128 56.9447 32.9786 56.9026 32.9524L56.9016 32.9519ZM54.9724 37.2201C54.9724 37.6183 54.6487 37.9419 54.2508 37.9419C53.853 37.9419 53.5288 37.6178 53.5288 37.2201C53.5288 36.1683 54.9724 36.378 54.9724 37.2201Z" fill="#9CA2AA" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M65.6391 78.5977C66.1187 78.5977 66.5094 78.9865 66.5094 79.468C66.5094 79.9476 66.1205 80.3384 65.6391 80.3384H11.1977C10.7181 80.3384 10.3274 79.9495 10.3274 79.468C10.3274 78.9884 10.7163 78.5977 11.1977 78.5977H65.6391Z" fill="#8D929C" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_3886_2587">
                                                        <rect width="80" height="80" fill="white" transform="translate(0.164062 0.339844)" />
                                                    </clipPath>
                                                </defs>
                                            </svg>

                                            <p className='patient-accordion-content-subtitle my-3' >
                                                No assessment details
                                            </p>

                                            <Button onClick={() => setShowPhisicalAssessment(true)} variant="outline" disabled={false} contentSize="medium" >
                                                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15.1641 8C15.1641 8.16576 15.0982 8.32473 14.981 8.44194C14.8638 8.55915 14.7048 8.625 14.5391 8.625H8.28906V14.875C8.28906 15.0408 8.22322 15.1997 8.10601 15.3169C7.9888 15.4342 7.82982 15.5 7.66406 15.5C7.4983 15.5 7.33933 15.4342 7.22212 15.3169C7.10491 15.1997 7.03906 15.0408 7.03906 14.875V8.625H0.789063C0.623302 8.625 0.464331 8.55915 0.347121 8.44194C0.229911 8.32473 0.164062 8.16576 0.164062 8C0.164062 7.83424 0.229911 7.67527 0.347121 7.55806C0.464331 7.44085 0.623302 7.375 0.789063 7.375H7.03906V1.125C7.03906 0.95924 7.10491 0.800269 7.22212 0.683058C7.33933 0.565848 7.4983 0.5 7.66406 0.5C7.82982 0.5 7.9888 0.565848 8.10601 0.683058C8.22322 0.800269 8.28906 0.95924 8.28906 1.125V7.375H14.5391C14.7048 7.375 14.8638 7.44085 14.981 7.55806C15.0982 7.67527 15.1641 7.83424 15.1641 8Z" fill="#2B4360" />
                                                </svg>

                                                <span className='ms-1'> Add Physical Assessment</span>
                                            </Button>
                                        </div>
                                        )
                                    }
                                </>
                            }

                        </>

                    ) : (
                        <div>
                            <Accordion defaultActiveKey="0">
                                <Button className='mb-3 add-new-button' onClick={() => setShowPhisicalAssessment(true)} variant="outline" disabled={false} contentSize="small"  >
                                    <div className='d-flex align-items-center gap-1  '>
                                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.1641 8C15.1641 8.16576 15.0982 8.32473 14.981 8.44194C14.8638 8.55915 14.7048 8.625 14.5391 8.625H8.28906V14.875C8.28906 15.0408 8.22322 15.1997 8.10601 15.3169C7.9888 15.4342 7.82982 15.5 7.66406 15.5C7.4983 15.5 7.33933 15.4342 7.22212 15.3169C7.10491 15.1997 7.03906 15.0408 7.03906 14.875V8.625H0.789063C0.623302 8.625 0.464331 8.55915 0.347121 8.44194C0.229911 8.32473 0.164062 8.16576 0.164062 8C0.164062 7.83424 0.229911 7.67527 0.347121 7.55806C0.464331 7.44085 0.623302 7.375 0.789063 7.375H7.03906V1.125C7.03906 0.95924 7.10491 0.800269 7.22212 0.683058C7.33933 0.565848 7.4983 0.5 7.66406 0.5C7.82982 0.5 7.9888 0.565848 8.10601 0.683058C8.22322 0.800269 8.28906 0.95924 8.28906 1.125V7.375H14.5391C14.7048 7.375 14.8638 7.44085 14.981 7.55806C15.0982 7.67527 15.1641 7.83424 15.1641 8Z" fill="#2B4360" />
                                        </svg>
                                        Add new
                                    </div>
                                </Button>
                                {modalFormPhisicalData?.map((item: any, index: number): any => {
                                    return (
                                        <Accordion.Item eventKey={index.toString()} className='phisical-assessment-accordion-item mb-3' key={index}>
                                            <Accordion.Header >
                                                <div className='d-flex align-items-center gap-2'>
                                                    <h6 className='phisical-assessment-accordion-title-showData m-0'>
                                                        {item.date}
                                                    </h6>
                                                    <div className='phisical-assessment-accordion-item-edit' onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditPhysicalAssessment({
                                                            ...item,
                                                            id: item._id || item.id   // ⭐ FIX: ensure id exists
                                                        });
                                                        setShowPhisicalAssessment(true);
                                                    }}
                                                    >
                                                        <p className='m-0'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className='me-1' width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                                <path d="M13.5484 3.40848L10.7553 0.615983C10.5209 0.381644 10.203 0.25 9.87157 0.25C9.54011 0.25 9.22223 0.381644 8.98782 0.615983L1.28032 8.32286C1.16385 8.43861 1.0715 8.57633 1.00863 8.72803C0.945765 8.87973 0.913622 9.0424 0.914067 9.20661V11.9997C0.914067 12.3313 1.04576 12.6492 1.28018 12.8836C1.5146 13.118 1.83255 13.2497 2.16407 13.2497H12.6641C12.863 13.2497 13.0537 13.1707 13.1944 13.0301C13.3351 12.8894 13.4141 12.6986 13.4141 12.4997C13.4141 12.3008 13.3351 12.1101 13.1944 11.9694C13.0537 11.8288 12.863 11.7497 12.6641 11.7497H6.97657L13.5484 5.17661C13.6646 5.06053 13.7567 4.92271 13.8195 4.77102C13.8824 4.61933 13.9147 4.45674 13.9147 4.29255C13.9147 4.12835 13.8824 3.96576 13.8195 3.81407C13.7567 3.66238 13.6646 3.52456 13.5484 3.40848ZM4.85157 11.7497H2.41407V9.31223L7.66407 4.06223L10.1016 6.49973L4.85157 11.7497ZM11.1641 5.43723L8.72657 2.99973L9.87282 1.85348L12.3103 4.29098L11.1641 5.43723Z" fill="#2B4360" />
                                                            </svg>
                                                            Edit
                                                        </p>
                                                    </div>
                                                </div>
                                            </Accordion.Header>
                                            <Accordion.Body className='pt-0'>
                                                <Row className='g-3'>
                                                    <Col md={4} sm={6}>
                                                        <div className='phisical-assessment-accordion-showData-box d-flex gap-3'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none">
                                                                <rect x="0.109375" y="0.339844" width="42" height="42" rx="7.41176" fill="#3E5A91" fillOpacity="0.2" />
                                                                <g clipPath="url(#clip0_7367_20111)">
                                                                    <path d="M19.6268 9.35156H13.1858V33.5087H19.6268V9.35156Z" stroke="#3E5A91" strokeWidth="1.66213" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M9.75024 13.5664H32.6328" stroke="#3E5A91" strokeWidth="1.66213" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M16.1631 18.5391H19.6417" stroke="#3E5A91" strokeWidth="0.831064" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M16.1631 23.5391H19.6417" stroke="#3E5A91" strokeWidth="0.831064" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M16.1631 28.4844H19.6417" stroke="#3E5A91" strokeWidth="0.831064" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                                </g>
                                                                <defs>
                                                                    <clipPath id="clip0_7367_20111">
                                                                        <rect width="27.1765" height="27.1765" fill="white" transform="translate(7.52124 7.75)" />
                                                                    </clipPath>
                                                                </defs>
                                                            </svg>
                                                            <div className='d-flex flex-column gap-1'>
                                                                <span className='contact-details-emergency'>Height</span>

                                                                {/* <span className='phisical-assessment-accordion-showData-box-subtitle'>
                                                                    {item.height} <span>({(item.height * 2.54).toFixed(0)} cm)</span>
                                                                </span> */}

                                                                <span className="phisical-assessment-accordion-showData-box-subtitle">
                                                                    {item.height}
                                                                    {convertHeightToCm(item.height) && (
                                                                        <span> ({convertHeightToCm(item.height)} cm)</span>
                                                                    )}
                                                                </span>
                                                            </div>

                                                        </div>
                                                    </Col>
                                                    <Col md={4} sm={6} >
                                                        <div className='phisical-assessment-accordion-showData-box d-flex gap-3'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none">
                                                                <rect x="0.109375" y="0.339844" width="42" height="42" rx="6" fill="#F4C47E" fillOpacity="0.2" />
                                                                <path d="M9.85962 8.21484H32.3596C33.3596 8.21484 34.2346 9.08984 34.2346 10.0898V32.5898C34.2346 33.5898 33.3596 34.4648 32.3596 34.4648H9.85962C8.85962 34.4648 7.98462 33.5898 7.98462 32.5898V10.0898C7.98462 9.08984 8.85962 8.21484 9.85962 8.21484Z" stroke="#F4C47E" strokeWidth="0.934397" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M18.9846 17.3398L17.9846 15.0898M28.6096 15.0898C24.4846 10.9648 17.7346 10.9648 13.6096 15.0898L17.1096 18.5898C19.3596 16.3398 22.8596 16.3398 25.1096 18.5898L28.6096 15.0898Z" stroke="#F4C47E" strokeWidth="0.934397" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                            <div className='d-flex flex-column gap-1'>
                                                                <span className='contact-details-emergency'>Weight</span>
                                                                <span className='phisical-assessment-accordion-showData-box-subtitle'>{item.weight} kg</span>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col md={4} sm={6}>
                                                        <div className='phisical-assessment-accordion-showData-box d-flex gap-3'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none">
                                                                <rect x="0.109375" y="0.339844" width="42" height="42" rx="6" fill="#2ECF98" fillOpacity="0.2" />
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M21.1104 13.8398C22.1459 13.8398 22.9854 13.0004 22.9854 11.9648C22.9854 10.9293 22.1459 10.0898 21.1104 10.0898C20.0748 10.0898 19.2354 10.9293 19.2354 11.9648C19.2354 13.0004 20.0748 13.8398 21.1104 13.8398ZM21.1104 15.0898C22.8362 15.0898 24.2354 13.6907 24.2354 11.9648C24.2354 10.239 22.8362 8.83984 21.1104 8.83984C19.3845 8.83984 17.9854 10.239 17.9854 11.9648C17.9854 13.6907 19.3845 15.0898 21.1104 15.0898Z" fill="#2ECF98" />
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M16.9686 17.7868C17.5582 17.899 17.9848 18.4145 17.9848 19.0148V31.9653C17.9848 32.3105 18.2646 32.5903 18.6098 32.5903H18.6641C18.9873 32.5903 19.2573 32.3438 19.2865 32.0219L19.8598 25.7153C19.8616 25.0262 20.4208 24.4685 21.1098 24.4685C21.7989 24.4685 22.358 25.0262 22.3598 25.7152L22.9331 32.0219C22.9624 32.3438 23.2323 32.5903 23.5556 32.5903H23.6098C23.955 32.5903 24.2348 32.3105 24.2348 31.9653V19.0384C24.2348 18.438 24.6616 17.9225 25.2513 17.8104C26.3488 17.6017 27.5093 17.312 28.7847 16.9404C29.1161 16.8438 29.3065 16.4968 29.2099 16.1654C29.1133 15.834 28.7664 15.6437 28.435 15.7403C25.5386 16.5844 23.3165 16.975 21.1125 16.9652C18.9063 16.9552 16.6815 16.544 13.777 15.7381C13.4443 15.6458 13.0999 15.8406 13.0076 16.1732C12.9153 16.5059 13.1101 16.8503 13.4428 16.9425C14.7135 17.2952 15.8715 17.578 16.9686 17.7868ZM20.471 32.4669C20.2501 33.2652 19.5193 33.8403 18.6641 33.8403H18.6098C17.5743 33.8403 16.7348 33.0009 16.7348 31.9653V19.0148C15.5937 18.7976 14.4006 18.5056 13.1085 18.147C12.1107 17.8702 11.5262 16.8368 11.8031 15.839C12.08 14.8412 13.1133 14.2567 14.1111 14.5336C16.967 15.326 19.0705 15.706 21.1181 15.7152C23.1591 15.7243 25.2545 15.3652 28.0852 14.5402C29.0794 14.2505 30.1202 14.8215 30.41 15.8157C30.6997 16.8098 30.1286 17.8507 29.1345 18.1404C27.8318 18.52 26.6314 18.8204 25.4848 19.0384V31.9653C25.4848 33.0009 24.6454 33.8403 23.6098 33.8403H23.5556C22.7003 33.8403 21.9695 33.2652 21.7486 32.4669C21.7284 32.3935 21.7124 32.3182 21.701 32.2414C21.6958 32.2063 21.6915 32.1708 21.6883 32.135L21.115 25.8285C21.1116 25.7917 21.11 25.7551 21.1098 25.7185C21.1097 25.7551 21.108 25.7917 21.1047 25.8285L20.5314 32.135C20.5281 32.1708 20.5239 32.2063 20.5187 32.2414C20.5073 32.3182 20.4913 32.3935 20.471 32.4669Z" fill="#2ECF98" />
                                                            </svg>
                                                            <div className='d-flex flex-column gap-1'>
                                                                <span className='contact-details-emergency'>BMI</span>
                                                                <span className='phisical-assessment-accordion-showData-box-subtitle'>{item.bmi} (Normal)</span>
                                                            </div>
                                                        </div>
                                                    </Col>

                                                    <Col md={4} sm={6}>
                                                        <div className='phisical-assessment-accordion-showData-box d-flex gap-3'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none">
                                                                <rect x="0.109375" y="0.339844" width="42" height="42" rx="6" fill="#F12647" fillOpacity="0.2" />
                                                                <path d="M21.7724 8.48956C21.6854 8.40247 21.5821 8.33338 21.4684 8.28624C21.3546 8.23911 21.2327 8.21484 21.1096 8.21484C20.9865 8.21484 20.8646 8.23911 20.7509 8.28624C20.6371 8.33338 20.5338 8.40247 20.4468 8.48956C20.0911 8.84478 11.7346 17.2914 11.7346 25.0899C11.7346 27.5763 12.7223 29.9608 14.4805 31.719C16.2386 33.4772 18.6232 34.4649 21.1096 34.4649C23.596 34.4649 25.9806 33.4772 27.7387 31.719C29.4969 29.9608 30.4846 27.5763 30.4846 25.0899C30.4846 17.2914 22.1281 8.84478 21.7724 8.48956ZM21.1096 32.5899C19.1212 32.5876 17.2149 31.7967 15.8088 30.3907C14.4028 28.9846 13.6119 27.0783 13.6096 25.0899C13.6096 19.2699 19.1641 12.657 21.1096 10.5202C23.0561 12.6561 28.6096 19.2616 28.6096 25.0899C28.6073 27.0783 27.8164 28.9846 26.4104 30.3907C25.0044 31.7967 23.098 32.5876 21.1096 32.5899Z" fill="#F12647" fillOpacity="0.7" />
                                                                <path d="M23.9221 24.1523H22.0471V22.2773C22.0471 22.0287 21.9483 21.7902 21.7725 21.6144C21.5967 21.4386 21.3583 21.3398 21.1096 21.3398C20.861 21.3398 20.6225 21.4386 20.4467 21.6144C20.2709 21.7902 20.1721 22.0287 20.1721 22.2773V24.1523H18.2971C18.0485 24.1523 17.81 24.2511 17.6342 24.4269C17.4584 24.6027 17.3596 24.8412 17.3596 25.0898C17.3596 25.3385 17.4584 25.5769 17.6342 25.7528C17.81 25.9286 18.0485 26.0273 18.2971 26.0273H20.1721V27.9023C20.1721 28.151 20.2709 28.3894 20.4467 28.5653C20.6225 28.7411 20.861 28.8398 21.1096 28.8398C21.3583 28.8398 21.5967 28.7411 21.7725 28.5653C21.9483 28.3894 22.0471 28.151 22.0471 27.9023V26.0273H23.9221C24.1708 26.0273 24.4092 25.9286 24.585 25.7528C24.7608 25.5769 24.8596 25.3385 24.8596 25.0898C24.8596 24.8412 24.7608 24.6027 24.585 24.4269C24.4092 24.2511 24.1708 24.1523 23.9221 24.1523Z" fill="#F12647" fillOpacity="0.7" />
                                                            </svg>
                                                            <div className='d-flex flex-column gap-1'>
                                                                <span className='contact-details-emergency'>Blood Group</span>
                                                                <span className='phisical-assessment-accordion-showData-box-subtitle'>{item.bloodGroup}</span>
                                                            </div>
                                                        </div>
                                                    </Col>

                                                    <Col md={4} sm={6}>
                                                        <div className='phisical-assessment-accordion-showData-box d-flex gap-3'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none">
                                                                <rect x="0.109375" y="0.339844" width="42" height="42" rx="6" fill="#E29578" fillOpacity="0.2" />
                                                                <path d="M28.5498 25.9676C28.2312 25.9677 27.9218 25.8646 27.6716 25.675C27.4214 25.4855 27.245 25.2205 27.1708 24.9229L25.1305 16.695C25.115 16.6332 25.0801 16.5775 25.0305 16.5353C24.981 16.4932 24.9192 16.4666 24.8534 16.4593C24.7877 16.452 24.7212 16.4642 24.6629 16.4944C24.6046 16.5245 24.5574 16.5711 24.5276 16.6278L22.1301 21.2332C22.0073 21.4635 21.8196 21.656 21.5885 21.7888C21.3573 21.9216 21.0919 21.9893 20.8226 21.9843C20.5529 21.9761 20.2912 21.8943 20.0682 21.7485C19.8452 21.6027 19.67 21.3988 19.5632 21.1609L18.5977 18.9985H13.4231C13.2782 18.9985 13.1393 18.9432 13.0369 18.8448C12.9345 18.7465 12.877 18.6131 12.877 18.474C12.877 18.3349 12.9345 18.2015 13.0369 18.1031C13.1393 18.0048 13.2782 17.9495 13.4231 17.9495H18.9581C19.065 17.9495 19.1695 17.9795 19.2588 18.036C19.348 18.0925 19.418 18.173 19.46 18.2673L20.567 20.7476C20.5914 20.8018 20.6314 20.8483 20.6823 20.8815C20.7331 20.9147 20.7928 20.9334 20.8543 20.9353C20.9163 20.9397 20.9783 20.9256 21.0317 20.8949C21.085 20.8642 21.1272 20.8184 21.1525 20.7638L23.55 16.159C23.6797 15.9091 23.8864 15.7036 24.142 15.5705C24.3976 15.4375 24.6897 15.3832 24.9785 15.4152C25.2673 15.4472 25.5389 15.5638 25.7562 15.7493C25.9736 15.9347 26.1262 16.1799 26.1933 16.4516L28.2331 24.6801C28.2478 24.7396 28.2806 24.7935 28.3272 24.8352C28.3739 24.8768 28.4323 24.9042 28.4952 24.914C28.5581 24.9245 28.6228 24.9166 28.6809 24.8913C28.739 24.8661 28.7879 24.8246 28.8213 24.7724L30.7955 21.7399C30.8446 21.6644 30.9129 21.6022 30.9939 21.5591C31.0749 21.516 31.166 21.4934 31.2586 21.4934H35.5632C35.7081 21.4934 35.847 21.5486 35.9494 21.647C36.0518 21.7453 36.1094 21.8787 36.1094 22.0178C36.1094 22.1569 36.0518 22.2903 35.9494 22.3887C35.847 22.4871 35.7081 22.5423 35.5632 22.5423H31.5612L29.7475 25.3288C29.6209 25.5243 29.4445 25.6856 29.2349 25.7974C29.0253 25.9091 28.7895 25.9677 28.5498 25.9676Z" fill="#E29578" stroke="#E29578" strokeWidth="0.2" />
                                                                <path d="M24.3984 22.1814C24.3522 22.0512 24.2566 21.9444 24.1322 21.8843C24.0078 21.8241 23.8647 21.8155 23.734 21.8603C23.6033 21.9051 23.4956 21.9996 23.4342 22.1233C23.3728 22.2471 23.3627 22.3901 23.4061 22.5212C23.6646 23.2237 23.714 23.2132 23.734 23.9614C23.734 26.0479 22.9052 28.0489 21.4298 29.5243C19.9545 30.9996 17.9534 31.8285 15.867 31.8285C13.7805 31.8285 11.7794 30.9996 10.3041 29.5243C8.82872 28.0489 7.99987 26.0479 7.99987 23.9614C7.99987 19.6088 14.2621 12.7618 15.867 11.0783C17.8948 13.1938 18.7331 13.9852 20.3573 16.4244C20.4335 16.5389 20.5517 16.6189 20.6863 16.6472C20.821 16.6754 20.9613 16.6495 21.0771 16.5752C21.1929 16.5009 21.2749 16.3841 21.3053 16.2499C21.3358 16.1158 21.3123 15.975 21.2399 15.858C19.4774 13.2069 18.4666 12.2275 16.2378 9.95434C16.1394 9.85602 16.006 9.80078 15.867 9.80078C15.7279 9.80078 15.5945 9.85602 15.4962 9.95434C15.1474 10.3031 6.95093 18.5615 6.95093 23.9614C6.95093 26.3261 7.89029 28.5939 9.56237 30.266C11.2344 31.9381 13.5023 32.8774 15.867 32.8774C18.2316 32.8774 20.4995 31.9381 22.1715 30.266C23.8436 28.5939 24.783 26.3261 24.783 23.9614C24.6995 23.1026 24.6944 23.0173 24.3984 22.1814Z" fill="#E29578" stroke="#E29578" strokeWidth="0.289362" />
                                                            </svg>
                                                            <div className='d-flex flex-column gap-1'>
                                                                <span className='contact-details-emergency'>Blood Pressure</span>
                                                                {/* <span className='phisical-assessment-accordion-showData-box-subtitle'>{item.systolic}/{item.diastolic} mmHg </span> */}
                                                                <span className='phisical-assessment-accordion-showData-box-subtitle'>
                                                                    {item.systolic}
                                                                    {item.systolic && item.diastolic && "/"}
                                                                    {item.diastolic}
                                                                    {(item.systolic || item.diastolic) && " mmHg"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col md={4} sm={6}>
                                                        <div className='phisical-assessment-accordion-showData-box d-flex gap-3'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none">
                                                                <rect x="0.109375" y="0.339844" width="42" height="42" rx="6" fill="#FF8695" fillOpacity="0.2" />
                                                                <path d="M24.1666 25.3992L19.7041 30.2648L11.1353 20.8898C10.499 20.2073 10.0785 19.352 9.92667 18.4313C9.77488 17.5105 9.89857 16.5655 10.2822 15.7148C10.587 15.0118 11.0594 14.3941 11.6583 13.916C12.2571 13.4379 12.964 13.1138 13.7171 12.9723C14.4702 12.8307 15.2466 12.876 15.9781 13.104C16.7097 13.3321 17.3742 13.736 17.9135 14.2805L19.0385 15.4148C19.1256 15.5027 19.2293 15.5725 19.3435 15.6201C19.4578 15.6676 19.5803 15.6922 19.7041 15.6922C19.8278 15.6922 19.9504 15.6676 20.0646 15.6201C20.1789 15.5725 20.2826 15.5027 20.3697 15.4148L21.4947 14.2805C21.9356 13.8381 22.4604 13.4884 23.0384 13.2517C23.6164 13.015 24.2358 12.8963 24.8603 12.9023C25.5938 12.8979 26.3176 13.0702 26.9703 13.4048C27.6231 13.7393 28.1856 14.2262 28.6103 14.8242C29.0622 15.4425 29.3615 16.1589 29.4837 16.9149C29.6059 17.6709 29.5475 18.4451 29.3135 19.1742C29.268 19.294 29.2477 19.4218 29.2536 19.5497C29.2594 19.6777 29.2915 19.803 29.3477 19.9181C29.4039 20.0332 29.4831 20.1355 29.5804 20.2188C29.6777 20.3021 29.7911 20.3646 29.9135 20.4023C30.1497 20.4792 30.4067 20.4592 30.6282 20.3467C30.8497 20.2342 31.0175 20.0384 31.0947 19.8023C31.4235 18.7931 31.5099 17.7205 31.347 16.6716C31.1842 15.6227 30.7766 14.6269 30.1572 13.7648C29.5564 12.9194 28.7622 12.2298 27.8408 11.7536C26.9194 11.2774 25.8975 11.0284 24.8603 11.0273C23.989 11.0274 23.1263 11.1997 22.3219 11.5343C21.5174 11.869 20.7871 12.3594 20.1728 12.9773L19.7135 13.4461L19.2353 12.9773C18.6211 12.3594 17.8907 11.869 17.0863 11.5343C16.2818 11.1997 15.4191 11.0274 14.5478 11.0273C13.2729 11.0282 12.0263 11.4037 10.9629 12.107C9.89956 12.8104 9.06627 13.8107 8.56658 14.9836C8.02599 16.1691 7.85055 17.4887 8.06258 18.7743C8.27462 20.0599 8.86454 21.2532 9.7572 22.2023L19.0103 32.2898C19.0982 32.3865 19.2053 32.4638 19.3248 32.5166C19.4442 32.5695 19.5734 32.5968 19.7041 32.5968C19.8347 32.5968 19.9639 32.5695 20.0834 32.5166C20.2029 32.4638 20.31 32.3865 20.3978 32.2898L25.5541 26.6648C25.7232 26.4808 25.8122 26.2372 25.8017 25.9876C25.7911 25.7379 25.6818 25.5027 25.4978 25.3336C25.3138 25.1645 25.0702 25.0755 24.8206 25.086C24.5709 25.0966 24.3357 25.2058 24.1666 25.3898V25.3992Z" fill="#FF8695" />
                                                                <path d="M33.2974 22.2774H26.4349L24.7942 18.1805C24.7248 18.0061 24.6045 17.8565 24.4491 17.7512C24.2936 17.6459 24.1101 17.5897 23.9224 17.5899C23.7367 17.5882 23.5548 17.6416 23.3996 17.7434C23.2444 17.8452 23.1229 17.9908 23.0505 18.1618L21.1755 22.643L20.1442 20.0555C20.0725 19.875 19.9465 19.7212 19.7836 19.6154C19.6207 19.5096 19.429 19.457 19.2349 19.4649C19.0432 19.4702 18.8577 19.5341 18.7034 19.6481C18.5492 19.7621 18.4337 19.9207 18.3724 20.1024L17.6224 22.2774H16.4224C16.1737 22.2774 15.9353 22.3762 15.7595 22.552C15.5836 22.7278 15.4849 22.9662 15.4849 23.2149C15.4849 23.4635 15.5836 23.702 15.7595 23.8778C15.9353 24.0536 16.1737 24.1524 16.4224 24.1524H18.2974C18.4939 24.1529 18.6856 24.0916 18.8455 23.9772C19.0053 23.8628 19.1251 23.7011 19.188 23.5149L19.3099 23.1305L20.2474 25.4368C20.3162 25.6097 20.435 25.7583 20.5887 25.8634C20.7423 25.9686 20.9237 26.0257 21.1099 26.0274C21.2939 26.0272 21.4738 25.9729 21.6272 25.8712C21.7805 25.7695 21.9006 25.625 21.9724 25.4555L23.8474 20.9743L24.8786 23.5618C24.9508 23.7439 25.0783 23.8987 25.2431 24.0047C25.4079 24.1106 25.6017 24.1623 25.7974 24.1524H33.2974C33.546 24.1524 33.7845 24.0536 33.9603 23.8778C34.1361 23.702 34.2349 23.4635 34.2349 23.2149C34.2349 22.9662 34.1361 22.7278 33.9603 22.552C33.7845 22.3762 33.546 22.2774 33.2974 22.2774Z" fill="#FF8695" />
                                                            </svg>
                                                            <div className='d-flex flex-column gap-1'>
                                                                <span className='contact-details-emergency'>Hearth Rate</span>
                                                                <span className='phisical-assessment-accordion-showData-box-subtitle'>{item.heartRate} bpm</span>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    )

                                })}

                            </Accordion>
                        </div>
                    )}
                </>

            ),
        },
        {
            id: '1',
            title: 'Fertility Assessment',
            content: (
                <>
                    {/* Fix: Show skeleton when data is null OR empty */}
                    {!modalFormFertilityData ||
                        Object.keys(modalFormFertilityData).length === 0 ? (
                        <>
                            {loading ? (
                                <>
                                    <Skeleton width={100} height={30} />
                                    <div className="p-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <Skeleton width={150} height={25} />
                                        </div>
                                        {[...Array(3)].map((_, idx) => (
                                            <div key={idx} className="custom-skeleton-accordion mb-3">

                                                {/* Header */}
                                                <div className="accordion-skeleton-header d-flex justify-content-between align-items-center">
                                                    <div className="d-flex align-items-center gap-2">
                                                    </div>
                                                </div>

                                                {/* Body */}
                                                <div className="accordion-skeleton-body mt-3">
                                                    <div className="row g-3">
                                                        {[1, 2,].map((col) => (
                                                            <div className="col-md-4 col-sm-6" key={col}>
                                                                <div className="d-flex gap-3 align-items-center">
                                                                    <div className="d-flex flex-column gap-1">
                                                                        <Skeleton width={200} />
                                                                        <Skeleton width={100} height={14} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                </>

                            ) : (
                                <div className="text-center">
                                         <svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 81 81" fill="none">
                                            <path d="M16.8308 29.5077C16.5023 29.5092 16.1768 29.4452 15.8734 29.3192C15.5701 29.1933 15.2949 29.008 15.0641 28.7743L11.7308 25.441C9.06581 22.7926 7.55607 19.198 7.53076 15.441C7.53502 14.4301 7.74005 13.4301 8.13394 12.499C8.52784 11.568 9.10275 10.7244 9.8253 10.0174C10.5479 9.31032 11.4037 8.75384 12.343 8.38024C13.2824 8.00663 14.2866 7.82334 15.2974 7.84101C16.7924 7.83521 18.255 8.2763 19.4974 9.10768L28.2308 14.941C28.7395 15.3281 29.0806 15.8953 29.184 16.5262C29.2875 17.157 29.1453 17.8035 28.7868 18.3327C28.4282 18.862 27.8806 19.2338 27.2564 19.3717C26.6322 19.5096 25.9789 19.4032 25.4308 19.0743L16.8308 13.2743C16.4019 13.0009 15.906 12.851 15.3974 12.841C14.699 12.841 14.0292 13.1184 13.5354 13.6123C13.0415 14.1061 12.7641 14.7759 12.7641 15.4743C12.7496 16.712 12.9841 17.94 13.4536 19.0853C13.9232 20.2306 14.6182 21.2697 15.4974 22.141L18.8308 25.4743C19.2989 25.9431 19.5619 26.5785 19.5619 27.241C19.5619 27.9035 19.2989 28.5389 18.8308 29.0077C18.5532 29.2304 18.2307 29.3903 17.8855 29.4766C17.5403 29.5629 17.1805 29.5735 16.8308 29.5077Z" fill="#9CA3AF" />
                                            <path d="M19.464 24.9755C19.0047 23.2922 17.9037 21.8562 16.3974 20.9755C15.8112 20.6122 15.1587 20.3691 14.4777 20.2604C13.7967 20.1516 13.1009 20.1794 12.4307 20.3422C10.947 20.8569 9.72783 21.939 9.04052 23.3511C8.3532 24.7632 8.25378 26.3902 8.76405 27.8755C9.17734 29.3454 10.0688 30.6356 11.2974 31.5422C12.2701 32.2329 13.4379 32.5949 14.6307 32.5755C15.0825 32.5742 15.5317 32.5068 15.964 32.3755C16.7084 32.1459 17.3931 31.7551 17.9692 31.2308C18.5453 30.7065 18.9988 30.0617 19.2974 29.3422C19.8419 27.9467 19.9007 26.4084 19.464 24.9755Z" fill="#DDE1E8" />
                                            <path d="M63.4976 29.5066C63.1691 29.5081 62.8436 29.4441 62.5403 29.3181C62.2369 29.1922 61.9617 29.0069 61.7309 28.7732C61.2627 28.3045 60.9998 27.6691 60.9998 27.0066C60.9998 26.3441 61.2627 25.7087 61.7309 25.2399L65.0642 21.9066C65.9434 21.0353 66.6385 19.9961 67.108 18.8509C67.5776 17.7056 67.8121 16.4776 67.7976 15.2399C67.7976 14.5415 67.5201 13.8717 67.0263 13.3779C66.5324 12.884 65.8626 12.6066 65.1642 12.6066C64.6557 12.6165 64.1598 12.7664 63.7309 13.0399L54.8976 19.0732C54.6271 19.279 54.3175 19.4275 53.9877 19.5096C53.6578 19.5917 53.3148 19.6057 52.9794 19.5507C52.644 19.4957 52.3233 19.3729 52.0369 19.1898C51.7506 19.0067 51.5046 18.7672 51.314 18.4858C51.1234 18.2044 50.9921 17.8871 50.9283 17.5532C50.8644 17.2194 50.8693 16.8761 50.9427 16.5442C51.016 16.2123 51.1563 15.8989 51.3548 15.6231C51.5534 15.3472 51.8061 15.1148 52.0976 14.9399L60.8309 9.10657C62.0734 8.27519 63.536 7.8341 65.0309 7.8399C67.0554 7.8399 68.997 8.64412 70.4285 10.0757C71.86 11.5072 72.6642 13.4487 72.6642 15.4732C72.6389 19.2302 71.1292 22.8249 68.4642 25.4732L65.1309 28.8066C64.6923 29.2347 64.1101 29.4843 63.4976 29.5066Z" fill="#9CA3AF" />
                                            <path d="M67.8974 20.3432C67.2338 20.1656 66.5415 20.1214 65.8607 20.2129C65.1799 20.3044 64.5239 20.53 63.9307 20.8765C62.4245 21.7571 61.3235 23.1932 60.8641 24.8765C60.4357 26.3516 60.5299 27.9294 61.1307 29.3432C61.4293 30.0627 61.8828 30.7075 62.4589 31.2318C63.0351 31.7561 63.7197 32.1469 64.4641 32.3765C64.8964 32.5078 65.3456 32.5752 65.7974 32.5765C66.9333 32.5612 68.0378 32.2008 68.9641 31.5431C70.1927 30.6366 71.0841 29.3464 71.4974 27.8765C72.0109 26.3998 71.9208 24.7801 71.2467 23.3695C70.5726 21.9588 69.3689 20.8713 67.8974 20.3432ZM55.5641 15.6098C55.4206 15.3714 55.2273 15.1667 54.9974 15.0098C50.7067 11.8274 45.5062 10.1094 40.1641 10.1094C34.822 10.1094 29.6215 11.8274 25.3307 15.0098C25.1009 15.1667 24.9076 15.3714 24.7641 15.6098C22.5264 18.9623 21.3826 22.9259 21.4901 26.9551C21.5975 30.9844 22.9509 34.8813 25.3641 38.1098L27.6641 41.1765V45.6432C27.6506 48.9475 28.8348 52.1448 30.9974 54.6432V67.0098C31.0062 68.5542 31.6235 70.0329 32.7156 71.1249C33.8077 72.217 35.2863 72.8344 36.8307 72.8432H43.4974C45.0418 72.8344 46.5205 72.217 47.6125 71.1249C48.7046 70.0329 49.322 68.5542 49.3307 67.0098V54.6432C51.4933 52.1448 52.6775 48.9475 52.6641 45.6432V41.1765L54.9641 38.1098C57.3772 34.8813 58.7306 30.9844 58.8381 26.9551C58.9455 22.9259 57.8017 18.9623 55.5641 15.6098Z" fill="#DDE1E8" />
                                            <path d="M50.1641 22.84C47.3614 20.4907 43.8211 19.2031 40.1641 19.2031C36.507 19.2031 32.9667 20.4907 30.1641 22.84C29.9028 23.0442 29.6854 23.299 29.5249 23.5891C29.3643 23.8793 29.264 24.1988 29.2297 24.5287C29.1955 24.8585 29.2281 25.1919 29.3257 25.5088C29.4232 25.8257 29.5836 26.1198 29.7974 26.3733C32.2974 28.9078 34.2709 31.9123 35.6039 35.2133C36.9369 38.5144 37.6031 42.0468 37.5641 45.6066C37.5641 46.2697 37.8274 46.9055 38.2963 47.3744C38.7651 47.8432 39.401 48.1066 40.0641 48.1066C40.7271 48.1066 41.363 47.8432 41.8318 47.3744C42.3007 46.9055 42.5641 46.2697 42.5641 45.6066C42.525 42.0468 43.1912 38.5144 44.5242 35.2133C45.8572 31.9123 47.8307 28.9078 50.3307 26.3733C50.5561 26.1325 50.7309 25.849 50.8448 25.5395C50.9587 25.23 51.0093 24.9008 50.9938 24.5714C50.9783 24.242 50.8968 23.919 50.7543 23.6216C50.6118 23.3242 50.4111 23.0584 50.1641 22.84Z" fill="#9CA3AF" />
                                        </svg>
                                    <p className='patient-accordion-content-subtitle my-3'>
                                        No fertility assessment
                                    </p>
                                    <Button onClick={() => setShowFertilityAssessment(true)}
                                        variant="outline"
                                        disabled={false}
                                        contentSize="medium"
                                    >
                                           <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.1641 8C15.1641 8.16576 15.0982 8.32473 14.981 8.44194C14.8638 8.55915 14.7048 8.625 14.5391 8.625H8.28906V14.875C8.28906 15.0408 8.22322 15.1997 8.10601 15.3169C7.9888 15.4342 7.82982 15.5 7.66406 15.5C7.4983 15.5 7.33933 15.4342 7.22212 15.3169C7.10491 15.1997 7.03906 15.0408 7.03906 14.875V8.625H0.789063C0.623302 8.625 0.464331 8.55915 0.347121 8.44194C0.229911 8.32473 0.164062 8.16576 0.164062 8C0.164062 7.83424 0.229911 7.67527 0.347121 7.55806C0.464331 7.44085 0.623302 7.375 0.789063 7.375H7.03906V1.125C7.03906 0.95924 7.10491 0.800269 7.22212 0.683058C7.33933 0.565848 7.4983 0.5 7.66406 0.5C7.82982 0.5 7.9888 0.565848 8.10601 0.683058C8.22322 0.800269 8.28906 0.95924 8.28906 1.125V7.375H14.5391C14.7048 7.375 14.8638 7.44085 14.981 7.55806C15.0982 7.67527 15.1641 7.83424 15.1641 8Z" fill="#2B4360" />
                                            </svg>
                                        <span className='ms-1'> Add Fertility Assessment</span>
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div>
                            <Button
                                className='mb-3 add-new-button'
                                onClick={() => {
                                    setEditFertilityAssessment(modalFormFertilityData);
                                    setShowFertilityAssessment(true);
                                }}
                                variant="outline"
                                contentSize="small"
                            >
                                <svg width="16" height="16" className='me-1' viewBox="0 0 14 14" fill="none">
                                    <path d="M13.5484 3.40848L10.7553 0.615983C10.5209 0.381644 10.203 0.25 9.87157 0.25C9.54011 0.25 9.22223 0.381644 8.98782 0.615983L1.28032 8.32286C1.16385 8.43861 1.0715 8.57633 1.00863 8.72803C0.945765 8.87973 0.913622 9.0424 0.914067 9.20661V11.9997C0.914067 12.3313 1.04576 12.6492 1.28018 12.8836C1.5146 13.118 1.83255 13.2497 2.16407 13.2497H12.6641C12.863 13.2497 13.0537 13.1707 13.1944 13.0301C13.3351 12.8894 13.4141 12.6986 13.4141 12.4997C13.4141 12.3008 13.3351 12.1101 13.1944 11.9694C13.0537 11.8288 12.863 11.7497 12.6641 11.7497H6.97657L13.5484 5.17661C13.6646 5.06053 13.7567 4.92271 13.8195 4.77102C13.8824 4.61933 13.9147 4.45674 13.9147 4.29255C13.9147 4.12835 13.8824 3.96576 13.8195 3.81407C13.7567 3.66238 13.6646 3.52456 13.5484 3.40848ZM4.85157 11.7497H2.41407V9.31223L7.66407 4.06223L10.1016 6.49973L4.85157 11.7497ZM11.1641 5.43723L8.72657 2.99973L9.87282 1.85348L12.3103 4.29098L11.1641 5.43723Z" fill="#2B4360" />
                                </svg>
                                Edit
                            </Button>

                            {/* Accordion */}
                            <Accordion defaultActiveKey="0">
                                {/* MENSTRUAL CYCLE */}
                                <Accordion.Item eventKey="0" className='phisical-assessment-accordion-item mb-3'>
                                    <Accordion.Header>
                                        <div className='d-flex justify-content-center align-items-center gap-2'>
                                                 <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                                                    <rect x="0.399414" y="0.5" width="34" height="34" rx="6" fill="#0062D2" fillOpacity="0.2" />
                                                    <path d="M25.7697 9.79492H25.3824C25.2609 9.79492 25.1624 9.89346 25.1624 10.0149C25.1624 10.1364 25.2609 10.2349 25.3824 10.2349H25.7697C26.0911 10.2349 26.3523 10.4962 26.3523 10.8176V26.0852C26.3523 26.4058 26.0916 26.6665 25.7711 26.6665H9.02904C8.70849 26.6665 8.44781 26.4058 8.44781 26.0852V10.8176C8.44781 10.4962 8.70906 10.2349 9.03047 10.2349H9.41776C9.53922 10.2349 9.63776 10.1364 9.63776 10.0149C9.63776 9.89346 9.53922 9.79492 9.41776 9.79492H9.03047C8.46643 9.79492 8.00781 10.2535 8.00781 10.8176V26.0852C8.00781 26.6484 8.46586 27.1065 9.02904 27.1065H25.7711C26.3343 27.1065 26.7923 26.6484 26.7923 26.0852V10.8176C26.7923 10.2535 26.3337 9.79492 25.7697 9.79492Z" fill="#0062D2" stroke="#0062D2" strokeWidth="0.289362" />
                                                    <path d="M11.1893 11.7314C11.3108 11.7314 11.4093 11.6329 11.4093 11.5114C11.4093 11.3899 11.3108 11.2914 11.1893 11.2914C10.7708 11.2914 10.4039 10.5999 10.4039 9.81185C10.4039 9.0238 10.7708 8.33258 11.1893 8.33258C11.4271 8.33258 11.6683 8.56661 11.8187 8.94331C11.8639 9.05617 11.9917 9.11232 12.1046 9.06591C12.2174 9.02094 12.2724 8.89289 12.2272 8.78003C12.0055 8.2243 11.6173 7.89258 11.1893 7.89258C10.5021 7.89258 9.96387 8.73563 9.96387 9.81185C9.96387 10.8884 10.5021 11.7314 11.1893 11.7314ZM14.5535 8.33258C14.7913 8.33258 15.0325 8.56661 15.1829 8.94331C15.2278 9.05617 15.3556 9.11232 15.4687 9.06591C15.5816 9.02094 15.6366 8.89289 15.5913 8.78003C15.3696 8.2243 14.9815 7.89258 14.5535 7.89258C13.8663 7.89258 13.328 8.73563 13.328 9.81185C13.328 10.8884 13.8663 11.7314 14.5535 11.7314C14.675 11.7314 14.7735 11.6329 14.7735 11.5114C14.7735 11.3899 14.675 11.2914 14.5535 11.2914C14.135 11.2914 13.768 10.5999 13.768 9.81185C13.768 9.0238 14.135 8.33258 14.5535 8.33258ZM17.9177 7.89258C17.2305 7.89258 16.6922 8.73563 16.6922 9.81185C16.6922 10.8884 17.2305 11.7314 17.9177 11.7314C18.0391 11.7314 18.1377 11.6329 18.1377 11.5114C18.1377 11.3899 18.0391 11.2914 17.9177 11.2914C17.4992 11.2914 17.1322 10.5999 17.1322 9.81185C17.1322 9.0238 17.4992 8.33258 17.9177 8.33258C18.1554 8.33258 18.3966 8.56661 18.5473 8.94331C18.5926 9.05617 18.7212 9.11089 18.8332 9.06591C18.9461 9.02094 19.0011 8.89289 18.9558 8.78003C18.7335 8.2243 18.3456 7.89258 17.9177 7.89258ZM21.2818 7.89258C20.5949 7.89258 20.0567 8.73563 20.0567 9.81185C20.0567 10.8884 20.5949 11.7314 21.2818 11.7314C21.4033 11.7314 21.5018 11.6329 21.5018 11.5114C21.5018 11.3899 21.4033 11.2914 21.2818 11.2914C20.8636 11.2914 20.4967 10.5999 20.4967 9.81185C20.4967 9.0238 20.8636 8.33258 21.2818 8.33258C21.5196 8.33258 21.7608 8.56661 21.9115 8.94331C21.9564 9.05617 22.0851 9.11089 22.1974 9.06591C22.3102 9.02094 22.3652 8.89289 22.32 8.78003C22.0977 8.2243 21.7098 7.89258 21.2818 7.89258ZM24.6463 7.89258C23.9591 7.89258 23.4208 8.73563 23.4208 9.81185C23.4208 10.8884 23.9591 11.7314 24.6463 11.7314C24.7677 11.7314 24.8663 11.6329 24.8663 11.5114C24.8663 11.3899 24.7677 11.2914 24.6463 11.2914C24.2278 11.2914 23.8608 10.5999 23.8608 9.81185C23.8608 9.0238 24.2278 8.33258 24.6463 8.33258C24.8838 8.33258 25.125 8.56661 25.2756 8.94331C25.3209 9.05617 25.4498 9.11089 25.5615 9.06591C25.6744 9.02094 25.7294 8.89289 25.6841 8.78003C25.4618 8.2243 25.074 7.89258 24.6463 7.89258Z" fill="#0062D2" stroke="#0062D2" strokeWidth="0.289362" />
                                                    <path d="M12.7851 10.0149C12.7851 9.89346 12.6865 9.79492 12.5651 9.79492H11.4041C11.2826 9.79492 11.1841 9.89346 11.1841 10.0149C11.1841 10.1364 11.2826 10.2349 11.4041 10.2349H12.5651C12.6865 10.2349 12.7851 10.1364 12.7851 10.0149ZM15.9674 10.2349C16.0888 10.2349 16.1874 10.1364 16.1874 10.0149C16.1874 9.89346 16.0888 9.79492 15.9674 9.79492H14.8063C14.6849 9.79492 14.5863 9.89346 14.5863 10.0149C14.5863 10.1364 14.6849 10.2349 14.8063 10.2349H15.9674ZM17.9296 10.0149C17.9296 10.1364 18.0281 10.2349 18.1496 10.2349H19.3109C19.4324 10.2349 19.5309 10.1364 19.5309 10.0149C19.5309 9.89346 19.4324 9.79492 19.3109 9.79492H18.1496C18.0281 9.79492 17.9296 9.89346 17.9296 10.0149ZM22.533 9.79492H21.372C21.2505 9.79492 21.152 9.89346 21.152 10.0149C21.152 10.1364 21.2505 10.2349 21.372 10.2349H22.533C22.6544 10.2349 22.753 10.1364 22.753 10.0149C22.753 9.89346 22.6544 9.79492 22.533 9.79492ZM12.1437 13.3567C11.4413 13.3567 10.8701 13.9279 10.8701 14.6301V23.3533C10.8701 24.0418 11.4271 24.6266 12.1437 24.6266H20.7071C20.8286 24.6266 20.9271 24.528 20.9271 24.4066C20.9271 24.2851 20.8286 24.1866 20.7071 24.1866H12.1437C11.6716 24.1866 11.3101 23.8009 11.3101 23.3533V14.6301C11.3101 14.1706 11.6839 13.7967 12.1437 13.7967H23.0887C23.5482 13.7967 23.922 14.1706 23.922 14.6301V21.6577C23.922 21.748 23.8879 21.8336 23.8263 21.8989L22.1251 23.6999C22.0671 23.7613 21.9666 23.7233 21.9543 23.667L21.7298 21.652C21.7175 21.59 21.7652 21.5314 21.8292 21.5314H22.3817C22.5032 21.5314 22.6017 21.4329 22.6017 21.3114C22.6017 21.1899 22.5032 21.0914 22.3817 21.0914H21.8292C21.4804 21.0914 21.235 21.417 21.2952 21.7182L21.5198 23.7328C21.6042 24.1707 22.1454 24.3192 22.4448 24.0021L24.146 22.2011C24.2852 22.0539 24.362 21.8608 24.362 21.6577V14.6301C24.362 13.9279 23.7908 13.3567 23.0887 13.3567H12.1437Z" fill="#0062D2" stroke="#0062D2" strokeWidth="0.289362" />
                                                    <path d="M17.6503 17.6144C17.7079 17.7212 17.8411 17.7622 17.9482 17.7043C18.0554 17.6468 18.0955 17.5136 18.0382 17.4064C17.6019 16.594 17.0774 15.7911 16.8717 15.4834C16.7307 15.2734 16.4235 15.274 16.2839 15.4837C15.7185 16.3296 14.4033 18.3996 14.4033 19.3535C14.4033 20.5526 15.3787 21.528 16.5778 21.528C16.6993 21.528 16.7978 21.4295 16.7978 21.308C16.7978 21.1865 16.6993 21.088 16.5778 21.088C15.6213 21.088 14.8433 20.31 14.8433 19.3535C14.8433 18.6915 15.7259 17.1237 16.5778 15.8364C16.813 16.1924 17.2673 16.9005 17.6503 17.6144Z" fill="#0062D2" stroke="#0062D2" strokeWidth="0.289362" />
                                                    <path d="M18.7704 21.8644C19.555 21.8644 20.1933 21.2261 20.1933 20.4414C20.1933 19.8576 19.4588 18.6645 19.0211 18.0053C18.9091 17.8368 18.6318 17.8368 18.5199 18.0053C18.0821 18.6645 17.3477 19.8576 17.3477 20.4414C17.3477 21.2261 17.986 21.8644 18.7704 21.8644ZM18.7704 18.3045C19.2887 19.0957 19.8194 20.0456 19.8194 20.4414C19.8194 21.0199 19.3488 21.4904 18.7704 21.4904C18.1922 21.4904 17.7216 21.0199 17.7216 20.4414C17.7216 20.0456 18.2523 19.0954 18.7704 18.3045Z" fill="#0062D2" stroke="#0062D2" strokeWidth="0.245915" />
                                                </svg>
                                            <span className='patient-report-box-title'>
                                                Menstrual Cycle
                                            </span>
                                        </div>
                                    </Accordion.Header>

                                    <Accordion.Body className='pt-0'>
                                        <Row className='g-2'>
                                            <Col sm={6}>
                                                <div className="d-flex flex-column gap-1">
                                                    <span className="contact-details-emergency">Age at first menstruation</span>
                                                    <span className="accordion-title-detail">
                                                        {modalFormFertilityData?.menstrualCycle?.ageAtFirstMenstruation}
                                                    </span>
                                                </div>
                                            </Col>

                                            <Col sm={6}>
                                                <div className="d-flex flex-column gap-1">
                                                    <span className="contact-details-emergency">Cycle Length</span>
                                                    <span className="accordion-title-detail">
                                                        {modalFormFertilityData?.menstrualCycle?.cycleLength}
                                                    </span>
                                                </div>
                                            </Col>

                                            <Col sm={6}>
                                                <div className="d-flex flex-column gap-1">
                                                    <span className="contact-details-emergency">Period Length</span>
                                                    <span className="accordion-title-detail">
                                                        {modalFormFertilityData?.menstrualCycle?.periodLength}
                                                    </span>
                                                </div>
                                            </Col>

                                            <Col sm={6}>
                                                <div className="d-flex flex-column gap-1">
                                                    <span className="contact-details-emergency">Last Period Date</span>
                                                    <span className="accordion-title-detail">
                                                        {modalFormFertilityData?.menstrualCycle?.lastPeriodDate}
                                                    </span>
                                                </div>
                                            </Col>

                                            <Col sm={6}>
                                                <div className="d-flex flex-column gap-1">
                                                    <span className="contact-details-emergency">Is your cycle regular?</span>
                                                    <span className="accordion-title-detail">
                                                        {modalFormFertilityData?.menstrualCycle?.isCycleRegular}
                                                    </span>
                                                </div>
                                            </Col>

                                            <Col sm={6}>
                                                <div className="d-flex flex-column gap-1">
                                                    <span className="contact-details-emergency">
                                                        Do you experience menstrual issues?
                                                    </span>
                                                    <span className="accordion-title-detail">
                                                        {modalFormFertilityData?.menstrualCycle?.menstrualIssues}
                                                    </span>
                                                </div>
                                            </Col>

                                            {/* <Col sm={6}>
                                        <div className="d-flex flex-column gap-1">
                                            <span className="contact-details-emergency">
                                                Menstrual issues details
                                            </span>
                                            <span className="accordion-title-detail">
                                                {modalFormFertilityData?.menstrualCycle?.menstrualIssuesDetails || 'N/A'}
                                            </span>
                                        </div>
                                    </Col> */}
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>

                                {/* PREGNANCY */}
                                <Accordion.Item eventKey="1" className='phisical-assessment-accordion-item mb-3'>
                                    <Accordion.Header>
                                        <div className='d-flex justify-content-center align-items-center gap-2'>
                                             <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                                                    <rect x="0.399414" y="0.5" width="34" height="34" rx="6" fill="#FFE3E8" />
                                                    <g clipPath="url(#clip0_7367_52089)">
                                                        <path d="M20.3179 27.9273C20.2581 27.9953 20.2276 28.0843 20.233 28.1747C20.2384 28.2652 20.2793 28.3498 20.3469 28.4103C20.4144 28.4707 20.503 28.5021 20.5935 28.4975C20.684 28.4929 20.7691 28.4528 20.8301 28.3858L20.914 28.2923C21.9573 27.1294 23.703 25.1833 23.374 22.9224C23.3168 22.5414 23.2057 22.1704 23.044 21.8206C23.0385 21.8042 23.0317 21.7883 23.0238 21.7729C22.666 21.0105 22.0649 20.2799 21.2203 19.581C21.2106 19.5724 21.2005 19.5643 21.1899 19.5568C20.8761 19.3004 20.5493 19.0605 20.2107 18.838C20.3822 18.7121 20.5254 18.5517 20.6312 18.3671C20.7369 18.1825 20.8029 17.9778 20.8248 17.7662C20.9085 16.6328 19.5374 15.6255 19.0868 15.2945L19.0602 15.2749C18.6875 15.0004 18.3651 14.785 18.0805 14.5948C17.1503 13.9726 16.8818 13.7646 16.9129 13.1151C17.5389 13.2785 18.1539 13.1708 18.5378 12.7871C19.7227 11.6029 19.1679 9.00246 18.9697 8.23401C18.7418 7.35074 17.7771 6.58315 16.8191 6.52299C14.8623 6.39958 13.5027 6.77221 12.6619 7.65994C11.3371 9.05935 11.6135 11.4015 11.8806 13.6665C12.1057 15.5743 12.3182 17.376 11.5396 18.304C11.4702 18.3871 11.4219 18.4858 11.399 18.5916C11.376 18.6974 11.3791 18.8072 11.4079 18.9116C11.4378 19.0204 11.4937 19.1203 11.5707 19.2027C11.6478 19.2852 11.7436 19.3477 11.8502 19.3849C12.1935 19.5041 12.5545 19.5643 12.9179 19.5628C13.537 19.5643 14.1457 19.4037 14.6835 19.097C14.7054 20.0191 14.2709 20.6676 13.7743 21.4079C12.8699 22.7564 11.7445 24.4346 13.0043 28.264C13.034 28.3491 13.0959 28.4191 13.1767 28.459C13.2575 28.4988 13.3507 28.5054 13.4363 28.4773C13.5219 28.4491 13.593 28.3884 13.6343 28.3084C13.6757 28.2283 13.6839 28.1352 13.6573 28.0491C12.5023 24.5388 13.4814 23.079 14.3453 21.791C15.0109 20.7984 15.6484 19.8462 15.2588 18.2445L16.5669 19.5949C16.7319 19.7657 16.9303 19.9006 17.1498 19.9913L22.4567 22.1935C22.5708 22.4582 22.6503 22.7365 22.6934 23.0214C22.9762 24.9636 21.4272 26.6906 20.4022 27.8333L20.3179 27.9273ZM14.5378 18.3435C14.3853 18.568 13.2174 19.1364 12.0662 18.7461C13.0358 17.5905 12.8063 15.6454 12.5634 13.586C12.3146 11.478 12.0574 9.29826 13.1612 8.1326C13.8529 7.40179 15.0352 7.10015 16.7759 7.20911C17.1056 7.24014 17.4199 7.36345 17.6827 7.5649C17.2039 8.67177 16.658 9.28915 15.3774 9.3799C15.3758 9.38024 15.3745 9.38076 15.3731 9.38076C15.3671 9.3811 15.3611 9.38007 15.355 9.38076C15.2643 9.38929 15.1806 9.43352 15.1225 9.50372C15.0643 9.57392 15.0365 9.66434 15.045 9.7551C15.1258 10.62 14.8202 11.4928 14.5103 12.2328C14.3972 12.5027 14.2648 12.7679 14.1368 13.0242C13.6765 13.9461 13.2006 14.8997 13.606 16.1265C13.6712 16.3185 13.7555 16.5035 13.8575 16.6787C14.1555 17.1792 14.3899 17.7149 14.5555 18.2734C14.5472 18.2961 14.5411 18.3196 14.5378 18.3435ZM17.4136 19.3562C17.2809 19.3015 17.1609 19.22 17.0611 19.1168L14.568 16.5431C14.531 16.4746 14.4933 16.4064 14.4549 16.3386C14.3755 16.2029 14.3098 16.0596 14.2588 15.9108C13.9424 14.9531 14.3174 14.2015 14.7521 13.3311C14.885 13.0647 15.0225 12.7894 15.1443 12.4984C15.4485 11.7719 15.7481 10.9228 15.745 10.0308C17.1235 9.82901 17.7634 9.00263 18.1856 8.11954C18.2372 8.20939 18.277 8.30551 18.3041 8.40554C18.7578 10.1652 18.6588 11.6942 18.0518 12.3009C17.7841 12.5683 17.1351 12.6012 16.5126 12.1921C16.4749 12.1673 16.4326 12.1502 16.3883 12.1418C16.3439 12.1334 16.2984 12.1337 16.2542 12.1429C16.21 12.1521 16.168 12.1699 16.1307 12.1952C16.0933 12.2206 16.0614 12.2531 16.0366 12.2909C16.0118 12.3286 15.9947 12.3708 15.9863 12.4152C15.9779 12.4595 15.9782 12.5051 15.9874 12.5493C15.9966 12.5935 16.0144 12.6355 16.0397 12.6728C16.0651 12.7101 16.0976 12.7421 16.1354 12.7669C16.1733 12.7918 16.212 12.8143 16.2505 12.8372C16.2466 12.8516 16.2436 12.8662 16.2416 12.881C16.1123 14.1059 16.7094 14.5049 17.6984 15.1662C17.9768 15.3522 18.2922 15.5633 18.6525 15.8285L18.68 15.8486C19.9319 16.7685 20.1644 17.3716 20.1392 17.7153C20.1161 18.0264 19.8578 18.3143 19.3709 18.5713C19.3358 18.5902 19.3042 18.6153 19.2777 18.6452L18.0901 18.083C17.9645 18.0237 17.8521 17.94 17.7592 17.8368L15.6572 15.5031C15.627 15.4696 15.5904 15.4423 15.5497 15.4229C15.5089 15.4035 15.4647 15.3923 15.4197 15.3899C15.3746 15.3876 15.3295 15.3941 15.2869 15.4092C15.2444 15.4243 15.2052 15.4476 15.1716 15.4778C15.1381 15.5081 15.1109 15.5446 15.0914 15.5854C15.072 15.6261 15.0608 15.6703 15.0585 15.7154C15.0561 15.7605 15.0627 15.8056 15.0778 15.8481C15.0928 15.8907 15.1162 15.9299 15.1464 15.9634L17.2484 18.2973C17.402 18.4681 17.5882 18.6065 17.796 18.7045L20.8035 20.1284C21.1944 20.4476 21.5498 20.8078 21.8636 21.203L17.4136 19.3562Z" fill="#FF768C" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_7367_52089">
                                                            <rect width="22" height="22" fill="white" transform="translate(6.39941 6.5)" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>

                                            <span className='patient-report-box-title'>
                                                Pregnancy
                                            </span>
                                        </div>
                                    </Accordion.Header>

                                    <Accordion.Body className='pt-0'>
                                        <Row className='g-3'>

                                            <Col sm={6}>
                                                <div className="d-flex flex-column gap-1">
                                                    <span className="contact-details-emergency">Have you been pregnant before?</span>
                                                    <span className="accordion-title-detail">
                                                        {modalFormFertilityData?.pregnancy?.pregnantBefore}
                                                    </span>
                                                </div>
                                            </Col>

                                            {/* <Col sm={6}>
                                        <div className="d-flex flex-column gap-1">
                                            <span className="contact-details-emergency">Details</span>
                                            <span className="accordion-title-detail">
                                                {modalFormFertilityData?.pregnancy?.pregnantBeforeDetails || 'N/A'}
                                            </span>
                                        </div>
                                    </Col> */}

                                            <Col sm={6}>
                                                <div className="d-flex flex-column gap-1">
                                                    <span className="contact-details-emergency">
                                                        How long trying to conceive?
                                                    </span>
                                                    <span className="accordion-title-detail">
                                                        {modalFormFertilityData?.pregnancy?.tryingToConceiveDuration}
                                                    </span>
                                                </div>
                                            </Col>

                                            <Col sm={6}>
                                                <div className="d-flex flex-column gap-1">
                                                    <span className="contact-details-emergency">
                                                        History of miscarriage or ectopic pregnancy?
                                                    </span>
                                                    <span className="accordion-title-detail">
                                                        {modalFormFertilityData?.pregnancy?.miscarriageOrEctopicHistory}
                                                    </span>
                                                </div>
                                            </Col>

                                            {/* <Col sm={6}>
                                        <div className="d-flex flex-column gap-1">
                                            <span className="contact-details-emergency">Details</span>
                                            <span className="accordion-title-detail">
                                                {modalFormFertilityData?.pregnancy?.miscarriageOrEctopicDetails || 'N/A'}
                                            </span>
                                        </div>
                                    </Col> */}

                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                    )}
                </>
            ),
        },
      {
    id: "2",
    title: "Medical History",
    content: (
        <div>
            {/* 1. SHOW SKELETON WHEN LOADING */}
            {loading && (
                <>
                    <Skeleton width={100} height={20} />
                    <Row>
                        <Col sm={5}>
                            <h6 className="contact-details-emergency">
                                <Skeleton className="mt-2" width={150} />
                            </h6>
                            <Skeleton  width={120} height={14} />
                        </Col>

                        <Col sm={7}>
                            <h6 className="contact-details-emergency ">
                                <Skeleton width={150} />
                            </h6>
                            <Skeleton width={120} height={14} />
                        </Col>

                        <Col sm={12}>
                            <h6 className="contact-details-emergency">
                                <Skeleton width={180} />
                            </h6>

                            <div className="d-flex gap-2 flex-wrap mb-1">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} width={80} height={26} borderRadius={8} />
                                ))}
                            </div>
                        </Col>

                        <Col sm={5}>
                            <h6 className="contact-details-emergency">
                                <Skeleton width={150} />
                            </h6>
                            <Skeleton width={200} height={14} />
                        </Col>

                        <Col sm={7}>
                            <h6 className="contact-details-emergency">
                                <Skeleton width={150} />
                            </h6>

                            <div className="d-flex gap-2 flex-wrap mb-1">
                                {[1, 2, ].map((i) => (
                                    <Skeleton key={i} width={90} height={26} borderRadius={8} />
                                ))}
                            </div>
                        </Col>

                        <Col sm={5}>
                            <h6 className="contact-details-emergency">
                                <Skeleton width={150} />
                            </h6>
                            <Skeleton width={100} height={26} borderRadius={8} />
                        </Col>

                        <Col sm={7}>
                            <h6 className="contact-details-emergency">
                                <Skeleton width={150} />
                            </h6>
                            <Skeleton width={100} height={26} borderRadius={8} />
                        </Col>
                    </Row>
                </>
            )}

            {/* 2. IF NOT LOADING AND NO DATA */}
            {!loading && !medicalHistoryFormData && (
                <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="78" height="78" viewBox="0 0 78 78" fill="none">
                                            <path d="M60.6072 15.509V57.2116C60.6072 59.5787 58.6882 61.4977 56.3211 61.4977H22.0085C19.6414 61.4977 17.7224 59.5787 17.7224 57.2116V6.70801C17.7224 4.34086 19.6414 2.42188 22.0085 2.42188H47.5739C51.0628 5.92883 54.5519 9.43579 58.0453 12.9382C58.8964 13.7937 59.7518 14.6491 60.6072 15.509Z" fill="#F3F4F6" />
                                            <path d="M60.6072 15.509H51.511C49.3365 15.509 47.5737 13.7463 47.5737 11.5718V2.42188C51.0626 5.92883 54.5517 9.43579 58.0451 12.9382C58.8963 13.7937 59.7518 14.6491 60.6072 15.509Z" fill="#DDE1E8" />
                                            <path d="M47.6833 28.1613V31.1021C47.6833 31.9213 47.0192 32.5854 46.2 32.5854H42.1186V36.6668C42.1186 37.486 41.4545 38.1501 40.6353 38.1501H37.6903C36.8712 38.1501 36.207 37.486 36.207 36.6668V32.5854H32.1298C31.3106 32.5854 30.6465 31.9213 30.6465 31.1021V28.1613C30.6465 27.3422 31.3106 26.678 32.1298 26.678H36.207V22.5966C36.207 21.7774 36.8712 21.1133 37.6903 21.1133H40.6353C41.4545 21.1133 42.1186 21.7774 42.1186 22.5966V26.678H46.2C47.0192 26.678 47.6833 27.3422 47.6833 28.1613Z" fill="#D2D6DE" />
                                            <path d="M70.7355 44.5053L65.9498 70.7936C65.4789 73.3803 63.2258 75.2604 60.5965 75.2604H19.5071C16.8778 75.2604 14.6247 73.3803 14.1538 70.7936L7.59299 34.7558C6.98481 31.4153 9.55093 28.3398 12.9463 28.3398H26.3864C27.5838 28.3398 28.7477 28.7348 29.6979 29.4636L39.4797 36.9658C40.4299 37.6944 41.5938 38.0895 42.7912 38.0895H65.3821C68.7776 38.0894 71.3437 41.1649 70.7355 44.5053Z" fill="#9CA3AF" />
                                            <path d="M60.3568 63.8798C60.3568 66.5187 58.2175 68.658 55.5786 68.658H48.1395C45.5006 68.658 43.3613 66.5187 43.3613 63.8798C43.3613 61.2409 45.5006 59.1016 48.1395 59.1016H55.5786C58.2175 59.1017 60.3568 61.2409 60.3568 63.8798Z" fill="#8D929C" />
                                        </svg>

                    <p className="patient-accordion-content-subtitle my-3">
                        No medical history
                    </p>

                    <Button
                        onClick={() => {
                            setEditingMedicalHistory(null);
                            setShowModal(true);
                        }}
                        variant="outline"
                        contentSize="medium"
                    >
                     <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.1641 8C15.1641 8.16576 15.0982 8.32473 14.981 8.44194C14.8638 8.55915 14.7048 8.625 14.5391 8.625H8.28906V14.875C8.28906 15.0408 8.22322 15.1997 8.10601 15.3169C7.9888 15.4342 7.82982 15.5 7.66406 15.5C7.4983 15.5 7.33933 15.4342 7.22212 15.3169C7.10491 15.1997 7.03906 15.0408 7.03906 14.875V8.625H0.789063C0.623302 8.625 0.464331 8.55915 0.347121 8.44194C0.229911 8.32473 0.164062 8.16576 0.164062 8C0.164062 7.83424 0.229911 7.67527 0.347121 7.55806C0.464331 7.44085 0.623302 7.375 0.789063 7.375H7.03906V1.125C7.03906 0.95924 7.10491 0.800269 7.22212 0.683058C7.33933 0.565848 7.4983 0.5 7.66406 0.5C7.82982 0.5 7.9888 0.565848 8.10601 0.683058C8.22322 0.800269 8.28906 0.95924 8.28906 1.125V7.375H14.5391C14.7048 7.375 14.8638 7.44085 14.981 7.55806C15.0982 7.67527 15.1641 7.83424 15.1641 8Z" fill="#2B4360" />
                                            </svg>
                        <span className="ms-1">Add Medical History</span>
                    </Button>
                </div>
            )}

            {/* 3. SHOW DATA */}
            {!loading && medicalHistoryFormData && (
                <>
                    <Button
                        onClick={() => {
                            setEditingMedicalHistory(medicalHistoryFormData);
                            setShowModal(true);
                        }}
                        className="mb-3 add-new-button"
                        variant="outline"
                        contentSize="small"
                    >
                           <svg width="16" height="16" viewBox="0 0 14 14" className='me-2' fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.5484 3.40848L10.7553 0.615983C10.5209 0.381644 10.203 0.25 9.87157 0.25C9.54011 0.25 9.22223 0.381644 8.98782 0.615983L1.28032 8.32286C1.16385 8.43861 1.0715 8.57633 1.00863 8.72803C0.945765 8.87973 0.913622 9.0424 0.914067 9.20661V11.9997C0.914067 12.3313 1.04576 12.6492 1.28018 12.8836C1.5146 13.118 1.83255 13.2497 2.16407 13.2497H12.6641C12.863 13.2497 13.0537 13.1707 13.1944 13.0301C13.3351 12.8894 13.4141 12.6986 13.4141 12.4997C13.4141 12.3008 13.3351 12.1101 13.1944 11.9694C13.0537 11.8288 12.863 11.7497 12.6641 11.7497H6.97657L13.5484 5.17661C13.6646 5.06053 13.7567 4.92271 13.8195 4.77102C13.8824 4.61933 13.9147 4.45674 13.9147 4.29255C13.9147 4.12835 13.8824 3.96576 13.8195 3.81407C13.7567 3.66238 13.6646 3.52456 13.5484 3.40848ZM4.85157 11.7497H2.41407V9.31223L7.66407 4.06223L10.1016 6.49973L4.85157 11.7497ZM11.1641 5.43723L8.72657 2.99973L9.87282 1.85348L12.3103 4.29098L11.1641 5.43723Z" fill="#2B4360" />
                                    </svg>
                        Edit
                    </Button>

                    <Row>
                        <Col sm={5}>
                            <h6 className="contact-details-emergency">Current Medications</h6>
                            <p className="accordion-title-detail">
                                {medicalHistoryFormData?.medications?.status === "Yes"
                                    ? medicalHistoryFormData?.medications?.medicationsDetails || "Yes"
                                    : "No"}
                            </p>
                        </Col>

                        <Col sm={7}>
                            <h6 className="contact-details-emergency">Surgeries</h6>
                            <p className="accordion-title-detail">
                                {medicalHistoryFormData?.surgeries?.status === "Yes"
                                    ? medicalHistoryFormData?.surgeries?.surgeriesDetails || "Yes"
                                    : "No"}
                            </p>
                        </Col>

                        <Col sm={12}>
                            <h6 className="contact-details-emergency">Medical condition / Allergies</h6>
                            {medicalHistoryFormData?.conditions?.map((item: any, index: number) => (
                                <p key={index} className="accordion-title-detail d-inline-block border-box-orange-font box-border-orange me-2 mb-2">
                                    {item}
                                </p>
                            ))}
                        </Col>

                        <Col sm={5}>
                            <h6 className="contact-details-emergency">Family History</h6>
                            <ul>
                                <li className="medical-emergency-fimily-history">
                                    {medicalHistoryFormData?.familyHistory || "No added family history"}
                                </li>
                            </ul>
                        </Col>

                        <Col sm={7}>
                            <h6 className="contact-details-emergency">Lifestyle</h6>
                            {medicalHistoryFormData?.lifestyle?.map((item: any, index: number) => (
                                <p key={index} className="accordion-title-detail d-inline-block border-box-blue-font box-border-blue me-2 mb-2">
                                    {item}
                                </p>
                            ))}
                        </Col>

                        <Col sm={5}>
                            <h6 className="contact-details-emergency">Physical Exercise</h6>
                            <p className="accordion-title-detail border-box-orange-font box-border-orange d-inline-block">
                                {medicalHistoryFormData?.exerciseFrequency}
                            </p>
                        </Col>

                        <Col sm={7}>
                            <h6 className="contact-details-emergency">Stress Level</h6>
                            <p className="accordion-title-detail border-box-red-font box-border-red d-inline-block">
                                {medicalHistoryFormData?.stressLevel}
                            </p>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    ),
}

    ];

    return (
        <>
            <div className="mt-3">
                <Accordion className="mb-3" alwaysOpen activeKey={activeAccordion}>
                    {accordionData.map((item) => (
                        <Accordion.Item eventKey={item.id} key={item.id} className='patient-accordion-item shadow-sm mb-3'>
                            <Accordion.Header onClick={() => setActiveAccordion(prev =>
                                prev.includes(item.id)
                                    ? prev.filter(id => id !== item.id)
                                    : [...prev, item.id]
                            )} >
                                <p className='contact-details-heading m-0'>{item.title}</p>
                            </Accordion.Header>
                            <Accordion.Body className='pt-0'>{item.content}</Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>

           <div className="row mb-5">
    <div>
        <h6 className="fw-semibold mb-3 mt-2 Patient-Details">Review</h6>

        <ContentContainer className="shadow-sm border-0 mb-4">
            <Card.Body>
                <strong className="d-block mb-2 heading-patient">
                    Consultation Review *
                </strong>

                {/* ⬇⬇ SHOW SKELETON WHILE LOADING ⬇⬇ */}
                {loading ? (
                    <>
                        <Skeleton height={150} className="mb-3" />

                        <div className="d-flex justify-content-end">
                            <Skeleton width={120} height={40} />
                        </div>
                    </>
                ) : (
                    /* ⬇⬇ SHOW ACTUAL UI WHEN NOT LOADING ⬇⬇ */
                    <>
                        <textarea
                            className="form-control border rounded p-3 Patient-review"
                            rows={8}
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        />

                        <div className="d-flex justify-content-end mt-3">
                            <Button
                                className="edit-profile-btn d-flex align-items-center"
                                onClick={handleSave}
                            >
                                Save Review
                            </Button>
                        </div>
                    </>
                )}
            </Card.Body>
        </ContentContainer>
    </div>
</div>



                <Modal
                    show={showPhisicalAssessment}
                    onHide={() => { setShowPhisicalAssessment(false); setEditPhysicalAssessment(initialFormData) }}
                    header={
                        editPhysicalAssessment?.id

                            ? "Edit Physical Assessment"
                            : modalFormPhisicalData.length === 0
                                ? "Physical Assessment"
                                : "Add New Physical Assessment"
                    }
                    closeButton={true}
                    size="lg"
                >
                    <div className="mb-0 ">
                        <PhisicalAssessmentForm
                            setModalFormPhisicalData={setModalFormPhisicalData}
                            setShowPhisicalAssessment={setShowPhisicalAssessment}
                            editPhysicalAssessment={editPhysicalAssessment}
                            setEditPhysicalAssessment={setEditPhysicalAssessment}
                            modalFormPhisicalData={modalFormPhisicalData}
                            handleSavePhysicalAssessment={handleSavePhysicalAssessment} // ⭐ ADDED
                        />
                    </div>
                </Modal>

                <Modal
                    show={showFertilityAssessment}
                    onHide={() => { setShowFertilityAssessment(false) }}
                    header={Object.keys(modalFormFertilityData).length === 0 ? "Fertility Assessment" : "Edit Fertility Assessment"}
                    closeButton={true}
                    size="lg"
                >
                    <div className="mb-0">
                        <FertilityAssessmentForm
                            setShowFertilityAssessment={setShowFertilityAssessment}
                            setModalFormFertilityData={setModalFormFertilityData}
                            editFertilityAssessment={editFertilityAssessment}
                            handleSaveFertilityAssessment={handleSaveFertilityAssessment} // ⭐ add this
                        />
                    </div>
                </Modal>
                <Modal
                    className=""
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    header={Object.keys(medicalHistoryFormData).length === 0 ? "Add Medical History" : "Edit Medical History"}
                    size="lg"
                    closeButton={true}
                >
                    <div className="mb-0">
                        <MedicalHistory
                            initialData={editingMedicalHistory}
                            setMedicalHistoryFormData={setMedicalHistoryFormData}
                            setShowModal={setShowModal}
                            onClose={() => setEditingMedicalHistory(null)}
                            handleSaveMedicalHistory={handleSaveMedicalHistory}
                        />

                    </div>
                </Modal>

            </div>
        </>
    );
}
