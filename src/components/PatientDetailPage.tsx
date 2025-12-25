"use client";
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { Button, Card, Dropdown } from "react-bootstrap";
import ContentContainer from "@/components/ui/ContentContainer";
import patientImage from "@/assets/images/Img-1.png";
import EditProfile from "../assets/images/EditProfile-2.png";
import "../style/ProfileTabes.css";
import CustomTabs from './ui/CustomTabs';
import PatientBasicDetail from './PatientBasicDetail';
import PartnerDetail from './PartnerDetail';
import { getOne } from "@/utils/apis/apiHelper";
import { useParams } from "next/navigation";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import Modal from './ui/Modal';
import { RescheduleAppointment, SuccessModalReschedule } from './form/RescheduleAppointment';
import { CancelAppointment, SuccessModalCancel } from './form/CancelAppointment';

export default function PatientDetailPageComponent({ onPatientLoaded, }: any) {

  const [activeTab, setActiveTab] = useState<string>("basic");
  const params = useParams();
  const id = params?.id?.toString();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<any>(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSuccessModalCancel, setShowSuccessModalCancel] = useState(false);

  const [RescheduleModal, setRescheduleModal] = useState<boolean>(false);
  const [CancelModal, setCancelModal] = useState<boolean>(false);

  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        if (!id) {
          setLoading(false);  // nothing to load
          return;
        }

        setLoading(true); // start loading

        const res = await getOne(id);
        const pData = res?.data?.data || res?.data;

        setPatient(pData);

        // Send patient name to parent
        onPatientLoaded?.(pData?.personalDetails?.name || "N/A");

      } catch (error) {
        console.error("Error fetching patient:", error);
      }

      setLoading(false); // stop loading
    };

    fetchPatient();
  }, [id]);

  const formatPhoneNumber = (number?: string) => {
    if (!number) return "N/A";

    // remove all non-digits
    const cleaned = number.replace(/\D/g, "");

    // assuming Indian number (10 digits)
    if (cleaned.length === 10) {
      return `+91 ${cleaned}`;
    }

    return `+91 ${cleaned.slice(-10)}`;
  };


  const tabOptions = [
    {
      key: "basic",
      label: "Basic Details",
      content: (
        <>
          <PatientBasicDetail patientId={id} patient={patient} loading={loading} />
        </>
      ),
    },
    {
      key: "Details",
      label: "Partner Details",
      content: (
        <>
          <PartnerDetail setActiveTab={setActiveTab} />
        </>
      ),
    },
  ];

  const p = patient?.personalDetails;

  return (
    <>
      <div className="row mb-4">

        {/* LEFT SIDE - PATIENT BASIC DETAILS */}
        <div className="col-md-6">
          {/* -------- TITLE SKELETON -------- */}
          {loading ? (
            <Skeleton width={150} height={22} className="mb-3 mt-2" />
          ) : (
            <h6 className="fw-semibold mb-3 mt-2 Patient-Details">Patient Details</h6>
          )}

          <div className="pation-profile-data">
            <ContentContainer className="shadow-sm border-0 patient-box">
              <Card.Body>

                {/* -------- PROFILE IMAGE + NAME -------- */}
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center mb-3">
                    {loading ? (
                      <div className="d-flex align-items-center">
                        <Skeleton width={60} height={60} circle className="me-3" />
                        <Skeleton width={120} height={20} />
                      </div>
                    ) : (
                      <>
                        {/* <img
                        src={p?.profileImage ? p.profileImage : patientImage}
                        alt="Patient"
                        width={60}
                        height={60}
                        className="rounded-circle me-3"
                      /> */}
                        <img
                          src={p?.profileImage || patientImage.src}
                          width={70}
                          height={70}
                          className="rounded-circle me-3"
                        />
                        <div>
                          <h5 className="mb-1 fw-semibold name-patient">
                            {p?.name || "N/A"}
                          </h5>
                        </div>
                      </>
                    )}
                  </div>
                  <Dropdown align="end" className="d-flex align-items-center">
                    <Dropdown.Toggle
                      as="button"
                      id="dropdown-basic"
                      className="bg-transparent border-0 p-1 no-caret"
                    >
                      <div className='patient-profile-dot'>

                        <HiOutlineDotsHorizontal />
                      </div>


                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dots-open">
                      <Dropdown.Item className="no-hover">
                        <div className="d-flex align-items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7.65626 4.37475V6.62842L9.52493 7.74952C9.6005 7.79299 9.66664 7.85108 9.71951 7.92041C9.77237 7.98973 9.81089 8.06889 9.83282 8.15326C9.85475 8.23763 9.85965 8.32553 9.84724 8.41182C9.83482 8.49811 9.80533 8.58106 9.7605 8.65583C9.71567 8.73059 9.65639 8.79568 9.58613 8.84728C9.51586 8.89888 9.43602 8.93597 9.35127 8.95637C9.26651 8.97678 9.17854 8.98009 9.09249 8.96611C9.00644 8.95214 8.92403 8.92116 8.85009 8.87499L6.66259 7.56249C6.56537 7.50421 6.48491 7.42174 6.42903 7.32313C6.37316 7.22451 6.34378 7.1131 6.34376 6.99975V4.37475C6.34376 4.2007 6.4129 4.03378 6.53597 3.91071C6.65904 3.78764 6.82596 3.7185 7.00001 3.7185C7.17406 3.7185 7.34098 3.78764 7.46405 3.91071C7.58712 4.03378 7.65626 4.2007 7.65626 4.37475ZM12.25 2.8435C12.076 2.8435 11.909 2.91264 11.786 3.03571C11.6629 3.15878 11.5938 3.3257 11.5938 3.49975V3.9028C11.3635 3.64741 11.1245 3.39366 10.867 3.1328C10.1069 2.37279 9.13967 1.85363 8.08621 1.64017C7.03274 1.42672 5.93973 1.52844 4.94375 1.93262C3.94777 2.33681 3.09298 3.02554 2.48619 3.91276C1.8794 4.79997 1.54751 5.84633 1.532 6.92109C1.51649 7.99585 1.81805 9.05135 2.39898 9.95571C2.97992 10.8601 3.81448 11.5732 4.79838 12.0059C5.78229 12.4387 6.8719 12.5719 7.93109 12.3889C8.99027 12.206 9.97205 11.7149 10.7538 10.9772C10.8804 10.8577 10.9543 10.6927 10.9594 10.5187C10.9644 10.3447 10.9001 10.1757 10.7806 10.0491C10.661 9.92251 10.4961 9.84855 10.3221 9.84352C10.148 9.8385 9.97913 9.90282 9.85251 10.0223C9.25851 10.5829 8.51251 10.9561 7.70769 11.0951C6.90287 11.2342 6.07491 11.1331 5.32721 10.8044C4.57952 10.4757 3.94525 9.93404 3.50361 9.24698C3.06198 8.55993 2.83256 7.75798 2.84402 6.94131C2.85548 6.12464 3.1073 5.32945 3.56803 4.65505C4.02877 3.98066 4.67799 3.45696 5.43461 3.14937C6.19123 2.84178 7.0217 2.76393 7.8223 2.92555C8.6229 3.08717 9.35814 3.48109 9.93618 4.05811C10.2599 4.38569 10.5547 4.70288 10.8407 5.031H10.0625C9.88846 5.031 9.72154 5.10014 9.59847 5.22321C9.4754 5.34628 9.40626 5.5132 9.40626 5.68725C9.40626 5.8613 9.4754 6.02822 9.59847 6.15129C9.72154 6.27436 9.88846 6.3435 10.0625 6.3435H12.25C12.4241 6.3435 12.591 6.27436 12.714 6.15129C12.8371 6.02822 12.9063 5.8613 12.9063 5.68725V3.49975C12.9063 3.3257 12.8371 3.15878 12.714 3.03571C12.591 2.91264 12.4241 2.8435 12.25 2.8435Z" fill="#2B4360" />
                          </svg>
                          <span className="settings-accordion-subtitle m-0" onClick={() => { setRescheduleModal?.(true); }}>Reschedule</span>
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item className="no-hover">
                        <div className="d-flex align-items-center gap-2 ">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M11.4018 10.4735C11.5251 10.5968 11.5943 10.764 11.5943 10.9383C11.5943 11.1127 11.5251 11.2799 11.4018 11.4032C11.2785 11.5265 11.1113 11.5957 10.9369 11.5957C10.7626 11.5957 10.5954 11.5265 10.4721 11.4032L6.99998 7.92997L3.52677 11.4021C3.40349 11.5254 3.23628 11.5946 3.06193 11.5946C2.88758 11.5946 2.72037 11.5254 2.59709 11.4021C2.4738 11.2788 2.40454 11.1116 2.40454 10.9372C2.40454 10.7629 2.4738 10.5957 2.59709 10.4724L6.07029 7.00028L2.59818 3.52708C2.4749 3.40379 2.40563 3.23658 2.40563 3.06223C2.40563 2.88788 2.4749 2.72067 2.59818 2.59739C2.72146 2.4741 2.88867 2.40484 3.06302 2.40484C3.23737 2.40484 3.40458 2.4741 3.52787 2.59739L6.99998 6.07059L10.4732 2.59684C10.5965 2.47356 10.7637 2.4043 10.938 2.4043C11.1124 2.4043 11.2796 2.47356 11.4029 2.59684C11.5262 2.72013 11.5954 2.88733 11.5954 3.06169C11.5954 3.23604 11.5262 3.40324 11.4029 3.52653L7.92966 7.00028L11.4018 10.4735Z" fill="#2B4360" />
                          </svg>
                          <span className="appoiment-dots-open-danger m-0" onClick={() => { setCancelModal?.(true); }}>Cancel Appointment</span>
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item className="no-hover">
                        <div className="d-flex align-items-center gap-2 ">
                          <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.2812 2.1875H8.3125V1.53125C8.3125 1.12514 8.15117 0.735658 7.86401 0.448493C7.57684 0.161328 7.18736 0 6.78125 0H4.15625C3.75014 0 3.36066 0.161328 3.07349 0.448493C2.78633 0.735658 2.625 1.12514 2.625 1.53125V2.1875H0.65625C0.482202 2.1875 0.315282 2.25664 0.192211 2.37971C0.0691404 2.50278 0 2.6697 0 2.84375C0 3.0178 0.0691404 3.18472 0.192211 3.30779C0.315282 3.43086 0.482202 3.5 0.65625 3.5H0.875V10.9375C0.875 11.2276 0.990234 11.5058 1.19535 11.7109C1.40047 11.916 1.67867 12.0312 1.96875 12.0312H8.96875C9.25883 12.0312 9.53703 11.916 9.74215 11.7109C9.94727 11.5058 10.0625 11.2276 10.0625 10.9375V3.5H10.2812C10.4553 3.5 10.6222 3.43086 10.7453 3.30779C10.8684 3.18472 10.9375 3.0178 10.9375 2.84375C10.9375 2.6697 10.8684 2.50278 10.7453 2.37971C10.6222 2.25664 10.4553 2.1875 10.2812 2.1875ZM3.9375 1.53125C3.9375 1.47323 3.96055 1.41759 4.00157 1.37657C4.04259 1.33555 4.09823 1.3125 4.15625 1.3125H6.78125C6.83927 1.3125 6.89491 1.33555 6.93593 1.37657C6.97695 1.41759 7 1.47323 7 1.53125V2.1875H3.9375V1.53125ZM8.75 10.7188H2.1875V3.5H8.75V10.7188ZM4.8125 5.25V8.75C4.8125 8.92405 4.74336 9.09097 4.62029 9.21404C4.49722 9.33711 4.3303 9.40625 4.15625 9.40625C3.9822 9.40625 3.81528 9.33711 3.69221 9.21404C3.56914 9.09097 3.5 8.92405 3.5 8.75V5.25C3.5 5.07595 3.56914 4.90903 3.69221 4.78596C3.81528 4.66289 3.9822 4.59375 4.15625 4.59375C4.3303 4.59375 4.49722 4.66289 4.62029 4.78596C4.74336 4.90903 4.8125 5.07595 4.8125 5.25ZM7.4375 5.25V8.75C7.4375 8.92405 7.36836 9.09097 7.24529 9.21404C7.12222 9.33711 6.9553 9.40625 6.78125 9.40625C6.6072 9.40625 6.44028 9.33711 6.31721 9.21404C6.19414 9.09097 6.125 8.92405 6.125 8.75V5.25C6.125 5.07595 6.19414 4.90903 6.31721 4.78596C6.44028 4.66289 6.6072 4.59375 6.78125 4.59375C6.9553 4.59375 7.12222 4.66289 7.24529 4.78596C7.36836 4.90903 7.4375 5.07595 7.4375 5.25Z" fill="#E85966" />
                          </svg>

                          <span className="appoiment-dots-open-danger text-danger m-0">Delete</span>
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                {/* -------- DETAILS GRID -------- */}
                <div className="row">

                  {/* PHONE */}
                  <div className="col-6">
                    {loading ? (
                      <Skeleton width={60} height={16} />
                    ) : (
                      <div className="heading-patient">Phone</div>
                    )}

                    {loading ? (
                      <Skeleton width={110} height={18} style={{ marginTop: "6px" }} />
                    ) : (
                      <p className="mb-2 sub-heading-patient">
                        {formatPhoneNumber(p?.contactNumber)}
                      </p>
                    )}
                  </div>


                  {/* EMAIL */}
                  <div className="col-6" >
                    {loading ? (
                      <Skeleton width={60} height={16} />
                    ) : (
                      <div className="heading-patient">Email Address</div>
                    )}
                    {loading ? (
                      <Skeleton width={160} height={18} />
                    ) : (
                      <p className="mb-2 sub-heading-patient">{p?.email || "N/A"}</p>
                    )}
                  </div>

                  {/* GENDER */}
                  <div className="col-6">
                    {loading ? (
                      <Skeleton width={60} height={16} />
                    ) : (
                      <div className="heading-patient">Gender</div>
                    )}
                    {loading ? (
                      <Skeleton width={80} height={18} />
                    ) : (
                      <p className="mb-2 sub-heading-patient">{p?.gender || "N/A"}</p>
                    )}
                  </div>

                  {/* AGE */}
                  <div className="col-6">
                    {loading ? (
                      <Skeleton width={60} height={16} />
                    ) : (
                      <div className="heading-patient">Age</div>
                    )}
                    {loading ? (
                      <Skeleton width={50} height={18} />
                    ) : (
                      <p className="mb-2 sub-heading-patient">{p?.age ?? "N/A"} years </p>
                    )}
                  </div>

                  {/* PINCODE */}
                  <div className="col-6">
                    {loading ? (
                      <Skeleton width={60} height={16} />
                    ) : (
                      <div className="heading-patient">Pin Code</div>
                    )}
                    {loading ? (
                      <Skeleton width={100} height={18} />
                    ) : (
                      <p className="sub-heading-patient">{p?.pincode || "N/A"}</p>
                    )}
                  </div>

                </div>
              </Card.Body>
            </ContentContainer>

            {/* Reschedule Modal */}
            <Modal
              show={RescheduleModal}
              onHide={() => setRescheduleModal?.(false)}
              header="Request to Reschedule Appointment"
              closeButton={true}
            >
              <RescheduleAppointment
                setRescheduleModal={setRescheduleModal}
                setShowSuccessModal={setShowSuccessModal}
                selectedPatient={p}
              />
            </Modal>

            {/* Cancel Modal */}
            <Modal
              show={CancelModal}
              onHide={() => setCancelModal?.(false)}
              header="Request to Cancel Appointment"
              closeButton={true}
            >
              <CancelAppointment
                setCancelModal={setCancelModal}
                setShowSuccessModalCancel={setShowSuccessModalCancel}
                selectedPatient={selectedPatient}
              />

            </Modal>

            {/* Independent Success Modal */}
            <SuccessModalReschedule
              showSuccessModal={showSuccessModal}
              setShowSuccessModal={setShowSuccessModal}
            />
            <SuccessModalCancel
              showSuccessModalCancel={showSuccessModalCancel}
              setShowSuccessModalCancel={setShowSuccessModalCancel}
            // setBookAppointmentModal={setBookAppointmentModal}
            />

          </div>

        </div>

        {/* RIGHT SIDE - CONSULTATION & CONCERNS */}
        <div className="col-md-6">

          {/* -------- TITLE SKELETON -------- */}
          {loading ? (
            <Skeleton width={240} height={22} className="mb-3 mt-2" />
          ) : (
            <h6 className="fw-semibold mb-3 mt-2 Patient-Details">Consultation Type and Concerns</h6>
          )}

          <div className="pation-profile-dataa">
            <ContentContainer className="shadow-sm border-0 patient-box">
              <Card.Body>

                {/* ---------- CONSULTATION TYPE ---------- */}
                <div className="mb-3">

                  {/* Label */}
                  {loading ? (
                    <Skeleton width={80} height={18} className="mb-2" />
                  ) : (
                    <strong className="d-block mb-2 heading-patient">Type</strong>
                  )}

                  {/* Tag skeletons */}
                  <div className="d-flex gap-3 flex-wrap mb-4">

                    {loading ? (
                      <>
                        <Skeleton width={80} height={25} className="rounded" />
                        <Skeleton width={90} height={25} className="rounded" />
                        <Skeleton width={70} height={25} className="rounded" />
                      </>
                    ) : patient?.concerns?.length > 0 ? (
                      patient.concerns.map((tag: string, index: number) => (
                        <span key={`${tag}-${index}`} className="sub-patient bg-white">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span>No concerns found</span>
                    )}

                  </div>
                </div>

                {/* ---------- REVIEW / CONCERNS ---------- */}
                <div className="mt-1 mb-3">

                  {/* Label */}
                  {loading ? (
                    <Skeleton width={90} height={18} className="mb-2" />
                  ) : (
                    <strong className="d-block mb-1 heading-patient">Concerns</strong>
                  )}

                  {/* Review text skeleton */}
                  {loading ? (
                    <>
                      <Skeleton width={"100%"} height={16} className="mb-2" />
                      <Skeleton width={"90%"} height={16} className="mb-2" />
                      <Skeleton width={"80%"} height={16} />
                    </>
                  ) : (
                    <p className="mb-0 Patient-review">
                      {patient?.consultReview || "No review added yet."}
                    </p>
                  )}
                </div>

              </Card.Body>
            </ContentContainer>
          </div>
        </div>

      </div>

      {/* FIXED FOOTER BUTTONS */}
      <div
        className="d-flex justify-content-end gap-3 p-3 border-top bg-white w-100"
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <Button variant="light" className="cancel-profile-btn">Cancel</Button>
        <Button className="Button-login" variant="primary">Finish Consultation</Button>
      </div>

      {/* TABS */}
      <div className="mt-1">
        <CustomTabs
          activeKey={activeTab}
          setActiveKey={setActiveTab}
          tabOptions={tabOptions}
        />
      </div>

    </>
  );
}
