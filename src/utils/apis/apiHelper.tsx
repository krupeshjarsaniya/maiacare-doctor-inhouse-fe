import { FertilityAssessmentType } from "../types/interfaces";
import { LoginRequest } from "../types/requestInterface";
import apiClient from "./axiosInstance";
import api from "./axiosInstance";

export const login = (data: LoginRequest) => {
  return apiClient.post("/auth/login", data);
}

export const getLoginUser = () => {
  return apiClient.get("/profile/get/login-user");
}

export const forgotPassword = (data: { email: string }) => {
  return apiClient.post("/auth/forgot-password", data);
}

export const forgotPasswordVerify = (data: { token: string | null, otp: number | string }) => {
  return apiClient.post("/auth/forgot-password-verify", data);
}

export const newPassword = (data: { token: string | null, password: string }) => {
  return apiClient.post("/auth/new-password", data);
}

export const changePassword = (data: { oldPassword: string, newPassword: string }) => {
  return apiClient.post("/profile/change-password", data);
}

export const getLoggedInDevice = (data: { token: string | null }) => {
  return apiClient.post("/profile/list-login-device", {}, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    }
  });
}


// export const logout = () => {
//   return apiClient.post("/profile/logout");
// }

export const getLoggedInUser = () => {
  const token = localStorage.getItem("token");
  return apiClient.get("/profile/get", {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
}
export const update = (payload: any) => {
  return apiClient.put("/profile/update", payload);
}
// export const update = () => {
//   const token = localStorage.getItem("token");
//   return apiClient.put("/profile/update", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     }
//   });
// }

type QualificationType = {
  degree: string;
  fieldOfStudy: string;
  university: string;
  startYear: number | string;
  endYear: number | string;
};

export const addQualification = (data: QualificationType[]) => {
  const token = localStorage.getItem("token");
  return apiClient.post("/profile/qualifications/add", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
}


export const editQualification = (data: QualificationType, id: string | null) => {
  const token = localStorage.getItem("token");
  return apiClient.put(`/profile/qualifications/edit/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
}

export const deleteQualification = (id: string) => {
  const token = localStorage.getItem("token");
  return apiClient.delete(`/profile/qualifications/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getKyc = () => {
  const token = localStorage.getItem("token");
  return apiClient.get("/profile/get/kyc-details", {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
}

export const uploadkycdetails = (data: { aadharNumber: string; aadharFile: string; panNumber: string; panFile: string; licenceNumber: string; licenceFile: string; otherDocuments: { reportName: string; filePath: string; originalName: string; }[]; }) => {
  const token = localStorage.getItem("token");
  return apiClient.put("/profile/upload-kyc-details", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAll = (data: object) => {
  return apiClient.post("/patient/getAll", data);
}
export const getOne = async (id: string | number) => {
  return await api.get(`/patient/${id}`);   // FIXED ✔
};

export const patientDelete = (patientId: string) => {
  const token = localStorage.getItem("token");

  return apiClient.delete(`/patient/delete/${patientId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const addphysicalassessment = (data: any) => {
  const token = localStorage.getItem("token");

  return apiClient.post("/patient/physical-assessment", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
};



export const getPhysicalAssessment = (
  id: string,
) => {
  const token = localStorage.getItem("token");

  return apiClient.post(
    `/patient/physical-assessment/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const updatephysicalassessment = (data: any, id:string|undefined) => {
  const token = localStorage.getItem("token");

  return apiClient.put(`/patient/physical-assessment/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const addFertilityAssessment = (data: any) => {
  const token = localStorage.getItem("token");
  return apiClient.post("/patient/fertility-assessment", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const getFertilityAssessment = async (id: string) => {
  return api.get(`/patient/fertility-assessment/${id}`);
};



export const updatefertilityassessment = (id: string, data: any) => {
  const token = localStorage.getItem("token");

  return apiClient.put(
    `/patient/fertility-assessment/${id}`,
    data, // ← payload
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


// export const addMedicalHistory = (patientId: string, data: any) => {
//   const token = localStorage.getItem("token");

//   return apiClient.post(
//     "/patient/medical-history",
//     {
//       patientId, // send patientId
//       ...data,   // include form data
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
// };
export const addMedicalHistory = (data: any) => {
  const token = localStorage.getItem("token");

  return apiClient.post("/patient/medical-history", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
};

export const getmedicalhistory = async (id: string) => {
  return api.get(`/patient/medical-history/${id}`);
};


export const updatemedicalhistory = (id: string, data: any) => {
  const token = localStorage.getItem("token");

  return apiClient.put(
    `/patient/medical-history/${id}`,
    data, // ← payload
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const basicDetails = (data: object) => {
  return apiClient.post("/patient/partner/basicDetails", data);
}


export const addPartnerMedicalHistory = (data: { patientId: string | undefined; medications: { status: string; medicationsDetails: string; }; surgeries: { status: string; surgeriesDetails: string; }; conditions: string[]; familyHistory: string; lifestyle: string[]; exerciseFrequency: string; stressLevel: string; }) => {
  const token = localStorage.getItem("token");
  return apiClient.post("/patient/partner/medicalHistory", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
}

export const getPartnermedicalhistory = async (id: string | undefined) => {
  return api.get(`/patient/partner/medicalHistory/${id}`);
};


export const updatePartnermedicalhistory = (
  id: string | undefined,
  data: { patientId: string | undefined; medications: { status: string; medicationsDetails: string; }; surgeries: { status: string; surgeriesDetails: string; }; conditions: any[]; familyHistory: string; lifestyle: any[]; exerciseFrequency: string; stressLevel: string; }
) => {
  const token = localStorage.getItem("token");
  console.log("id----", id)
  const res = apiClient.put(
    `/patient/partner/medicalHistory/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};


export const addPartnerPhysicalAssesment = (data: { height: string; weight: string; bmi: string; bloodGroup: string; bloodPressureSystolic: string; bloodPressureDiastolic: string; heartRate: string; }) => {
  const token = localStorage.getItem("token");
  return apiClient.post("/patient/partner/physicalAssessment", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
}


export const getPartnerPhysicalAssessment = (
  id: string,
) => {
  const token = localStorage.getItem("token");

  return apiClient.post(
    `/patient/partner/physicalAssessment/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const updatePartnerphysicalassessment = (data: any) => {
  const token = localStorage.getItem("token");

  return apiClient.put("/patient/partner/physicalAssessment", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};






export const addPartnerfertilityAssessment = (data: { patientId: string | undefined; semenAnalysis: { status: string; semenAnalysisDetails: string; }; fertilityIssues: { status: string; fertilityIssuesDetails: string; }; fertilityTreatments: { status: string; fertilityTreatmentsDetails: string; }; surgeries: { status: string; surgeriesDetails: string; }; }) => {
  const token = localStorage.getItem("token");
  return apiClient.post("/patient/partner/fertilityAssessment", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
}


export const getPartnerFertilityAssessment = async (id: string) => {
  return api.get(`/patient/partner/fertility-assessment/${id}`);
};



export const updatePartnerfertilityassessment = (id: string, data: any) => {
  const token = localStorage.getItem("token");

  return apiClient.put(
    `/patient/partner/fertilityAssessment/${id}`,
    data, // ← payload
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};






export const getProfileImageUrl = (formData: { type: string; files: string | File | undefined; }) => {
  const token = localStorage.getItem("token");

  return apiClient.post("/update-images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};




export const logout = () => {
  return apiClient.post("/profile/logout");
}

// export const logoutByDevice = (id: string) => {
//   return apiClient.post(`/profile/logoutByDevice/${id}`);
// };


export const logoutByDevice = (id: string) => {
  return apiClient.post(`/profile/logoutByDevice`, { id });
};
export const consultation = (data: any) => {
  const token = localStorage.getItem("token");

  return apiClient.post("/patient/consultReview", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
};
