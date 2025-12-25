import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import "../../style/Edit-Profile.css";
import { InputFieldGroup } from '../ui/InputField';
import { Accordion, Col, Row } from 'react-bootstrap';
import { RadioButtonGroup } from '../ui/RadioField';
import { InputSelect, InputSelectMultiSelect } from '../ui/InputSelect';
import { PhoneNumberInput } from '../ui/PhoneNumberInput';
import Button from '../ui/Button';
import Simpleeditpro from '../../assets/images/Simpleeditpro.png';
import cameraicon from '../../assets/images/Cameraicon.png';
import { allDataType, EditFertilityAssessment, FertilityAssessmentType, MedicalHistoryType, PhysicalAssessmentDataModel } from '@/utils/types/interfaces';
import toast from 'react-hot-toast';
import { BsInfoCircle } from 'react-icons/bs';
import { addPartnerMedicalHistory, basicDetails, getProfileImageUrl, updatePartnermedicalhistory } from '@/utils/apis/apiHelper';
import { useParams } from 'next/navigation';
// import '../../style/PartnerDetails.css'
export function BasicDetailsForm({
    setAddPartner,
    setActiveTab,
    setShowData,
    setTabManagement,
    setAllData,
    allData
}: {
    setAddPartner: (value: boolean) => void,
    setActiveTab: (tab: string) => void,
    setShowData: (value: any) => void,
    setTabManagement: (value: number) => void | number,
    allData: allDataType | undefined;
    setAllData: React.Dispatch<React.SetStateAction<allDataType | undefined>>;
}) {

    const initialFormError: FormError = {};
    type FormData = {
        partnerName: string;
        partnerGender: string;
        partnerAge: string;
        partnerContactNumber: string;
        partnerEmail: string;
        profileImage: string;
    };

    type FormError = Partial<Record<keyof FormData, string>>;

    const initialFormData: FormData = {
        partnerName: "",
        partnerGender: "Male",   // Capitalized
        partnerAge: "",
        partnerContactNumber: "",
        partnerEmail: "",
        profileImage: ""
    };

    const [formData, setFormData] = useState<FormData>(initialFormData);
    // console.log("formData", formData);
    const [formError, setFormError] = useState<FormError>(initialFormError);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "basic_detail_phone") {
            // Allow only digits
            const isOnlyNumbers = /^[0-9]*$/.test(value);

            if (isOnlyNumbers) {
                // clear error only when it's numeric
                setFormError((prev) => ({ ...prev, [name]: "" }));
            } else {
                // keep "required" style error if invalid
                setFormError((prev) => ({
                    ...prev,
                    [name]: "Phone number is required",
                }));
            }
        } else {
            // for other fields, clear error on any change
            setFormError((prev) => ({ ...prev, [name]: "" }));
        }

        // console.log("value", value);
    };

    const [profileImage, setProfileImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };
    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement> | undefined
    ) => {
        if (event) {
            const file = event.target.files?.[0];
            console.log("file", file);

            if (file) {
                const allowedTypes = ["image/jpeg", "image/png"];

                if (!allowedTypes.includes(file.type)) {
                    setFormData((prev) => ({
                        ...prev,
                        partnerImage: "",
                    }));
                    setFormError((prev) => ({
                        ...prev,
                        partnerImage: "Only JPG and PNG files are allowed",
                    }));
                    return;
                }

                if (file.size > 5 * 1024 * 1024) {
                    setFormData((prev) => ({
                        ...prev,
                        partnerImage: "",
                    }));
                    setFormError((prev) => ({
                        ...prev,
                        partnerImage: "File size must be less than 5MB",
                    }));
                    return;
                }

                const reader = new FileReader();
                reader.onload = () => {
                    setProfileImage(reader.result as string);
                    setFormData((prev) => ({
                        ...prev,
                        profileImage: reader.result as string,
                    }));
                    setFormError((prev) => ({
                        ...prev,
                        profileImage: "",
                    }));
                };
                reader.readAsDataURL(file);
            }
            const data = {
                type: "doctor",
                files: file
            }
            getProfileImageUrl(data)
                .then((response) => {
                    if (response.data.status) {
                        console.log("response : ", response);
                        const uploadedImage = response.data.files[0];

                        setProfileImage(uploadedImage);
                        setFormData((prev) => ({
                            ...prev,
                            partnerImage: uploadedImage,
                        }));
                        setFormError((prev) => ({
                            ...prev,
                            partnerImage: "",
                        }));

                    } else {
                        console.log("error");
                    }

                }).catch((error) => {
                    console.log("error", error);
                });
        }
    };


    const validateForm = (data: FormData): FormError => {
        const errors: FormError = {};

        if (!data.partnerName.trim()) errors.partnerName = "Name is required";
        if (!data.partnerGender.trim()) errors.partnerGender = "Age is required";
        if (!data.partnerContactNumber.trim()) errors.partnerContactNumber = "Phone number is required";

        // Only check required here
        // if (!data.profileImage.trim()) {
        //     errors.profileImage = "Profile Image is required";
        // }

        if (!data.partnerEmail.trim()) {
            errors.partnerEmail = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.partnerEmail)) {
            errors.partnerEmail = "Enter a valid email address";
        }


        return errors;
    };
    const params = useParams();
    const patientId = params?.id?.toString();


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = validateForm(formData);
        setFormError(errors);
        // console.log("errors", errors);
        if (Object.keys(errors).length === 0) {
            setTabManagement(1)
            // console.log("FormData111111 ", formData);
            setFormError(initialFormError);
            setActiveTab("medical history");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // setShowData((prev: any) => ({ ...prev, profile: { ...prev.profile, ...formData } }));
        setShowData((prev: any) => ({
            ...(prev || {}),
            profile: {
                ...((prev && prev.profile) || {}),
                ...formData,
            },
        }));
        
        const passData = {
            patientId: String(patientId),
            partnerImage: profileImage,
            partnerName: formData.partnerName,
            partnerContactNumber: formData.partnerContactNumber,
            partnerEmail: formData.partnerEmail,
            partnerGender: formData.partnerGender.charAt(0).toUpperCase() + formData.partnerGender.slice(1),
            partnerAge: Number(formData.partnerAge)
        };

        const formDataToSend = new FormData();
        formDataToSend.append("type", "doctor");
        formDataToSend.append("files", formData.profileImage);

        // getProfileImageUrl(formDataImage)
        //     .then((response) => {
        //         console.log("getImageUrl: ", response.data);
        //     })
        //     .catch((err) => {
        //         console.log("getImageUrl", err);
        //     });

        // basicDetails(passData)
        //     .then((response) => {

        //         if (response.status == 200) {
        //             console.log("Partner basic details added: ", response.data);
        //         } else {
        //             console.log("Error");
        //         }

        //     })
        //     .catch((err) => {
        //         console.log("Partner basic details adding error", err);
        //     });

        setAllData({ ...allData, basicDetailsPassingData: passData })
    };
    return (
        <>

            <form onSubmit={handleSubmit}>
                <Row className="g-md-3 g-1">
                    <Col md={12}>
                        <div className="d-flex align-items-center gap-4  flex-wrap justify-content-center justify-content-sm-start text-center text-md-start">
                            <div className="profile-wrapper position-relative" >
                                <img
                                    src={profileImage || Simpleeditpro.src}
                                    alt="Profile"
                                    className="object-fit-cover rounded-2"
                                    width={100}
                                    height={100}
                                />

                                <div
                                    className="camera-icon"
                                    onClick={handleImageClick}
                                >
                                    <Image src={cameraicon} alt="Upload" width={48} height={48} />
                                </div>
                                <InputFieldGroup
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    ref={fileInputRef}
                                    className="image-formate d-none"
                                    onChange={(event) => handleFileChange(event)}
                                    name="profileImage"
                                />
                            </div>

                            <div>
                                <div className="accordion-title-detail">Add Profile Picture</div>
                                <div className="select-profile-subtitle">
                                    Allowed Jpg, png of max size 5MB
                                </div>
                                <small className="text-danger maiacare-input-field-error form-text ">{formError.profileImage}</small>
                            </div>
                        </div>

                    </Col>
                    <Col md={12}>

                        <InputFieldGroup
                            label="Name"
                            name="partnerName"
                            type="text"
                            value={formData.partnerName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleChange(e);
                            }}
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => { }}
                            placeholder="Enter name"
                            required={true}
                            error={formError.partnerName}
                            className="position-relative "
                        ></InputFieldGroup>
                    </Col>
                    <Col md={6}>
                        <RadioButtonGroup
                            label="Gender"
                            name="partnerGender"
                            value={formData.partnerGender || ''}

                            onChange={(e) => handleChange(e)}
                            required
                            options={[
                                { label: "Male", value: "Male" },
                                { label: "Female", value: "Female" },
                                { label: "Other", value: "Other" },
                            ]}
                        />

                    </Col>

                    <Col md={6}>
                        <InputSelect
                            label="age"
                            name="partnerAge"
                            value={formData.partnerAge}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                handleChange(e);
                            }}
                            onBlur={(e: React.FocusEvent<HTMLSelectElement>) => { }}
                            required={true}
                            disabled={false}
                            error={formError.partnerAge}
                            options={[
                                { id: "1", value: "1", label: "1" },
                                { id: "2", value: "2", label: "2" },
                                { id: "3", value: "3", label: "3" },
                                { id: "4", value: "4", label: "4" },
                                { id: "5", value: "5", label: "5" },
                                { id: "6", value: "6", label: "6" },
                                { id: "7", value: "7", label: "7" },
                                { id: "8", value: "8", label: "8" },
                                { id: "9", value: "9", label: "9" },
                                { id: "10", value: "10", label: "10" },
                                { id: "11", value: "11", label: "11" },
                                { id: "12", value: "12", label: "12" },
                                { id: "13", value: "13", label: "13" },
                                { id: "14", value: "14", label: "14" },
                                { id: "15", value: "15", label: "15" },
                                { id: "16", value: "16", label: "16" },
                                { id: "17", value: "17", label: "17" },
                                { id: "18", value: "18", label: "18" },
                                { id: "19", value: "19", label: "19" },
                                { id: "20", value: "20", label: "20" },
                                { id: "21", value: "21", label: "21" },
                                { id: "22", value: "22", label: "22" },
                                { id: "23", value: "23", label: "23" },
                                { id: "24", value: "24", label: "24" },
                                { id: "25", value: "25", label: "25" },
                            ]}
                        />
                    </Col>


                    <Col md={6}>
                        <PhoneNumberInput
                            label="Contact Number"
                            value={formData.partnerContactNumber}
                            onChange={(phone: any) => {
                                // setFormData((prev) => ({ ...prev, phone }));
                                // setFormError((prev) => ({ ...prev, phone: "" }));
                                handleChange({
                                    target: { name: "partnerContactNumber", value: phone },
                                } as React.ChangeEvent<HTMLInputElement>);
                            }}
                            placeholder='(000) 000-0000'
                            required
                            error={formError.partnerContactNumber}
                        />
                    </Col>


                    <Col md={6}>

                        <InputFieldGroup
                            label="Email ID"
                            name="partnerEmail"
                            type="text"
                            value={formData.partnerEmail}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleChange(e);
                            }}
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => { }}
                            placeholder="Enter Email ID"
                            required={false}
                            error={formError.partnerEmail}
                            className="position-relative "
                        ></InputFieldGroup>

                    </Col>
                    <div className='d-flex gap-3'>
                        <Button className="w-100" variant="outline" disabled={false} onClick={() => setAddPartner(false)}>
                            Cancel
                        </Button>
                        <Button className="w-100" variant="default" disabled={false} type="submit">
                            Save
                        </Button>
                    </div>

                </Row>
            </form>

        </>
    )
}

export function MedicalHistoryForm({
    setAddPartner,
    setActiveTab,
    setShowData,
    showData,
    initialData,
    setEditMedicalHistory,
    formDataMedicalHistory,
    setTabManagement,
    setAllData,
    allData
}: {
    setAddPartner: (value: boolean) => void,
    setActiveTab: (tab: string) => void,
    setShowData: (value: any) => void,
    initialData?: any,
    showData?: any,
    setEditMedicalHistory?: React.Dispatch<React.SetStateAction<boolean>> | any;
    formDataMedicalHistory?: MedicalHistoryType | any,
    setTabManagement?: (value: number) => void | number,
    setAllData?: (value: any) => unknown,
    allData?: any
}) {
    type FormError = Partial<Record<keyof MedicalHistoryType, string>>;

    // console.log("formDataMedicalHistory : ", formDataMedicalHistory);

    const normalizeMulti = (arr: any[]) =>
        arr.map((item) =>
            typeof item === "string"
                ? { value: item, label: item }
                : {
                    value: item.value ?? item.label,
                    label: item.label ?? item.value,
                }
        );

    const initialFormData: MedicalHistoryType = {
        medication: formDataMedicalHistory?.medications?.status || "Yes",
        surgeries: formDataMedicalHistory?.surgeries?.status || "Yes",
        surgeriesContent: formDataMedicalHistory?.surgeries?.surgeriesDetails || "",

        medicalCondition: formDataMedicalHistory?.conditions
            ? normalizeMulti(formDataMedicalHistory?.conditions)
            : [],

        lifestyle: formDataMedicalHistory?.lifestyle
            ? normalizeMulti(formDataMedicalHistory?.lifestyle)
            : [],


        familyMedicalHistory: formDataMedicalHistory?.familyHistory || "",

        stress: formDataMedicalHistory?.stressLevel || "Moderate",
        exercise: formDataMedicalHistory?.exerciseFrequency || "Regularly",
        medicationcontent: formDataMedicalHistory?.medications?.medicationsDetails || "",
        surgeriescontent: formDataMedicalHistory?.surgeries?.surgeriesDetails || "",
    }


    const MedicalHistoryFormError: FormError = {};

    const [FormData, setFormData] = useState<MedicalHistoryType>(initialFormData);

    const [medicalHistoryFormError, setMedicalHistoryFormError] = useState<FormError>(MedicalHistoryFormError);

    const validateForm = (data: MedicalHistoryType): FormError => {
        const errors: FormError = {};

        if (data.medication === 'yes' && !data.medicationcontent.trim()) errors.medicationcontent = "Medication Content is required";
        if (data.surgeries === 'yes' && !data.surgeriescontent.trim()) errors.surgeriescontent = "Surgeries Content is required";
        if (!data.medicalCondition.length) errors.medicalCondition = "Medical Condition is required";
        if (!data.lifestyle.length) errors.lifestyle = "Lifestyle is required";

        // if (!data.medicationcontent.trim()) errors.medicationcontent = "Medication Content is required";

        return errors;
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setMedicalHistoryFormError((prev) => ({ ...prev, [name]: "" }));
    }

    const params = useParams();
    const id = params?.id?.toString();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const errors = validateForm(FormData);
        setMedicalHistoryFormError(errors);




        if (Object.keys(errors).length === 0) {
            if (formDataMedicalHistory) {

                const values = FormData.lifestyle.map((e: { label: string, value: string }) => e.value);
                const passData = {
                    patientId: id,

                    medications: {
                        status: FormData.medication,
                        medicationsDetails: FormData.medicationcontent,
                    },

                    surgeries: {
                        status: FormData.surgeries,
                        surgeriesDetails: FormData.surgeriescontent,
                    },

                    conditions: FormData.medicalCondition.map((e: any) => e.value),

                    familyHistory: FormData.familyMedicalHistory,

                    // lifestyle: FormData.lifestyle.map((e: { label: string, value: string }) => e.value),
                    lifestyle: values,
                    exerciseFrequency: FormData.exercise,
                    stressLevel: FormData.stress
                };

                updatePartnermedicalhistory(showData._id, passData)
                    .then((response) => {
                        console.log("partner medical history: ", response);
                        const res = response.data.data.medicalHistory;
                        const updatedMedicalHistory = {
                            medications: {
                                status: res.medications.status,
                                medicationsDetails: res.medications.medicationsDetails
                            },
                            surgeries: {
                                status: res.surgeries.status,
                                surgeriesDetails: res.surgeries.surgeriesDetails
                            },
                            conditions: res.conditions,
                            lifestyle: res.lifestyle,
                            familyHistory: res.familyHistory,
                            exerciseFrequency: res.exerciseFrequency,
                            stressLevel: res.stressLevel
                        };
                        console.log("updatedMedicalHistory", updatedMedicalHistory);

                        setShowData((prev: any) => ({
                            ...prev,
                            medicalHistory: updatedMedicalHistory
                        }));
                        setEditMedicalHistory(false);

                    })
                    .catch((err) => {
                        console.log("partner medical history", err);
                    });


                toast.success('Changes saved successfully', {
                    icon: <BsInfoCircle size={22} color="white" />,
                });

                // const updatedData = {
                //     ...showData,
                //     medicalHistory: FormData,
                // };

                // setShowData(updatedData);
                setEditMedicalHistory(false);


            } else {
                if (setTabManagement) {
                    setTabManagement(2);
                }

                setActiveTab("physical & fertility assessment");
                // console.log("FormData55", FormData);
                // setShowData((prev: any) => ({ ...prev, medicalHistory: FormData }));
                const medicalHistoryPassingData = {
                    patientId: id,
                    medications: {
                        status: FormData.medication.charAt(0).toUpperCase() + FormData.medication.slice(1),
                        medicationsDetails: FormData.medicationcontent
                    },
                    surgeries: {
                        status: String(FormData?.surgeries?.charAt(0)?.toUpperCase() + FormData?.surgeries?.slice(1)),
                        surgeriesDetails: FormData.surgeriescontent
                    },
                    conditions: FormData.medicalCondition.map((e) => e.value),
                    familyHistory: FormData.familyMedicalHistory,
                    lifestyle: FormData.lifestyle.map((e) => e.value),
                    exerciseFrequency: FormData.exercise.charAt(0).toUpperCase() + FormData.exercise.slice(1),
                    stressLevel: FormData.stress.charAt(0).toUpperCase() + FormData.stress.slice(1)

                }
                if (setAllData) {
                    setAllData({ ...allData, medicalHistoryPassingData: medicalHistoryPassingData });
                }
                // addPartnerMedicalHistory(medicalHistoryPassingData)
                //     .then((response) => {
                //         console.log("partner medical history: ", response.data);
                //     })
                //     .catch((err) => {
                //         console.log("partner medical history", err);
                //     });
            }

        }
    };

    // const getData = ()=>{
    //     getPartnermedicalhistory(id)
    //     .then((res)=>{
    //         console.log("Response from getting data : ", res);
    //     })
    //     .catch((err)=>{
    //         console.log("Response from getting data : ", err);
    //     })
    // }

    // useEffect(() => {
    //     console.log("formDataMedicalHistory",showData)
    // }, [])


    return (
        <>
            <form>
                <Row className='g-md-2 g-1'>
                    <Col md={12}>
                        <RadioButtonGroup
                            label="Are you currently taking any medications?"
                            name="medication"
                            value={FormData.medication || 'yes'}
                            onChange={(e) => handleChange(e)}
                            required={true}
                            error={medicalHistoryFormError.medication}
                            options={[
                                { label: "Yes", value: "Yes" },
                                { label: "No", value: "No" },
                            ]}
                        />

                        {FormData.medication === 'Yes' && (
                            <InputFieldGroup
                                type="text"
                                value={FormData.medicationcontent}
                                name='medicationcontent'
                                onChange={handleChange}
                                error={medicalHistoryFormError.medicationcontent}
                                placeholder="Enter medication"
                                className="mt-md-3 mt-2"
                            />
                        )}




                    </Col>
                    <Col md={12} className='mt-md-3 mt-2 '>
                        <RadioButtonGroup
                            label="Have you had any surgeries?"
                            name="surgeries"
                            value={FormData.surgeries || 'Yes'}
                            onChange={(e) => handleChange(e)}
                            required={true}
                            error={medicalHistoryFormError.surgeries}
                            options={[
                                { label: "Yes", value: "Yes" },
                                { label: "No", value: "No" },
                            ]}
                        />

                        {FormData.surgeries === 'Yes' && (
                            <InputFieldGroup
                                type="text"
                                value={FormData.surgeriescontent}
                                name='surgeriescontent'
                                onChange={handleChange}
                                error={medicalHistoryFormError.surgeriescontent}
                                placeholder="Enter surgeries"
                                className={`mt-md-3 mt-2`}
                            />
                        )}


                    </Col>
                    <Col md={12} className='mt-md-3 mt-2'>
                        <InputSelectMultiSelect
                            label="Do you have any medical condition?"
                            name="medicalCondition"
                            values={FormData.medicalCondition}
                            onChange={(values) => { setFormData((prev) => ({ ...prev, medicalCondition: values })); setMedicalHistoryFormError((prev) => ({ ...prev, medicalCondition: "" })); }}
                            options={[
                                { id: "1", value: "PCOS", label: "PCOS" },
                                { id: "2", value: "Thyroid Disorder", label: "Thyroid Disorder" },
                                { id: "3", value: "Diabetes", label: "Diabetes" },
                                { id: "4", value: "Hypertension", label: "Hypertension" },
                            ]}
                            placeholder="Search Medical Condition or Allergies"
                            addPlaceholder="Add Medical Condition or Allergies"
                            required={true}
                            dropdownHandle={false} // open close arrow icon show hide
                            selectedOptionColor="var(--border-box)"
                            selectedOptionBorderColor="var(--border-box)"
                            error={medicalHistoryFormError.medicalCondition}

                        />



                    </Col>
                    <Col md={12} className='mt-md-3 mt-2'>
                        {/* <InputFieldGroup
                            label="Family Medical History "
                            name="familyMedicalHistory"
                            value={FormData.familyMedicalHistory}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleChange(e);
                            }}
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => { }}
                            placeholder="Enter family medical history"
                            required={false}
                            error={medicalHistoryFormError.familyMedicalHistory}
                            className="position-relative "
                        ></InputFieldGroup> */}
                        <InputFieldGroup
                            label="Family Medical History "
                            name="familyMedicalHistory"
                            value={FormData.familyMedicalHistory}
                            onChange={handleChange}
                            required={false}
                            error={medicalHistoryFormError.familyMedicalHistory}
                            className="position-relative "
                        ></InputFieldGroup>

                    </Col>
                    <Col md={12} className='mt-md-3 mt-2'>

                        <InputSelectMultiSelect
                            label="Lifestyle"
                            name="lifestyle"
                            values={FormData.lifestyle}
                            onChange={(values) => { setFormData((prev) => ({ ...prev, lifestyle: values })); setMedicalHistoryFormError((prev) => ({ ...prev, lifestyle: "" })); }}
                            options={[
                                { id: "1", value: "Non-smoker", label: "Non-smoker" },
                                { id: "2", value: "Occasional drinker", label: "Occasional drinker" },
                                { id: "3", value: "Vegetarian", label: "Vegetarian diet" },
                            ]}
                            placeholder="Select Lifestyle"
                            addPlaceholder="Add Lifestyle"
                            required={true}
                            dropdownHandle={true} // open close arrow icon show hide
                            selectedOptionColor="var(--border-box-blue)"
                            selectedOptionBorderColor="var(--border-box-blue)"
                            error={medicalHistoryFormError.lifestyle}
                        />


                    </Col>

                    <Col md={6} className='mt-md-3 mt-2'>
                        <RadioButtonGroup
                            label="How often do you exercise?"
                            name="exercise"
                            value={FormData.exercise || 'never'}
                            onChange={(e) => handleChange(e)}
                            required={true}
                            error={medicalHistoryFormError.exercise}
                            options={[
                                { label: "Never", value: "Never" },
                                { label: "Rarely", value: "Rarely" },
                                { label: "Regularly", value: "Regularly" },
                            ]}
                        />

                    </Col>
                    <Col md={6} className='mt-md-3 mt-2'>
                        <RadioButtonGroup
                            label="How would you rate your stress levels?"
                            name="stress"
                            value={FormData.stress || 'Low'}
                            onChange={(e) => handleChange(e)}
                            required={true}
                            error={medicalHistoryFormError.stress}
                            options={[
                                { label: "Low", value: "Low" },
                                { label: "Moderate", value: "Moderate" },
                                { label: "High", value: "High" },
                            ]}
                        />

                    </Col>
                    <div className='d-flex gap-3 mt-3'>

                        <Button className="w-100" variant="outline" disabled={false} onClick={() => { setAddPartner(false); setEditMedicalHistory(false) }}>
                            Cancel
                        </Button>

                        <Button className="w-100" variant="default" disabled={false} type="submit" onClick={handleSubmit}>
                            Save
                        </Button>
                    </div>

                </Row>
            </form >

        </>
    )
}

export function PhysicalAssessment({
    formError,
    setFormError,
    formData,
    setFormData,
    setShowContent,
    setShowPartnerDetail,
    setShowData, showData }:
    {
        formError?: any,
        setFormError?: any,
        formData: FertilityAssessmentType | PhysicalAssessmentDataModel,
        setFormData: React.Dispatch<React.SetStateAction<FertilityAssessmentType | PhysicalAssessmentDataModel | any>>,
        setShowContent?: (value: boolean) => void,
        setShowPartnerDetail?:
        (value: boolean) => void, setShowData: (value: any) => void, showData: any
    }) {

    type FormError = Partial<Record<keyof FertilityAssessmentType, string>>;

    const initialFormError: FormError = {};
    // const [formError, setFormError] = useState<FormError>(initialFormError);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
        setFormError((prev: any) => ({ ...prev, [name]: "" }));
    };

    return (
        <>
            <form >
                <Row className="g-3 accordion-form-physical-assessment">
                    <Col md={6}>
                        <InputFieldGroup
                            label="Height"
                            name="height"
                            type="text"
                            className='setting-password-input'
                            value={formData.height}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const newValue = e.target.value;

                                // Allow only digits, single quote, double quote
                                if (/^[0-9'"]*$/.test(newValue)) {
                                    handleChange(e);
                                }
                            }}
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => { }}
                            placeholder="Enter height (in)"
                            required={true}
                            disabled={false}
                            readOnly={false}
                            error={formError.height}
                        />
                    </Col>
                    <Col md={6}>
                        <InputFieldGroup
                            label="Weight"
                            name="weight"
                            type="number"

                            value={formData.weight}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleChange(e);

                            }}
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => { }}
                            placeholder="Enter weight(kg)"
                            required={true}
                            disabled={false}
                            readOnly={false}
                            error={formError.weight}
                        />
                    </Col>

                    <Col md={6}>

                        <InputFieldGroup
                            label="BMI"
                            name="bmi"
                            type="number"

                            value={formData.bmi}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleChange(e);

                            }}
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => { }}
                            placeholder="Enter BMI"
                            required={true}
                            disabled={false}
                            readOnly={false}
                            error={formError.bmi}
                        />
                    </Col>
                    <Col md={6}>
                        <InputSelect
                            label="Blood Group"
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                handleChange(e);
                            }}
                            onBlur={(e: React.FocusEvent<HTMLSelectElement>) => { }}
                            required={true}
                            disabled={false}
                            error={formError.bloodGroup}
                            placeholder="Select Blood Group"
                            // helperText="Select doctor"
                            options={[
                                { id: "1", value: "A+", label: "A+" },
                                { id: "2", value: "A-", label: "A-" },
                                { id: "3", value: "B+", label: "B+" },
                                { id: "4", value: "B-", label: "B-" },
                                { id: "5", value: "AB+", label: "AB+" },
                                { id: "6", value: "AB-", label: "AB-" },
                                { id: "7", value: "O+", label: "O+" },
                                { id: "8", value: "O-", label: "O-" },
                            ]}
                        />

                    </Col>

                    <Col md={5} className='input-custom-width'>
                        <InputFieldGroup
                            label="Blood Pressure"
                            name="systolic"
                            type="number"

                            placeholder="Systolic(mmHg)"
                            required={true}
                            disabled={false}
                            readOnly={false}
                            value={formData.systolic}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleChange(e);

                            }}
                            error={formError.systolic}
                        />
                    </Col>

                    <Col md={1} className={formError.systolic ? "or-custom-width d-flex justify-content-center align-items-center mt-4" : "or-custom-width d-flex justify-content-center align-items-center mt-5 "}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="28" viewBox="0 0 10 28" fill="none">
                            <path d="M9.45417 0.843998L2.92617 27.7H0.23817L6.74217 0.843998H9.45417Z" fill="#3E4A57" />
                        </svg>

                    </Col>

                    <Col md={5} className='input-custom-width'>
                        <InputFieldGroup
                            label="" // No label here to match the design
                            name="diastolic"
                            type="number"
                            className="input-custom-data"
                            placeholder="Diastolic(mmHg)"
                            required={false}
                            disabled={false}
                            readOnly={false}
                            value={formData.diastolic}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleChange(e);

                            }}
                            error={formError.diastolic}

                        />
                    </Col>

                    <Col md={12}>

                        <InputFieldGroup
                            label="Heart Rate"
                            name="heartRate"
                            type="number"
                            value={formData.heartRate}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleChange(e);

                            }}
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => { }}
                            placeholder="Enter Rate(bpm)"
                            required={true}
                            disabled={false}
                            readOnly={false}
                            error={formError.heartRate}
                        />
                    </Col>
                </Row>
            </form>
        </>
    )
}

export function FertilityAssessment({
    setShowContent,
    setShowPartnerDetail, setShowData,
    showData, initialData,
    formData, setFormData,
    setFormError,
    formError
}: {
    setShowContent?: (value: boolean) => void,
    setShowPartnerDetail?: (value: boolean) => void,
    setShowData?: (value: any) => void,
    showData?: any,
    initialData?: any,
    formData: EditFertilityAssessment,
    setFormData: React.Dispatch<React.SetStateAction<FertilityAssessmentType | EditFertilityAssessment | any>>,
    setFormError: React.Dispatch<React.SetStateAction<any>>,
    formError?: any
}) {

    // type FormError = Partial<Record<keyof FertilityAssessmentType, string>>;

    // const initialFormError: FormError = {};

    // const [formError, setFormError] = useState<FormError>(initialFormError);

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setFormData((prev: any) => {
            switch (name) {

                case "semenAnalysis":
                    return {
                        ...prev,
                        semenAnalysis: {
                            ...prev.semenAnalysis,
                            status: value.charAt(0).toUpperCase() + value.slice(1)
                        }
                    };

                case "fertilityIssues":
                    return {
                        ...prev,
                        fertilityIssues: {
                            ...prev.fertilityIssues,
                            status: value.charAt(0).toUpperCase() + value.slice(1)
                        }
                    };

                case "fertilityTreatment":
                    return {
                        ...prev,
                        fertilityTreatments: {
                            ...prev.fertilityTreatments,
                            status: value.charAt(0).toUpperCase() + value.slice(1)
                        }
                    };

                case "surgeries":
                    return {
                        ...prev,
                        surgeries: {
                            ...prev.surgeries,
                            status: value.charAt(0).toUpperCase() + value.slice(1)
                        }
                    };

                case "semenAnalysisContent":
                    return {
                        ...prev,
                        semenAnalysis: {
                            ...prev.semenAnalysis,
                            semenAnalysisDetails: value
                        }
                    };

                case "fertilityIssuesContent":
                    return {
                        ...prev,
                        fertilityIssues: {
                            ...prev.fertilityIssues,
                            fertilityIssuesDetails: value
                        }
                    };

                case "fertilityTreatmentContent":
                    return {
                        ...prev,
                        fertilityTreatments: {
                            ...prev.fertilityTreatments,
                            fertilityTreatmentsDetails: value
                        }
                    };

                case "surgeriesContent":
                    return {
                        ...prev,
                        surgeries: {
                            ...prev.surgeries,
                            surgeriesDetails: value
                        }
                    };

                default:
                    return prev;
            }
        });

        setFormError((prev: any) => ({ ...prev, [name]: "" }));
    };


    const handleSubmitData = (e: React.FormEvent) => {
        console.log(formData);
    };
    console.log("showData", showData)

    return (
        <>
            <form onClick={handleSubmitData}>
                <Row className='g-md-3 g-2'>
                    <Col md={12} >
                        <RadioButtonGroup
                            label="Have you ever had a semen analysis?"
                            name="semenAnalysis"
                            value={formData.semenAnalysis.status?.toString().toLowerCase() || "yes"}
                            onChange={handleChange}
                            required={true}
                            error={formError.semenAnalysis}
                            options={[
                                { label: "Yes", value: "yes" },
                                { label: "No", value: "no" },
                            ]}
                        />


                        {formData?.semenAnalysis?.status?.toString().toLowerCase() === 'yes' && (
                            <InputFieldGroup
                                type="text"
                                value={formData.semenAnalysis.semenAnalysisDetails}
                                name='semenAnalysisContent'
                                onChange={handleChange}
                                error={formError.semenAnalysisDetails}
                                placeholder="If yes, provide details"
                                className="mt-2"
                            />
                        )}


                    </Col>
                    <Col md={12} >
                        <RadioButtonGroup
                            label="Have you experienced any fertility issues?"
                            name="fertilityIssues"
                            // value={formData.semenAnalysis.status?.toString().toLowerCase() || "yes"}
                            value={String(formData?.fertilityIssues?.status?.toString().toLowerCase() || "yes")}
                            onChange={(e) => handleChange(e)}
                            required={true}
                            error={formError.fertilityIssues}
                            options={[
                                { label: "Yes", value: "yes" },
                                { label: "No", value: "no" },
                            ]}
                        />

                        {formData.fertilityIssues.status?.toString().toLowerCase() === 'yes' && (
                            <InputFieldGroup
                                type="text"
                                value={formData.fertilityIssues.fertilityIssuesDetails}
                                name='fertilityIssuesContent'
                                onChange={handleChange}
                                error={formError.semenAnalysisContent}

                                placeholder="If yes, provide details if available"

                                className={`mt-2`}
                            >

                            </InputFieldGroup>
                        )}

                    </Col>
                    <Col md={12} >
                        <RadioButtonGroup
                            label="Have you previously undergone fertility treatments?"
                            name="fertilityTreatment"
                            value={
                                typeof formData?.fertilityTreatments?.status === "boolean"
                                    ? formData.fertilityTreatments.status ? "yes" : "no"
                                    : formData?.fertilityTreatments?.status?.toString().toLowerCase() || "no"
                            }
                            onChange={handleChange}
                            required={true}
                            error={formError.fertilityTreatment}
                            options={[
                                { label: "Yes", value: "yes" },
                                { label: "No", value: "no" },
                            ]}
                        />


                        {formData?.fertilityTreatments?.status?.toString().toLowerCase() === "yes" && (
                            <InputFieldGroup
                                type="text"
                                value={formData.fertilityTreatments.fertilityTreatmentsDetails}
                                name='fertilityTreatmentContent'
                                onChange={handleChange}
                                error={formError.fertilityTreatmentContent}

                                placeholder="If yes, provide details if available"

                                className={`mt-2`}
                            >

                            </InputFieldGroup>
                        )}

                    </Col>
                    <Col md={12} >
                        <RadioButtonGroup
                            label="Any history of surgeries?"
                            name="surgeries"
                            // value={
                            //     typeof formData?.fertilityTreatments?.status === "boolean"
                            //         ? formData.fertilityTreatments.status ? "yes" : "no"
                            //         : formData?.fertilityTreatments?.status?.toString().toLowerCase() || "no"
                            // }
                            value={
                                typeof formData.surgeries.status === "boolean"
                                    ? formData.surgeries.status ? "yes" : "no"
                                    : formData.surgeries.status?.toLowerCase() || ""
                            }

                            onChange={(e) => handleChange(e)}
                            required={true}
                            error={formError.surgeries}
                            options={[
                                { label: "Yes", value: "yes" },
                                { label: "No", value: "no" },
                            ]}
                        />

                        {formData.surgeries.status?.toString().toLowerCase() === "yes" && (
                            <InputFieldGroup
                                type="text"
                                value={formData.surgeries.surgeriesDetails || ""}
                                name='surgeriesContent'
                                onChange={handleChange}
                                error={formError.surgeriesContent}

                                placeholder="If yes, provide details if available"

                                className={`mt-2`}
                            >

                            </InputFieldGroup>
                        )}
                    </Col>
                </Row>
            </form>
        </>
    )
}