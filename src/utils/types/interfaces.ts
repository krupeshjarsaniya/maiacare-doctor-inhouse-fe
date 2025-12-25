import "../StaticData";
import { StaticImageData } from "next/image";

export interface User {
  id: string;
  name: string;
  email: string;
}

// interfaces.ts

export interface Patient {
  id: number;
  name: string;
  mobile: string;
  email: string;
  pincode: string;
  treatment: string;
  status: string;
};

export type OptionType = { value: string; label: string };



//Patients basic details  interface  
export interface MedicalHistoryType {
  medication: string,
  surgeries: string,
  surgeriesContent: string,
  medicalCondition: OptionType[],
  familyMedicalHistory: string,
  lifestyle: OptionType[],
  stress: string,
  exercise: string,
  medicationcontent: string,
  surgeriescontent: string,

};

export interface PhysicalAssessmentDataModel {
  id?: string;
  _id?: string;   // ⬅ ADD THIS
  height: string;
  weight: string;
  bmi: string;
  bloodGroup: string
  systolic: string;
  diastolic: string;
  heartRate: string;
  date: string;
};

export interface FertilityAssessmentFormType {
  ageAtFirstMenstruation: string;
  cycleLength: string;
  periodLength: string;
  date: string;
  isCycleRegular: string;
  menstrualIssues: string;
  pregnancy: string;
  timeduration: string;
  ectopicpregnancy: string;
}



export interface EditFertilityAssessment {
  // semenAnalysis: string;
  // semenAnalysisContent: string;
  // fertilityIssues: string;
  // fertilityIssuesContent: string;
  // fertilityTreatment: string;
  // fertilityTreatmentContent: string;
  // surgeries: string;
  // surgeriesContent: string;
  fertilityIssues: {
    fertilityIssuesDetails: string,
    status: string | boolean
  };

  fertilityTreatments: {
    fertilityTreatmentsDetails: string,
    status: string | boolean
  };

  semenAnalysis: {
    semenAnalysisDetails: string,
    status: string | boolean
  };

  surgeries: {
    surgeriesDetails: string,
    status: string | boolean
  }
}
export interface FormErrorEditFertilityAssessment {
  semenAnalysis?: string;
  semenAnalysisDetails?: string;

  fertilityIssues?: string;
  fertilityIssuesContent?: string;

  fertilityTreatment?: string;
  fertilityTreatmentContent?: string;

  surgeries?: string;
  surgeriesContent?: string;
}


export interface FertilityAssessmentType {
  height: string;
  weight: string;
  bmi: string;
  bloodGroup: string;
  systolic: string;
  diastolic: string;
  heartRate: string;
  semenAnalysis: {
    status: string,
    semenAnalysisDetails: string
  };
  semenAnalysisContent: string;
  fertilityIssues: {
    status: string,
    fertilityIssuesDetails: string
  };
  fertilityIssuesContent: string;
  fertilityTreatments: {
    status: string,
    fertilityTreatmentsDetails: string
  };
  fertilityTreatmentContent: string;
  surgeries: {
    status: string,
    surgeriesDetails: string
  };
  surgeriesContent: string;
}

export interface PhysicalAssessmentData {
  date: string;
  height: string;
  weight: string;
  bmi: string;
  bloodGroup: string;
  bloodPressure: string;
  heartRate: string;
}

export interface BookAppointmentForm {
  //Appointment Details

  appointmentId: string;
  type: string;
  reasonForVisit: [];
  appointmentDate: string;
  appointmentTime: string;
  forTime: string;
  additionalNote: string;

  //Patient Details
  // patientName: SelectPatientType | null;
  patientName: any;
  phone: string;
  email: string;
  patientAge: string;
  gender: string;
}

export interface SelectPatientType {
  id: string;
  ProfilePhoto: StaticImageData;
  name: string;
}
interface DocumentType {
  originalName?: string;
  reportName?: string;
  aadharNumber?: string;
  panNumber?: string;
  licenceNumber?: string;
  filePath: string;
  updatedAt?: string;
}

export interface PartnerData {
  patientId: string|number;
  partnerImage: string | null;
  partnerName: string;
  partnerContactNumber: string;
  partnerEmail: string;
  partnerGender: string;
  partnerAge: number;
}
export interface MedicalHistoryData {
  patientId: string;

  medications: {
    status: string;
    medicationsDetails: string;
  };

  surgeries: {
    status: string;
    surgeriesDetails: string;
  };

  conditions: string[];

  familyHistory: string;

  lifestyle: string[];

  exerciseFrequency: string;

  stressLevel: string;
}

export interface allDataType {
  basicDetailsPassingData?: PartnerData,
  medicalHistoryPassingData?: MedicalHistoryData
}