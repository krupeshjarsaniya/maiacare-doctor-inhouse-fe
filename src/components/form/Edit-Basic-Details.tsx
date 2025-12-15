"use client";
// import { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import Simpleeditpro from "../../assets/images/Simpleeditpro.png";
import Image from "next/image";
import cameraicon from "../../assets/images/Cameraicon.png";
import { InputFieldGroup } from "../ui/InputField";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { OptionType } from "@/utils/types/interfaces";
import { DatePickerFieldGroup } from "../ui/CustomDatePicker";
import { RadioButtonGroup } from "../ui/RadioField";
import Textarea from "../ui/Textarea";
import ContentContainer from "../ui/ContentContainer";
import { ArrowRight } from "lucide-react";
import Modal from "../ui/Modal";
// import Profiledoctor from "../../assets/images/Profile-doctor.png";
import LightTrush from "../../assets/images/LightTrush.png";
import ImageSquare from "../../assets/images/ImageSquare.png";
import EditProfile from "../../assets/images/Edit-Profile.png";
import Camera from "../../assets/images/Camera.png";
import { TimePickerFieldGroup } from "../ui/CustomTimePicker";
import { useSearchParams } from "next/navigation";
import { PhoneNumberInput } from "../ui/PhoneNumberInput";
import Button from "../ui/Button";
import { InputSelect } from "../ui/InputSelect";
import { getLoggedInUser, getLoginUser, getProfileImageUrl, update } from "@/utils/apis/apiHelper";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
export default function PersonalDetails({ onNext }: { onNext: () => void }) {
  // Personal Details
  interface FormError {
    [key: string]: string;
  }
  const initialFormError: FormError = {};
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState<FormError>(initialFormError);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [qualifications, setQualifications] = useState([
    { degree: "", field: "", university: "", startYear: "", endYear: "" }
  ]);
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState([
    { degree: "", field: "", university: "", startYear: "", endYear: "" },
  ]);


  type FormData = {
    Name: string;
    Specialty: string;
    Experience: string;
    date: string;
    gender: string; // default will be "female"
    Contact: string;
    Email: string;
    About: string;
    degree: string;
    field: string;
    university: string;
    startYear: string;
    endYear: string;
    MF: string;
    Time: string;
    SS: string;
    Timer: string;
    services: OptionType[];
    fees: string;
  };

  const initialFormData: FormData = {
    Name: "",
    Specialty: "",
    Experience: "",
    date: "",
    gender: "female", // default value
    Contact: "",
    Email: "",
    About: "",
    degree: "",
    field: "",
    university: "",
    startYear: "",
    endYear: "",
    MF: "",
    Time: "",
    SS: "",
    Timer: "",
    services: [],
    fees: "",
  };

  type Qualification = {
    degree: string;
    field: string;
    university: string;
    startYear: string;
    endYear: string;
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);

  // All Validatation  

  const validateForm = (data: FormData): FormError => {
    const errors: FormError = {};

    if (!data.Name.trim()) errors.Name = "Name is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.Email.trim()) {
      errors.Email = "Email is required";
    } else if (!emailRegex.test(data.Email)) {
      errors.Email = "Please enter a valid email";
    }

    if (!data.Specialty.trim()) errors.Specialty = "Speciality is required";
    if (!data.Experience.trim()) errors.Experience = "Experience is required";
    if (!data.date.trim()) errors.date = "DOB is required";
    if (!data.gender.trim()) errors.gender = "Gender is required";

    const contactRegex = /^[0-9]{12}$/;
    if (!data.Contact.trim()) {
      errors.Contact = "Contact number is required";
    } else if (!contactRegex.test(data.Contact)) {
      errors.Contact = "Please enter a valid 10-digit number";
    }

    if (!data.About.trim()) errors.About = "About is required";
    if (!data.services.length) errors.services = "services is required";
    if (!data.fees.trim()) errors.fees = "fees is required";
    // if (!data.degree.trim()) errors.degree = "Degree is required";
    // if (!data.field.trim()) errors.field = "Field is required";
    // if (!data.university.trim()) errors.university = "University is required";
    // if (!data.startYear.trim()) errors.startYear = "Start year is required";
    // if (!data.endYear.trim()) errors.endYear = "End year is required";


    // if (!data.MF.trim()) errors.MF = "Start time is required";
    // if (!data.SS.trim()) errors.SS = "Start time required";
    // if (!data.Time.trim()) errors.Time = "End Time is required";
    // if (!data.Timer.trim()) errors.Timer = "End Time is required";

    return errors;
  };

  // Add Qualifications validtation  
  const validateForm1 = (quals: typeof qualifications) => {
    const errors = quals.map((q) => ({
      degree: !q.degree ? "Degree is required" : "",
      field: !q.field ? "Field is required" : "",
      university: !q.university ? "University is required" : "",
      startYear: !q.startYear ? "Start Year is required" : "",
      endYear: !q.endYear ? "End Year is required " : "",
    }));
    return errors;
  };
  // const handleNextClick = () => {
  //   const errors = validateForm(formData);
  //   setFormError(errors);
  //   if (Object.keys(errors).length === 0) {
  //     onNext();
  //   } else {
  //     console.log("Form has errors:", errors);
  //   }
  // };

  const handleNextClick = async () => {
    const errors = validateForm(formData);
    const qualErrors = validateForm1(qualifications);

    console.log("errors", errors);
    console.log("qualErrors", qualErrors);

    setFormError(errors);
    setFormErrors(qualErrors);

    const hasQualError = qualErrors.some((err) =>
      Object.values(err).some((msg) => msg !== "")
    );

    if (Object.keys(errors).length === 0 && !hasQualError) {
      try {
        const payload = {
          name: formData.Name,
          specialty: formData.Specialty,
          yearsOfExperience: formData.Experience,
          dob: formData.date,
          gender: formData.gender,
          contactNumber: formData.Contact,
          email: formData.Email,
          about: formData.About,
          servicesOffered: formData.services.map((s) => s.value),
          fees: Number(formData.fees),
          profilePicture: selectedImage,

          qualifications: qualifications.map((q) => ({
            degree: q.degree,
            fieldOfStudy: q.field,
            university: q.university,
            startYear: Number(q.startYear),
            endYear: Number(q.endYear),
          })),

          // ⭐ REQUIRED BY BACKEND
          useCustomHours: false,
          groupOperationalHours: {
            weekdayOpen: formData.MF,
            weekdayClose: formData.Time,
            weekendOpen: formData.SS,
            weekendClose: formData.Timer,
          },
        };

        console.log("Sending payload", payload.contactNumber);

        const response = await update(payload);

        console.log("API response", response);

        if (response?.status === 200) {
          console.log("Profile updated successfully");
          onNext();
        } else {
          console.error("Failed to update profile", response);
        }
      } catch (error) {
        console.error("Error updating profile", error);
      }
    } else {
      console.log("Form has errors, cannot proceed");
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError((prev) => ({ ...prev, [name]: "" }));
  };


  // const handleQualificationChange = (index: number, field: string, value: string) => {
  //   const updated = [...qualifications];
  //   updated[index][field] = value;
  //   setQualifications(updated);
  // };

  // Add new qualification

  const handleAddQualification = () => {
    setQualifications([
      ...qualifications,
      { degree: "", field: "", university: "", startYear: "", endYear: "" }
    ]);
    setFormErrors([
      ...formErrors,
      { degree: "", field: "", university: "", startYear: "", endYear: "" },
    ]);
  };



  const yearOptions = Array.from({ length: 51 }, (_, i) => {
    const year = 2000 + i;
    return { id: year.toString(), value: year.toString(), label: year.toString() };
  });


  //********* EDIT PROFILE MODAL *********//
  const fileInputRef = useRef<HTMLInputElement>(null);  // file input programmatically open 
  const cameraInputRef = useRef<HTMLInputElement>(null); // camera image select 

  const [previewImage, setPreviewImage] = useState<string | null>(null);  //previewImage 
  const [selectedImage, setSelectedImage] = useState<string | null>(null);//selectedImage 

  const handleOpenModal = () => {
    setPreviewImage(selectedImage || Simpleeditpro.src); // show image in modal
    setShowModal(true);
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();   //Edit btn click in file chhose
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFile = event.target.files?.[0]; //previewImage chnages
  //   if (selectedFile) {
  //     const imageURL = URL.createObjectURL(selectedFile);
  //     setPreviewImage(imageURL);
  //   }
  // };


  //  modal open and seletc image jpg/png image allow 

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // ✅ 1. Only allow JPG and PNG
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setErrorMessage("Only JPG and PNG images are allowed.");
      setPreviewImage(null); // remove previous preview
      event.target.value = ""; // reset input
      return;
    }

    // ✅ 2. Max size 5MB check
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      setErrorMessage("File size must be less than 5MB.");
      setPreviewImage(null); // remove previous preview
      event.target.value = ""; // reset input
      return;
    }
    const passData = {
      type: "doctor",
      files: selectedFile
    }
    getProfileImageUrl(passData)
      .then((res) => {
        setSelectedImage(res.data.files[0]);
      })
      .catch((err) => {
        console.log(err);
      })

    // ✅ 3. If valid → set preview & clear error
    const imageURL = URL.createObjectURL(selectedFile);
    setPreviewImage(imageURL);
    setErrorMessage(""); // clear previous error
  };


  // camera image select 
  const handleFileCamera = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Allowed image types
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    // Max file size = 5MB
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    // Type validation
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Only JPG and PNG images are allowed.");
      setPreviewImage(null); // remove previous preview
      event.target.value = ""; // Reset input
      return;
    }

    // Size validation
    if (file.size > maxSize) {
      setErrorMessage("File size must be less than 5MB.");
      setPreviewImage(null); // remove previous preview
      event.target.value = ""; // Reset input
      return;
    }

    // ✅ If valid image
    setErrorMessage(""); // Clear error
    const imageURL = URL.createObjectURL(file);
    setPreviewImage(imageURL); // Show preview
  };


  const handleSave = () => {
    setSelectedImage(previewImage); // save modal preview to actual profile
    setShowModal(false);

  };



  const handleDelete = () => {
    setPreviewImage(null); // delete only in modal
  };
  //modal  image delete click in save btn click image set.
  useEffect(() => {
    if (showModal) {
      setPreviewImage(selectedImage);
    }
  }, [showModal]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);  // <-- START LOADING

        const response = await getLoggedInUser();
        const user = response?.data?.data;
        console.log("user", user);

        if (!user) {
          setLoading(false);
          return;
        }

        const firstQualification = user.qualifications?.[0] || {
          degree: "",
          fieldOfStudy: "",
          university: "",
          startYear: "",
          endYear: "",
        };

        setFormData((prev) => ({
          Name: user.name || "",
          Specialty: user.specialty || "",
          Experience: user.yearsOfExperience?.toString() || "",
          date: user.dob ? user.dob.split("T")[0] : "",
          gender: user.gender || "female",
          Contact: user.contactNumber || "",
          Email: user.email || "",
          About: user.about || "",
          fees: user.fees?.toString() || "",
          services: user.servicesOffered?.map((s: string) => ({
            id: s,
            value: s,
            label: s,
          })) || [],

          degree: firstQualification.degree || "",
          field: firstQualification.fieldOfStudy || "",
          university: firstQualification.university || "",
          startYear: firstQualification.startYear?.toString() || "",
          endYear: firstQualification.endYear?.toString() || "",

          MF: user.useCustomHours === false
            ? user.operationalHours?.[0]?.openTime || ""
            : prev.MF,

          Time: user.useCustomHours === false
            ? user.operationalHours?.[0]?.closeTime || ""
            : prev.Time,

          SS: user.useCustomHours === false
            ? user.operationalHours?.[5]?.openTime || ""
            : prev.SS,

          Timer: user.useCustomHours === false
            ? user.operationalHours?.[5]?.closeTime || ""
            : prev.Timer,
        }));

        setQualifications(
          user.qualifications?.map((q: any) => ({
            degree: q.degree || "",
            field: q.fieldOfStudy || "",
            university: q.university || "",
            startYear: q.startYear?.toString() || "",
            endYear: q.endYear?.toString() || "",
          })) || []
        );

        setFormErrors(
          user.qualifications?.map(() => ({
            degree: "",
            field: "",
            university: "",
            startYear: "",
            endYear: "",
          })) || []
        );

        setSelectedImage(user.profilePicture || null);

      } catch (err) {
        console.error("Error fetching user data", err);
      }

      setLoading(false);   // <-- END LOADING (VERY IMPORTANT)
    };

    fetchUserData();
  }, []);


  return (
    <div>
      <ContentContainer className="mt-3">
        <Row>
          <Col>
            {/* -------- TITLE SKELETON -------- */}
            {loading ? (
              <Skeleton width={140} height={22} className="mb-2" />
            ) : (
              <h5 className="profile-card-main-titile">Personal Details</h5>
            )}

            <div className="d-flex align-items-center gap-4 mt-3 flex-wrap justify-content-center justify-content-sm-start text-center text-md-start">

              {/* -------- PROFILE IMAGE SKELETON -------- */}
              <div className="profile-wrapper">

                {loading ? (
                  <>
                    {/* Profile image skeleton */}
                    <Skeleton width={160} height={160} circle />

                    {/* Camera icon skeleton */}
                    <Skeleton
                      width={44}
                      height={44}
                      circle
                      className="position-absolute"
                      style={{ bottom: "-10px", right: "-10px" }}
                    />
                  </>
                ) : (
                  <>
                    {/* Normal profile image */}
                    <img
                      src={selectedImage ? selectedImage : Simpleeditpro.src}
                      alt="Profile"
                      className="profile-image mt-1"
                      width={160}
                      height={160}
                    />

                    {/* Camera Icon */}
                    <div className="camera-icon" onClick={handleOpenModal}>
                      <Image src={cameraicon} alt="Upload" width={44} height={44} />
                    </div>
                  </>
                )}

              </div>

              {/* -------- RIGHT TEXT SKELETON -------- */}
              {loading ? (
                <div className="mt-2">
                  <Skeleton width={150} height={18} className="mb-2" />
                  <Skeleton width={120} height={14} />
                </div>
              ) : (
                <div>
                  <div className="fw-semibold">Add Profile Picture</div>
                  <div className="text-muted small">
                    Allowed Jpg, png of max size 5MB
                  </div>
                </div>
              )}

              {/* -------- MODAL (DO NOT SKELETON MODAL) -------- */}
              {!loading && (
                <Modal
                  show={showModal}
                  onHide={() => {
                    setShowModal(false);
                    setErrorMessage("");
                  }}
                  size="md"
                  header="Profile Photo"
                  closeButton={true}
                  className="text-pink"
                  dialogClassName="custom-modal-width"
                >

                  <div className="d-flex flex-column align-items-center">

                    <div className="rounded overflow-hidden mb-3 mx-auto position-relative edit-basic-details-modal">
                      <Image
                        src={previewImage ? previewImage : Simpleeditpro}
                        alt="Simpleeditpro"
                        width={160}
                        height={160}
                        className="edit-basic-details-image"
                      />
                    </div>

                    {errorMessage && (
                      <div className="text-danger mb-2 edit-basic-details-error-font">
                        {errorMessage}
                      </div>
                    )}

                    <div className="w-100 border-top pt-3 d-flex justify-content-between align-items-center flex-wrap">

                      <div className="d-flex gap-3 align-items-center flex-wrap">

                        {/* Add Photo Button */}
                        <div className="text-center edit-basic-details-edit-button" onClick={handleEditClick}>
                          <Image src={ImageSquare} alt="Add Photo" width={21} height={21} />
                          <div className="small">Add Photo</div>

                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="edit-basic-details-edit-input"
                          />
                        </div>

                        {/* Take Photo */}
                        <div className="text-center edit-basic-camera-icon">
                          <Image src={Camera} alt="Take Photo" width={21} height={21} onClick={openCamera} />
                          <div className="small">Take Photo</div>

                          <input
                            type="file"
                            accept="image/*"
                            capture="user"
                            ref={cameraInputRef}
                            className="edit-basic-details-edit-input"
                            onChange={handleFileCamera}
                          />
                        </div>
                      </div>

                      <div className="d-flex gap-3 mt-md-0 align-items-center">
                        <button className="btn p-0" onClick={handleDelete}>
                          <Image src={LightTrush} alt="Trash" width={21} height={21} />
                          <div className="maiacare-input-field-helper-text">Delete</div>
                        </button>

                        <Button variant="default" contentSize="small" onClick={handleSave}>
                          Save
                        </Button>
                      </div>

                    </div>
                  </div>

                </Modal>
              )}
            </div>
          </Col>

        </Row>

        <div>
          <Row className="g-3">

            {/* ---------- NAME FIELD ---------- */}
            <Col md={12}>
              {loading ? (
                <>
                  <Skeleton width={80} height={14} className="mb-2" />
                  <Skeleton width="100%" height={42} className="mb-3" />
                </>
              ) : (
                <InputFieldGroup
                  label="Name"
                  name="Name"
                  type="text"
                  value={formData.Name}
                  onChange={(e) => {
                    setFormData({ ...formData, Name: e.target.value });
                    if (formError.Name) setFormError({ ...formError, Name: "" });
                  }}
                  placeholder="Name"
                  required
                  error={formError.Name}
                />
              )}
            </Col>

            {/* ---------- SPECIALITY FIELD ---------- */}
            <Col md={6}>
              {loading ? (
                <>
                  <Skeleton width={90} height={14} className="mb-2" />
                  <Skeleton width="100%" height={42} className="mb-3" />
                </>
              ) : (
                <InputFieldGroup
                  label="Speciality"
                  name="Speciality"
                  type="text"
                  value={formData.Specialty}
                  onChange={(e) => {
                    setFormData({ ...formData, Specialty: e.target.value });
                    if (formError.Specialty) setFormError({ ...formError, Specialty: "" });
                  }}
                  placeholder="Speciality"
                  required
                  error={formError.Specialty}
                />
              )}
            </Col>

            {/* ---------- EXPERIENCE FIELD ---------- */}
            <Col md={6}>
              {loading ? (
                <>
                  <Skeleton width={120} height={14} className="mb-2" />
                  <Skeleton width="100%" height={42} className="mb-3" />
                </>
              ) : (
                <InputFieldGroup
                  label="Year Of Experience"
                  name="Experience"
                  type="text"
                  value={formData.Experience}
                  onChange={(e) => {
                    setFormData({ ...formData, Experience: e.target.value });
                    if (formError.Experience) setFormError({ ...formError, Experience: "" });
                  }}
                  placeholder="Year Of Experience"
                  required
                  error={formError.Experience}
                />
              )}
            </Col>

            {/* ---------- DOB FIELD ---------- */}
            <Col md={6}>
              {loading ? (
                <>
                  <Skeleton width={60} height={14} className="mb-2" />
                  <Skeleton width="100%" height={42} className="mb-3" />
                </>
              ) : (
                <DatePickerFieldGroup
                  label="DOB"
                  name="date"
                  placeholder="Select DOB"
                  value={formData.date}
                  onChange={(e) => { handleChange(e); if (formError.date) setFormError({ ...formError, date: "" }); }}
                  required
                  error={formError.date}
                  max={new Date().toISOString().split("T")[0]}
                />


              )}
            </Col>

            {/* ---------- GENDER RADIO BUTTON ---------- */}
            <Col md={6}>
              {loading ? (
                <>
                  <Skeleton width={50} height={14} className="mb-2" />
                  <div className="d-flex gap-3">
                    <Skeleton width={20} height={20} circle />
                    <Skeleton width={20} height={20} circle />
                  </div>
                </>
              ) : (
                <RadioButtonGroup
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => {
                    handleChange(e);
                    if (formError.gender) setFormError({ ...formError, gender: "" });
                  }}
                  required
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                  ]}
                  error={formError.gender}
                />
              )}
            </Col>

            {/* ---------- CONTACT NUMBER ---------- */}
            <Col md={6}>
              {loading ? (
                <>
                  <Skeleton width={120} height={14} className="mb-2" />
                  <Skeleton width="100%" height={42} className="mb-3" />
                </>
              ) : (
                <PhoneNumberInput
                  label="Contact Number"
                  value={formData.Contact}
                  inputMode="numeric"
                  onChange={(phone: string) => {
                    let value = phone.replace(/\D/g, "").slice(0, 12);
                    setFormData({ ...formData, Contact: value });
                    if (formError.Contact) setFormError({ ...formError, Contact: "" });
                  }}
                  required
                  error={formError.Contact}
                />
              )}
            </Col>

            {/* ---------- EMAIL ---------- */}
            <Col md={6}>
              {loading ? (
                <>
                  <Skeleton width={100} height={14} className="mb-2" />
                  <Skeleton width="100%" height={42} className="mb-3" />
                </>
              ) : (
                <InputFieldGroup
                  label="Email ID"
                  name="Email"
                  type="email"
                  value={formData.Email}
                  onChange={(e) => {
                    setFormData({ ...formData, Email: e.target.value });
                    if (formError.Email) setFormError({ ...formError, Email: "" });
                  }}
                  placeholder="Email"
                  required
                  error={formError.Email}
                />
              )}
            </Col>

            {/* ---------- ABOUT TEXTAREA ---------- */}
            <Col md={12}>
              {loading ? (
                <>
                  <Skeleton width={60} height={14} className="mb-2" />
                  <Skeleton width="100%" height={90} className="mb-3" />
                </>
              ) : (
                <Textarea label="About" name="About" value={formData.About} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => { handleChange(e); if (formError.About) { setFormError({ ...formError, About: "" }); } }} onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => { }} placeholder="About" required={true} disabled={false} error={formError.About} maxLength={500} />
              )}
            </Col>

          </Row>

        </div>
      </ContentContainer>

      <ContentContainer className="mt-4">
        {loading ? (
          <>
            {/* ---------- TITLE SKELETON ---------- */}
            <div className="d-flex flex-column flex-md-row justify-content-md-between mb-3">
              <Skeleton width={220} height={22} className="mb-2 mb-md-0" />
              <Skeleton width={180} height={20} />
            </div>

            {/* ---------- Monday-Friday Row Skeleton ---------- */}
            <Row className="mb-3">
              <Col md={6} className="edit-basic-detail-timepicker">
                <Skeleton width="100%" height={42} className="mb-2" />
              </Col>
              <Col md={6} className="mt-2 edit-basic-detail-timepicker">
                <Skeleton width="100%" height={42} />
              </Col>
            </Row>

            {/* ---------- Saturday-Sunday Row Skeleton ---------- */}
            <Row className="mb-3 edit-basic-detail-timepicker">
              <Col md={6} className="edit-basic-detailsat-sun">
                <Skeleton width="100%" height={42} className="mb-2" />
              </Col>
              <Col md={6} className="mt-2 edit-basic-detail-timepicker">
                <Skeleton width="100%" height={42} />
              </Col>
            </Row>
          </>
        ) : (
          <>
            {/* ---------- ORIGINAL FORM ---------- */}
            <div className="d-flex flex-column flex-md-row justify-content-md-between text-md-start mb-3">
              <h5 className="profile-card-main-titile mb-2 mb-md-0">
                Operational hours & Days
              </h5>
              <Form.Check
                type="checkbox"
                label="Select custom Hours and Days?"
                className="text-nowrap check-box input"
              />
            </div>

            <Row className="mb-3">
              <Col md={6} className="edit-basic-detail-timepicker">
                <TimePickerFieldGroup
                  label="Monday-Friday"
                  name="MF"
                  placeholder="Select Time"
                  value={formData.MF}
                  onChange={(e) => { const time = e.target.value; setFormData({ ...formData, MF: time }); }}
                />

              </Col>

              <Col md={6} className="mt-2 edit-basic-detail-timepicker">
                <TimePickerFieldGroup
                  name="Time"
                  placeholder="Select Time"
                  value={formData.Time}
                  onChange={(e) => {
                    const time = e.target.value;
                    setFormData({ ...formData, Time: time });
                  }}
                />
              </Col>
            </Row>

            <Row className="mb-3 edit-basic-detail-timepicker">
              <Col md={6} className="edit-basic-detailsat-sun">
                <TimePickerFieldGroup
                  label="Saturday-Sunday"
                  name="SS"
                  placeholder="Select Time"
                  value={formData.SS}
                  onChange={(e) => {
                    const time = e.target.value;
                    setFormData({ ...formData, SS: time });
                  }}
                />
              </Col>

              <Col md={6} className="mt-2 edit-basic-detail-timepicker">
                <TimePickerFieldGroup
                  name="Timer"
                  placeholder="Select Time"
                  value={formData.Timer}
                  onChange={(e) => {
                    const time = e.target.value;
                    setFormData({ ...formData, Timer: time });
                  }}
                />
              </Col>
            </Row>
          </>
        )}
      </ContentContainer>


      {/* <div id="qualification-section"> */}
      <ContentContainer className="mt-3">
        {/* ---------- TITLE SKELETON ---------- */}
        {loading ? (
          <Skeleton width={180} height={22} className="mb-4" />
        ) : (
          <h5 className="profile-card-main-titile mb-4">Qualification Details</h5>
        )}

        {/* ---------- QUALIFICATION LIST SKELETON ---------- */}
        {loading
          ? Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="position-relative mb-4 p-3 border rounded-3">
              <Row className="g-3">
                <Col md={6}>
                  <Skeleton width="100%" height={42} />
                </Col>
                <Col md={6}>
                  <Skeleton width="100%" height={42} />
                </Col>
                <Col md={12}>
                  <Skeleton width="100%" height={42} />
                </Col>
                <Col md={6}>
                  <Skeleton width="100%" height={42} />
                </Col>
                <Col md={6}>
                  <Skeleton width="100%" height={42} />
                </Col>
              </Row>
            </div>
          ))
          : qualifications.map((q, index) => (
            <div key={index} className="position-relative mb-4">
              {/* Remove Button */}
              {index > 0 && (
                <div className="d-flex justify-content-end mb-1">
                  <Button
                    // variant="danger"
                    size="sm"
                    className="d-flex align-items-center justify-content-center edit-basic-qualification-button maiacare-button"
                    onClick={() => {
                      const updatedQuals = qualifications.filter((_, i) => i !== index);
                      const updatedErrors = formErrors.filter((_, i) => i !== index); // keep errors in sync
                      setQualifications(updatedQuals);
                      setFormErrors(updatedErrors);
                    }}
                  >
                    -
                  </Button>
                </div>
              )}

              {/* Qualification Box */}
              <div className="p-3">
                <Row className="g-3">
                  <Col md={6}>
                    <InputFieldGroup
                      label="Degree"
                      name="degree"
                      type="text"
                      value={q.degree}
                      onChange={(e) => {
                        const updatedQuals = [...qualifications];
                        updatedQuals[index].degree = e.target.value;
                        setQualifications(updatedQuals);

                        const updatedErrors = [...formErrors];
                        updatedErrors[index].degree = "";
                        setFormErrors(updatedErrors);
                      }}
                      placeholder="Degree"
                      required
                      error={formErrors[index]?.degree}
                    />
                  </Col>

                  <Col md={6}>
                    <InputFieldGroup
                      label="Field of study"
                      name="field"
                      type="text"
                      value={q.field}
                      onChange={(e) => {
                        const updatedQuals = [...qualifications];
                        updatedQuals[index].field = e.target.value;
                        setQualifications(updatedQuals);

                        const updatedErrors = [...formErrors];
                        updatedErrors[index].field = "";
                        setFormErrors(updatedErrors);
                      }}
                      placeholder="Field"
                      required
                      error={formErrors[index]?.field}
                    />
                  </Col>

                  <Col md={12}>
                    <InputFieldGroup
                      label="University"
                      name="university"
                      type="text"
                      value={q.university}
                      onChange={(e) => {
                        const updatedQuals = [...qualifications];
                        updatedQuals[index].university = e.target.value;
                        setQualifications(updatedQuals);

                        const updatedErrors = [...formErrors];
                        updatedErrors[index].university = "";
                        setFormErrors(updatedErrors);
                      }}
                      placeholder="University"
                      required
                      error={formErrors[index]?.university}
                    />
                  </Col>

                  <Col md={6}>
                    <InputSelect
                      label="Start Year"
                      name="startYear"
                      value={q.startYear}
                      onChange={(e) => {
                        const updatedQuals = [...qualifications];
                        updatedQuals[index].startYear = e.target.value;
                        setQualifications(updatedQuals);

                        const updatedErrors = [...formErrors];
                        updatedErrors[index].startYear = "";
                        setFormErrors(updatedErrors);
                      }}
                      options={yearOptions}
                      error={formErrors[index]?.startYear}
                      required
                    />
                  </Col>

                  <Col md={6}>
                    <InputSelect
                      label="End Year"
                      name="endYear"
                      value={q.endYear}
                      onChange={(e) => {
                        const updatedQuals = [...qualifications];
                        updatedQuals[index].endYear = e.target.value;
                        setQualifications(updatedQuals);

                        const updatedErrors = [...formErrors];
                        updatedErrors[index].endYear = "";
                        setFormErrors(updatedErrors);
                      }}
                      options={yearOptions.filter((year) => {
                        if (!q.startYear) return true;
                        return Number(year.value) >= Number(q.startYear) + 1;
                      })}
                      error={formErrors[index]?.endYear}
                      required
                    />
                  </Col>
                </Row>
              </div>
            </div>
          ))}

        {/* Add Qualification Button */}
        {!loading && (
          <Button variant="default" className="maiacare-button" onClick={handleAddQualification}>
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.75 9.375C18.75 9.67337 18.6315 9.95952 18.4205 10.1705C18.2095 10.3815 17.9234 10.5 17.625 10.5H10.5V17.625C10.5 17.9234 10.3815 18.2095 10.1705 18.4205C9.95952 18.6315 9.67337 18.75 9.375 18.75C9.07663 18.75 8.79048 18.6315 8.5795 18.4205C8.36853 18.2095 8.25 17.9234 8.25 17.625V10.5H1.125C0.826631 10.5 0.540483 10.3815 0.329505 10.1705C0.118526 9.95952 0 9.67337 0 9.375C0 9.07663 0.118526 8.79048 0.329505 8.5795C0.540483 8.36853 0.826631 8.25 1.125 8.25H8.25V1.125C8.25 0.826631 8.36853 0.540483 8.5795 0.329505C8.79048 0.118526 9.07663 0 9.375 0C9.67337 0 9.95952 0.118526 10.1705 0.329505C10.3815 0.540483 10.5 0.826631 10.5 1.125V8.25H17.625C17.9234 8.25 18.2095 8.36853 18.4205 8.5795C18.6315 8.79048 18.75 9.07663 18.75 9.375Z" fill="white" />
            </svg>&nbsp;
            Add Qualification
          </Button>
        )}
      </ContentContainer>

      {/* </div> */}


      <div className="d-flex justify-content-end mt-4">
        <Button
          variant="default"
          className="maiacare-button"
          onClick={handleNextClick} // navigate 
        >
          Next <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
