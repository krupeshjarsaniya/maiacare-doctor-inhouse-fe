import React, { useEffect, useState } from 'react';
// import { Container} from 'react-bootstrap';
import ProfileManageLeave from "@/components/form/Profile-Manage-Leave";
import ProfileBasicDetails from "@/components/form/Profile-Basic-Details";
// import "../style/ProfileTabes.css";
// import ContentContainer from './ui/ContentContainer';
import CustomTabs from './ui/CustomTabs';
import Profile from './Profile';
import ContentContainer from './ui/ContentContainer';

const ProfileTabes = () => {
  const [activeTab, setActiveTab] = useState<string>("basic");

  const tabOptions = [
    {
      key: "basic",
      label: "Basic Details",
      content: (
        <>
          <ProfileBasicDetails />
        </>
      ),
    },
    {
      key: "leaves",
      label: "Manage Leaves",
      content: (
        <>
          <ProfileManageLeave />
        </>
      ),
    },
    // {
    //   key: "reviews",
    //   label: "Reviews",
    //   content: (
    //     <>
    //       <ContentContainer className="mt-5">
    //         <h1>Reviews Content</h1>
    //       </ContentContainer>
    //     </>
    //   ),
    // },

  ];


  return (
    <>
      <Profile />
      <div className='mt-4'>

        <CustomTabs
          activeKey={activeTab}
          setActiveKey={setActiveTab}
          tabOptions={tabOptions}
          // className='profile-tabs'
        />

        {/* {activeTab === 'basic' && (
          <div>

          </div>
        )}

        {activeTab === 'leaves' && (
          <div>
            
          </div>
        )}

        {activeTab === 'Reviews' && (
          <div>Reviews Content</div>
        )} */}

      </div>
    </>





  );
};

export default ProfileTabes;
