import React, { FormEvent, useEffect, useState } from 'react'

import { IoAdd } from 'react-icons/io5'
import Modal from './ui/Modal';
import { FertilityAssessment, MedicalHistoryForm, PhysicalAssessment } from './form/AddPartnerDetailsForm';
import { Accordion, Col, Dropdown, Row } from 'react-bootstrap';
import Image from 'next/image';
import ContentContainer from './ui/ContentContainer';
// import { PartnerData, partnerData } from '@/data/partnerData';
// import MedicalHistory from './form/MedicalHistory';
// import PhysicalAssessment from '../assets/images/Pluse Sine.png';
import Simpleeditpro from '@/assets/images/Simpleeditpro.png';
import { partnerDetailData } from '@/utils/StaticData';
import Button from './ui/Button';
import { AddPartnerDetails } from './AddPartnerDetails';
import { EditFertilityAssessment, FertilityAssessmentType, FormErrorEditFertilityAssessment, MedicalHistoryType, PhysicalAssessmentData, PhysicalAssessmentDataModel } from '@/utils/types/interfaces';
import toast from 'react-hot-toast';
import { BsInfoCircle } from 'react-icons/bs';
import { useParams } from 'next/navigation';
import { addPartnerPhysicalAssesment, getAll, getOne, updatePartnerfertilityassessment } from '@/utils/apis/apiHelper';
import { log } from 'console';

export default function PartnerDetail({ setActiveTab }: { setActiveTab: (tab: string) => void }) {

    const [addPartner, setAddPartner] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [showPartnerDetail, setShowPartnerDetail] = useState(true);
    const [loading, setLoading] = useState({});
    const [eventKey, setEventKey] = useState(0);
    const [modalEditTab, setModalEditTab] = useState<string | null>("basic");
    const [AddPhysicalAssessment, setAddPhysicalAssessment] = useState(false);
    const [EditFertilityAssessment, setEditFertilityAssessment] = useState(false);
    const [EditMedicalHistory, setEditMedicalHistory] = useState<boolean>(false);

    const [showData, setShowData] = useState<any>(partnerDetailData);
    console.log("showData", showData);

    const initialFormDataAddPhysicalAssessment: PhysicalAssessmentDataModel = {
        id: "",
        height: "",
        weight: "",
        bmi: "",
        bloodGroup: "",
        systolic: "",
        diastolic: "",
        heartRate: "",
        date: ""

    };

    const initialFormDataEditFertilityAssessment: EditFertilityAssessment = {
        semenAnalysis: {
            semenAnalysisDetails: "",
            status: ""
        },

        fertilityIssues: {
            fertilityIssuesDetails: "",
            status: ""
        },

        fertilityTreatments: {
            fertilityTreatmentsDetails: "",
            status: ""
        },

        surgeries: {
            surgeriesDetails: "",
            status: ""
        }
    };


    const [formDataAddPhysicalAssessment, setFormDataAddPhysicalAssessment] = useState<PhysicalAssessmentDataModel>(initialFormDataAddPhysicalAssessment);
    type FormErrorAddPhysicalAssessment = Partial<Record<keyof PhysicalAssessmentDataModel, string>>;
    const initialFormErrorAddPhysicalAssessment: FormErrorAddPhysicalAssessment = {};
    const [formErrorAddPhysicalAssessment, setFormErrorAddPhysicalAssessment] = useState<FormErrorAddPhysicalAssessment>(initialFormErrorAddPhysicalAssessment);

    const [formDataEditFertilityAssessment, setFormDataEditFertilityAssessment] = useState<EditFertilityAssessment>(initialFormDataEditFertilityAssessment);
    // type FormErrorEditFertilityAssessment = Partial<Record<keyof EditFertilityAssessment, string>>;
    // type FormErrorEditFertilityAssessment = EditFertilityAssessment | {};
    // const initialFormErrorEditFertilityAssessment: FormErrorEditFertilityAssessment = {};
    // const initialFormErrorEditFertilityAssessment: FormErrorEditFertilityAssessment = {};

    // const [formErrorEditFertilityAssessment, setFormErrorEditFertilityAssessment] = useState<FormErrorEditFertilityAssessment>(initialFormErrorEditFertilityAssessment);
    // const [formErrorEditFertilityAssessment, setFormErrorEditFertilityAssessment] =
    // useState<FormErrorEditFertilityAssessment>(initialFormErrorEditFertilityAssessment);

    const [formDataMedicalHistory, setFormDataMedicalHistory] = useState<MedicalHistoryType>();
    const initialFormErrorEditFertilityAssessment: FormErrorEditFertilityAssessment = {};

    const [formErrorEditFertilityAssessment, setFormErrorEditFertilityAssessment] =
        useState<FormErrorEditFertilityAssessment>(initialFormErrorEditFertilityAssessment);

    // useEffect(() => {
    //     setLoading(true)
    //     setShowData(partnerDetailData);

    // }, [])

    const formatDate = (dateString?: string) => {
        const date = dateString ? new Date(dateString) : new Date();
        return date.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    const validateForm = (data: PhysicalAssessmentDataModel): FormErrorAddPhysicalAssessment => {
        const errors: FormErrorAddPhysicalAssessment = {};

        if (!data.height.trim()) errors.height = "Height is required";
        if (!data.weight.trim()) errors.weight = "Weight is required";
        if (!data.bmi.trim()) errors.bmi = "BMI is required";
        if (!data.bloodGroup.trim()) errors.bloodGroup = "Blood group is required";
        if (!data.systolic.trim()) errors.systolic = "Blood pressure is required";

        if (!data.heartRate.trim()) errors.heartRate = "Heart rate is required";

        return errors;
    };

    const validateForm2 = (
        data: EditFertilityAssessment
    ): FormErrorEditFertilityAssessment => {

        const errors: FormErrorEditFertilityAssessment = {};  // <-- IMPORTANT

        // SEMEN ANALYSIS
        // const semenDetails = data.semenAnalysis?.semenAnalysisDetails?.trim() ?? "";
        // const semenStatus = data.semenAnalysis?.status;

        // if (!semenDetails) {
        //     errors.semenAnalysis = "Seminal Analysis is required";
        // }

        // if ((semenStatus === "yes" || semenStatus === true) && !semenDetails) {
        //     errors.semenAnalysisDetails = "Seminal Analysis Content is required";
        // }

        const semenDetails = data.semenAnalysis?.semenAnalysisDetails?.trim() ?? "";
        const semenStatus = (data.semenAnalysis?.status || "").toString().toLowerCase();

        if (!semenStatus) {
            errors.semenAnalysis = "Seminal analysis is required";
        }

        if (semenStatus === "yes" && !semenDetails) {
            errors.semenAnalysisDetails = "Seminal Analysis Content is required";
        }


        // FERTILITY ISSUES
        const issuesDetails = data.fertilityIssues?.fertilityIssuesDetails?.trim() ?? "";
        const issuesStatus = data.fertilityIssues?.status;

        if (!issuesDetails) {
            errors.fertilityIssues = "Fertility Issues is required";
        }

        if ((issuesStatus === "yes" || issuesStatus === true) && !issuesDetails) {
            errors.fertilityIssuesContent = "Fertility Issues Content is required";
        }

        // FERTILITY TREATMENT
        const treatmentDetails = data.fertilityTreatments?.fertilityTreatmentsDetails?.trim() ?? "";
        const treatmentStatus = data.fertilityTreatments?.status;

        if (!treatmentDetails) {
            errors.fertilityTreatment = "Fertility Treatment is required";
        }

        if ((treatmentStatus === "yes" || treatmentStatus === true) && !treatmentDetails) {
            errors.fertilityTreatmentContent = "Fertility Treatment Content is required";
        }

        // SURGERIES
        const surgeriesDetails = data.surgeries?.surgeriesDetails?.trim() ?? "";
        const surgeriesStatus = data.surgeries?.status;

        if (!surgeriesDetails) {
            errors.surgeries = "Surgeries is required";
        }

        if ((surgeriesStatus === "yes" || surgeriesStatus === true) && !surgeriesDetails) {
            errors.surgeriesContent = "Surgeries Content is required";
        }

        return errors;
    };


    const [selectedId, setSelectedId] = useState<string>("")
    const handleAddPhysicalAssessment = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("click ", formDataAddPhysicalAssessment);

        const errors = validateForm(formDataAddPhysicalAssessment);
        console.log("Form submitted", formDataAddPhysicalAssessment);
        setFormErrorAddPhysicalAssessment(errors);

        // if (Object.keys(errors).length === 0) {
        //     // Handle form submission
        //     setFormErrorAddPhysicalAssessment(initialFormErrorAddPhysicalAssessment);
        //     setAddPhysicalAssessment(false);
        //     setShowContent(true);

        //     setShowData((prev: any) => ({ ...prev, PhysicalAssessmentData: [...prev.PhysicalAssessmentData, formDataAddPhysicalAssessment] }));
        //     setFormDataAddPhysicalAssessment(initialFormDataAddPhysicalAssessment);
        //     console.log("test click");

        //     toast.success('Physical Assessment Added Successfully', {
        //         icon: <BsInfoCircle size={22} color="white" />,
        //     });
        // }
        const passData = {
            patientId: id,
            height: formDataAddPhysicalAssessment.height,
            weight: formDataAddPhysicalAssessment.weight,
            bmi: formDataAddPhysicalAssessment.bmi,
            bloodGroup: formDataAddPhysicalAssessment.bloodGroup,
            bloodPressureSystolic: formDataAddPhysicalAssessment.systolic,
            bloodPressureDiastolic: formDataAddPhysicalAssessment.diastolic,
            heartRate: formDataAddPhysicalAssessment.heartRate
        }

        addPartnerPhysicalAssesment(passData)
            .then(() => {
                toast.success('Physical Assessment Added Successfully', {
                    icon: <BsInfoCircle size={22} color="white" />,
                });
                setAddPhysicalAssessment(false)
                fetchPatient()
            })
            .catch((err) => {
                console.log("PartnerPhysicalAssesment: ", err);
            });
    }

    const handleEditFertilityAssessment = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("click ");

        const errors = validateForm2(formDataEditFertilityAssessment);
        setFormErrorEditFertilityAssessment(errors);

        const passData = {
            patientId: showData.patientId,
            ...formDataEditFertilityAssessment
        }
        console.log("passData", passData);

        updatePartnerfertilityassessment(showData.patientId, passData)
            .then((res) => {
                console.log("response from updatePartnerfertilityassessment: ", res);
                fetchPatient()
                toast.success('Changes saved successfully', {
                    icon: <BsInfoCircle size={22} color="white" />,
                });
                setEditFertilityAssessment(false)
            })
            .catch((err) => {
                console.log("response from updatePartnerfertilityassessment: ", err);
            })

        if (Object.keys(errors).length === 0) {
            // setFormErrorEditFertilityAssessment(initialFormErrorEditFertilityAssessment);
            // setEditFertilityAssessment(false);
            // setShowContent(true);

            // setShowData((prev: any) => ({ ...prev, fertilityAssessment: { ...prev.fertilityAssessment, ...formDataEditFertilityAssessment } }));
            toast.success('Changes saved successfully', {
                icon: <BsInfoCircle size={22} color="white" />,
            });

        }
    }
    const convertHeightToCm = (heightStr: string): string => {
        if (!heightStr) return '';

        // Remove any whitespace
        const cleanHeight = String(heightStr || "").trim();

        // Check if it's already in cm
        if (cleanHeight.toLowerCase().includes('cm')) {
            return cleanHeight.replace(/[^\d.]/g, '');
        }

        // Match feet and inches format (e.g., "5'8", "5'8"", "5 ft 8 in")
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

        // Check if it's just inches (numeric value)
        const numericValue = parseFloat(cleanHeight);
        if (!isNaN(numericValue)) {
            // Assume it's inches if it's a reasonable height value (24-96 inches)
            if (numericValue >= 24 && numericValue <= 96) {
                return (numericValue * 2.54).toFixed(0);
            }
            // If it's a small number, assume it's already in feet (convert to inches first)
            if (numericValue >= 3 && numericValue <= 8) {
                return (numericValue * 12 * 2.54).toFixed(0);
            }
        }

        return '';
    };
    // console.log("showData.medicalHistory", showData.medicalHistory);
    // const addItem = (newItem) => {
    //     setShowData(prevItems => [...prevItems, newItem]);
    // };



    const params = useParams();
    const id = params?.id?.toString();
    const fetchPatient = async () => {
        try {
            if (!id) return;

            const res = await getOne(id);
            const pData = res?.data?.data || res?.data;

            setShowData(pData?.partnerDetails)

            if (pData?.partnerDetails?.basicDetails?.partnerEmail) {
                setShowContent(true);
                setShowPartnerDetail(false);
            }

        } catch (error) {
            console.error("Error fetching partner:", error);
        }
    };
    function convertDate(isoString: string) {
        const dateObj = new Date(isoString);

        const options: Intl.DateTimeFormatOptions = {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric"
        };

        let formattedDate = dateObj.toLocaleDateString("en-GB", options);


        return formattedDate;
    }


    useEffect(() => {
        fetchPatient();
    }, []);
    return (
        <>
            {showPartnerDetail && (
                <div className='d-flex align-items-center justify-content-center partner-detail-main '>
                    <div className="text-center">
                        <svg width="86" height="79" viewBox="0 0 86 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M34.387 52.6988L31.187 56.6988C29.587 58.5988 26.687 58.5988 25.087 56.6988L21.887 52.6988L23.4869 44.8984H32.7869L34.387 52.6988Z" fill="#F3F4F6" />
                            <path d="M22.7916 48.2969L23.5231 44.7734H32.7604L33.4557 48.1524C31.8557 49.7524 25.7916 50.2969 22.7916 48.2969Z" fill="#D7D7D7" fillOpacity="0.4" />
                            <path d="M42.787 29.8984V46.7984C42.787 51.0984 78.787 51.0984 78.787 46.7984V29.8984H42.787Z" fill="#9CA3AF" />
                            <path d="M67.025 52.9059L63.825 56.9059C62.225 58.8059 59.325 58.8059 57.725 56.9059L54.525 52.9059L56.125 45.1055H65.425L67.025 52.9059Z" fill="#F3F4F6" />
                            <path d="M55.4297 48.5039L56.1612 44.9805H65.3984L66.0938 48.3594C64.4937 49.9594 58.4297 50.5039 55.4297 48.5039Z" fill="#D7D7D7" fillOpacity="0.4" />
                            <path d="M85.6869 78.2992H35.9869V70.1992C35.9869 64.3992 39.6869 59.1992 45.1869 57.2992L54.5869 52.6992C57.7869 56.6992 63.7869 56.6992 66.9869 52.6992L76.3869 57.2992C81.8869 59.1992 85.5869 64.3992 85.5869 70.1992V78.2992H85.6869Z" fill="#9CA3AF" />
                            <path opacity="0.1" d="M62.3869 70.1992C62.3869 63.2992 58.9869 56.9992 53.4869 53.1992L45.1869 57.1992C39.6869 59.0992 35.9869 64.2992 35.9869 70.0992V78.1992H62.3869V70.1992Z" fill="#676767" />
                            <path opacity="0.1" d="M43.0869 29.8984H42.7869V46.9984C45.8869 43.5984 48.0869 39.4984 49.5869 36.1984C53.4869 34.5984 56.2869 30.9984 56.3869 26.4984C56.4869 22.9984 54.9869 19.8984 52.5869 17.8984C52.0869 13.0984 50.787 8.89844 48.787 5.39844C45.187 8.99844 43.0869 14.6984 43.0869 22.4984C38.1869 22.7984 38.4869 29.3984 43.0869 29.8984Z" fill="#926892" />
                            <path d="M78.487 22.3992C78.487 7.99922 71.287 0.699219 60.787 0.699219C50.287 0.699219 43.187 7.99922 43.187 22.3992C37.787 22.7992 38.587 30.5992 44.387 29.8992C49.287 43.5992 56.187 47.1992 60.787 47.1992C65.487 47.1992 72.287 43.5992 77.187 29.8992C83.087 30.5992 83.887 22.7992 78.487 22.3992Z" fill="#F3F4F6" />
                            <path d="M60.7869 0.699219C50.2869 0.699219 43.0869 8.09922 43.0869 22.3992C43.7869 20.4992 44.5869 19.0992 45.3869 17.9992C52.4869 8.49922 62.5869 27.0992 78.3869 22.3992C78.4869 7.99922 71.2869 0.699219 60.7869 0.699219Z" fill="#9CA3AF" />
                            <path opacity="0.1" d="M43.0869 29.8984H42.7869V46.9984C45.8869 43.5984 48.0869 39.4984 49.5869 36.1984C53.4869 34.5984 56.2869 30.9984 56.3869 26.4984C56.4869 22.9984 54.9869 19.8984 52.5869 17.8984C52.0869 13.0984 50.787 8.89844 48.787 5.39844C45.187 8.99844 43.0869 14.6984 43.0869 22.4984C38.1869 22.7984 38.4869 29.3984 43.0869 29.8984Z" fill="#676767" />
                            <path d="M55.2869 78.2992H0.986938V70.1992C0.986938 64.3992 4.68694 59.1992 10.1869 57.2992L21.8869 52.6992C25.0869 56.6992 31.0869 56.6992 34.2869 52.6992L45.9869 57.2992C51.4869 59.1992 55.1869 64.3992 55.1869 70.1992V78.2992H55.2869Z" fill="#DDE1E8" />
                            <path d="M45.7869 22.3992C45.7869 7.99922 38.5869 0.699219 28.0869 0.699219C17.5869 0.699219 10.4869 7.99922 10.4869 22.3992C5.08689 22.7992 5.88689 30.5992 11.6869 29.8992C16.5869 43.5992 23.4869 47.2992 28.0869 47.2992C32.6869 47.2992 39.5869 43.6992 44.4869 29.9992C50.3869 30.5992 51.1869 22.7992 45.7869 22.3992Z" fill="#F3F4F6" />
                            <path d="M28.0869 0.699219C38.5869 0.699219 45.7869 8.09922 45.7869 22.3992C38.5869 3.99922 28.0869 27.5992 10.4869 22.3992C10.4869 7.99922 17.6869 0.699219 28.0869 0.699219Z" fill="#AFB6C3" />
                            <path d="M42.3369 70.832C42.3369 70.2797 42.7846 69.832 43.3369 69.832C43.8892 69.832 44.3369 70.2797 44.3369 70.832V78.2979H42.3369V70.832Z" fill="#C5C9D0" />
                            <path d="M75.7197 70.832C75.7197 70.2797 76.1674 69.832 76.7197 69.832C77.272 69.832 77.7197 70.2797 77.7197 70.832V78.2979H75.7197V70.832Z" fill="#8D929C" />
                            <path d="M10.7008 70.832C10.7008 70.2797 11.1485 69.832 11.7008 69.832C12.2531 69.832 12.7008 70.2797 12.7008 70.832V78.2979H10.7008V70.832Z" fill="#C5C9D0" />
                        </svg>

                        <p className='patient-accordion-content-subtitle my-3'>No partner details</p>
                        <Button variant="outline" disabled={false} contentSize="medium" onClick={() => setAddPartner(true)}>
                            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.1641 8C15.1641 8.16576 15.0982 8.32473 14.981 8.44194C14.8638 8.55915 14.7048 8.625 14.5391 8.625H8.28906V14.875C8.28906 15.0408 8.22322 15.1997 8.10601 15.3169C7.9888 15.4342 7.82982 15.5 7.66406 15.5C7.4983 15.5 7.33933 15.4342 7.22212 15.3169C7.10491 15.1997 7.03906 15.0408 7.03906 14.875V8.625H0.789063C0.623302 8.625 0.464331 8.55915 0.347121 8.44194C0.229911 8.32473 0.164062 8.16576 0.164062 8C0.164062 7.83424 0.229911 7.67527 0.347121 7.55806C0.464331 7.44085 0.623302 7.375 0.789063 7.375H7.03906V1.125C7.03906 0.95924 7.10491 0.800269 7.22212 0.683058C7.33933 0.565848 7.4983 0.5 7.66406 0.5C7.82982 0.5 7.9888 0.565848 8.10601 0.683058C8.22322 0.800269 8.28906 0.95924 8.28906 1.125V7.375H14.5391C14.7048 7.375 14.8638 7.44085 14.981 7.55806C15.0982 7.67527 15.1641 7.83424 15.1641 8Z" fill="#2B4360" />
                            </svg>
                            <span className='ms-1'>Add Partner Details</span>
                        </Button>
                    </div>
                </div>
            )}

            <Modal
                show={addPartner}
                onHide={() => setAddPartner(false)}
                header="Add Partner "
                closeButton={true}
                size="lg"
            >
                <AddPartnerDetails
                    setAddPartner={setAddPartner}
                    setShowContent={setShowContent}
                    setShowPartnerDetail={setShowPartnerDetail}
                    setShowData={setShowData}
                    modalEditTab={modalEditTab}
                    setModalEditTab={setModalEditTab}
                    showData={showData}

                />
            </Modal>
            {showContent && (

                <Row className="mt-2 g-3 mb-5">
                    <Col md={7}>
                        <ContentContainer>
                            <div className='d-flex justify-content-between align-items-start '>
                                <div className='d-flex align-items-start align-items-sm-center gap-3 flex-column flex-sm-row'>
                                    <div>
                                        <img
                                            src={showData?.basicDetails?.partnerImage || Simpleeditpro}
                                            alt="PartnerImage"
                                            width={90}
                                            height={90}
                                            className="rounded-3"
                                        />
                                    </div>
                                    <div>
                                        <div className="d-flex align-items-center mb-1">
                                            <h6 className="mb-0 doctor-profile-heading me-2">{showData?.basicDetails?.partnerName || "No Name"}</h6>
                                        </div>

                                        <div className='pt-sm-1 p-0 d-flex gap-2 '>
                                            <div className='d-flex justify-content-center align-items-center gap-1'>
                                                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15.5 7.31243C15.5 6.2239 15.1841 5.15875 14.5907 4.24617C13.9974 3.33359 13.1519 2.61279 12.157 2.17119C11.1621 1.72958 10.0604 1.58615 8.98553 1.75827C7.91069 1.9304 6.90888 2.4107 6.10161 3.14092C5.29434 3.87113 4.71628 4.81989 4.43754 5.87214C4.1588 6.92438 4.19137 8.03489 4.53128 9.06899C4.87119 10.1031 5.50385 11.0164 6.35252 11.698C7.20119 12.3797 8.22942 12.8005 9.3125 12.9093V16.3124C9.3125 16.4616 9.37176 16.6047 9.47725 16.7102C9.58274 16.8157 9.72582 16.8749 9.875 16.8749C10.0242 16.8749 10.1673 16.8157 10.2727 16.7102C10.3782 16.6047 10.4375 16.4616 10.4375 16.3124V12.9093C11.8243 12.7682 13.1095 12.1178 14.0446 11.084C14.9797 10.0502 15.4983 8.70641 15.5 7.31243ZM9.875 11.8124C8.98498 11.8124 8.11496 11.5485 7.37493 11.054C6.63491 10.5596 6.05814 9.85678 5.71754 9.03451C5.37695 8.21224 5.28783 7.30744 5.46147 6.43453C5.6351 5.56161 6.06368 4.75979 6.69302 4.13045C7.32236 3.50112 8.12418 3.07253 8.99709 2.8989C9.87001 2.72527 10.7748 2.81438 11.5971 3.15497C12.4193 3.49557 13.1221 4.07235 13.6166 4.81237C14.1111 5.55239 14.375 6.42242 14.375 7.31243C14.3737 8.50551 13.8992 9.64934 13.0555 10.493C12.2119 11.3366 11.0681 11.8111 9.875 11.8124Z" fill="#8A8D93" />
                                                </svg>
                                                <span className='doctor-profile-subheading'>{showData?.basicDetails?.partnerGender || ""}</span>
                                            </div>
                                            <div className='d-flex justify-content-center align-items-center gap-1'>
                                                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clipPath="url(#clip0_2367_101200)">
                                                        <path d="M10.4141 19.7925C9.37242 19.7925 8.28909 19.6259 7.20576 19.2509C2.12242 17.5009 -0.585911 11.9175 1.16409 6.79255C2.91409 1.70921 8.49742 -0.999119 13.6224 0.750881C15.9974 1.58421 17.9558 3.25088 19.0808 5.45921C19.2474 5.75088 19.1224 6.12588 18.8308 6.25088C18.5391 6.41755 18.1641 6.29255 18.0391 6.00088C17.0391 4.04255 15.3308 2.58421 13.2474 1.87588C8.74742 0.334214 3.83076 2.70921 2.28909 7.20921C0.747422 11.7092 3.12242 16.5842 7.58076 18.1259C12.0391 19.6675 16.9558 17.2925 18.4974 12.8342C18.6224 12.5009 18.9558 12.3759 19.2474 12.4592C19.5808 12.5842 19.7058 12.9175 19.6224 13.2092C18.2891 17.2509 14.4558 19.7925 10.4141 19.7925Z" fill="#8A8D93" />
                                                        <path d="M18.7057 6.4987L15.2474 6.45703C14.9141 6.45703 14.6641 6.16536 14.6641 5.83203C14.6641 5.4987 14.9557 5.2487 15.2891 5.2487L18.1641 5.29036L18.2057 2.41536C18.2057 2.08203 18.4557 1.83203 18.8307 1.83203C19.1641 1.83203 19.4141 2.1237 19.4141 2.45703L19.3307 5.8737C19.3307 6.04036 19.2474 6.16536 19.1641 6.29036C19.0391 6.41536 18.8724 6.4987 18.7057 6.4987Z" fill="#8A8D93" />
                                                        <path d="M7.83075 11.375L7.45575 10.5H5.78908L5.41408 11.375H4.45575L6.20575 7.375H7.08075L8.83075 11.375H7.83075ZM6.62242 8.58333L6.12242 9.75H7.12242L6.62242 8.58333ZM11.4141 10.875C11.1224 11.1667 10.7891 11.3333 10.4141 11.3333C9.99742 11.3333 9.66408 11.2083 9.41408 10.9167C9.12242 10.625 8.99742 10.2917 8.99742 9.83333C8.99742 9.375 9.12242 9 9.41408 8.70833C9.70575 8.41667 10.0391 8.25 10.3724 8.25C10.7474 8.25 11.0391 8.41667 11.2891 8.70833V8.29167H12.1641V10.9583C12.1641 11.25 12.1224 11.4583 12.0391 11.7083C11.9557 11.9167 11.8307 12.0833 11.6641 12.2083C11.3307 12.4583 10.9557 12.5833 10.5391 12.5833C10.2891 12.5833 10.0807 12.5417 9.83075 12.4583C9.58075 12.375 9.37242 12.2917 9.20575 12.125L9.53908 11.4583C9.83075 11.6667 10.1224 11.7917 10.4557 11.7917C10.7891 11.7917 11.0391 11.7083 11.2057 11.5417C11.3307 11.4583 11.4141 11.2083 11.4141 10.875ZM11.2891 9.79167C11.2891 9.54167 11.2057 9.33333 11.0807 9.20833C10.9557 9.08333 10.7891 9 10.5807 9C10.3724 9 10.2057 9.08333 10.0391 9.20833C9.87242 9.33333 9.83075 9.54167 9.83075 9.79167C9.83075 10.0417 9.91408 10.25 10.0391 10.375C10.1641 10.5417 10.3724 10.5833 10.5807 10.5833C10.7891 10.5833 10.9557 10.5 11.0807 10.375C11.2474 10.25 11.2891 10.0417 11.2891 9.79167ZM15.6224 10.9583C15.2891 11.2917 14.8724 11.4583 14.4141 11.4583C13.9557 11.4583 13.5391 11.3333 13.2474 11.0417C12.9557 10.75 12.7891 10.375 12.7891 9.875C12.7891 9.375 12.9557 9 13.2474 8.70833C13.5391 8.41667 13.9141 8.29167 14.3307 8.29167C14.7474 8.29167 15.1224 8.41667 15.4141 8.66667C15.7057 8.91667 15.8724 9.29167 15.8724 9.70833V10.1667H13.6224C13.6641 10.3333 13.7474 10.4583 13.8724 10.5833C14.0391 10.7083 14.2057 10.75 14.3724 10.75C14.6641 10.75 14.9141 10.6667 15.1224 10.4583L15.6224 10.9583ZM14.8307 9.125C14.7057 9.04167 14.5807 8.95833 14.4141 8.95833C14.2474 8.95833 14.0807 9 13.9557 9.125C13.8307 9.20833 13.7474 9.375 13.7057 9.54167H15.0391C14.9974 9.375 14.9141 9.20833 14.8307 9.125Z" fill="#8A8D93" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_2367_101200">
                                                            <rect width="19" height="19" fill="white" transform="translate(0.164062)" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>

                                                <span className='doctor-profile-subheading'> {showData?.basicDetails?.partnerAge || ""} Years </span>

                                            </div>
                                        </div>
                                        <div className='pt-sm-1 p-0 d-flex flex-wrap gap-2'>
                                            <div className='d-flex justify-content-center align-items-center gap-1'>
                                                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17.482 12.7819L13.8016 11.1327L13.7914 11.128C13.6003 11.0462 13.3919 11.0134 13.185 11.0325C12.978 11.0516 12.7791 11.122 12.6063 11.2373C12.5859 11.2508 12.5663 11.2654 12.5477 11.2811L10.6461 12.9022C9.44141 12.317 8.19766 11.0827 7.61251 9.89359L9.23594 7.96312C9.25157 7.94359 9.26641 7.92406 9.28048 7.90297C9.39331 7.73055 9.46177 7.53291 9.47976 7.32763C9.49775 7.12236 9.46472 6.91582 9.3836 6.7264V6.71703L7.72969 3.03031C7.62246 2.78286 7.43807 2.57673 7.20406 2.44268C6.97005 2.30864 6.69895 2.25387 6.43126 2.28656C5.37264 2.42586 4.40093 2.94575 3.69761 3.74914C2.99429 4.55252 2.60747 5.58444 2.60938 6.65219C2.60938 12.8553 7.65626 17.9022 13.8594 17.9022C14.9271 17.9041 15.9591 17.5173 16.7624 16.814C17.5658 16.1106 18.0857 15.1389 18.225 14.0803C18.2578 13.8127 18.2031 13.5417 18.0692 13.3077C17.9353 13.0737 17.7293 12.8892 17.482 12.7819ZM13.8594 16.6522C11.2081 16.6493 8.66625 15.5948 6.79151 13.7201C4.91678 11.8453 3.86228 9.30346 3.85938 6.65219C3.85644 5.88929 4.1313 5.1514 4.63261 4.57633C5.13393 4.00126 5.82743 3.62833 6.5836 3.52719C6.58329 3.5303 6.58329 3.53344 6.5836 3.53656L8.22423 7.20844L6.60938 9.14125C6.59299 9.16011 6.5781 9.18022 6.56485 9.2014C6.44728 9.38181 6.37832 9.58953 6.36463 9.80442C6.35094 10.0193 6.393 10.2341 6.48673 10.428C7.19454 11.8756 8.65313 13.3233 10.1164 14.0303C10.3117 14.1232 10.5277 14.1638 10.7434 14.1482C10.9591 14.1325 11.167 14.0613 11.3469 13.9412C11.3669 13.9277 11.3862 13.9131 11.4047 13.8975L13.3039 12.2772L16.9758 13.9217C16.9758 13.9217 16.982 13.9217 16.9844 13.9217C16.8845 14.679 16.5121 15.3739 15.9369 15.8764C15.3617 16.379 14.6232 16.6548 13.8594 16.6522Z" fill="#8A8D93" />
                                                </svg>

                                                <span className='doctor-profile-subheading'>{showData?.basicDetails?.partnerContactNumber || ""}</span>
                                            </div>
                                            <div className='d-flex justify-content-center align-items-center gap-1'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                                    <path d="M18.2744 4.25H3.27441C3.10865 4.25 2.94968 4.31585 2.83247 4.43306C2.71526 4.55027 2.64941 4.70924 2.64941 4.875V15.5C2.64941 15.8315 2.78111 16.1495 3.01553 16.3839C3.24995 16.6183 3.56789 16.75 3.89941 16.75H17.6494C17.9809 16.75 18.2989 16.6183 18.5333 16.3839C18.7677 16.1495 18.8994 15.8315 18.8994 15.5V4.875C18.8994 4.70924 18.8336 4.55027 18.7164 4.43306C18.5991 4.31585 18.4402 4.25 18.2744 4.25ZM16.6674 5.5L10.7744 10.9023L4.88145 5.5H16.6674ZM17.6494 15.5H3.89941V6.29609L10.3518 12.2109C10.4671 12.3168 10.6179 12.3755 10.7744 12.3755C10.9309 12.3755 11.0818 12.3168 11.1971 12.2109L17.6494 6.29609V15.5Z" fill="#8A8D93" />
                                                </svg>
                                                <span className='doctor-profile-subheading'>{showData?.basicDetails?.partnerEmail || ""} </span>

                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </ContentContainer>

                        <ContentContainer className="mt-3">

                            <div className='d-flex justify-content-between align-items-center'>
                                <p className="contact-details-heading mb-3">Medical History</p>
                                <Button
                                    onClick={() => {
                                        setEditMedicalHistory(true);
                                        setFormDataMedicalHistory(showData.medicalHistory)
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

                            </div>

                            <Row className="">
                                <Col sm={5}>
                                    <div className="">
                                        <h6 className=" contact-details-emergency">Current Medications</h6>
                                        <p className=" accordion-title-detail">
                                            {showData?.medicalHistory?.medications?.status == "Yes" ? showData?.medicalHistory?.medications?.medicationsDetails : showData?.medicalHistory?.medications?.status}
                                        </p>
                                    </div>
                                </Col>

                                <Col sm={7}>
                                    <div className="">
                                        <h6 className=" contact-details-emergency">Surgeries</h6>
                                        <p className=" accordion-title-detail">
                                            {showData?.medicalHistory?.surgeries?.status == "Yes" ? showData?.medicalHistory?.surgeries?.surgeriesDetails : showData?.medicalHistory?.surgeries?.status}
                                        </p>
                                    </div>
                                </Col>

                                <Col sm={12}>
                                    <div className="">
                                        <h6 className=" contact-details-emergency">Medical condition / Allergies</h6>

                                        {showData?.medicalHistory?.conditions?.map((item: any, i: number) => {
                                            return (
                                                <p key={i} className="accordion-title-detail d-inline-block border-box-orange-font box-border-orange me-2 mb-2">
                                                    {item}
                                                </p>
                                            )
                                        })}

                                    </div>
                                </Col>

                                <Col sm={5}>
                                    <div className="">
                                        <h6 className=" contact-details-emergency">Family History</h6>
                                        <div className=" accordion-title-detail">
                                            <ul>

                                                <li className='medical-emergency-fimily-history'>{showData?.medicalHistory?.familyHistory || "No added family history"}</li>


                                            </ul>
                                        </div>
                                    </div>
                                </Col>

                                <Col sm={7}>
                                    <div className="">
                                        <h6 className=" contact-details-emergency">Lifestyle</h6>
                                        {showData?.medicalHistory?.lifestyle?.map((item: any, i: number) => {
                                            return (
                                                <p key={i} className="accordion-title-detail d-inline-block border-box-blue-font box-border-blue me-2 mb-2">
                                                    {item}
                                                </p>
                                            )
                                        })}

                                    </div>
                                </Col>

                                <Col sm={5}>
                                    <div className="">
                                        <h6 className=" contact-details-emergency">Physical Exercise</h6>
                                        <p className="accordion-title-detail border-box-orange-font box-border-orange d-inline-block ">

                                            {showData?.medicalHistory?.exerciseFrequency}

                                        </p>
                                    </div>
                                </Col>

                                <Col sm={7}>
                                    <div className="">
                                        <h6 className=" contact-details-emergency">Stress Level</h6>
                                        <p className="accordion-title-detail d-inline-block border-box-red-font box-border-red">
                                            {showData?.medicalHistory?.stressLevel}
                                        </p>
                                    </div>
                                </Col>
                            </Row>

                        </ContentContainer>

                        {/* <ContentContainer className="mt-4">
                            {[
                                {
                                    ...showData.medicalHistory,
                                    familyMedicalHistory: showData.medicalHistory.familyMedicalHistory,
                                    medical_surgeries: showData.medicalHistory.surgeries,
                                    medical_medical_condition: showData.medicalHistory.medicalCondition,
                                    lifestyle: showData.medicalHistory.lifestyle,
                                    exercise: showData.medicalHistory.exercise,
                                    stress: showData.medicalHistory.stress,
                                    medicationContent: showData.medicalHistory.medicationContent,

                                },
                            ].map((item: any, index: number) => {
                                return (
                                    <div key={index} className="medical-history-details text-start">
                                        <div>

                                        </div>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <p className="contact-details-heading mb-2">Medical History</p>
                                            <Button variant="outline" className="medical-history-edit-btn medical-history-edit-btn-font mb-3" onClick={() => { setEditMedicalHistory(true); setFormDataMedicalHistory(item) }}>
                                                <svg width="14" height="14" viewBox="0 0 14 14" className='me-1' fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M13.5484 3.40848L10.7553 0.615983C10.5209 0.381644 10.203 0.25 9.87157 0.25C9.54011 0.25 9.22223 0.381644 8.98782 0.615983L1.28032 8.32286C1.16385 8.43861 1.0715 8.57633 1.00863 8.72803C0.945765 8.87973 0.913622 9.0424 0.914067 9.20661V11.9997C0.914067 12.3313 1.04576 12.6492 1.28018 12.8836C1.5146 13.118 1.83255 13.2497 2.16407 13.2497H12.6641C12.863 13.2497 13.0537 13.1707 13.1944 13.0301C13.3351 12.8894 13.4141 12.6986 13.4141 12.4997C13.4141 12.3008 13.3351 12.1101 13.1944 11.9694C13.0537 11.8288 12.863 11.7497 12.6641 11.7497H6.97657L13.5484 5.17661C13.6646 5.06053 13.7567 4.92271 13.8195 4.77102C13.8824 4.61933 13.9147 4.45674 13.9147 4.29255C13.9147 4.12835 13.8824 3.96576 13.8195 3.81407C13.7567 3.66238 13.6646 3.52456 13.5484 3.40848ZM4.85157 11.7497H2.41407V9.31223L7.66407 4.06223L10.1016 6.49973L4.85157 11.7497ZM11.1641 5.43723L8.72657 2.99973L9.87282 1.85348L12.3103 4.29098L11.1641 5.43723Z" fill="#2B4360" />
                                                </svg> Edit
                                            </Button>
                                        </div>

                                        <Row>

                                            <Col lg={5} md={12}>
                                                <div className="mb-3">
                                                    <h6 className="mb-1 contact-details-emergency">Current Medications</h6>
                                                    <p className="mb-2 accordion-title-detail">
                                                        {item.medication
                                                            === 'yes'
                                                            ? item.medicationcontent
                                                                ? `Yes, ${item.medicationcontent}`
                                                                : 'Yes'
                                                            : 'No'}
                                                    </p>
                                                </div>
                                            </Col>

                                            <Col lg={7} md={12}>
                                                <div className="mb-3">
                                                    <h6 className="mb-1 contact-details-emergency">Surgeries</h6>
                                                    <p className="mb-2 accordion-title-detail">
                                                        {item.surgeries
                                                            === 'yes'
                                                            ? item.surgeriescontent
                                                                ? `Yes, ${item.surgeriescontent}`
                                                                : 'Yes'
                                                            : 'No'}
                                                    </p>
                                                </div>
                                            </Col>

                                            <Col lg={12} md={12}>
                                                <div className="mb-3">
                                                    <h6 className="mb-1 contact-details-emergency">Medical condition / Allergies</h6>

                                                    <p className=" accordion-title-detail d-inline-block border-box-orange-font box-border-orange ">
                                                        {item.medical_medical_condition || 'No medical conditions recorded'}
                                                    </p>
                                                    
                                                </div>
                                            </Col>

                                            <Col lg={12} md={12}>
                                                <div className="mb-3">
                                                    <h6 className="mb-1 contact-details-emergency">Family History</h6>
                                                    {item.familyMedicalHistory?.length > 0 ? (
                                                        <ul className="mb-2">
                                                            {typeof item.familyMedicalHistory === 'string' ? (
                                                                <li className="medical-emergency-fimily-history">
                                                                    {item.familyMedicalHistory.trim()}
                                                                </li>
                                                            ) : (
                                                                item.familyMedicalHistory.map((fh: string, i: number) => (
                                                                    <li key={i} className="medical-emergency-fimily-history">
                                                                        {fh.trim()}
                                                                    </li>
                                                                ))
                                                            )}
                                                        </ul>
                                                    ) : (
                                                        <p className="mb-2 d-block">
                                                            No medical conditions recorded
                                                        </p>
                                                    )}
                                                </div>
                                            </Col>

                                            <Col lg={12} md={12}>
                                                <div className="mb-3">
                                                    <h6 className="mb-1 contact-details-emergency">Lifestyle</h6>
                                                    {typeof item.lifestyle === 'string' ? (
                                                        <p className="mb-2 d-inline-block border-box-blue-font box-border-blue me-2">
                                                            {item.lifestyle.trim()}
                                                        </p>
                                                    ) : (
                                                        item.lifestyle?.map((lifestyle: string, i: number) => (
                                                            <p key={i} className="mb-2 d-inline-block border-box-blue-font box-border-blue me-2">
                                                                {lifestyle.trim()}
                                                            </p>
                                                        ))
                                                    )}
                                                </div>
                                            </Col>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <Col lg={5} sm={4}>
                                                    <div className="mb-3">
                                                        <h6 className="mb-1 contact-details-emergency">Physical Exercise</h6>
                                                        <p className="mb-2 border-box-orange-font box-border-orange d-inline-block">
                                                            {item.exercise || 'Not specified'}
                                                        </p>
                                                    </div>
                                                </Col>

                                                <Col lg={7} sm={8}>
                                                    <div className="mb-3 pe-md-3">
                                                        <h6 className="mb-1 contact-details-emergency">Stress Level</h6>
                                                        <p className="mb-2 d-inline-block border-box-red-font box-border-red">
                                                            {item.stress || 'Not specified'}
                                                        </p>
                                                    </div>

                                                </Col>
                                            </div>
                                        </Row>
                                    </div>
                                );
                            })}
                        </ContentContainer> */}

                    </Col>
                    <Col md={5}>
                        <ContentContainer>
                            <div className='d-flex justify-content-between align-items-center'>
                                <p className="contact-details-heading">Physical Assessment </p>

                                <span className="medical-history-add-btn medical-history-edit-btn-font mb-3" onClick={() => {
                                    setAddPhysicalAssessment(true)
                                }}>
                                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.7744 9.5C18.7744 9.69891 18.6954 9.88968 18.5547 10.0303C18.4141 10.171 18.2233 10.25 18.0244 10.25H10.5244V17.75C10.5244 17.9489 10.4454 18.1397 10.3047 18.2803C10.1641 18.421 9.97333 18.5 9.77441 18.5C9.5755 18.5 9.38474 18.421 9.24408 18.2803C9.10343 18.1397 9.02441 17.9489 9.02441 17.75V10.25H1.52441C1.3255 10.25 1.13474 10.171 0.994084 10.0303C0.853432 9.88968 0.774414 9.69891 0.774414 9.5C0.774414 9.30109 0.853432 9.11032 0.994084 8.96967C1.13474 8.82902 1.3255 8.75 1.52441 8.75H9.02441V1.25C9.02441 1.05109 9.10343 0.860322 9.24408 0.71967C9.38474 0.579018 9.5755 0.5 9.77441 0.5C9.97333 0.5 10.1641 0.579018 10.3047 0.71967C10.4454 0.860322 10.5244 1.05109 10.5244 1.25V8.75H18.0244C18.2233 8.75 18.4141 8.82902 18.5547 8.96967C18.6954 9.11032 18.7744 9.30109 18.7744 9.5Z" fill="#2B4360" />
                                    </svg>
                                </span>
                            </div>
                            <Accordion defaultActiveKey="0">

                                {showData?.physicalAssessment?.map((item: any, index: any) => (
                                    <Accordion.Item eventKey={index.toString()} className='phisical-assessment-accordion-item mb-3' key={index}>
                                        <Accordion.Header className='phisical-assessment-accordion-title-showData'>
                                            <div className='phisical-assessment-accordion-title-showData'>
                                                {/* {formatDate(item.date)} */}
                                                {convertDate(item.createdAt)}
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body className='pt-0'>
                                            <Row className='g-3'>
                                                <Col xl={6} lg={12} md={12} sm={6}>
                                                    <div className='phisical-assessment-accordion-showData-box d-flex gap-2'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 43 43" fill="none">
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
                                                <Col xl={6} lg={12} md={12} sm={6}>
                                                    <div className='phisical-assessment-accordion-showData-box d-flex gap-2'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 43 43" fill="none">
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
                                                <Col xl={6} lg={12} md={12} sm={6}>
                                                    <div className='phisical-assessment-accordion-showData-box d-flex gap-2'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 43 43" fill="none">
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

                                                <Col xl={6} lg={12} md={12} sm={6}>
                                                    <div className='phisical-assessment-accordion-showData-box d-flex gap-2'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 43 43" fill="none">
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

                                                <Col xl={6} lg={12} md={12} sm={6}>
                                                    <div className='phisical-assessment-accordion-showData-box d-flex gap-2'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 43 43" fill="none">
                                                            <rect x="0.109375" y="0.339844" width="42" height="42" rx="6" fill="#E29578" fillOpacity="0.2" />
                                                            <path d="M28.5498 25.9676C28.2312 25.9677 27.9218 25.8646 27.6716 25.675C27.4214 25.4855 27.245 25.2205 27.1708 24.9229L25.1305 16.695C25.115 16.6332 25.0801 16.5775 25.0305 16.5353C24.981 16.4932 24.9192 16.4666 24.8534 16.4593C24.7877 16.452 24.7212 16.4642 24.6629 16.4944C24.6046 16.5245 24.5574 16.5711 24.5276 16.6278L22.1301 21.2332C22.0073 21.4635 21.8196 21.656 21.5885 21.7888C21.3573 21.9216 21.0919 21.9893 20.8226 21.9843C20.5529 21.9761 20.2912 21.8943 20.0682 21.7485C19.8452 21.6027 19.67 21.3988 19.5632 21.1609L18.5977 18.9985H13.4231C13.2782 18.9985 13.1393 18.9432 13.0369 18.8448C12.9345 18.7465 12.877 18.6131 12.877 18.474C12.877 18.3349 12.9345 18.2015 13.0369 18.1031C13.1393 18.0048 13.2782 17.9495 13.4231 17.9495H18.9581C19.065 17.9495 19.1695 17.9795 19.2588 18.036C19.348 18.0925 19.418 18.173 19.46 18.2673L20.567 20.7476C20.5914 20.8018 20.6314 20.8483 20.6823 20.8815C20.7331 20.9147 20.7928 20.9334 20.8543 20.9353C20.9163 20.9397 20.9783 20.9256 21.0317 20.8949C21.085 20.8642 21.1272 20.8184 21.1525 20.7638L23.55 16.159C23.6797 15.9091 23.8864 15.7036 24.142 15.5705C24.3976 15.4375 24.6897 15.3832 24.9785 15.4152C25.2673 15.4472 25.5389 15.5638 25.7562 15.7493C25.9736 15.9347 26.1262 16.1799 26.1933 16.4516L28.2331 24.6801C28.2478 24.7396 28.2806 24.7935 28.3272 24.8352C28.3739 24.8768 28.4323 24.9042 28.4952 24.914C28.5581 24.9245 28.6228 24.9166 28.6809 24.8913C28.739 24.8661 28.7879 24.8246 28.8213 24.7724L30.7955 21.7399C30.8446 21.6644 30.9129 21.6022 30.9939 21.5591C31.0749 21.516 31.166 21.4934 31.2586 21.4934H35.5632C35.7081 21.4934 35.847 21.5486 35.9494 21.647C36.0518 21.7453 36.1094 21.8787 36.1094 22.0178C36.1094 22.1569 36.0518 22.2903 35.9494 22.3887C35.847 22.4871 35.7081 22.5423 35.5632 22.5423H31.5612L29.7475 25.3288C29.6209 25.5243 29.4445 25.6856 29.2349 25.7974C29.0253 25.9091 28.7895 25.9677 28.5498 25.9676Z" fill="#E29578" stroke="#E29578" strokeWidth="0.2" />
                                                            <path d="M24.3984 22.1814C24.3522 22.0512 24.2566 21.9444 24.1322 21.8843C24.0078 21.8241 23.8647 21.8155 23.734 21.8603C23.6033 21.9051 23.4956 21.9996 23.4342 22.1233C23.3728 22.2471 23.3627 22.3901 23.4061 22.5212C23.6646 23.2237 23.714 23.2132 23.734 23.9614C23.734 26.0479 22.9052 28.0489 21.4298 29.5243C19.9545 30.9996 17.9534 31.8285 15.867 31.8285C13.7805 31.8285 11.7794 30.9996 10.3041 29.5243C8.82872 28.0489 7.99987 26.0479 7.99987 23.9614C7.99987 19.6088 14.2621 12.7618 15.867 11.0783C17.8948 13.1938 18.7331 13.9852 20.3573 16.4244C20.4335 16.5389 20.5517 16.6189 20.6863 16.6472C20.821 16.6754 20.9613 16.6495 21.0771 16.5752C21.1929 16.5009 21.2749 16.3841 21.3053 16.2499C21.3358 16.1158 21.3123 15.975 21.2399 15.858C19.4774 13.2069 18.4666 12.2275 16.2378 9.95434C16.1394 9.85602 16.006 9.80078 15.867 9.80078C15.7279 9.80078 15.5945 9.85602 15.4962 9.95434C15.1474 10.3031 6.95093 18.5615 6.95093 23.9614C6.95093 26.3261 7.89029 28.5939 9.56237 30.266C11.2344 31.9381 13.5023 32.8774 15.867 32.8774C18.2316 32.8774 20.4995 31.9381 22.1715 30.266C23.8436 28.5939 24.783 26.3261 24.783 23.9614C24.6995 23.1026 24.6944 23.0173 24.3984 22.1814Z" fill="#E29578" stroke="#E29578" strokeWidth="0.289362" />
                                                        </svg>

                                                        <div className='d-flex flex-column gap-1'>
                                                            <span className='contact-details-emergency'>Blood Pressure</span>

                                                            {/* <span className='phisical-assessment-accordion-showData-box-subtitle'>{item.systolic}/{item.diastolic} mmHg</span> */}
                                                            <span className='phisical-assessment-accordion-showData-box-subtitle'>
                                                                {`${item.bloodPressure.systolic}/${item.bloodPressure.diastolic} mmHg`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xl={6} lg={12} md={12} sm={6}>
                                                    <div className='phisical-assessment-accordion-showData-box d-flex gap-2'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 43 43" fill="none">
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
                                ))}
                            </Accordion>
                        </ContentContainer>
                        <ContentContainer className="mt-3 mb-2">
                            {/* {[
                                {

                                    ...showData.fertilityAssessment,
                                    semenAnalysis: showData.fertilityAssessment.semenAnalysis,
                                    fertilityIssues: showData.fertilityAssessment.fertilityIssues,
                                    fertilityTreatment: showData.fertilityAssessment.fertilityTreatment,
                                    surgeries: showData.fertilityAssessment.surgeries,
                                    semenAnalysisContent: showData.fertilityAssessment.semenAnalysisContent,
                                    fertilityIssuesContent: showData.fertilityAssessment.fertilityIssuesContent,
                                    fertilityTreatmentContent: showData.fertilityAssessment.fertilityTreatmentContent,
                                    surgeriesContent: showData.fertilityAssessment.surgeriesContent,
                                },
                            ].map((item: any, index: number) => ( */}
                            <div className="medical-history-details text-start">
                                <div className='d-flex justify-content-between align-items-center'>
                                    <p className="contact-details-heading mb-3">Fertility Assessment</p>

                                    <Button variant="outline" className="medical-history-edit-btn medical-history-edit-btn-font mb-3" onClick={() => { setEditFertilityAssessment(true); setFormDataEditFertilityAssessment(showData.fertilityAssessment); }}>
                                        <svg width="14" height="14" viewBox="0 0 14 14" className='me-1' fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13.5484 3.40848L10.7553 0.615983C10.5209 0.381644 10.203 0.25 9.87157 0.25C9.54011 0.25 9.22223 0.381644 8.98782 0.615983L1.28032 8.32286C1.16385 8.43861 1.0715 8.57633 1.00863 8.72803C0.945765 8.87973 0.913622 9.0424 0.914067 9.20661V11.9997C0.914067 12.3313 1.04576 12.6492 1.28018 12.8836C1.5146 13.118 1.83255 13.2497 2.16407 13.2497H12.6641C12.863 13.2497 13.0537 13.1707 13.1944 13.0301C13.3351 12.8894 13.4141 12.6986 13.4141 12.4997C13.4141 12.3008 13.3351 12.1101 13.1944 11.9694C13.0537 11.8288 12.863 11.7497 12.6641 11.7497H6.97657L13.5484 5.17661C13.6646 5.06053 13.7567 4.92271 13.8195 4.77102C13.8824 4.61933 13.9147 4.45674 13.9147 4.29255C13.9147 4.12835 13.8824 3.96576 13.8195 3.81407C13.7567 3.66238 13.6646 3.52456 13.5484 3.40848ZM4.85157 11.7497H2.41407V9.31223L7.66407 4.06223L10.1016 6.49973L4.85157 11.7497ZM11.1641 5.43723L8.72657 2.99973L9.87282 1.85348L12.3103 4.29098L11.1641 5.43723Z" fill="#2B4360" />
                                        </svg> Edit
                                    </Button>

                                </div>

                                <Row>
                                    <Col md={6} sm={6}>
                                        <div className="mb-3">
                                            <h6 className="mb-1 contact-details-emergency">Semen Analysis</h6>
                                            <p className="mb-2 accordion-title-detail">
                                                {showData?.fertilityAssessment?.semenAnalysis?.status
                                                    === 'Yes'
                                                    ? showData?.fertilityAssessment.semenAnalysis.semenAnalysisDetails
                                                        ? `Yes | ${showData?.fertilityAssessment.semenAnalysis.semenAnalysisDetails}`
                                                        : 'Yes'
                                                    : 'No'}
                                            </p>
                                        </div>
                                    </Col>

                                    <Col md={6} sm={6}>
                                        <div className="mb-3">
                                            <h6 className="mb-1 contact-details-emergency">Fertility Issues</h6>
                                            <p className="mb-2 accordion-title-detail">
                                                {showData?.fertilityAssessment?.fertilityIssues?.status
                                                    === 'Yes'
                                                    ? showData?.fertilityAssessment?.fertilityIssues?.fertilityIssuesDetails
                                                        ? `Yes | ${showData?.fertilityAssessment?.fertilityIssues?.fertilityIssuesDetails}`
                                                        : 'Yes'
                                                    : 'No'}
                                            </p>
                                        </div>
                                    </Col>

                                    <Col md={6} sm={6}>
                                        <div className="mb-3">
                                            <h6 className="mb-1 contact-details-emergency">Fertility Treatment</h6>
                                            <p className="mb-2 accordion-title-detail">

                                                {showData?.fertilityAssessment?.fertilityTreatments?.status
                                                    === 'Yes'
                                                    ? showData?.fertilityAssessment?.fertilityTreatments?.fertilityTreatmentsDetails
                                                        ? `Yes | ${showData?.fertilityAssessment?.fertilityTreatments?.fertilityTreatmentsDetails}`
                                                        : 'Yes'
                                                    : 'No'}
                                            </p>
                                        </div>
                                    </Col>

                                    <Col md={6} sm={6}>
                                        <div className="mb-3">
                                            <h6 className="mb-1 contact-details-emergency">Surgeries</h6>
                                            <p className="mb-2 accordion-title-detail">

                                                {showData?.fertilityAssessment?.surgeries?.status
                                                    === 'Yes'
                                                    ? showData.fertilityAssessment.surgeries.surgeriesDetails
                                                        ? `Yes | ${showData.fertilityAssessment.surgeries.surgeriesDetails}`
                                                        : 'Yes'
                                                    : 'No'}
                                            </p>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            {/* // ))} */}
                        </ContentContainer>
                    </Col>
                </Row>
            )}

            <Modal
                show={AddPhysicalAssessment}
                onHide={() => setAddPhysicalAssessment(false)}
                header="Add New Physical Assessment"
                closeButton={true}
                size="lg"
            >

                {/* <h1>forms</h1> */}
                <PhysicalAssessment
                    formData={formDataAddPhysicalAssessment}
                    setFormData={setFormDataAddPhysicalAssessment}
                    setShowData={setShowData}
                    showData={showData}
                    formError={formErrorAddPhysicalAssessment}
                    setFormError={setFormErrorAddPhysicalAssessment}
                />

                <div className='d-flex gap-3'>
                    <Button className="w-100 mt-3" variant="outline" disabled={false} onClick={() => setAddPhysicalAssessment(false)}>
                        Cancel
                    </Button>
                    <Button className="w-100 mt-3" variant="default" disabled={false} type="button" onClick={(e: any) => handleAddPhysicalAssessment(e)}
                    >
                        Save
                    </Button>
                </div>
            </Modal>

            <Modal
                show={EditFertilityAssessment}
                onHide={() => setEditFertilityAssessment(false)}
                header="Edit Fertility Assessment"
                closeButton={true}
                size="lg"
            >

                {/* <h1>forms</h1> */}
                <FertilityAssessment
                    formData={formDataEditFertilityAssessment}
                    setFormData={setFormDataEditFertilityAssessment}
                    setFormError={setFormErrorEditFertilityAssessment}
                    formError={formErrorEditFertilityAssessment}
                    setShowContent={setShowContent}
                    setShowPartnerDetail={setShowPartnerDetail}
                    setShowData={setShowData} showData={showData}

                />


                <div className='d-flex gap-3'>
                    <Button className="w-100 mt-3" variant="outline" disabled={false} onClick={() => setEditFertilityAssessment(false)}>
                        Cancel
                    </Button>
                    <Button className="w-100 mt-3" variant="default" disabled={false} type="button" onClick={(e: any) => handleEditFertilityAssessment(e)}
                    >
                        Save
                    </Button>
                </div>
            </Modal>

            <Modal
                show={EditMedicalHistory}
                onHide={() => setEditMedicalHistory(false)}
                header="Edit Medical History"
                closeButton={true}
                size="lg"
            >
                <MedicalHistoryForm
                    setEditMedicalHistory={setEditMedicalHistory}
                    setAddPartner={setAddPartner}
                    setActiveTab={setActiveTab}
                    setShowData={setShowData}
                    showData={showData}
                    initialData={modalEditTab === "medical history" ? showData.medicalHistory : undefined}
                    formDataMedicalHistory={formDataMedicalHistory}
                />
            </Modal>

        </>
    )
}
