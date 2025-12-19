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
import { FertilityAssessmentFormType } from "@/utils/types/interfaces";


interface FertilityAssessmentFormProps {
    setShowFertilityAssessment?: React.Dispatch<React.SetStateAction<boolean>>;
    setModalFormFertilityData?: React.Dispatch<React.SetStateAction<FertilityAssessmentFormType>>;
    editFertilityAssessment?: FertilityAssessmentFormType | any;
    handleSaveFertilityAssessment?: (data: FertilityAssessmentFormType) => void; // ✅ Add this
}

export const FertilityAssessmentForm = ({
    setShowFertilityAssessment,
    setModalFormFertilityData,
    editFertilityAssessment,
    handleSaveFertilityAssessment, // ✅ Add this,
}: FertilityAssessmentFormProps) => {
    function formatDate(isoDate: string): string {
        const date = new Date(isoDate);

        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const year = date.getUTCFullYear();

        return `${day}-${month}-${year}`;
    }

    function formatForDateInput(isoDate: string): string {
        if (!isoDate) return "";
        return isoDate.split("T")[0]; // yyyy-mm-dd
    }



    type FormError = Partial<Record<keyof FertilityAssessmentFormType, string>>;
    const initialFormError: FormError = {};

    const initialFormData: FertilityAssessmentFormType = {
        ageAtFirstMenstruation: editFertilityAssessment?.menstrualCycle?.ageAtFirstMenstruation || "",
        cycleLength: editFertilityAssessment?.menstrualCycle?.cycleLength || "",
        periodLength: editFertilityAssessment?.menstrualCycle?.periodLength || "",
        date: editFertilityAssessment?.menstrualCycle?.lastPeriodDate || "",
        isCycleRegular: editFertilityAssessment?.menstrualCycle?.isCycleRegular || "Regular",
        menstrualIssues: editFertilityAssessment?.menstrualCycle?.menstrualIssues?.toLowerCase() || "yes",
        menstrualIssuesDetails: editFertilityAssessment?.menstrualCycle?.menstrualIssuesDetails || "",
        pregnancy: editFertilityAssessment?.pregnancy?.pregnantBefore?.toLowerCase() || "yes",
        pregnantBeforeDetails: editFertilityAssessment?.pregnancy?.pregnantBeforeDetails,
        timeduration: editFertilityAssessment?.pregnancy?.tryingToConceiveDuration || "",
        ectopicpregnancy: editFertilityAssessment?.pregnancy?.miscarriageOrEctopicHistory?.toLowerCase() || "yes",
        miscarriageOrEctopicDetails: editFertilityAssessment?.pregnancy?.miscarriageOrEctopicDetails
    };

    console.log("editFertilityAssessment", editFertilityAssessment);
    const [formData, setFormData] = useState<FertilityAssessmentFormType>(initialFormData);
    const [formError, setFormError] = useState<FormError>(initialFormError);
    const validateForm = (data: FertilityAssessmentFormType): FormError => {
        const errors: FormError = {};
        console.log("data", data);

        if (!data.ageAtFirstMenstruation) errors.ageAtFirstMenstruation = "Age at first menstruation is required";
        if (!data.menstrualIssuesDetails) errors.menstrualIssuesDetails = "Mesnstrual Issues Details is required";
        if (!data.pregnantBeforeDetails) errors.pregnantBeforeDetails = "Pregnant Before Details is required";
        if (!data.miscarriageOrEctopicDetails) errors.miscarriageOrEctopicDetails = "miscarriage or ectopic pregnancy Details is required";
        if (!data.cycleLength) errors.cycleLength = "Cycle length is required";
        if (!data.periodLength) errors.periodLength = "Period length is required";
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
                                        value={formatForDateInput(formData.date)}
                                        className="edit-profile-field-placeholder edit-profile-field"
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

                                    {/* {formData.medication === 'yes' && (
                        <InputFieldGroup
                            type="text"
                            value={formData.medicationcontent}
                            name='medicationcontent'
                            onChange={handleChange}
                            error={formError.medicationcontent}
                            placeholder="Enter medication"
                            className='mt-md-3 mt-2'
                        />
                    )} */}

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

                                    {formData.menstrualIssues == "yes" && (
                                        <InputFieldGroup
                                            type="text"
                                            value={formData.menstrualIssuesDetails}
                                            name='menstrualIssuesDetails'
                                            onChange={handleChange}
                                            error={formError.menstrualIssuesDetails}
                                            placeholder="Enter Menstrual Issues"
                                            className='mt-md-3 mt-2'
                                        />
                                    )}
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
                                    {formData.pregnancy == "yes" && (
                                        <InputFieldGroup
                                            type="text"
                                            value={formData.pregnantBeforeDetails}
                                            name='pregnantBeforeDetails'
                                            onChange={handleChange}
                                            error={formError.pregnantBeforeDetails}
                                            placeholder="Enter Pregnant Details"
                                            className='mt-md-3 mt-2'
                                        />
                                    )}
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

                                    {formData.ectopicpregnancy == "yes" && (
                                        <InputFieldGroup
                                            type="text"
                                            value={formData.miscarriageOrEctopicDetails}
                                            name='miscarriageOrEctopicDetails'
                                            onChange={handleChange}
                                            error={formError.miscarriageOrEctopicDetails}
                                            placeholder="Enter miscarriage or ectopic pregnancy Details"
                                            className='mt-md-3 mt-2'
                                        />
                                    )}
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
