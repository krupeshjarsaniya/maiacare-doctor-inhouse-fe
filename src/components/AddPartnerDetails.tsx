"use client"

import { FormEvent, useState } from "react";
import CustomTabs from "./ui/CustomTabs";
import { BasicDetailsForm, FertilityAssessment, MedicalHistoryForm, PhysicalAssessment } from "./form/AddPartnerDetailsForm";
import { Accordion } from "react-bootstrap";
import Button from "./ui/Button";
// import '../style/fertilityassessment.css'
import { allDataType, FertilityAssessmentType, MedicalHistoryData, PartnerData } from "@/utils/types/interfaces";
import toast from "react-hot-toast";
import { BsInfoCircle } from "react-icons/bs";
import { addPartnerfertilityAssessment, addPartnerMedicalHistory, addPartnerPhysicalAssesment, basicDetails } from "@/utils/apis/apiHelper";
import { useParams } from "next/navigation";

interface AddPartnerDetailsProps {
    setAddPartner: (value: boolean) => void;
    setShowContent: (value: boolean) => void;
    setShowPartnerDetail: (value: boolean) => void;
    setShowData: (value: any) => void;
    modalEditTab: string | null;
    setModalEditTab: (value: string | null) => void;
    showData: any;
}

export function AddPartnerDetails({
    setAddPartner,
    setShowContent,
    setShowPartnerDetail,
    setShowData,
    modalEditTab,
    setModalEditTab,
    showData, }
    : AddPartnerDetailsProps) {

    const [activeTab, setActiveTab] = useState<string>("basic");
    const [tabManagement, setTabManagement] = useState<number>(0);
    const [allData, setAllData] = useState<allDataType>();

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const tabOptions = [
        {
            key: "basic",
            label: "Basic Details",
            content: (
                <div>
                    <BasicDetailsForm setAddPartner={setAddPartner}
                        setActiveTab={setActiveTab}
                        setShowData={setShowData}
                        setTabManagement={setTabManagement}
                        setAllData={setAllData}
                        allData={allData}
                    />
                </div>
            ),
        },

        {
            key: "medical history",
            label: "Medical History",
            disabled: tabManagement == 0,
            content: (
                <MedicalHistoryForm
                    setAddPartner={setAddPartner}
                    setActiveTab={setActiveTab}
                    setShowData={setShowData}
                    initialData={modalEditTab === "medical history" ? showData.medicalHistory : undefined}
                    setTabManagement={setTabManagement}
                    setAllData={setAllData}
                    allData={allData}
                />
                // <h6>Medical History</h6>
            ),
        },
        {
            key: "physical & fertility assessment",
            label: "Physical & Fertility Assessment",
            disabled: !(tabManagement > 1),
            content: (
                <PhysicalFertilityAssessmentAccordion
                    setShowContent={setShowContent}
                    setAddPartner={setAddPartner}
                    setShowPartnerDetail={setShowPartnerDetail}
                    setShowData={setShowData}
                    showData={showData}
                    initialData={modalEditTab === "physical & fertility assessment" ? showData.fertilityAssessment : undefined}
                    allData={allData}
                />

                // <PhysicalFertilityAssessmentForm
                //     setShowContent={setShowContent}
                //     setAddPartner={setAddPartner}
                //     setShowPartnerDetail={setShowPartnerDetail}
                //     setShowData={setShowData}
                //     showData={showData}
                //     initialData={modalEditTab === "physical & fertility assessment" ? showData.fertilityAssessment : undefined}
                //     eventKey={eventKey}
                // />
            ),
        },
    ];

    return (
        <>
            <CustomTabs
                tabOptions={tabOptions}
                className="mb-3"
                activeKey={activeTab}
                setActiveKey={handleTabChange}
            />

        </>
    )
}

export function PhysicalFertilityAssessmentAccordion({ setShowContent, setAddPartner, setShowPartnerDetail, setShowData, showData, initialData, allData }: {
    setShowContent: (value: boolean) => void, setAddPartner: (value: boolean) => void, setShowPartnerDetail: (value: boolean) => void, setShowData: (value: any) => void, showData: any, initialData: any, allData: allDataType | undefined;

}) {

    const initialFormData: FertilityAssessmentType = {
        height: "",
        weight: "",
        bmi: "",
        bloodGroup: "",
        systolic: "",
        diastolic: "",
        heartRate: "",
        semenAnalysis: initialData?.semenAnalysis || "yes",
        semenAnalysisContent: initialData?.semenAnalysisContent || "",
        fertilityIssues: initialData?.fertilityIssues || "no",
        fertilityIssuesContent: initialData?.fertilityIssuesContent || "",
        fertilityTreatments: initialData?.fertilityTreatment || "no",
        fertilityTreatmentContent: initialData?.fertilityTreatmentContent || "",
        surgeries: initialData?.surgeries || "no",
        surgeriesContent: initialData?.surgeriesContent || "",
    };

    const [formData, setFormData] = useState<FertilityAssessmentType>(initialFormData);
    type FormError = Partial<Record<keyof FertilityAssessmentType, string>>;

    const initialFormError: FormError = {};
    const [formError, setFormError] = useState<FormError>(initialFormError);
    const safeTrim = (val: any) => (typeof val === "string" ? val.trim() : "");
    const validateForm = (data: FertilityAssessmentType): FormError => {
        const errors: FormError = {};

        if (!safeTrim(data.height)) errors.height = "Height is required";
        if (!safeTrim(data.weight)) errors.weight = "Weight is required";
        if (!safeTrim(data.bmi)) errors.bmi = "BMI is required";
        if (!safeTrim(data.bloodGroup)) errors.bloodGroup = "Blood group is required";
        if (!safeTrim(data.systolic)) errors.systolic = "Blood pressure is required";
        if (!safeTrim(data.heartRate)) errors.heartRate = "Heart rate is required";

        if (!safeTrim(data.semenAnalysis)) errors.semenAnalysis = "Seminal Analysis is required";
        if (data.semenAnalysis.status === "yes" && !safeTrim(data.semenAnalysisContent))
            errors.semenAnalysisContent = "Seminal Analysis Content is required";

        if (!safeTrim(data.fertilityIssues)) errors.fertilityIssues = "Fertility Issues is required";
        if (data.fertilityIssues.status === "yes" && !safeTrim(data.fertilityIssuesContent))
            errors.fertilityIssuesContent = "Fertility Issues Content is required";

        if (!safeTrim(data.fertilityTreatments)) errors.fertilityTreatments = "Fertility Treatment is required";
        if (data.fertilityTreatments.status === "yes" && !safeTrim(data.fertilityTreatmentContent))
            errors.fertilityTreatmentContent = "Fertility Treatment Content is required";

        if (!safeTrim(data.surgeries)) errors.surgeries = "Surgeries is required";
        if (data.surgeries.status === "yes" && !safeTrim(data.surgeriesContent))
            errors.surgeriesContent = "Surgeries Content is required";

        return errors;
    };

    // const validateForm = (data: FertilityAssessmentType): FormError => {
    //     const errors: FormError = {};

    //     if (!data.height.trim()) errors.height = "Height is required";
    //     if (!data.weight.trim()) errors.weight = "Weight is required";
    //     if (!data.bmi.trim()) errors.bmi = "BMI is required";
    //     if (!data.bloodGroup.trim()) errors.bloodGroup = "Blood group is required";
    //     if (!data.systolic.trim()) errors.systolic = "Blood pressure is required";

    //     if (!data.heartRate.trim()) errors.heartRate = "Heart rate is required";

    //     if (!data?.semenAnalysis?.trim()) errors.semenAnalysis = "Seminal Analysis is required";
    //     if (data.semenAnalysis === 'yes' && !data?.semenAnalysisContent?.trim()) errors.semenAnalysisContent = "Seminal Analysis Content is required";
    //     if (!data?.fertilityIssues?.trim()) errors.fertilityIssues = "Fertility Issues is required";
    //     if (data.fertilityIssues === 'yes' && !data?.fertilityIssuesContent?.trim()) errors.fertilityIssuesContent = "Fertility Issues Content is required";
    //     if (!data?.fertilityTreatment?.trim()) errors.fertilityTreatment = "Fertility Treatment is required";
    //     if (data.fertilityTreatment === 'yes' && !data?.fertilityTreatmentContent?.trim()) errors.fertilityTreatmentContent = "Fertility Treatment Content is required";
    //     if (!data?.surgeries?.trim()) errors.surgeries = "Surgeries is required";
    //     if (data.surgeries === 'yes' && !data?.surgeriesContent?.trim()) errors.surgeriesContent = "Surgeries Content is required";

    //     return errors;
    // };

    const params = useParams();
    const id = params?.id?.toString();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        const errors = validateForm(formData);
        console.log("Form submitted", formData);
        setFormError(errors);
        if (!allData) return;
        if (!allData?.medicalHistoryPassingData || !allData.basicDetailsPassingData) return;

        addPartnerMedicalHistory(allData.medicalHistoryPassingData);
        basicDetails(allData.basicDetailsPassingData);

        console.log("allData", allData);
        addPartnerMedicalHistory(allData?.medicalHistoryPassingData)
        basicDetails(allData?.basicDetailsPassingData)
        
        const passData = {
            patientId: id,
            height: formData.height,
            weight: formData.weight,
            bmi: formData.bmi,
            bloodGroup: formData.bloodGroup,
            bloodPressureSystolic: formData.systolic,
            bloodPressureDiastolic: formData.diastolic,
            heartRate: formData.heartRate
        }
        addPartnerPhysicalAssesment(passData)
            .then(() => {
                setFormError(initialFormError);
                setAddPartner(false);
                setShowPartnerDetail(false);
                setShowContent(true);

                // setShowData((prev: any) => ({ ...prev, PhysicalAssessmentData: [...prev.PhysicalAssessmentData, formData] }));
                // setShowData((prev: any) => ({ ...prev, fertilityAssessment: { ...prev.fertilityAssessment, ...formData } }));

                toast.success('Partner added successfully', {
                    icon: <BsInfoCircle size={22} color="white" />,
                });
            })
            .catch((err) => {
                console.log("PartnerPhysicalAssesment: ", err);
            });
        const normalizeStatus = (val: any) =>
            typeof val === "string" && val.length > 0
                ? val.charAt(0).toUpperCase() + val.slice(1)
                : "";

        const passFertilityAssessmentData = {
            patientId: id,
            semenAnalysis: {
                status: normalizeStatus(formData.semenAnalysis.status),
                semenAnalysisDetails: formData.semenAnalysis.semenAnalysisDetails || ""
            },
            fertilityIssues: {
                status: normalizeStatus(formData.fertilityIssues.status),
                fertilityIssuesDetails: formData.fertilityIssues.fertilityIssuesDetails || ""
            },
            fertilityTreatments: {
                status: normalizeStatus(formData.fertilityTreatments.status),
                fertilityTreatmentsDetails: formData.fertilityTreatments.fertilityTreatmentsDetails || ""
            },
            surgeries: {
                status: normalizeStatus(formData.surgeries.status),
                surgeriesDetails: formData.surgeries.surgeriesDetails || ""
            }
        };

        // const passFertilityAssessmentData = {
        //     patientId: id,
        //     semenAnalysis: {
        //         status: formData.semenAnalysis.charAt(0).toUpperCase() + formData.semenAnalysis.slice(1),
        //         semenAnalysisDetails: formData.semenAnalysisContent
        //     },
        //     fertilityIssues: {
        //         status: formData.fertilityIssues.charAt(0).toUpperCase() + formData.fertilityIssues.slice(1),
        //         fertilityIssuesDetails: formData.fertilityIssuesContent
        //     },
        //     fertilityTreatments: {
        //         status: formData.fertilityTreatment.charAt(0).toUpperCase() + formData.fertilityTreatment.slice(1),
        //         fertilityTreatmentsDetails: formData.fertilityTreatmentContent
        //     },
        //     surgeries: {
        //         status: formData.surgeries.charAt(0).toUpperCase() + formData.surgeries.slice(1),
        //         surgeriesDetails: formData.surgeriesContent
        //     }
        // }

        addPartnerfertilityAssessment(passFertilityAssessmentData)
            .then(() => {
                setFormError(initialFormError);
                setAddPartner(false);
                setShowPartnerDetail(false);
                setShowContent(true);

                toast.success('Partner added successfully', {
                    icon: <BsInfoCircle size={22} color="white" />,
                });
            })
            .catch((err) => {
                console.log("PartnerfertilityAssessment: ", err);
            });

    };
    return (
        <>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0" className="fertilitiy-assement-accodion-item mb-3 mt-3">
                    <Accordion.Header>
                        <div className="fertilitiy-assement-accodion-title">
                            Physical Assessment
                        </div>
                    </Accordion.Header>
                    <Accordion.Body className='pt-0'>
                        <PhysicalAssessment setFormError={setFormError} formError={formError} formData={formData} setFormData={setFormData} setShowContent={setShowContent} setShowPartnerDetail={setShowPartnerDetail} setShowData={setShowData} showData={showData} />

                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1" className="fertilitiy-assement-accodion-item mb-3 mt-3">
                    <Accordion.Header>
                        <div className="fertilitiy-assement-accodion-title">
                            Fertility Assessment
                        </div>
                    </Accordion.Header>
                    <Accordion.Body className='pt-0'>
                        <FertilityAssessment formData={formData} setFormData={setFormData} setFormError={setFormError} formError={formError} setShowContent={setShowContent} setShowPartnerDetail={setShowPartnerDetail} setShowData={setShowData} showData={showData} initialData={initialData} />

                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <div className='d-flex gap-3'>
                <Button className="w-100 mt-3" variant="outline" disabled={false} onClick={() => setAddPartner(false)}>
                    Cancel
                </Button>
                <Button className="w-100 mt-3" variant="default" disabled={false} type="button" onClick={(e: any) => handleSubmit(e)}
                >
                    Save
                </Button>
            </div>
        </>
    )
}

