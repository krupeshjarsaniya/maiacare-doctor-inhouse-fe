"use client";

import { ChangeEvent, useState } from "react";
import { Accordion, Col, Row } from "react-bootstrap";
import { InputSelect } from "../ui/InputSelect";
import { DatePickerFieldGroup } from "../ui/CustomDatePicker";
import { RadioButtonGroup } from "../ui/RadioField";
import { InputFieldGroup } from "../ui/InputField";
import Button from "../ui/Button";
import toast from 'react-hot-toast';
import { BsInfoCircle } from 'react-icons/bs';
import { FertilityAssessmentFormType,  } from "@/utils/types/interfaces";


interface FertilityAssessmentFormProps {
    setShowFertilityAssessment?: React.Dispatch<React.SetStateAction<boolean>>;
    setModalFormFertilityData?: React.Dispatch<React.SetStateAction<FertilityAssessmentFormType>>;
    editFertilityAssessment?: FertilityAssessmentFormType;
     handleSaveFertilityAssessment?: (data: FertilityAssessmentFormType) => void; // ✅ Add this
}

export const FertilityAssessmentForm = ({
    setShowFertilityAssessment,
    setModalFormFertilityData,
    editFertilityAssessment,
        handleSaveFertilityAssessment, // ✅ Add this,
}: FertilityAssessmentFormProps) => {

    type FormError = Partial<Record<keyof FertilityAssessmentFormType, string>>;
    const initialFormError: FormError = {};

    const initialFormData: FertilityAssessmentFormType = {
        ageAtFirstMenstruation: editFertilityAssessment?.ageAtFirstMenstruation || "",
        cycleLength: editFertilityAssessment?.cycleLength || "",
        periodLength: editFertilityAssessment?.periodLength || "",
        date: editFertilityAssessment?.date || "",
        isCycleRegular: editFertilityAssessment?.isCycleRegular || "Regular",
        menstrualIssues: editFertilityAssessment?.menstrualIssues || "yes",
        pregnancy: editFertilityAssessment?.pregnancy || "yes",
        timeduration: editFertilityAssessment?.timeduration || "",
        ectopicpregnancy: editFertilityAssessment?.ectopicpregnancy || "yes"

    };

    const [formData, setFormData] = useState<FertilityAssessmentFormType>(initialFormData);
    const [formError, setFormError] = useState<FormError>(initialFormError);
    const validateForm = (data: FertilityAssessmentFormType): FormError => {
        const errors: FormError = {};

        if (!data.ageAtFirstMenstruation.trim()) errors.ageAtFirstMenstruation = "Age at first menstruation is required";
        if (!data.cycleLength.trim()) errors.cycleLength = "Cycle length is required";
        if (!data.periodLength.trim()) errors.periodLength = "Period length is required";
        if (!data.date) errors.date = "Date is required";
        if (!data.isCycleRegular) errors.isCycleRegular = "Is cycle regular is required";
        if (!data.menstrualIssues) errors.menstrualIssues = "Menstrual issues is required";
        if (!data.pregnancy) errors.pregnancy = "Pregnancy is required";
        if (!data.timeduration) errors.timeduration = "Duration is required";
        if (!data.ectopicpregnancy) errors.ectopicpregnancy = "Ectopic pregnancy is required";

        return errors;
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
        setFormError((prev: any) => ({ ...prev, [name]: "" }));
    };

    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();

    //     const errors = validateForm(formData);
    //     setFormError(errors);
    //     console.log("errors", errors);
    //     if (Object.keys(errors).length === 0) {
    //         //   setShowModal(true);
    //         setModalFormFertilityData?.(formData);
    //         setShowFertilityAssessment?.(false);
    //         setFormError(initialFormError);

    //         if (editFertilityAssessment && editFertilityAssessment.ageAtFirstMenstruation) {
    //             toast.success('Changes saved successfully', {
    //                 icon: <BsInfoCircle size={22} color="white" />,
    //             });
    //         } else {
    //             toast.success('Fertility assessment added successfully', {
    //                 icon: <BsInfoCircle size={22} color="white" />,
    //             });
    //         }
    //     }
    // };
   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const errors = validateForm(formData);
        setFormError(errors);

        if (Object.keys(errors).length === 0) {
            if (handleSaveFertilityAssessment) {
                // ✅ Call API handler from parent
                handleSaveFertilityAssessment(formData);
            } else {
                // fallback: update local state
                setModalFormFertilityData?.(formData);
                setShowFertilityAssessment?.(false);
            }

            setFormError(initialFormError);

            if (editFertilityAssessment && editFertilityAssessment.ageAtFirstMenstruation) {
                toast.success('Changes saved successfully');
            } else {
                toast.success('Fertility assessment added successfully');
            }
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0" className="fertilitiy-assement-accodion-item mb-3">
                        <Accordion.Header>
                            <div className="fertilitiy-assement-accodion-title">
                                Menstrual Cycle
                            </div>
                        </Accordion.Header>
                        <Accordion.Body className="custom-accordion-body">
                            <Row className="g-md-3 g-1">
                                <Col md={6}>
                                    <InputSelect
                                        label="Age at first menstruation"
                                        name="ageAtFirstMenstruation"
                                        value={formData.ageAtFirstMenstruation}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            handleChange(e);
                                        }}
                                        error={formError.ageAtFirstMenstruation}
                                        onBlur={() => { }}
                                        required
                                        disabled={false}
                                        placeholder="Select Age"
                                        options={[{ id: "1", value: "1", label: "1" }, { id: "2", value: "2", label: "2" } /* ... */]}
                                    />
                                </Col>

                                <Col md={6}>
                                    <InputSelect
                                        label="Cycle Length"
                                        name="cycleLength"
                                        value={formData.cycleLength}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            handleChange(e);
                                        }}
                                        error={formError.cycleLength}
                                        onBlur={() => { }}
                                        required
                                        disabled={false}
                                        placeholder="Select Cycle Length"
                                        options={[{ id: "1", value: "1", label: "1" }, { id: "2", value: "2", label: "2" } /* ... */]}
                                    />
                                </Col>

                                <Col md={6}>
                                    <InputSelect
                                        label="Period Length"
                                        name="periodLength"
                                        value={formData.periodLength}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            handleChange(e);
                                        }}
                                        error={formError.periodLength}
                                        onBlur={() => { }}
                                        required
                                        disabled={false}
                                        placeholder="Select Period Length"
                                        options={[{ id: "1", value: "1", label: "1" }, { id: "2", value: "2", label: "2" } /* ... */]}
                                    />
                                </Col>

                                <Col md={6}>
                                    <DatePickerFieldGroup
                                        label="Last Period Date"
                                        name="date"
                                        value={formData.date}
                                        placeholder="Enter last period date"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            handleChange(e);
                                        }}
                                        error={formError.date}
                                        onBlur={() => { }}
                                        required
                                        disabled={false}
                                        helperText=""
                                        max={new Date().toISOString().split("T")[0]} // future date is disabled
                                    />
                                </Col>

                                <Col md={12}>
                                    <RadioButtonGroup
                                        label="Is your cycle regular?"
                                        name="isCycleRegular"
                                        value={formData.isCycleRegular || 'Regular'}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Regular", value: "Regular" },
                                            { label: "Sometimes Irregular", value: "Sometimes Irregular" },
                                            { label: "Irregular", value: "Irregular" }
                                        ]}
                                    />

                                    <RadioButtonGroup
                                        label="Do you experience menstrual issues?"
                                        name="menstrualIssues"
                                        className="mt-2"
                                        value={formData.menstrualIssues || 'yes'}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Yes", value: "yes" },
                                            { label: "No", value: "no" }
                                        ]}
                                    />
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="1" className="fertilitiy-assement-accodion-item" >
                        <Accordion.Header>
                            <div className="fertilitiy-assement-accodion-title">
                                Pregnancy
                            </div>
                        </Accordion.Header>
                        <Accordion.Body className="custom-accordion-body">
                            <Row className="g-md-3 g-2">
                                <Col md={12}>
                                    <RadioButtonGroup
                                        label="Have you been pregnant before?"
                                        name="pregnancy"
                                        className="mt-2"
                                        value={formData.pregnancy || 'yes'}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Yes", value: "yes" },
                                            { label: "No", value: "no" }
                                        ]}
                                    />
                                </Col>
                                <Col md={12}>
                                    <InputFieldGroup
                                        label="How long have you been trying to conceive?"
                                        name="timeduration"
                                        type="text"

                                        placeholder="Enter Duration"
                                        required
                                        disabled={false}
                                        readOnly={false}
                                        value={formData.timeduration}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            handleChange(e);
                                        }}
                                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => { }}
                                        error={formError.timeduration}
                                    />
                                </Col>
                                <Col md={12}>
                                    <RadioButtonGroup
                                        label="Any history of miscarriage or ectopic pregnancy?"
                                        name="ectopicpregnancy"
                                        value={formData.ectopicpregnancy || 'yes'}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Yes", value: "yes" },
                                            { label: "No", value: "no" }
                                        ]}
                                    />
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                {/* Submit buttons */}
                <div className='d-flex gap-3 mt-3'>
                    <Button className="w-100" variant="outline" type="button" onClick={() => {
                        setShowFertilityAssessment?.(false); setFormData(initialFormData);
                    }}>
                        Cancel
                    </Button>
                    <Button className="w-100" variant="default" type="submit">
                        Save
                    </Button>
                </div>

            </form>

        </>
    )
}
