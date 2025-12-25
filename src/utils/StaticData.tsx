import RaniImg from "@/assets/images/Img-1.png";
import NinaImg from "@/assets/images/Img-2.png";
import HimariImg from "@/assets/images/Img-3.png";
import AnjaliImg from "@/assets/images/Img-4.png";
import AasthaImg from "@/assets/images/Img-5.png";
import { StaticImageData } from "next/image";
import Doctor1 from "@/assets/images/doctor1.png";
import Doctor2 from "@/assets/images/doctor2.png";
import Doctor3 from "@/assets/images/doctor3.png";
import Doctor4 from "@/assets/images/doctor4.png";

export interface ConsultationEntry {
  id: number; // <-- ADD ID
  name: string;
  mobile: string;
  email: string;
  pin: string;
  status: string;
  image: string | StaticImageData;
  date?: string;  // ✅ optional date field
}

export interface InventoryEntry {
  id: number; // <-- ADD ID
  name: string;
  mobile: string;
  email: string;
  pin: string;
  status: string;
  image: string | StaticImageData;
  date?: string;  // ✅ optional date field
}

export type Doctor = {
  id: string | number;
  name: string;
  image: string | StaticImageData;
  slots: string[];
};


export const consultationData: ConsultationEntry[] = [
  {
    id: 1,
    name: "Rani Desai",
    mobile: "9092038491",
    email: "ranidesai@protonmail.com",
    pin: "400077",
    status: "Completed",
    image: RaniImg,
    date: "2025-09-15"
  },
  {
    id: 2,
    name: "Nina Gupta",
    mobile: "9092038491",
    email: "ninagupta@protonmail.com",
    pin: "400077",
    status: "Pending",
    image: NinaImg,
    date: "2025-09-16"
  },
  {
    id: 3,
    name: "Himari Roy",
    mobile: "9092038491",
    email: "himariroy@protonmail.com",
    pin: "400077",
    status: "Scheduled",
    image: HimariImg,
    date: "2025-09-15"
  },
  {
    id: 4,
    name: "Anjali Shinde",
    mobile: "9092038491",
    email: "anjalishinde@protonmail.com",
    pin: "400077",
    status: "No Response",
    image: AnjaliImg,
    date: "2025-09-15"
  },
  {
    id: 5,
    name: "Anjali Shinde",
    mobile: "9092038491",
    email: "anjalishinde@protonmail.com",
    pin: "400077",
    status: "Cancelled",
    image: AnjaliImg,
    date: "2025-09-15"
  },
  {
    id: 6,
    name: "Aastha Patil",
    mobile: "9092038491",
    email: "aasthapatil@protonmail.com",
    pin: "400077",
    status: "Rescheduled",
    image: AasthaImg,
    date: "2025-09-15"
  },
  {
    id: 7,
    name: "Anjali Shinde",
    mobile: "9092038491",
    email: "anjalishinde@protonmail.com",
    pin: "400077",
    status: "No Response",
    image: AnjaliImg,
    date: "2025-09-15"
  },
  {
    id: 8,
    name: "Rani Desai",
    mobile: "9092038491",
    email: "ranidesai@protonmail.com",
    pin: "400077",
    status: "Completed",
    image: RaniImg,
    date: "2025-09-15"
  },
  {
    id: 9,
    name: "Anjali Shinde",
    mobile: "9092038491",
    email: "anjalishinde@protonmail.com",
    pin: "400077",
    status: "Cancelled",
    image: AnjaliImg,
    date: "2025-09-15"
  },
  {
    id: 10,
    name: "Rani Desai",
    mobile: "9092038491",
    email: "ranidesai@protonmail.com",
    pin: "400077",
    status: "Completed",
    image: RaniImg,
    date: "2025-10-15"
  },
];



export const inventoryData: InventoryEntry[] = [
  {
    id: 1,
    name: "Rani Desai",
    mobile: "9092038491",
    email: "ranidesai@protonmail.com",
    pin: "400077",
    status: "Completed",
    image: RaniImg,
    date: "2025-09-16"
  },
  {
    id: 2,
    name: "Nina Gupta",
    mobile: "9092038491",
    email: "ninagupta@protonmail.com",
    pin: "400077",
    status: "Pending",
    image: NinaImg,
    date: "2025-09-15"
  },
  {
    id: 3,
    name: "Himari Roy",
    mobile: "9092038491",
    email: "himariroy@protonmail.com",
    pin: "400077",
    status: "Scheduled",
    image: HimariImg,
    date: "2025-09-15"
  },
  {
    id: 4,
    name: "Anjali Shinde",
    mobile: "9092038491",
    email: "anjalishinde@protonmail.com",
    pin: "400077",
    status: "No Response",
    image: AnjaliImg,
    date: "2025-09-25"
  },
  {
    id: 5,
    name: "Anjali Shinde",
    mobile: "9092038491",
    email: "anjalishinde@protonmail.com",
    pin: "400077",
    status: "Cancelled",
    image: AnjaliImg,
    date: "2025-10-15"
  },

];



export const doctorsData: Doctor[] = [
  {
    id: 1,
    name: "Dr. Manan Gupta",
    image: Doctor1,
    slots: ["3:00 PM", "3:30 PM", "4:00 PM", "5:00 PM", "5:30 PM"],
  },
  {
    id: 2,
    name: "Dr. Manan Gupta",
    image: Doctor2,
    slots: ["3:00 PM", "3:30 PM", "4:00 PM", "5:00 PM"],
  },
  {
    id: 3,
    name: "Dr. Jaya Prakesh",
    image: Doctor3,
    slots: ["3:00 PM", "3:30 PM", "4:00 PM", "5:00 PM", "6:00 PM"],
  },
  {
    id: 4,
    name: "Dr. Megha Singh",
    image: RaniImg,
    slots: ["3:00 PM", "3:30 PM", "4:00 PM", "5:00 PM"],
  },
  {
    id: 5,
    name: "Dr. Veena Raman",
    image: Doctor4,
    slots: ["3:00 PM", "3:30 PM", "4:00 PM", "5:00 PM", "5:30 PM"],
  },
];


import { ColumnDef } from '@tanstack/react-table';
// import { LeaveEntry } from "../utils/types/interfaces";
import Trash from "../assets/images/Trash.png";
import LightEditimg from "../assets/images/LightEditimg.png";
import Image from 'next/image';
import { Patient, SelectPatientType } from "./types/interfaces";


export type LeaveEntry = {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: string;
};

export const leaveData: LeaveEntry[] = [
  {
    id: '01',
    type: 'Casual leave',
    startDate: '3 Aug 2026',
    endDate: '25 Oct 2023',
    days: '1 Day',
  },
  {
    id: '02',
    type: 'Sick leave',
    startDate: '9 Aug 2026',
    endDate: '19 Oct 2023',
    days: '3 Days',
  },
  {
    id: '03',
    type: 'Vacation',
    startDate: '6 Aug 2026',
    endDate: '13 Oct 2023',
    days: '15 Days',
  },
  {
    id: '04',
    type: 'Family Thing',
    startDate: '9 Aug 2026',
    endDate: '23 Oct 2023',
    days: '1 Day',
  },
  {
    id: '05',
    type: 'Sick leave',
    startDate: '23 Aug 2026',
    endDate: '29 Oct 2023',
    days: '2 Days',
  },
  {
    id: '06',
    type: 'Casual leave',
    startDate: '3 Aug 2026',
    endDate: '22 Oct 2023',
    days: '1 Day',
  },
  {
    id: '07',
    type: 'Family thing',
    startDate: '6 Aug 2026',
    endDate: '21 Oct 2023',
    days: '2 Days',
  },
  {
    id: '08',
    type: 'Casual leave',
    startDate: '3 Aug 2026',
    endDate: '21 Oct 2023',
    days: '1 Day',
  },
];

export const leaveColumns: ColumnDef<LeaveEntry>[] = [
  {
    header: '#',
    accessorKey: 'id',
  },
  {
    header: 'Leave Type',
    accessorKey: 'type',
  },
  {
    header: 'Start Date',
    accessorKey: 'startDate',
  },
  {
    header: 'End Date',
    accessorKey: 'endDate',
  },
  {
    header: 'No. of days',
    accessorKey: 'days',
  },
  // {
  //   header: 'Action',
  //   cell: () => (
  //     <div className="d-flex gap-2">
  //       <button className="btn btn-sm profile-card-boeder ">
  //         <Image src={LightEditimg} alt="Specialization" width={18} height={20} />
  //       </button>

  //       <button className="btn btn-sm profile-card-boeder">
  //         <Image src={Trash} alt="Specialization" width={18} height={20} />
  //       </button>
  //     </div>
  //   ),
  // },
];

export const tableResponse: Patient[] = [
  {
    id: 1,
    name: "Meera Joshi",
    mobile: "9092038491",
    email: "----",
    pincode: "400072",
    treatment: "Fertility Support +2",
    status: "Active",
  },
  {
    id: 2,
    name: "Anjali Kapoor",
    mobile: "9092038491",
    email: "ashok.kumar@gmail.com",
    pincode: "400072",
    treatment: "IVF",
    status: "Deactivated",
  },
  // ...add more rows
];





export const partnerDetailData = {
  profile: {
    partnerName: "Raj Desai",
    partnerGender: "Male",
    partnerAge: "31",
    partnerContactNumber: "12345 67890",
    partnerEmail: "riyadharang@miacare.com",

  },
  medicalHistory: {
    medication: "yes",
    medicationcontent: "This is Medical Condition",
    surgeriesContent: "This is Medical Condition",
    currentMedication: "CureAll 5000, HealMax Plus",
    surgeries: "no",
    MedicalconditionAllergies: ["PCOS", "Thyroid Disorder", "Peanut Allergy", "Lactose Intolerant"],
    familyMedicalHistory: ["Mother had endometriosis", "Father had thyroid"],
    lifestyle: ["Non-smoker", "Occasional alcohol", "Vegetarian diet"],
    exercise: "rarely",
    stress: "high",
  },
  PhysicalAssessmentData: [
    // {
    //   date: "Wed, 19 Feb 2024",
    //   height: "5'4'",
    //   weight: "58",
    //   bmi: "22.1",
    //   bloodGroup: "O+",
    //   systolic: "120",
    //   diastolic: "80",

    //   heartRate: "72",
    // },
    // {
    //   date: "Mon, 22 Feb 2024",
    //   height: "5'4'",
    //   weight: "58",
    //   bmi: "22.1",
    //   bloodGroup: "O+",
    //   systolic: "120",
    //   diastolic: "80",
    //   heartRate: "72",
    // },
  ],
  fertilityAssessment: {
    semenAnalysis: "Yes | Healthy Semen",
    semenAnalysisContent: "This Is Seema Analys Content",
    fertilityIssues: "No",
    fertilityIssuesContent: "This is Fertility Issue Content",
    fertilityTreatment: "No",
    fertilityTreatmentContent: "This Is fertilityTreatmentContent Contet",
    surgeries: "No",
    surgeriesContent: "This Is surgeriesContent Content"
  }
}

export const AppointmentData = [
  {
    id: 1,
    reason: "Ultrasound scan",
    date: "11 Feb 2025",
    time: "3 PM",
    payment: "Pending",
    status: "Upcoming",
    prescription: "N/A",
    invoice: "N/A",
    actions: "View"
  },
  {
    id: 2,
    reason: "Blood Test Review",
    date: "11 Feb 2025",
    time: "3 PM",
    payment: "Done",
    status: "Completed",
    prescription: "file",
    invoice: "file",
    actions: "View"
  },
  {
    id: 3,
    reason: "Physical Check-up",
    date: "11 Feb 2025",
    time: "3 PM",
    payment: "Done",
    status: "Completed",
    prescription: "viewfile",
    invoice: "viewfile",
    actions: "View"
  },
  {
    id: 4,
    reason: "Initial Consultation",
    date: "11 Feb 2025",
    time: "3 PM",
    payment: "Done",
    status: "Completed",
    prescription: "viewfile",
    invoice: "viewfile",
    actions: "View"
  },

];

export const PatientsDetails: SelectPatientType[] = [
  { id: "1", ProfilePhoto: Doctor4, name: "Nisha S" },
  { id: "2", ProfilePhoto: Doctor4, name: "Kavita Sharma" },
  { id: "3", ProfilePhoto: Doctor4, name: "Anjali Rao" },
  { id: "4", ProfilePhoto: Doctor4, name: "Priya Desai" },
];


export const PaymentHistoryData = [
  {
    transactionId: "TXN1234567890",
    serviceType: "Treatment",
    date: "11 Feb 2025",
    time: "3 PM",
    paymentMode: "UPI",
    amount: "₹1,200",
    status: "Pending",
    actions: "View"
  },
  {
    transactionId: "TXN1234567890",
    serviceType: "Treatment",
    date: "11 Feb 2025",
    time: "3 PM",
    paymentMode: "UPI",
    amount: "₹1,200",
    status: "Paid",
    actions: "View"
  },
  {
    transactionId: "TXN1234567890",
    serviceType: "Lab Test",
    date: "11 Feb 2025",
    time: "3 PM",
    paymentMode: "UPI",
    amount: "₹1,200",
    status: "Paid",
    actions: "View"
  },
  {
    transactionId: "TXN1234567890",
    serviceType: "Consultation",
    date: "11 Feb 2025",
    time: "3 PM",
    paymentMode: "UPI",
    amount: "₹1,200",
    status: "Refunded",
    actions: "View"
  },
]
