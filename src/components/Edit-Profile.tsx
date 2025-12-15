"use client";
import React, { useEffect, useState } from 'react';
import Editbasicdetails from './form/Edit-Basic-Details';
import Editkycdetails from './form/Edit-Kyc-Details';
import "../style/Edit-Profile.css";
import CustomTabs from './ui/CustomTabs';
import ContentContainer from './ui/ContentContainer';
// import ContentContainer from './ui/ContentContainer';



const EditProfile = () => {
  const [activeTab, setActiveTab] = useState<string>("basic");


  const handleNextClick = () => {
    setActiveTab("KYC");
  };

  const handlePrevious = () => {
    setActiveTab("basic");
  };


  const tabOptions = [
    {
      key: "basic",
      label: "Basic Details",
      content: (
        <>
          <Editbasicdetails onNext={handleNextClick} />
        </>
      ),
    },
    // {
    //   key: "Clinic",
    //   label: "Clinic Details",
    //   content: (
    //     <>
    //       <ContentContainer className="mt-5">
    //         <h1>Clinic Details</h1>
    //       </ContentContainer>
    //     </>
    //   ),
    // },
    {
      key: "KYC",
      label: "KYC Details",
      content: (
        <>
          <Editkycdetails
            onNext={handleNextClick}
            onPrevious={handlePrevious}
          />
        </>
      ),
    },

  ];

  return (
    <>
      <div>

        <CustomTabs
          activeKey={activeTab}
          setActiveKey={setActiveTab}
          tabOptions={tabOptions}
        />
      </div>

    </>

  )

}
export default EditProfile;