import React, { ChangeEvent, FormEvent, useState } from 'react'
import { RadioButtonGroup } from '../ui/RadioField'
import { InputFieldGroup } from '../ui/InputField';
import { InputSelectMultiSelect } from '../ui/InputSelect';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from '../ui/Button';
import { BsInfoCircle } from 'react-icons/bs';
import toast from 'react-hot-toast';
import { MedicalHistoryType } from '@/utils/types/interfaces';

interface MedicalHistoryProps {
    setMedicalHistoryFormData: any;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    initialData?: any;
    onClose?: () => void;
    handleSaveMedicalHistory?: (data: MedicalHistoryType) => Promise<void>;
}

export default function MedicalHistory({
    setMedicalHistoryFormData,
    setShowModal,
    initialData,
    handleSaveMedicalHistory,
    onClose
}: MedicalHistoryProps) {

    type FormError = Partial<Record<keyof MedicalHistoryType, string>>;

    const initialFormData: MedicalHistoryType = {
        medication: initialData?.medication || "no",
        surgeries: initialData?.surgeries || "yes",
        surgeriesContent: initialData?.surgeriescontent || "",
        medicalCondition: initialData?.medicalCondition || [],
        familyMedicalHistory: initialData?.familyMedicalHistory || "",
        lifestyle: initialData?.lifestyle || [],

        // FIXED ENUM VALUES (backend requires capitalized)
        stress: initialData?.stress || "High",
        exercise: initialData?.exercise || "Rarely",

        medicationcontent: initialData?.medicationcontent || "",
        surgeriescontent: initialData?.surgeriescontent || "",
    };

    const initialFormError: FormError = {};
    const [formData, setFormData] = useState<MedicalHistoryType>(initialFormData);
    const [formError, setFormError] = useState<FormError>(initialFormError);

    const validateForm = (data: MedicalHistoryType): FormError => {
        const errors: FormError = {};

        if (data.medication === 'yes' && !data.medicationcontent.trim())
            errors.medicationcontent = "Medication Content is required";

        if (data.surgeries === 'yes' && !data.surgeriescontent.trim())
            errors.surgeriescontent = "Surgeries Content is required";

        if (!data.medicalCondition?.length)
            errors.medicalCondition = "Medical Condition is required";

        if (!data.lifestyle?.length)
            errors.lifestyle = "Lifestyle is required";

        if (!data.stress.trim())
            errors.stress = "Stress Level is required";

        return errors;
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormError((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const errors = validateForm(formData);
        setFormError(errors);

        if (Object.keys(errors).length === 0) {
            console.log("formData", formData);
            
            try {
                if (handleSaveMedicalHistory) {
                    await handleSaveMedicalHistory(formData);
                }

                toast.success(
                    initialData ? "Changes saved successfully" : "Medical history added successfully",
                    { icon: <BsInfoCircle size={22} color="white" /> }
                );

                setShowModal(false);
                if (onClose) onClose();
            } catch (err) {
                console.error("API error:", err);
                toast.error("Failed to save medical history");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Row className='g-md-2 g-1'>

                {/* Medication */}
                <Col md={12}>
                    <RadioButtonGroup
                        label="Are you currently taking any medications?"
                        name="medication"
                        value={formData.medication}
                        onChange={handleChange}
                        required={true}
                        error={formError.medication}
                        options={[
                            { label: "Yes", value: "yes" },
                            { label: "No", value: "no" },
                        ]}
                    />

                    {formData.medication === 'yes' && (
                        <InputFieldGroup
                            type="text"
                            value={formData.medicationcontent}
                            name='medicationcontent'
                            onChange={handleChange}
                            error={formError.medicationcontent}
                            placeholder="Enter medication"
                            className='mt-md-3 mt-2'
                        />
                    )}
                </Col>

                {/* Surgeries */}
                <Col md={12} className='mt-md-3 mt-2'>
                    <RadioButtonGroup
                        label="Have you had any surgeries?"
                        name="surgeries"
                        value={formData.surgeries}
                        onChange={handleChange}
                        required={true}
                        error={formError.surgeries}
                        options={[
                            { label: "Yes", value: "yes" },
                            { label: "No", value: "no" },
                        ]}
                    />

                    {formData.surgeries === 'yes' && (
                        <InputFieldGroup
                            type="text"
                            value={formData.surgeriescontent}
                            name='surgeriescontent'
                            onChange={handleChange}
                            error={formError.surgeriescontent}
                            placeholder="Enter surgeries"
                            className='mt-md-3 mt-2'
                        />
                    )}
                </Col>

                {/* Medical Conditions */}
                <Col md={12} className='mt-md-3 mt-2'>
                    <InputSelectMultiSelect
                        label="Do you have any medical condition?"
                        name="medicalCondition"
                        values={formData.medicalCondition}
                        onChange={(values) => {
                            setFormData(prev => ({ ...prev, medicalCondition: values }));
                            setFormError(prev => ({ ...prev, medicalCondition: "" }));
                        }}
                        options={[
                            { id: "1", value: "PCOS", label: "PCOS" },
                            { id: "2", value: "Thyroid Disorder", label: "Thyroid Disorder" },
                            { id: "3", value: "Diabetes", label: "Diabetes" },
                            { id: "4", value: "Hypertension", label: "Hypertension" },
                        ]}
                        placeholder="Search Medical Condition or Allergies"
                        addPlaceholder="Add Medical Condition or Allergies"
                        required={true}
                        selectedOptionColor="var(--border-box)"
                        selectedOptionBorderColor="var(--border-box)"
                        error={formError.medicalCondition}
                    />
                </Col>

                {/* Family History */}
                <Col md={12} className='mt-md-3 mt-2'>
                    <InputFieldGroup
                        label="Family Medical History"
                        name="familyMedicalHistory"
                        value={formData.familyMedicalHistory}
                        onChange={handleChange}
                        placeholder="Enter family medical history"
                        error={formError.familyMedicalHistory}
                    />
                </Col>

                {/* Lifestyle */}
                <Col md={12} className='mt-md-3 mt-2'>
                    <InputSelectMultiSelect
                        label="Lifestyle"
                        name="lifestyle"
                        values={formData.lifestyle}
                        onChange={(values) => {
                            setFormData(prev => ({ ...prev, lifestyle: values }));
                            setFormError(prev => ({ ...prev, lifestyle: "" }));
                        }}
                        options={[
                            { id: "1", value: "Non-smoker", label: "Non-smoker" },
                            { id: "2", value: "Occasional alcohol", label: "Occasional alcohol" },
                            { id: "3", value: "Vegetarian diet", label: "Vegetarian diet" },
                        ]}
                        placeholder="Select Lifestyle"
                        addPlaceholder="Add Lifestyle"
                        required={true}
                        selectedOptionColor="var(--border-box-blue)"
                        selectedOptionBorderColor="var(--border-box-blue)"
                        error={formError.lifestyle}
                    />
                </Col>

                {/* Exercise (ENUM FIXED) */}
                <Col lg={6} className='mt-md-3 mt-2'>
                    <RadioButtonGroup
                        label="How often do you exercise?"
                        name="exercise"
                        value={formData.exercise}
                        onChange={handleChange}
                        required={true}
                        error={formError.exercise}
                        options={[
                            { label: "Never", value: "Never" },
                            { label: "Rarely", value: "Rarely" },
                            { label: "Regularly", value: "Regularly" },
                        ]}
                    />
                </Col>

                {/* Stress (ENUM FIXED) */}
                <Col lg={6} className='mt-md-3 mt-2'>
                    <RadioButtonGroup
                        label="How would you rate your stress levels?"
                        name="stress"
                        value={formData.stress}
                        onChange={handleChange}
                        required={true}
                        error={formError.stress}
                        options={[
                            { label: "Low", value: "Low" },
                            { label: "Moderate", value: "Moderate" },
                            { label: "High", value: "High" },
                        ]}
                    />
                </Col>

                {/* Buttons */}
                <div className='d-flex gap-3 mt-3'>
                    <Button className="w-100" variant="outline" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button className="w-100" variant="default" type="submit">
                        Save
                    </Button>
                </div>

            </Row>
        </form>
    );
}
