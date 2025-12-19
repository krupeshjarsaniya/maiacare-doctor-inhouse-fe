"use client";
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { Button, Card } from "react-bootstrap";
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
export default function PatientDetailPageComponent({ onPatientLoaded, }: any) {

  const [activeTab, setActiveTab] = useState<string>("basic");
  const params = useParams();
  const id = params?.id?.toString();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<any>(null);

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
                  <div className="col-6">
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
