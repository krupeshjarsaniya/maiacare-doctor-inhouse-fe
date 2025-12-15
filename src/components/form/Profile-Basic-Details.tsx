import React, { ChangeEvent, useEffect, useState } from 'react';
import { Container, Row, Col, Form, Table, Accordion } from 'react-bootstrap';
import Add from "../../assets/images/Add.png";
import Delete from "../../assets/images/Delete.png";
import LightEditimg from "../../assets/images/LightEditimg.png";
import Pdfimg from "../../assets/images/Pdfimg.png";
import Download from "../../assets/images/Download.png";
import Image from 'next/image';
import { useRouter } from "next/navigation";
// import Modal from "../ui/Modal";
import ContentContainer from '../ui/ContentContainer';
import Modal from '../ui/Modal';
import { InputFieldGroup } from '../ui/InputField';
import Button from '../ui/Button';
import toast from 'react-hot-toast';
import { InputSelect } from '../ui/InputSelect';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { addQualification, deleteQualification, editQualification, getLoggedInUser } from '@/utils/apis/apiHelper';
interface DocumentType {
  originalName?: string;
  reportName?: string;
  aadharNumber?: string;
  panNumber?: string;
  licenceNumber?: string;
  filePath: string;
  updatedAt?: string;
  name: string;
  date: string;
}

const ProfileBasicDetails = () => {
  interface FormError {
    [key: string]: string;

  }
  const router = useRouter();
  const initialFormError: FormError = {};
  const [formError, setFormError] = useState<FormError>(initialFormError);
  const [activeTab,] = useState('basic');
  const [startTime, setStartTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(true);
  interface qualificationType {
    degree: string,
    fieldOfStudy: string,
    university: string,
    startYear: string | number,
    endYear: string | number,
    _id: string
  }
  const [defaultQualifications, setDefaultQualifications] = useState<any[]>([]);
  const [showQualificationModal, setShowQualificationModal] = useState(false);
  const [showDeleteModal, setDeleteShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | undefined>("");
  const [selectedQualificationId, setSelectedQualificationId] = useState<string | null>(null);
  type FormData = {
    MF: string;
    SS: string;
    Time: string;
    Timer: string;

    degree: string;
    fieldOfStudy: string;
    university: string;
    startYear: string;
    endYear: string;

  };

  const initialFormData: FormData = {
    MF: "",
    SS: "",
    Time: "",
    Timer: "",
    degree: "",
    fieldOfStudy: "",
    university: "",
    startYear: "",
    endYear: ""
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [qualifications, setQualifications] = useState<FormData[]>([
    { ...initialFormData },
  ]);
  const [formErrors, setFormErrors] = useState([
    { degree: "", fieldOfStudy: "", university: "", startYear: "", endYear: "" }
  ]);


  const [documents, setDocuments] = useState<DocumentType[]>([]);

  const [operationalHours, setOperationalHours] = useState<OperationalHour[]>([]);



  const handleDelete = (id: string) => {
    // const updated = defaultQualifications.filter((_, i) => i !== index);
    // setDefaultQualifications(updated);
    console.log("ID: ", id);

    deleteQualification(id)
      .then((response) => {

        if (response.status == 200) {
          setDeleteShowModal(false)
          getUser()
        } else {
          console.log("Error");
        }

      })
      .catch((err) => {
        console.log("Qualification deleting error", err);
      });
  };

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name; // 👈 download name set
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // const operationalHours = [
  //   { days: "Mon to Fri", time: "10 AM – 5 PM" },
  //   { days: "Sat & Sun", time: "10 AM – 2 PM" },
  // ];

  //================  + add  Modal all data below ============= //

  const handleOpen = () => {
    // modal open in clean state and clear data 
    setFormData(initialFormData);
    setFormError(initialFormError);
    setFormErrors([]);
    setQualifications([{ ...initialFormData }]); // one  blank qualification row

    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);

    // Modal close data clear
    setFormData(initialFormData);
    setFormError(initialFormError);
    setFormErrors([]);
    setQualifications([{ ...initialFormData }]); // reset to 1 blank
  };


  const yearOptions = Array.from({ length: 51 }, (_, i) => {
    const year = 2000 + i;
    return { id: year.toString(), value: year.toString(), label: year.toString() };
  });

  const validateForm = (data: FormData): FormError => {
    const errors: FormError = {};
    return errors;
  };
  const validateForm1 = (quals: typeof qualifications) => {
    const errors = quals.map((q) => ({

      degree: !q.degree ? "Degree is required" : "",
      fieldOfStudy: !q.fieldOfStudy ? "fieldOfStudy is required" : "",
      university: !q.university ? "University is required" : "",
      startYear: !q.startYear ? "Start Year is required" : "",
      endYear: !q.endYear ? "End Year is required" : "",
    }));
    return errors;
  };

  // ✅ Function to add data
  const handleAddQualification = () => {
    setQualifications([...qualifications, { ...initialFormData }]);
    // ADDD Qualifications validtation msg 
    setFormErrors([
      ...formErrors,
      { degree: "", fieldOfStudy: "", university: "", startYear: "", endYear: "" }
    ]);
  };
  const handleRemoveQualification = (index: number) => {
    const updated = [...qualifications];
    updated.splice(index, 1);
    setQualifications(updated);
  };

  const handleSave = () => {
    // 🔹 Run validations
    const errors = validateForm(formData);          // single form
    const qualErrors = validateForm1(qualifications); // multi rows

    setFormError(errors);
    setFormErrors(qualErrors); // ✅ set array  

    const hasQualError = qualErrors.some((err) =>
      Object.values(err).some((msg) => msg !== "")
    );

    if (Object.keys(errors).length === 0 && !hasQualError) {
      // 🔹 Convert filled qualifications into display format
      const newItems = qualifications
        .filter(
          (q) =>
            q.degree && q.fieldOfStudy && q.university && q.startYear && q.endYear
        )
        .map((q) => ({
          title: `${q.degree} - ${q.fieldOfStudy}`,
          university: q.university,
          years: `${q.startYear} - ${q.endYear}`,
          degree: q.degree,
          fieldOfStudy: q.fieldOfStudy,
          startYear: q.startYear,
          endYear: q.endYear
        }));

      // if (newItems.length === 0) {
      //   alert("Please fill all fields before saving.");
      //   return;
      // }

      // 🔹 Update default qualifications
      setDefaultQualifications((prev) => [...prev, ...newItems]);

      console.log("Form submitted ✅", { formData, qualifications });

      // 🔹 Success → close modal + reset data

      const passData = qualifications.map((q) => ({
        degree: q.degree,
        fieldOfStudy: q.fieldOfStudy,
        university: q.university,
        startYear: Number(q.startYear),
        endYear: Number(q.endYear),
      }));

      console.log("Send data:", passData);


      addQualification(passData)
        .then((response) => {

          if (response.status == 200) {
            console.log("Qualification Added: ", response.data);
            setShowModal(false);
            setFormData(initialFormData);
            setFormError(initialFormError);
            setFormErrors([]);
            setQualifications([{ ...initialFormData }]);
            getUser()
            toast.success("Data saved successfully!", {
              position: "top-right",
              // autoClose: 3000,
            });
          } else {
            console.log("Error");
          }

        })
        .catch((err) => {
          console.log("Qualification adding error", err);
        });

    }
    else {
      console.log("Form has errors : ", { errors, qualErrors });
    }
  };
  // + add Qualification button diable data show after unable
  const isQualificationComplete = (q: any) => {
    return q.degree && q.fieldOfStudy && q.university && q.startYear && q.endYear;
  };

  // ===== Edit button click in modal open ================
  const openQualificationModal = (index: number, id: string) => {
    setEditIndex(index);
    setFormData(defaultQualifications[index]); // je data show thayu e prefill karo
    setShowQualificationModal(true); // modal open
    setSelectedQualificationId(id)
  };

  const closeQualificationModal = () => setShowQualificationModal(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError((prev) => ({ ...prev, [name]: "" }));
  };

  const EditValidtation = (data: FormData): FormError => {
    const errors: FormError = {};

    if (!data.degree.trim()) errors.degree = "Degree is required";
    if (!data.fieldOfStudy.trim()) errors.fieldOfStudy = "fieldOfStudy is required";
    if (!data.university.trim()) errors.university = "University is required";
    if (!data.startYear) errors.startYear = "Start year is required";
    if (!data.endYear) errors.endYear = "End year is required";

    return errors;
  };

  const handleEditSave = () => {
    const errors = EditValidtation(formData);
    setFormError(errors);
    // console.log("Qualification:", id);

    if (Object.keys(errors).length > 0) return; // ❌ don't save if errors
    console.log("formData", formData);

    editQualification(formData, selectedQualificationId)
      .then((response) => {

        if (response.status == 200) {
          console.log("Qualification Edited : ", response.data);
          getUser()
        } else {
          console.log("Error");
        }

      })
      .catch((err) => {
        console.log("Qualification adding error", err);
      });

    console.log("Form updated:", formData);

    closeQualificationModal();
    setEditIndex(null);
  };

  const [editIndex, setEditIndex] = useState<number | null>(null); // track current editing row
  interface OperationalHour {
    _id: string;
    day: string;
    openTime: string;
    closeTime: string;
  }

  interface Qualification {
    degree: string;
    fieldOfStudy: string;
    university: string;
    startYear: number;
    endYear: number;
    _id: string;
  }
  interface DoctorDataType {
    _id: string;
    name: string;
    profilePicture: string;
    specialty: string;
    yearsOfExperience: number;
    dob: string;
    gender: string;
    contactNumber: string;
    email: string;
    about: string;
    servicesOffered: string[];
    operationalHours: OperationalHour[];
    qualifications: Qualification[];
    fees: number;
    clinicIds: string[];
    doctorType: string;
    doctor_id_other: string;
    other_type_flag: string;
    memberSince: string;
    documents: any[];
  }
  const [user, setUser] = useState<DoctorDataType | null>(null)

  // const getUser = () => {
  //   getLoggedInUser()
  //     .then((response) => {
  //       if (response.status == 200) {
  //         const userData = response.data.data;

  //         // Normalize documents
  //         const normalizedDocs = userData.documents.map((doc: any, i: number) => ({
  //           ...doc,
  //           originalName: doc.originalName || doc.reportName || doc.name || `Document-${i + 1}`,
  //           updatedAt: doc.updatedAt || doc.uploadedAt || doc.date || null,
  //         }));

  //         setUser(userData);
  //         setDocuments(normalizedDocs);
  //         setDefaultQualifications(userData.qualifications);

  //         // ⭐ ADD THIS
  //         setOperationalHours(userData.operationalHours || []);

  //       } else {
  //         console.log("Error");
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  const getUser = () => {
    setLoading(true);  // start loading

    getLoggedInUser()
      .then((response) => {
        if (response.status === 200) {
          const userData = response.data.data;

          // Normalize documents
          const normalizedDocs = userData.documents?.map((doc: any, i: number) => ({
            ...doc,
            originalName: doc.originalName || doc.reportName || doc.name || `Document-${i + 1}`,
            updatedAt: doc.updatedAt || doc.uploadedAt || doc.date || null,
          })) || [];

          setUser(userData);
          setDocuments(normalizedDocs);
          setDefaultQualifications(userData.qualifications || []);
          setOperationalHours(userData.operationalHours || []);

        } else {
          console.log("Error");
        }

        setLoading(false); // stop loading
      })
      .catch((err) => {
        console.log(err);
        setLoading(false); // stop loading on error
      });
  };

  useEffect(() => {
    getUser()
  }, [])

  return (
    // <Container fluid className="mt-3">
    <div>
      <Row>

        {/* =====LEFT COLUMN PART ======== */}


        <Col xl={8} md={7}>

          {/* Operational Hours & Days */}
          <div>
            <ContentContainer className="mt-4">
              <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-center text-center text-md-start mb-3">
                {loading ? (
                  <Skeleton width={120} height={18} />
                ) : (
                  <h5 className="profile-card-main-titile mb-2 mb-md-0">
                    Operational Hours & Days
                  </h5>
                )}
              </div>
              {loading ? (
                <Skeleton width={170} height={25} />
              ) : (
                <div>
                  {operationalHours?.length > 0 ? (
                    (() => {
                      // Group continuous days with same time
                      const groups = [];
                      let start = operationalHours[0];
                      let prev = operationalHours[0];
                      const formatTimeToAMPM = (timeString: string): string => {
                        if (!timeString) return "";

                        const [hour, minute] = timeString.split(":");
                        const date = new Date();
                        date.setHours(Number(hour), Number(minute));

                        return date.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                        });
                      };

                      for (let i = 1; i < operationalHours.length; i++) {
                        const curr = operationalHours[i];

                        if (
                          curr.openTime === prev.openTime &&
                          curr.closeTime === prev.closeTime
                        ) {
                          // continue grouping
                          prev = curr;
                        } else {
                          groups.push({ start, end: prev });
                          start = curr;
                          prev = curr;
                        }
                      }

                      groups.push({ start, end: prev });

                      return groups.map((g, index) => (
                        <div key={index} className="mb-3">
                          <p className="basic-detail-text mb-1">
                            <span className=''>  {g.start.day} {g.start.day !== g.end.day && `- ${g.end.day}`} :</span>

                            <span className='ms-1'>
                              {formatTimeToAMPM(g.start.openTime)} - {formatTimeToAMPM(g.start.closeTime)}
                            </span>


                          </p>
                        </div>
                      ));
                    })()
                  ) : (
                    <p className="text-muted">No operational hours available</p>
                  )}
                </div>
              )}
            </ContentContainer>
          </div>


          {/* Qualification */}
          <div>
            <div>
              <ContentContainer className='mt-4' >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  {loading ? (
                    <>
                      <Skeleton width={140} height={20} />
                      <Skeleton width={45} height={35} />
                    </>
                  ) : (
                    <>
                      <h5 className="profile-card-main-titile">Qualification</h5>
                      <Button onClick={handleOpen} className="profile-card-boeder profile-card-button bg-transparent" variant="outline">
                        {/* <Image src={Add} alt="Add" /> */}

                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 9C18 9.19891 17.921 9.38968 17.7803 9.53033C17.6397 9.67098 17.4489 9.75 17.25 9.75H9.75V17.25C9.75 17.4489 9.67098 17.6397 9.53033 17.7803C9.38968 17.921 9.19891 18 9 18C8.80109 18 8.61032 17.921 8.46967 17.7803C8.32902 17.6397 8.25 17.4489 8.25 17.25V9.75H0.75C0.551088 9.75 0.360322 9.67098 0.21967 9.53033C0.0790178 9.38968 0 9.19891 0 9C0 8.80109 0.0790178 8.61032 0.21967 8.46967C0.360322 8.32902 0.551088 8.25 0.75 8.25H8.25V0.75C8.25 0.551088 8.32902 0.360322 8.46967 0.21967C8.61032 0.0790178 8.80109 0 9 0C9.19891 0 9.38968 0.0790178 9.53033 0.21967C9.67098 0.360322 9.75 0.551088 9.75 0.75V8.25H17.25C17.4489 8.25 17.6397 8.32902 17.7803 8.46967C17.921 8.61032 18 8.80109 18 9Z" fill="#2B4360" />
                        </svg>

                      </Button>
                    </>
                  )}
                </div>
                {/* ---------- BODY SKELETON ---------- */}
                <Modal
                  show={showModal}
                  onHide={handleClose}
                  dialogClassName="custom-modal-width"
                  header="Qualification Details"
                  centered>
                  <div>
                    {/* 🔁 Loop through all qualifications */}
                    <Accordion defaultActiveKey="0" alwaysOpen>
                      {qualifications.map((q, index) => (
                        <div key={index} className="mb-4"> {/* ← Add margin-bottom here for spacing */}
                          <Accordion.Item eventKey={index.toString()}>
                            <Accordion.Header>
                              Qualification {index + 1}
                            </Accordion.Header>

                            <Accordion.Body>
                              <div className="position-relative pt-3 p-3 modal-border-dashed">

                                {/* Remove button - show only if NOT first item */}
                                {index !== 0 && (
                                  <button
                                    type="button"
                                    className="btn-close position-absolute profile-basic-details-remove-button"
                                    style={{ top: "10px", right: "10px" }}
                                    onClick={() => handleRemoveQualification(index)}
                                  />
                                )}

                                <Row>
                                  <Col md={6} className="mt-3">
                                    <InputFieldGroup
                                      label="Degree"
                                      name="degree"
                                      type="text"
                                      value={q.degree}
                                      onChange={(e) => {
                                        const updated = [...qualifications];
                                        updated[index].degree = e.target.value;
                                        setQualifications(updated);

                                        const updatedErrors = [...formErrors];
                                        if (updatedErrors[index]) {
                                          updatedErrors[index].degree = "";
                                        }
                                        setFormErrors(updatedErrors);
                                      }}
                                      placeholder="Enter Degree"
                                      required={true}
                                      error={formErrors[index]?.degree}
                                    />
                                  </Col>

                                  <Col md={6} className="mt-3">
                                    <InputFieldGroup
                                      label="Field of study"
                                      name="field"
                                      type="text"
                                      value={q.fieldOfStudy}
                                      onChange={(e) => {
                                        const updated = [...qualifications];
                                        updated[index].fieldOfStudy = e.target.value;
                                        setQualifications(updated);

                                        const updatedErrors = [...formErrors];
                                        if (updatedErrors[index]) {
                                          updatedErrors[index].fieldOfStudy = "";
                                        }
                                        setFormErrors(updatedErrors);
                                      }}
                                      placeholder="Select Field"
                                      required={true}
                                      error={formErrors[index]?.fieldOfStudy}
                                    />
                                  </Col>

                                  <Col md={12} className="mt-3">
                                    <InputFieldGroup
                                      label="University"
                                      name="university"
                                      type="text"
                                      value={q.university}
                                      onChange={(e) => {
                                        const updated = [...qualifications];
                                        updated[index].university = e.target.value;
                                        setQualifications(updated);

                                        const updatedErrors = [...formErrors];
                                        if (updatedErrors[index]) {
                                          updatedErrors[index].university = "";
                                        }
                                        setFormErrors(updatedErrors);
                                      }}
                                      placeholder="University"
                                      required={true}
                                      error={formErrors[index]?.university}
                                    />
                                  </Col>

                                  <Col md={6} className="mt-3">
                                    <InputSelect
                                      label="Start Year"
                                      name="startYear"
                                      value={q.startYear}
                                      onChange={(e) => {
                                        const updated = [...qualifications];
                                        updated[index].startYear = e.target.value;
                                        setQualifications(updated);

                                        const updatedErrors = [...formErrors];
                                        if (updatedErrors[index]) {
                                          updatedErrors[index].startYear = "";
                                        }
                                        setFormErrors(updatedErrors);
                                      }}
                                      required={true}
                                      error={formErrors[index]?.startYear}
                                      options={yearOptions}
                                    />
                                  </Col>

                                  <Col md={6} className="mt-3">
                                    <InputSelect
                                      label="End Year"
                                      name="endYear"
                                      value={q.endYear}
                                      onChange={(e) => {
                                        const updated = [...qualifications];
                                        updated[index].endYear = e.target.value;
                                        setQualifications(updated);

                                        const updatedErrors = [...formErrors];
                                        if (updatedErrors[index]) {
                                          updatedErrors[index].endYear = "";
                                        }
                                        setFormErrors(updatedErrors);
                                      }}
                                      required={true}
                                      error={formErrors[index]?.endYear}
                                      options={yearOptions.filter((year) => {
                                        if (!q.startYear) return true;
                                        return Number(year.value) >= Number(q.startYear) + 1;
                                      })}
                                    />
                                  </Col>
                                </Row>

                              </div>
                            </Accordion.Body>

                          </Accordion.Item>
                        </div>
                      ))}
                    </Accordion>


                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    {/* Add Qualification Button */}
                    <Button onClick={handleAddQualification} variant='default'
                      disabled={
                        qualifications.length > 0 &&
                        !isQualificationComplete(qualifications[qualifications.length - 1])
                      }
                    >
                      + Add Qualification
                    </Button>

                    {/* Save Button */}
                    <Button onClick={handleSave} variant='default'>
                      Save
                    </Button>
                  </div>
                </Modal>



                {loading ? (
                  Array(3).fill(0).map((_, idx) => (
                    <div key={idx} className="d-flex justify-content-between align-items-start p-3 mb-3 bg-white border rounded-4 profile-card-boeder">
                      <div className="flex-grow-1">
                        <Skeleton height={20} width={`60%`} className="mb-2" />
                        <Skeleton height={18} width={`80%`} className="mb-1" />
                        <Skeleton height={18} width={`50%`} />
                      </div>

                      <div className="d-flex gap-2">
                        {/* Skeleton for edit/delete buttons */}
                        <Skeleton height={32} width={32} className="rounded-1" />
                        <Skeleton height={32} width={32} className="rounded-1" />
                      </div>
                    </div>
                  ))
                ) : defaultQualifications.length === 0 ? (
                  <div className="text-center text-muted p-4 border rounded-4">
                    "Data not found. Please Add Data"
                  </div>
                ) : (
                  defaultQualifications.map((item, idx) => (
                    <div
                      key={idx}
                      className="d-flex justify-content-between align-items-start p-3 mb-3 bg-white border rounded-4 profile-card-boeder"
                    >
                      <div>
                        <div className="card-feild">{item.degree}</div>
                        <div className="card-university-text">{item.university}</div>
                        <div className="card-year">{`${item.startYear} - ${item.endYear}`}</div>
                      </div>

                      <div className="d-flex gap-2">
                        <Button onClick={() => openQualificationModal(idx, item._id)} className="border p-2 rounded-3 edit-del-btn  bg-transparent" variant='outline'>
                          <Image src={LightEditimg} alt="Specialization" width={18} height={18} />
                        </Button>

                        <Button className="border p-2 rounded-2 edit-del-btn  bg-transparent"
                          onClick={() => { setDeleteId(item._id); setDeleteShowModal(true) }} variant='outline'
                        >
                          <Image src={Delete} alt="Specialization" width={18} height={18} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
                <Modal
                  show={showDeleteModal}
                  onHide={() => setDeleteShowModal(false)}
                  size="md"
                  backdrop={false}
                  dialogClassName="delete-modal"
                  header="Qualification Delete"
                  centered
                >
                  <div className="delete-content text-center">

                    {/* Icon */}
                    <div className="delete-icon-wrapper mx-auto mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="110" height="110" fill="#ff4d4d" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 1 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                      </svg>
                    </div>

                    {/* Title */}
                    <h4 className="fw-bold mb-2">Are you sure?</h4>

                    {/* Subtitle */}
                    <p className="text-muted mb-4">
                      This action cannot be undone. Do you really want to delete this Qualification?
                    </p>

                    <div className="w-100 border-top pt-3 d-flex justify-content-between align-items-center flex-wrap">

                      <div className="d-flex justify-content-center gap-3 w-100">

                        <button
                          className="btn btn-light border px-4 flex-fill"
                          onClick={() => setDeleteShowModal(false)}
                        >
                          Cancel
                        </button>

                        <Button
                          contentSize="small"
                          className="px-4 maiacare-button flex-fill"
                          onClick={() => handleDelete(deleteId || "")}
                        >
                          Delete
                        </Button>

                      </div>


                    </div>
                  </div>
                </Modal>
              </ContentContainer>
            </div>
          </div>

          <Modal
            show={showQualificationModal}
            onHide={closeQualificationModal}
            centered
            dialogClassName="custom-modal-width"
            header="Qualification Details"
          >
            <div>

              <Row >
                <Col md={6} className="mt-3">
                  <InputFieldGroup
                    label="Degree"
                    name="degree"
                    type="text"
                    value={formData.degree}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                    }}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => { }}
                    placeholder="Enter degree"
                    required={true}
                    disabled={false}
                    readOnly={false}   // ✅ remove or set false
                    error={formError.degree}
                  />
                </Col>


                <Col md={6} className="mt-3">
                  <InputFieldGroup
                    label="Field of study"
                    name="field"
                    type="text"
                    value={formData.fieldOfStudy}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                    }}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => { }}
                    placeholder="Enter field"
                    required={true}
                    disabled={false}
                    readOnly={false}   // ✅ remove or set false
                    error={formError.fieldOfStudy}
                  />
                </Col>

                <Col md={12} className="mt-3">
                  <InputFieldGroup
                    label="University"
                    name="university"
                    type="text"
                    value={formData.university}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                    }}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => { }}
                    placeholder="Enter university"
                    required={true}
                    disabled={false}
                    readOnly={false}   // ✅ remove or set false
                    error={formError.university}
                  />
                </Col>


                <Col md={6} className="mt-3">
                  <InputSelect
                    label="Start Year"
                    name="startYear"
                    value={formData.startYear}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      handleChange(e);
                    }}
                    onBlur={(e: React.FocusEvent<HTMLSelectElement>) => { }}
                    required={true}
                    disabled={false}
                    error={formError.startYear}
                    options={yearOptions}
                  />
                </Col>

                <Col md={6} className="mt-3">
                  <InputSelect
                    label="End Year"
                    name="endYear"
                    value={formData.endYear}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      handleChange(e);
                    }}
                    onBlur={(e: React.FocusEvent<HTMLSelectElement>) => { }}
                    required={true}
                    disabled={false}
                    error={formError.endYear}
                    options={yearOptions}
                  />
                </Col>
              </Row>


              {/* Save Button */}
              <Button onClick={() => handleEditSave()} className="maiacare-button mt-4">
                Save
              </Button>

            </div>

          </Modal>


        </Col>


        {/* ======RIGHT COLUMN =========== */}
        {/* About */}

        <Col xl={4} md={5}>
          <div>
            <ContentContainer className="mt-4">

              {/* -------- ABOUT TITLE SKELETON -------- */}
              {loading ? (
                <Skeleton width={80} height={20} className="mb-2" />
              ) : (
                <h5 className="profile-card-main-titile">About</h5>
              )}

              {/* -------- ABOUT TEXT SKELETON -------- */}
              {loading ? (
                <>
                  <Skeleton width={"100%"} height={14} className="mb-2" />
                  <Skeleton width={"95%"} height={14} className="mb-2" />
                  <Skeleton width={"80%"} height={14} />
                </>
              ) : (
                <p className="mb-0 about-text">
                  {user ? user.about : ""}
                </p>
              )}

            </ContentContainer>
          </div>

          {/* Documents */}
          <div>
            <ContentContainer className="mt-4">

              {/* -------- DOCUMENTS TITLE SKELETON -------- */}
              {loading ? (
                <Skeleton width={120} height={20} className="mb-4" />
              ) : (
                <h5 className="mb-4 profile-card-main-titile">Documents</h5>
              )}

              {/* -------- DOCUMENTS LIST SKELETON -------- */}
              {loading ? (
                <>
                  {/* Skeleton card 1 */}
                  <div className="d-flex justify-content-between align-items-center border profile-card-boeder p-3 mb-3 document-main-border">
                    <div className="d-flex align-items-center">
                      <Skeleton width={40} height={40} className="me-3" />
                      <div>
                        <Skeleton width={140} height={16} className="mb-2" />
                        <Skeleton width={90} height={14} />
                      </div>
                    </div>
                    <Skeleton width={35} height={35} className="rounded" />
                  </div>

                  {/* Skeleton card 2 */}
                  <div className="d-flex justify-content-between align-items-center border profile-card-boeder p-3 mb-3 document-main-border">
                    <div className="d-flex align-items-center">
                      <Skeleton width={40} height={40} className="me-3" />
                      <div>
                        <Skeleton width={140} height={16} className="mb-2" />
                        <Skeleton width={90} height={14} />
                      </div>
                    </div>
                    <Skeleton width={35} height={35} className="rounded" />
                  </div>
                </>
              ) : (
                documents.map((doc, index) => {
                  const docName =
                    doc.originalName ||
                    doc.reportName ||
                    doc.aadharNumber ||
                    doc.panNumber ||
                    doc.licenceNumber ||
                    `Document-${index + 1}`;

                  const formattedDate = doc.updatedAt
                    ? new Date(doc.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                    : "";


                  return (
                    <div
                      key={index}
                      className="d-flex justify-content-between align-items-center border profile-card-boeder p-3 mb-3 document-main-border"
                    >
                      <div className="d-flex align-items-center">
                        {doc.filePath.endsWith("pdf")
                          ?
                          <div>              <svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
                            <path d="M37.8125 12.375H28.875V3.4375C28.875 3.25516 28.8026 3.0803 28.6736 2.95136C28.5447 2.82243 28.3698 2.75 28.1875 2.75H8.9375C8.75516 2.75 8.5803 2.82243 8.45136 2.95136C8.32243 3.0803 8.25 3.25516 8.25 3.4375V22.6875C8.25 22.8698 8.32243 23.0447 8.45136 23.1736C8.5803 23.3026 8.75516 23.375 8.9375 23.375H27.5V34.375H8.9375C8.75516 34.375 8.5803 34.4474 8.45136 34.5764C8.32243 34.7053 8.25 34.8802 8.25 35.0625V40.5625C8.25 40.7448 8.32243 40.9197 8.45136 41.0486C8.5803 41.1776 8.75516 41.25 8.9375 41.25H37.8125C37.9948 41.25 38.1697 41.1776 38.2986 41.0486C38.4276 40.9197 38.5 40.7448 38.5 40.5625V13.0625C38.5 12.8802 38.4276 12.7053 38.2986 12.5764C38.1697 12.4474 37.9948 12.375 37.8125 12.375Z" fill="#EEEEEE" />
                            <path d="M28.1875 22H6.1875C5.8078 22 5.5 22.3078 5.5 22.6875V35.0625C5.5 35.4422 5.8078 35.75 6.1875 35.75H28.1875C28.5672 35.75 28.875 35.4422 28.875 35.0625V22.6875C28.875 22.3078 28.5672 22 28.1875 22Z" fill="#EF5350" />
                            <path d="M38.3006 12.5745L28.6756 2.94947C28.5795 2.85251 28.4566 2.78639 28.3227 2.75952C28.1888 2.73266 28.05 2.74628 27.9239 2.79865C27.7978 2.85101 27.6901 2.93975 27.6146 3.05355C27.5391 3.16734 27.4992 3.30104 27.5 3.43759V13.0626C27.5 13.2449 27.5724 13.4198 27.7014 13.5487C27.8303 13.6777 28.0052 13.7501 28.1875 13.7501H37.8125C37.9491 13.7509 38.0828 13.711 38.1966 13.6355C38.3104 13.56 38.3991 13.4524 38.4515 13.3262C38.5038 13.2001 38.5174 13.0613 38.4906 12.9274C38.4637 12.7935 38.3976 12.6706 38.3006 12.5745Z" fill="#E0E0E0" />
                            <path d="M10.3125 31.6253V26.1253H12.1413C12.6108 26.0941 13.0755 26.236 13.4475 26.5241C13.6353 26.6874 13.784 26.8908 13.8828 27.1192C13.9816 27.3477 14.0278 27.5954 14.0181 27.8441C14.014 28.1655 13.9212 28.4795 13.75 28.7516C13.5892 29.0197 13.3489 29.2312 13.0625 29.3566C12.8139 29.4672 12.5439 29.5212 12.2719 29.5147H11.4469V31.6253H10.3125ZM11.4744 28.5178H12.1206C12.3242 28.5285 12.524 28.4595 12.6775 28.3253C12.7455 28.2571 12.7984 28.1753 12.8327 28.0853C12.8671 27.9953 12.8821 27.899 12.8769 27.8028C12.8769 27.3812 12.6248 27.1703 12.1206 27.1703H11.4744V28.5178ZM15.0906 31.6253V26.1253H17.1531C17.6701 26.1071 18.1768 26.2727 18.5831 26.5928C18.9197 26.8666 19.1867 27.2161 19.3623 27.6128C19.538 28.0095 19.6173 28.4421 19.5938 28.8753C19.5997 29.3797 19.4816 29.8779 19.25 30.326C19.0332 30.745 18.6986 31.0915 18.2875 31.3228C17.8124 31.5509 17.2874 31.655 16.7612 31.6253H15.0906ZM16.2525 30.5803H16.995C17.2591 30.59 17.52 30.5206 17.7444 30.381C17.9823 30.2024 18.1704 29.9658 18.2907 29.6937C18.4111 29.4217 18.4597 29.1234 18.4319 28.8272C18.4553 28.5488 18.4076 28.2691 18.2934 28.0142C18.1792 27.7592 18.0021 27.5375 17.7788 27.3697C17.5574 27.2291 17.2983 27.1595 17.0363 27.1703H16.2525V30.5803ZM20.79 31.6253V26.1253H23.9388V27.1703H21.9519V28.291H23.7738V29.336H21.9519V31.6253H20.79Z" fill="white" />
                          </svg></div>
                          :
                          <div>
                            <svg width="44" height="44" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M61.875 20.25H47.25V5.625C47.25 5.32663 47.1315 5.04048 46.9205 4.82951C46.7095 4.61853 46.4234 4.5 46.125 4.5H14.625C14.3266 4.5 14.0405 4.61853 13.8295 4.82951C13.6185 5.04048 13.5 5.32663 13.5 5.625V37.125C13.5 37.4234 13.6185 37.7095 13.8295 37.9205C14.0405 38.1315 14.3266 38.25 14.625 38.25H45V56.25H14.625C14.3266 56.25 14.0405 56.3685 13.8295 56.5795C13.6185 56.7905 13.5 57.0766 13.5 57.375V66.375C13.5 66.6734 13.6185 66.9595 13.8295 67.1705C14.0405 67.3815 14.3266 67.5 14.625 67.5H61.875C62.1734 67.5 62.4595 67.3815 62.6705 67.1705C62.8815 66.9595 63 66.6734 63 66.375V21.375C63 21.0766 62.8815 20.7905 62.6705 20.5795C62.4595 20.3685 62.1734 20.25 61.875 20.25Z" fill="#EEEEEE" />
                              <path d="M46.125 36H10.125C9.50368 36 9 36.5037 9 37.125V57.375C9 57.9963 9.50368 58.5 10.125 58.5H46.125C46.7463 58.5 47.25 57.9963 47.25 57.375V37.125C47.25 36.5037 46.7463 36 46.125 36Z" fill="#42A5F5" />
                              <path d="M62.6738 20.5764L46.9238 4.82645C46.7664 4.66779 46.5654 4.55958 46.3463 4.51563C46.1272 4.47168 45.9 4.49397 45.6936 4.57965C45.4872 4.66534 45.311 4.81055 45.1875 4.99676C45.064 5.18296 44.9987 5.40174 45 5.6252V21.3752C45 21.6736 45.1185 21.9597 45.3295 22.1707C45.5405 22.3817 45.8267 22.5002 46.125 22.5002H61.875C62.0985 22.5015 62.3173 22.4362 62.5035 22.3127C62.6897 22.1892 62.8349 22.013 62.9206 21.8066C63.0063 21.6002 63.0285 21.373 62.9846 21.1539C62.9406 20.9348 62.8324 20.7338 62.6738 20.5764Z" fill="#E0E0E0" />
                              <path d="M20.3961 42.7503H22.2973V48.2065C22.3367 48.9348 22.2375 49.664 22.0048 50.3553C21.7662 50.8761 21.3688 51.3079 20.8696 51.5888C20.3704 51.8697 19.795 51.9853 19.2261 51.919C18.6251 51.9981 18.0152 51.8665 17.5004 51.5465C16.9855 51.2265 16.5975 50.738 16.4023 50.164C16.2809 49.7325 16.2277 49.2845 16.2448 48.8365V48.5665H18.1123C18.0715 48.9338 18.1379 49.305 18.3036 49.6353C18.4175 49.7658 18.56 49.8682 18.72 49.9345C18.8801 50.0008 19.0532 50.0293 19.2261 50.0178C19.488 50.05 19.7522 49.9787 19.9624 49.819C20.1725 49.6593 20.312 49.4238 20.3511 49.1628C20.3807 48.7884 20.3807 48.4122 20.3511 48.0378L20.3961 42.7503ZM24.1198 51.7503V42.7503H27.1123C27.8806 42.6992 28.641 42.9313 29.2498 43.4028C29.5571 43.6701 29.8005 44.0029 29.9621 44.3767C30.1237 44.7505 30.1994 45.1558 30.1836 45.5628C30.1924 46.0882 30.0562 46.606 29.7898 47.059C29.5267 47.4978 29.1335 47.8438 28.6648 48.049C28.2582 48.2305 27.8162 48.3189 27.3711 48.3078H26.0211V51.7503H24.1198ZM26.0211 46.6653H27.0786C27.4117 46.6828 27.7386 46.5698 27.9898 46.3503C28.1011 46.2386 28.1876 46.1047 28.2438 45.9574C28.3 45.8102 28.3246 45.6527 28.3161 45.4953C28.3161 44.8053 27.9036 44.4603 27.0786 44.4603H26.0211V46.6653ZM35.5048 48.4428V46.7328H39.4761V51.7503H37.7661V50.9178C36.9758 51.618 35.9403 51.9768 34.8862 51.9157C33.8321 51.8545 32.8451 51.3784 32.1411 50.5915C31.3169 49.7128 30.8723 48.5446 30.9036 47.3403C30.8881 46.7195 30.9954 46.1018 31.2193 45.5226C31.4433 44.9434 31.7795 44.4141 32.2086 43.9653C32.6205 43.5237 33.1211 43.1742 33.6775 42.9397C34.2339 42.7051 34.8336 42.5907 35.4373 42.604C36.4219 42.5779 37.3848 42.8962 38.1598 43.504C38.5153 43.7741 38.8138 44.112 39.0378 44.4983C39.2618 44.8845 39.4069 45.3113 39.4648 45.754H37.3273C37.2135 45.336 36.9501 44.9744 36.5871 44.7379C36.2241 44.5015 35.7869 44.4067 35.3586 44.4715C35.0175 44.4628 34.6787 44.5288 34.3658 44.6648C34.0529 44.8009 33.7736 45.0037 33.5473 45.259C33.0642 45.8065 32.8139 46.521 32.8498 47.2503C32.8338 47.6124 32.8902 47.974 33.0157 48.314C33.1413 48.654 33.3335 48.9655 33.5811 49.2303C33.8267 49.4839 34.1229 49.683 34.4504 49.8148C34.7779 49.9466 35.1295 50.0081 35.4823 49.9953C36.0275 50.0117 36.5648 49.8627 37.0236 49.5678C37.2229 49.4457 37.3935 49.282 37.5236 49.0878C37.6537 48.8936 37.7403 48.6736 37.7773 48.4428H35.5048Z" fill="white" />
                            </svg>
                          </div>
                        }
                        <div>
                          <div className="card-feild">{docName}</div>
                          <div className="card-year">{formattedDate}</div>
                        </div>
                      </div>

                      <button
                        className="d-flex bg-white justify-content-center align-items-center border profile-card-boeder rounded Download-border"
                        onClick={() => handleDownload(`/files/${doc.name}.pdf`, doc.name)}
                      >
                        <Image src={Download} alt="download" width={25} height={25} />
                      </button>
                    </div>
                  );
                })
              )}

            </ContentContainer>
          </div>
        </Col>

      </Row>
    </div>
    // </Container>
  );
};

export default ProfileBasicDetails;
