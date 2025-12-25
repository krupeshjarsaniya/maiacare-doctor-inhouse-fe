// "use client";

// import React, { useEffect, useState } from "react";
// import {
//     Form,
//     InputGroup,

//     Pagination,
// } from "react-bootstrap";
// import { consultationData } from "@/utils/StaticData";
// import Image from "next/image";
// import CommonTable from "@/components/ui/BaseTable";
// import { ColumnDef } from "@tanstack/react-table";
// import { useSearchParams } from "next/navigation";
// import { IoSearch } from "react-icons/io5";
// import { PiSlidersDuotone } from "react-icons/pi";
// import "@/style/Consultation.css";
// import { LuTrash2, LuArrowDown } from "react-icons/lu";
// import AppointmentSummaryCards from "@/components/layout/AppointmentSummaryCards";
// import Link from "next/link";
// import woman from "@/assets/images/woman.png";
// import Button from "./ui/Button";

// // const statusColor: Record<string, string> = {
// //     Completed: "success",
// //     Pending: "primary",
// //     Scheduled: "info",
// //     "No Response": "danger",
// //     Rescheduled: "warning",
// // };

// export type ConsultationStatus =
//     | "Completed"
//     | "Pending"
//     | "Scheduled"
//     | "No Response"
//     | "Rescheduled"
//     | "Cancelled";

// export default function Consultation() {
//     const searchParams = useSearchParams();
//     const filter = searchParams.get("filter");

//     const [filteredData, setFilteredData] = useState(consultationData);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [timeFilter, setTimeFilter] = useState("All Time");


//     // const [leaveData, setLeaveData] = useState<LeaveEntry[]>(defaultLeaveData);
//     const handleDownload = (url: string, name: string) => {
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = name;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };


//     // delete function
//     const handleDelete = (id: number) => {
//         const updated = filteredData.filter((item) => item.id !== id);
//         setFilteredData(updated);
//     };


//     // useEffect(() => {
//     //     if (filter === "completed") {
//     //         setFilteredData(consultationData.filter(item => item.status === "Completed"));
//     //     } else if (filter === "cancelled") {
//     //         setFilteredData(consultationData.filter(item => item.status === "Cancelled"));
//     //     } else {
//     //         setFilteredData(consultationData);
//     //     }
//     // }, [filter]);
//     useEffect(() => {
//         let data = consultationData;

//         // 🔹 filter by status (query param)
//         if (filter === "completed") {
//             data = data.filter((item) => item.status === "Completed");
//         } else if (filter === "cancelled") {
//             data = data.filter((item) => item.status === "Cancelled");
//         }

//         // 🔹 filter by search
//         if (searchQuery.trim() !== "") {
//             const q = searchQuery.toLowerCase();
//             data = data.filter(
//                 (item) =>
//                     item.name.toLowerCase().includes(q) ||
//                     item.email.toLowerCase().includes(q) ||
//                     item.mobile.toLowerCase().includes(q)
//             );
//         }

//         // 🔹 filter by time
//         if (timeFilter !== "All Time") {
//             const now = new Date();

//             data = data.filter((item) => {
//                 if (!item.date) return false; // skip if no date
//                 const itemDate = new Date(item.date);
//                 if (isNaN(itemDate.getTime())) return false;

//                 if (timeFilter === "Today") {
//                     return itemDate.toDateString() === now.toDateString();
//                 }

//                 if (timeFilter === "This Week") {
//                     const weekStart = new Date(now);
//                     weekStart.setDate(now.getDate() - now.getDay()); // Sunday
//                     weekStart.setHours(0, 0, 0, 0);

//                     const weekEnd = new Date(weekStart);
//                     weekEnd.setDate(weekStart.getDate() + 7); // Next Sunday

//                     return itemDate >= weekStart && itemDate < weekEnd;
//                 }

//                 if (timeFilter === "This Month") {
//                     return (
//                         itemDate.getMonth() === now.getMonth() &&
//                         itemDate.getFullYear() === now.getFullYear()
//                     );
//                 }

//                 return true;
//             });
//         }

//         setFilteredData(data);
//     }, [filter, searchQuery, timeFilter]);



//     const columns: ColumnDef<any>[] = [
//         {
//             header: "#",
//             cell: (info) => {
//                 const index = info.row.index + 1; // row number start from 1
//                 return index < 10 ? `0${index}` : index; // format 01,02,03
//             },
//         },

//         {
//             header: "Name",
//             cell: (info) => {
//                 const imgSrc = info.row.original.image;
//                 const name = info.row.original.name;
//                 const id = info.row.original.id; // <-- Make sure you have an `id`

//                 return (
//                     <Link href={`/patients/${id}`} className="text-decoration-none text-dark">
//                         <div className="d-flex align-items-center gap-2">
//                             {typeof imgSrc === "string" ? (
//                                 <img
//                                     src={imgSrc}
//                                     alt={name}
//                                     className="rounded-circle border"
//                                     width="36"
//                                     height="36"
//                                 />
//                             ) : (
//                                 <Image
//                                     src={imgSrc}
//                                     alt={name}
//                                     width={36}
//                                     height={36}
//                                     className="rounded-circle border"
//                                 />
//                             )}
//                             {name}
//                         </div>
//                     </Link>
//                 );
//             },
//         },
//         {
//             header: "Mobile No",
//             accessorKey: "mobile",
//         },
//         {
//             header: "Email",
//             accessorKey: "email",
//         },
//         {
//             header: "Pin Code",
//             accessorKey: "pin",
//         },
//         {
//             header: "Status",
//             cell: (info) => {
//                 const status = info.row.original.status;
//                 const statusClass = `status-${status.toLowerCase().replace(/\s/g, "")}`;
//                 return (
//                     <span className={`status-pill ${statusClass}`}>
//                         {status}
//                     </span>
//                 );
//             },
//         },
//         {
//             header: "Actions",
//             cell: (info) => {
//                 const id = info.row.original.id; // <-- use id directly
//                 return (
//                     <div className="text-center d-flex">
//                         <Button
//                             variant="light"
//                             size="sm"
//                             className="d-flex bg-white justify-content-center align-items-center border profile-card-boeder rounded Download-border me-2"
//                             onClick={() => handleDownload(`/files/${name}.pdf`, `${name}.pdf`)}
//                         >
//                             {/* <LuArrowDown className="arrow-down" /> */}
//                             <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                 <path d="M15.2594 3.85684L11.768 0.366217C11.6519 0.250114 11.5141 0.158014 11.3624 0.0951779C11.2107 0.0323417 11.0482 0 10.884 0C10.7198 0 10.5572 0.0323417 10.4056 0.0951779C10.2539 0.158014 10.1161 0.250114 10 0.366217L0.366412 9.99981C0.249834 10.1155 0.157407 10.2531 0.0945056 10.4048C0.0316038 10.5565 -0.000518312 10.7192 6.32418e-06 10.8834V14.3748C6.32418e-06 14.7063 0.131702 15.0243 0.366123 15.2587C0.600543 15.4931 0.918486 15.6248 1.25001 15.6248H14.375C14.5408 15.6248 14.6997 15.559 14.8169 15.4418C14.9342 15.3245 15 15.1656 15 14.9998C15 14.8341 14.9342 14.6751 14.8169 14.5579C14.6997 14.4407 14.5408 14.3748 14.375 14.3748H6.50938L15.2594 5.62481C15.3755 5.50873 15.4676 5.37092 15.5304 5.21925C15.5933 5.06757 15.6256 4.905 15.6256 4.74083C15.6256 4.57665 15.5933 4.41408 15.5304 4.26241C15.4676 4.11073 15.3755 3.97292 15.2594 3.85684ZM4.74141 14.3748H1.25001V10.8834L8.12501 4.0084L11.6164 7.49981L4.74141 14.3748ZM12.5 6.61622L9.00938 3.12481L10.8844 1.24981L14.375 4.74122L12.5 6.61622Z" fill="#2B4360" />
//                             </svg>

//                         </Button>
//                         <Button
//                             variant="light"
//                             size="sm"
//                             className="btn btn-sm profile-card-boeder border bg-white"
//                             onClick={() => handleDelete(id)} // <-- pass id
//                         >
//                             <LuTrash2 className="trash" />
//                         </Button>
//                     </div>
//                 );
//             },
//         }
//     ];

//     return (
//         <div className="">
//             {/* Summary Cards */}
//             {/* <AppointmentSummaryCards target="patients" /> */}

//             {/* Search and Filter */}
//             <div className="d-flex justify-content-between align-items-center flex-wrap mb-3 searchbar-content">
//                 {/* Search Input */}
//                 <div className="d-flex align-items-center gap-2 mb-1 Consultations-image">
//                     {/* Search Input */}
//                     <InputGroup className="custom-search-group">
//                         <Form.Control
//                             placeholder="Search"
//                             className="custom-search-input"
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                         />
//                         <InputGroup.Text className="custom-search-icon">
//                             <IoSearch className="search-icon" />
//                         </InputGroup.Text>
//                     </InputGroup>

//                     <div className="border custom-filter-button p-2 consultations-image-summary-cards">
//                         <Image src={woman} alt="Total" className="img-fluid women-image" />
//                         <div className="consultations-image-book">
//                             <div className="Consultations-book">98 Consultations</div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Sort + Filter */}
//                 <div className="d-flex align-items-center gap-2 mb-2">
//                     <span className="text-muted small short-by">Sort by:</span>
//                     <Form.Select
//                         className="custom-sort-select"
//                         value={timeFilter}
//                         onChange={(e) => setTimeFilter(e.target.value)} // ✅ update state
//                     >
//                         <option>All Time</option>
//                         <option>Today</option>
//                         <option>This Week</option>
//                         <option>This Month</option>
//                     </Form.Select>
//                     <Button variant="light" className="border custom-filter-button">
//                         <PiSlidersDuotone />
//                     </Button>
//                 </div>

//             </div>

//             {/* Table */}
//             <CommonTable data={filteredData} columns={columns} />

//             {/* Pagination */}
//             {/* <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
//                 <small className="text-muted">Showing {filteredData.length} of {consultationData.length} results</small>
//                 <Pagination size="sm" className="mb-0">
//                     <Pagination.Prev disabled />
//                     {[1, 2, 3, 4, 5].map((p) => (
//                         <Pagination.Item key={p} active={p === 1}>
//                             {p}
//                         </Pagination.Item>
//                     ))}
//                     <Pagination.Ellipsis disabled />
//                     <Pagination.Item>99</Pagination.Item>
//                     <Pagination.Next />
//                 </Pagination>
//             </div> */}
//         </div>
//     );
// }



// "use client";

// import React, { useEffect, useState } from "react";
// import {
//     Form,
//     InputGroup,
// } from "react-bootstrap";
// import Image from "next/image";
// import CommonTable from "@/components/ui/BaseTable";
// import { ColumnDef } from "@tanstack/react-table";
// import { useSearchParams } from "next/navigation";
// import { IoSearch } from "react-icons/io5";
// import { PiSlidersDuotone } from "react-icons/pi";
// import "@/style/Consultation.css";
// import { LuTrash2 } from "react-icons/lu";
// import Link from "next/link";
// import woman from "@/assets/images/woman.png";
// import Button from "./ui/Button";

// // ✅ API
// import { getAll } from "@/utils/apis/apiHelper";
// import { patientDelete } from "@/utils/apis/apiHelper";

// export type ConsultationStatus =
//     | "Completed"
//     | "Pending"
//     | "Scheduled"
//     | "No Response"
//     | "Rescheduled"
//     | "Cancelled";

// export default function Consultation() {
//     const searchParams = useSearchParams();
//     const filter = searchParams.get("filter");

//     const [patientData, setPatientData] = useState<any[]>([]);
//     const [filteredData, setFilteredData] = useState<any[]>([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [timeFilter, setTimeFilter] = useState("All Time");
//     const handleDownload = (url: string, name: string) => {
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = name;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };
//     // --------------------------------------
//     // 🔹 FETCH DATA FROM API
//     // --------------------------------------
//     useEffect(() => {
//         const fetchPatients = async () => {
//             try {
//                 const res = await getAll();

//                 // Adjust based on your API response structure
//                 const list = res?.data?.data || res?.data || [];

//                 setPatientData(list);
//             } catch (error) {
//                 console.error("Error fetching patients:", error);
//             }
//         };

//         fetchPatients();
//     }, []);
//     const handleDelete = async (appointmentId: string) => {
//         try {
//             await patientDelete(appointmentId);

//             setFilteredData(prev =>
//                 prev.filter(item => item.appointment_id !== appointmentId)
//             );

//             setPatientData(prev =>
//                 prev.filter(item => item.appointment_id !== appointmentId)
//             );

//         } catch (error) {
//             console.error("Delete Error:", error);
//         }
//     };



//     // --------------------------------------
//     // 🔹 APPLY FILTERS (search, status, time)
//     // --------------------------------------
//     useEffect(() => {
//         let data = [...patientData];

//         // 🔸 Filter by status using query param
//         if (filter === "completed") {
//             data = data.filter((item) => item.status === "Completed");
//         } else if (filter === "cancelled") {
//             data = data.filter((item) => item.status === "Cancelled");
//         }

//         // 🔸 Search filter
//         if (searchQuery.trim() !== "") {
//             const q = searchQuery.toLowerCase();
//             data = data.filter(
//                 (item) =>
//                     item.name?.toLowerCase().includes(q) ||
//                     item.email?.toLowerCase().includes(q) ||
//                     item.mobile?.toLowerCase().includes(q)
//             );
//         }

//         // 🔸 Time filter
//         if (timeFilter !== "All Time") {
//             const now = new Date();

//             data = data.filter((item) => {
//                 if (!item.date) return false;
//                 const itemDate = new Date(item.date);
//                 if (isNaN(itemDate.getTime())) return false;

//                 if (timeFilter === "Today") {
//                     return itemDate.toDateString() === now.toDateString();
//                 }

//                 if (timeFilter === "This Week") {
//                     const weekStart = new Date(now);
//                     weekStart.setDate(now.getDate() - now.getDay());
//                     weekStart.setHours(0, 0, 0, 0);
//                     const weekEnd = new Date(weekStart);
//                     weekEnd.setDate(weekStart.getDate() + 7);
//                     return itemDate >= weekStart && itemDate < weekEnd;
//                 }

//                 if (timeFilter === "This Month") {
//                     return (
//                         itemDate.getMonth() === now.getMonth() &&
//                         itemDate.getFullYear() === now.getFullYear()
//                     );
//                 }

//                 return true;
//             });
//         }

//         setFilteredData(data);
//     }, [patientData, filter, searchQuery, timeFilter]);

//     // --------------------------------------
//     // 🔹 Table Columns
//     // --------------------------------------
//     const columns: ColumnDef<any>[] = [
//         {
//             header: "#",
//             cell: (info) => {
//                 const index = info.row.index + 1;
//                 return index < 10 ? `0${index}` : index;
//             },
//         },

//         {
//             header: "Name",
//             cell: (info) => {
//                 const row = info.row.original;
//                 const id = info.row.original.patient_id; // <-- Make sure you have an `id`

//                 return (
//                     <Link href={`/patients/${id}`} className="text-decoration-none text-dark">
//                         <div className="d-flex align-items-center gap-2">
//                             <Image
//                                 src={row.image || woman}
//                                 alt={row.name}
//                                 width={36}
//                                 height={36}
//                                 className="rounded-circle border"
//                             />
//                             {row.name}
//                         </div>
//                     </Link>
//                 );
//             },
//         },

//         { header: "Mobile", accessorKey: "contactNumber", },
//         { header: "Email", accessorKey: "email" },
//         { header: "Pin Code", accessorKey: "pincode" },

//         {
//             header: "Status",
//             cell: (info) => {
//                 const status = info.row.original.status;
//                 const cls = `status-${status.toLowerCase().replace(/\s/g, "")}`;
//                 return <span className={`status-pill ${cls}`}>{status}</span>;
//             },
//         },

//         {
//             header: "Actions",
//             cell: (info) => {
//                 const row = info.row.original;
//                 return (
//                     <div className="d-flex">
//                         <Button
//                             variant="light"
//                             size="sm"
//                             className="d-flex bg-white justify-content-center align-items-center border profile-card-boeder rounded Download-border me-2"
//                             onClick={() => handleDownload(`/files/${name}.pdf`, `${name}.pdf`)}
//                         >
//                             {/* <LuArrowDown className="arrow-down" /> */}
//                             <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                 <path d="M15.2594 3.85684L11.768 0.366217C11.6519 0.250114 11.5141 0.158014 11.3624 0.0951779C11.2107 0.0323417 11.0482 0 10.884 0C10.7198 0 10.5572 0.0323417 10.4056 0.0951779C10.2539 0.158014 10.1161 0.250114 10 0.366217L0.366412 9.99981C0.249834 10.1155 0.157407 10.2531 0.0945056 10.4048C0.0316038 10.5565 -0.000518312 10.7192 6.32418e-06 10.8834V14.3748C6.32418e-06 14.7063 0.131702 15.0243 0.366123 15.2587C0.600543 15.4931 0.918486 15.6248 1.25001 15.6248H14.375C14.5408 15.6248 14.6997 15.559 14.8169 15.4418C14.9342 15.3245 15 15.1656 15 14.9998C15 14.8341 14.9342 14.6751 14.8169 14.5579C14.6997 14.4407 14.5408 14.3748 14.375 14.3748H6.50938L15.2594 5.62481C15.3755 5.50873 15.4676 5.37092 15.5304 5.21925C15.5933 5.06757 15.6256 4.905 15.6256 4.74083C15.6256 4.57665 15.5933 4.41408 15.5304 4.26241C15.4676 4.11073 15.3755 3.97292 15.2594 3.85684ZM4.74141 14.3748H1.25001V10.8834L8.12501 4.0084L11.6164 7.49981L4.74141 14.3748ZM12.5 6.61622L9.00938 3.12481L10.8844 1.24981L14.375 4.74122L12.5 6.61622Z" fill="#2B4360" />
//                             </svg>

//                         </Button>
//                         <Button
//                             variant="light"
//                             size="sm"
//                             className="btn btn-sm profile-card-boeder border bg-white me-2"
//                             onClick={() => handleDelete(row.appointment_id)}
//                         >
//                             <LuTrash2 className="trash" />
//                         </Button>

//                     </div>
//                 );
//             },
//         },
//     ];

//     return (
//         <div>

//             {/* 🔹 Search + Summary Section */}
//             <div className="d-flex justify-content-between align-items-center flex-wrap mb-3 searchbar-content">

//                 {/* Search */}
//                 <div className="d-flex align-items-center gap-2 mb-1 Consultations-image">
//                     <InputGroup className="custom-search-group">
//                         <Form.Control
//                             placeholder="Search"
//                             className="custom-search-input"
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                         />
//                         <InputGroup.Text className="custom-search-icon">
//                             <IoSearch className="search-icon" />
//                         </InputGroup.Text>
//                     </InputGroup>

//                     <div className="border custom-filter-button p-2 consultations-image-summary-cards">
//                         <Image src={woman} alt="Total" className="img-fluid women-image" />
//                         <div className="consultations-image-book">
//                             <div className="Consultations-book">{filteredData.length} Consultations</div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Sort Filter */}
//                 <div className="d-flex align-items-center gap-2 mb-2">
//                     <span className="text-muted small short-by">Sort by:</span>
//                     <Form.Select
//                         className="custom-sort-select"
//                         value={timeFilter}
//                         onChange={(e) => setTimeFilter(e.target.value)}
//                     >
//                         <option>All Time</option>
//                         <option>Today</option>
//                         <option>This Week</option>
//                         <option>This Month</option>
//                     </Form.Select>

//                     <Button variant="light" className="border custom-filter-button">
//                         <PiSlidersDuotone />
//                     </Button>
//                 </div>
//             </div>

//             {/* Table */}
//             <CommonTable data={filteredData} columns={columns} />
//         </div>
//     );
// }




"use client";

import React, { useEffect, useState } from "react";
import {
    Dropdown,
    Form,
    InputGroup,
} from "react-bootstrap";
import Image from "next/image";
import CommonTable from "@/components/ui/BaseTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { PiSlidersDuotone } from "react-icons/pi";
import "@/style/Consultation.css";
import { LuTrash2 } from "react-icons/lu";
import Link from "next/link";
import woman from "@/assets/images/woman.png";
import Button from "./ui/Button";
import Skeleton from "react-loading-skeleton";
// ✅ API
import { getAll } from "@/utils/apis/apiHelper";
import { patientDelete } from "@/utils/apis/apiHelper";
import patientImage from "@/assets/images/Img-1.png";
import Modal from "./ui/Modal";
import toast from "react-hot-toast";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RescheduleAppointment, SuccessModalReschedule } from "./form/RescheduleAppointment";
import { CancelAppointment, SuccessModalCancel } from "./form/CancelAppointment";

export type ConsultationStatus =
    | "Completed"
    | "Pending"
    | "Scheduled"
    | "No Response"
    | "Rescheduled"
    | "Cancelled";

export default function Consultation() {
    const [patientTotal, setPatientTotal] = useState<number>(0);
    const [tableLimit, setTableLimit] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0)
    const [activePage, setActivePage] = useState<number>(1);
    const searchParams = useSearchParams();
    const filter = searchParams.get("filter");
    const [loading, setLoading] = useState<boolean>(true);
    const [patientData, setPatientData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [patientDeleteId, setPatientDeleteId] = useState<string | undefined>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [timeFilter, setTimeFilter] = useState("All Time");

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showSuccessModalCancel, setShowSuccessModalCancel] = useState(false);

    const [RescheduleModal, setRescheduleModal] = useState<boolean>(false);
    const [CancelModal, setCancelModal] = useState<boolean>(false);

    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    
    const router = useRouter();

    const handleDownload = (url: string, name: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    // --------------------------------------
    // 🔹 FETCH DATA FROM API
    // --------------------------------------

    const fetchallpatient = (searchValue = "") => {
        const tableobj = {
            page: activePage,
            search: searchValue, // 🔥 pass search here
        };

        setLoading(true);

        setTimeout(() => {
            getAll(tableobj)
                .then((response) => {
                    if (response.data.status) {
                        setPatientData(response.data.data);
                        setPatientTotal(response.data.totalConsults); // ✅ FIX HERE
                        setTableLimit(response.data.limit);
                        setTotalPages(response.data.pages);
                    } else {
                        console.log("Error...");
                    }
                })
                .catch((err) => {
                    console.log("error", err?.response);

                    const apiError = err?.response?.data;
                    const fieldError = apiError?.details?.errors
                        ? Object.values(apiError.details.errors)[0]
                        : null;

                    const message =
                        fieldError ||
                        apiError?.details?.message ||
                        apiError?.message ||
                        "Something went wrong";

                    toast.error(message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }, 500);
    };


    useEffect(() => {
        fetchallpatient();
    }, [])

    useEffect(() => {
        fetchallpatient(searchQuery);
    }, [activePage]);


    const handleDelete = async (appointmentId: string) => {
        try {
            await patientDelete(appointmentId);
            setShowModal(false)
            setFilteredData(prev =>
                prev.filter(item => item.appointment_id !== appointmentId)
            );

            setPatientData(prev =>
                prev.filter(item => item.appointment_id !== appointmentId)
            );

        } catch (error) {
            console.error("Delete Error:", error);
        }
    };



    // --------------------------------------
    // 🔹 APPLY FILTERS (search, status, time)
    // --------------------------------------
    useEffect(() => {
        let data = [...patientData];

        // 🔸 Filter by status using query param
        if (filter === "completed") {
            data = data.filter((item) => item.status === "Completed");
        } else if (filter === "cancelled") {
            data = data.filter((item) => item.status === "Cancelled");
        }

        // 🔸 Search filter
        if (searchQuery.trim() !== "") {
            const q = searchQuery.toLowerCase();
            data = data.filter(
                (item) =>
                    item.name?.toLowerCase().includes(q) ||
                    item.email?.toLowerCase().includes(q) ||
                    item.mobile?.toLowerCase().includes(q)
            );
        }

        // 🔸 Time filter
        if (timeFilter !== "All Time") {
            const now = new Date();

            data = data.filter((item) => {
                if (!item.date) return false;
                const itemDate = new Date(item.date);
                if (isNaN(itemDate.getTime())) return false;

                if (timeFilter === "Today") {
                    return itemDate.toDateString() === now.toDateString();
                }

                if (timeFilter === "This Week") {
                    const weekStart = new Date(now);
                    weekStart.setDate(now.getDate() - now.getDay());
                    weekStart.setHours(0, 0, 0, 0);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 7);
                    return itemDate >= weekStart && itemDate < weekEnd;
                }

                if (timeFilter === "This Month") {
                    return (
                        itemDate.getMonth() === now.getMonth() &&
                        itemDate.getFullYear() === now.getFullYear()
                    );
                }

                return true;
            });
        }

        setFilteredData(data);
    }, [patientData, filter, searchQuery, timeFilter]);

    // --------------------------------------
    // 🔹 Table Columns
    // --------------------------------------
    const columns: ColumnDef<any>[] = [
        {
            header: "#",
            cell: (info) => {
                const index = info.row.index + 1;
                return index < 10 ? `0${index}` : index;
            },
        },

        {
            header: "Name",
            cell: (info) => {
                const row = info.row.original;

                const id = info.row.original.patient_id; // <-- Make sure you have an `id`

                return (
                    <Link href={`/patients/${id}`} className="text-decoration-none text-dark">
                        <div className="d-flex align-items-center gap-2">
                            {/* <Image
                                src={row.image || woman}
                                alt={row.name || "patient"}
                                width={36}
                                height={36}
                                className="rounded-circle border"
                            /> */}
                            <img
                                src={row?.profileImage || patientImage.src}
                                width={48}
                                height={48}
                                className="rounded-circle me-3"
                            />
                            {/* <img
                                            src={row?.profileImage ? row.profileImage : patientImage}
                                            alt="Patient"
                                            width={60}
                                            height={60}
                                            className="rounded-circle me-3"
                                          /> */}
                            {row.name}
                        </div>
                    </Link>
                );
            },
        },

        { header: " Mobile No", accessorKey: "contactNumber", },
        { header: "Email", accessorKey: "email" },
        { header: "Pin Code", accessorKey: "pincode" },

        {
            header: "Status",
            cell: (info) => {
                const status = info.row.original.status;
                const cls = `status-${status.toLowerCase().replace(/\s/g, "")}`;
                return <span className={`status-pill ${cls}`}>{status}</span>;
            },
        },

        {
            header: "Actions",
            cell: (info) => {
                const row = info.row.original;
                return (
                    // <div className="d-flex">
                    //     <Button
                    //         variant="light"
                    //         size="sm"
                    //         className="d-flex bg-white justify-content-center align-items-center border profile-card-boeder  Download-border me-2"
                    //         onClick={() => handleDownload(`/files/${name}.pdf`, `${name}.pdf`)}
                    //     >
                    //         {/* <LuArrowDown className="arrow-down" /> */}
                    //         <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    //             <path d="M15.2594 3.85684L11.768 0.366217C11.6519 0.250114 11.5141 0.158014 11.3624 0.0951779C11.2107 0.0323417 11.0482 0 10.884 0C10.7198 0 10.5572 0.0323417 10.4056 0.0951779C10.2539 0.158014 10.1161 0.250114 10 0.366217L0.366412 9.99981C0.249834 10.1155 0.157407 10.2531 0.0945056 10.4048C0.0316038 10.5565 -0.000518312 10.7192 6.32418e-06 10.8834V14.3748C6.32418e-06 14.7063 0.131702 15.0243 0.366123 15.2587C0.600543 15.4931 0.918486 15.6248 1.25001 15.6248H14.375C14.5408 15.6248 14.6997 15.559 14.8169 15.4418C14.9342 15.3245 15 15.1656 15 14.9998C15 14.8341 14.9342 14.6751 14.8169 14.5579C14.6997 14.4407 14.5408 14.3748 14.375 14.3748H6.50938L15.2594 5.62481C15.3755 5.50873 15.4676 5.37092 15.5304 5.21925C15.5933 5.06757 15.6256 4.905 15.6256 4.74083C15.6256 4.57665 15.5933 4.41408 15.5304 4.26241C15.4676 4.11073 15.3755 3.97292 15.2594 3.85684ZM4.74141 14.3748H1.25001V10.8834L8.12501 4.0084L11.6164 7.49981L4.74141 14.3748ZM12.5 6.61622L9.00938 3.12481L10.8844 1.24981L14.375 4.74122L12.5 6.61622Z" fill="#2B4360" />
                    //         </svg>

                    //     </Button>
                    //     <Button
                    //         variant="light"
                    //         size="sm"
                    //         className="btn btn-sm profile-card-boeder border bg-white me-2"
                    //         onClick={() => { setPatientDeleteId(row.appointment_id); setShowModal(true) }}
                    //     >
                    //         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 15 17" fill="none">
                    //             <path d="M14.375 2.5H11.25V1.875C11.25 1.37772 11.0525 0.900806 10.7008 0.549175C10.3492 0.197544 9.87228 0 9.375 0H5.625C5.12772 0 4.65081 0.197544 4.29917 0.549175C3.94754 0.900806 3.75 1.37772 3.75 1.875V2.5H0.625C0.45924 2.5 0.300269 2.56585 0.183058 2.68306C0.0658481 2.80027 0 2.95924 0 3.125C0 3.29076 0.0658481 3.44973 0.183058 3.56694C0.300269 3.68415 0.45924 3.75 0.625 3.75H1.25V15C1.25 15.3315 1.3817 15.6495 1.61612 15.8839C1.85054 16.1183 2.16848 16.25 2.5 16.25H12.5C12.8315 16.25 13.1495 16.1183 13.3839 15.8839C13.6183 15.6495 13.75 15.3315 13.75 15V3.75H14.375C14.5408 3.75 14.6997 3.68415 14.8169 3.56694C14.9342 3.44973 15 3.29076 15 3.125C15 2.95924 14.9342 2.80027 14.8169 2.68306C14.6997 2.56585 14.5408 2.5 14.375 2.5ZM5 1.875C5 1.70924 5.06585 1.55027 5.18306 1.43306C5.30027 1.31585 5.45924 1.25 5.625 1.25H9.375C9.54076 1.25 9.69973 1.31585 9.81694 1.43306C9.93415 1.55027 10 1.70924 10 1.875V2.5H5V1.875ZM12.5 15H2.5V3.75H12.5V15ZM6.25 6.875V11.875C6.25 12.0408 6.18415 12.1997 6.06694 12.3169C5.94973 12.4342 5.79076 12.5 5.625 12.5C5.45924 12.5 5.30027 12.4342 5.18306 12.3169C5.06585 12.1997 5 12.0408 5 11.875V6.875C5 6.70924 5.06585 6.55027 5.18306 6.43306C5.30027 6.31585 5.45924 6.25 5.625 6.25C5.79076 6.25 5.94973 6.31585 6.06694 6.43306C6.18415 6.55027 6.25 6.70924 6.25 6.875ZM10 6.875V11.875C10 12.0408 9.93415 12.1997 9.81694 12.3169C9.69973 12.4342 9.54076 12.5 9.375 12.5C9.20924 12.5 9.05027 12.4342 8.93306 12.3169C8.81585 12.1997 8.75 12.0408 8.75 11.875V6.875C8.75 6.70924 8.81585 6.55027 8.93306 6.43306C9.05027 6.31585 9.20924 6.25 9.375 6.25C9.54076 6.25 9.69973 6.31585 9.81694 6.43306C9.93415 6.55027 10 6.70924 10 6.875Z" fill="#E85966" />
                    //         </svg>
                    //     </Button>
                    // </div>

                    <div onClick={(e) => e.stopPropagation()}>
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
                                        <span className="settings-accordion-subtitle m-0" onClick={(e) => { setRescheduleModal?.(true);setSelectedPatient(row); }}>Reschedule</span>
                                    </div>
                                </Dropdown.Item>
                                <Dropdown.Item className="no-hover">
                                    <div className="d-flex align-items-center gap-2 ">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M11.4018 10.4735C11.5251 10.5968 11.5943 10.764 11.5943 10.9383C11.5943 11.1127 11.5251 11.2799 11.4018 11.4032C11.2785 11.5265 11.1113 11.5957 10.9369 11.5957C10.7626 11.5957 10.5954 11.5265 10.4721 11.4032L6.99998 7.92997L3.52677 11.4021C3.40349 11.5254 3.23628 11.5946 3.06193 11.5946C2.88758 11.5946 2.72037 11.5254 2.59709 11.4021C2.4738 11.2788 2.40454 11.1116 2.40454 10.9372C2.40454 10.7629 2.4738 10.5957 2.59709 10.4724L6.07029 7.00028L2.59818 3.52708C2.4749 3.40379 2.40563 3.23658 2.40563 3.06223C2.40563 2.88788 2.4749 2.72067 2.59818 2.59739C2.72146 2.4741 2.88867 2.40484 3.06302 2.40484C3.23737 2.40484 3.40458 2.4741 3.52787 2.59739L6.99998 6.07059L10.4732 2.59684C10.5965 2.47356 10.7637 2.4043 10.938 2.4043C11.1124 2.4043 11.2796 2.47356 11.4029 2.59684C11.5262 2.72013 11.5954 2.88733 11.5954 3.06169C11.5954 3.23604 11.5262 3.40324 11.4029 3.52653L7.92966 7.00028L11.4018 10.4735Z" fill="#2B4360" />
                                        </svg>
                                        <span className="appoiment-dots-open-danger m-0" onClick={(e) => { setCancelModal?.(true); }}>Cancel Appointment</span>
                                    </div>
                                </Dropdown.Item>
                                <Dropdown.Item className="no-hover">
                                    <div className="d-flex align-items-center gap-2 ">
                                        <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.2812 2.1875H8.3125V1.53125C8.3125 1.12514 8.15117 0.735658 7.86401 0.448493C7.57684 0.161328 7.18736 0 6.78125 0H4.15625C3.75014 0 3.36066 0.161328 3.07349 0.448493C2.78633 0.735658 2.625 1.12514 2.625 1.53125V2.1875H0.65625C0.482202 2.1875 0.315282 2.25664 0.192211 2.37971C0.0691404 2.50278 0 2.6697 0 2.84375C0 3.0178 0.0691404 3.18472 0.192211 3.30779C0.315282 3.43086 0.482202 3.5 0.65625 3.5H0.875V10.9375C0.875 11.2276 0.990234 11.5058 1.19535 11.7109C1.40047 11.916 1.67867 12.0312 1.96875 12.0312H8.96875C9.25883 12.0312 9.53703 11.916 9.74215 11.7109C9.94727 11.5058 10.0625 11.2276 10.0625 10.9375V3.5H10.2812C10.4553 3.5 10.6222 3.43086 10.7453 3.30779C10.8684 3.18472 10.9375 3.0178 10.9375 2.84375C10.9375 2.6697 10.8684 2.50278 10.7453 2.37971C10.6222 2.25664 10.4553 2.1875 10.2812 2.1875ZM3.9375 1.53125C3.9375 1.47323 3.96055 1.41759 4.00157 1.37657C4.04259 1.33555 4.09823 1.3125 4.15625 1.3125H6.78125C6.83927 1.3125 6.89491 1.33555 6.93593 1.37657C6.97695 1.41759 7 1.47323 7 1.53125V2.1875H3.9375V1.53125ZM8.75 10.7188H2.1875V3.5H8.75V10.7188ZM4.8125 5.25V8.75C4.8125 8.92405 4.74336 9.09097 4.62029 9.21404C4.49722 9.33711 4.3303 9.40625 4.15625 9.40625C3.9822 9.40625 3.81528 9.33711 3.69221 9.21404C3.56914 9.09097 3.5 8.92405 3.5 8.75V5.25C3.5 5.07595 3.56914 4.90903 3.69221 4.78596C3.81528 4.66289 3.9822 4.59375 4.15625 4.59375C4.3303 4.59375 4.49722 4.66289 4.62029 4.78596C4.74336 4.90903 4.8125 5.07595 4.8125 5.25ZM7.4375 5.25V8.75C7.4375 8.92405 7.36836 9.09097 7.24529 9.21404C7.12222 9.33711 6.9553 9.40625 6.78125 9.40625C6.6072 9.40625 6.44028 9.33711 6.31721 9.21404C6.19414 9.09097 6.125 8.92405 6.125 8.75V5.25C6.125 5.07595 6.19414 4.90903 6.31721 4.78596C6.44028 4.66289 6.6072 4.59375 6.78125 4.59375C6.9553 4.59375 7.12222 4.66289 7.24529 4.78596C7.36836 4.90903 7.4375 5.07595 7.4375 5.25Z" fill="#E85966" />
                                        </svg>

                                        <span className="appoiment-dots-open-danger text-danger m-0" onClick={() => { setPatientDeleteId(row.appointment_id); setShowModal(true) }}>Delete</span>
                                    </div>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            {/* 🔹 Search + Summary Section */}
            <div className="d-flex justify-content-between align-items-center flex-wrap mb-3 searchbar-content">

                {/* Search */}
                <div className="d-flex align-items-center gap-2 mb-1 Consultations-image">
                    {loading ? (
                        <Skeleton width={250} height={45} />
                    ) : (
                        <InputGroup className="custom-search-group">
                            <Form.Control
                                placeholder="Search"
                                className="custom-search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <InputGroup.Text className="custom-search-icon">
                                <IoSearch className="search-icon" />
                            </InputGroup.Text>
                        </InputGroup>
                    )}

                    {loading ? (
                        <div className="d-flex align-items-center gap-2">
                            <Skeleton circle height={50} width={50} />
                            <Skeleton width={120} height={20} />
                        </div>
                    ) : (
                        <div className="border custom-filter-button p-2 consultations-image-summary-cards">
                            <Image src={woman} alt="Total" className="img-fluid women-image" />
                            <div className="consultations-image-book">
                                <div className="Consultations-book">  {searchQuery || filter ? filteredData.length : patientTotal} Consultations</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sort Filter */}
                <div className="d-flex align-items-center gap-2 mb-2">
                    {loading ? (
                        <>
                            <Skeleton width={60} />
                            <Skeleton width={120} height={40} />
                            <Skeleton width={45} height={40} />
                        </>
                    ) : (
                        <>
                            <span className="text-muted small short-by">Sort by:</span>
                            <Form.Select
                                className="custom-sort-select"
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value)}
                            >
                                <option>All Time</option>
                                <option>Today</option>
                                <option>This Week</option>
                                <option>This Month</option>
                            </Form.Select>

                            <Button variant="light" className="border custom-filter-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M6.00002 9.84375V3.75C6.00002 3.55109 5.92101 3.36032 5.78035 3.21967C5.6397 3.07902 5.44894 3 5.25002 3C5.05111 3 4.86035 3.07902 4.71969 3.21967C4.57904 3.36032 4.50002 3.55109 4.50002 3.75V9.84375C3.85471 10.009 3.28274 10.3843 2.87429 10.9105C2.46584 11.4367 2.24414 12.0839 2.24414 12.75C2.24414 13.4161 2.46584 14.0633 2.87429 14.5895C3.28274 15.1157 3.85471 15.491 4.50002 15.6562V20.25C4.50002 20.4489 4.57904 20.6397 4.71969 20.7803C4.86035 20.921 5.05111 21 5.25002 21C5.44894 21 5.6397 20.921 5.78035 20.7803C5.92101 20.6397 6.00002 20.4489 6.00002 20.25V15.6562C6.64533 15.491 7.2173 15.1157 7.62575 14.5895C8.0342 14.0633 8.25591 13.4161 8.25591 12.75C8.25591 12.0839 8.0342 11.4367 7.62575 10.9105C7.2173 10.3843 6.64533 10.009 6.00002 9.84375ZM5.25002 14.25C4.95335 14.25 4.66334 14.162 4.41667 13.9972C4.16999 13.8324 3.97774 13.5981 3.8642 13.324C3.75067 13.0499 3.72097 12.7483 3.77885 12.4574C3.83672 12.1664 3.97958 11.8991 4.18936 11.6893C4.39914 11.4796 4.66642 11.3367 4.95739 11.2788C5.24836 11.2209 5.54996 11.2506 5.82405 11.3642C6.09814 11.4777 6.33241 11.67 6.49723 11.9166C6.66205 12.1633 6.75002 12.4533 6.75002 12.75C6.75002 13.1478 6.59199 13.5294 6.31068 13.8107C6.02938 14.092 5.64785 14.25 5.25002 14.25ZM12.75 5.34375V3.75C12.75 3.55109 12.671 3.36032 12.5304 3.21967C12.3897 3.07902 12.1989 3 12 3C11.8011 3 11.6103 3.07902 11.4697 3.21967C11.329 3.36032 11.25 3.55109 11.25 3.75V5.34375C10.6047 5.50898 10.0327 5.88428 9.62429 6.41048C9.21584 6.93669 8.99414 7.58387 8.99414 8.25C8.99414 8.91613 9.21584 9.56331 9.62429 10.0895C10.0327 10.6157 10.6047 10.991 11.25 11.1562V20.25C11.25 20.4489 11.329 20.6397 11.4697 20.7803C11.6103 20.921 11.8011 21 12 21C12.1989 21 12.3897 20.921 12.5304 20.7803C12.671 20.6397 12.75 20.4489 12.75 20.25V11.1562C13.3953 10.991 13.9673 10.6157 14.3758 10.0895C14.7842 9.56331 15.0059 8.91613 15.0059 8.25C15.0059 7.58387 14.7842 6.93669 14.3758 6.41048C13.9673 5.88428 13.3953 5.50898 12.75 5.34375ZM12 9.75C11.7034 9.75 11.4133 9.66203 11.1667 9.4972C10.92 9.33238 10.7277 9.09811 10.6142 8.82403C10.5007 8.54994 10.471 8.24834 10.5288 7.95736C10.5867 7.66639 10.7296 7.39912 10.9394 7.18934C11.1491 6.97956 11.4164 6.8367 11.7074 6.77882C11.9984 6.72094 12.3 6.75065 12.574 6.86418C12.8481 6.97771 13.0824 7.16997 13.2472 7.41665C13.412 7.66332 13.5 7.95333 13.5 8.25C13.5 8.64782 13.342 9.02936 13.0607 9.31066C12.7794 9.59196 12.3978 9.75 12 9.75ZM21.75 15.75C21.7494 15.0849 21.5282 14.4388 21.121 13.9129C20.7139 13.387 20.1438 13.011 19.5 12.8438V3.75C19.5 3.55109 19.421 3.36032 19.2804 3.21967C19.1397 3.07902 18.9489 3 18.75 3C18.5511 3 18.3603 3.07902 18.2197 3.21967C18.079 3.36032 18 3.55109 18 3.75V12.8438C17.3547 13.009 16.7827 13.3843 16.3743 13.9105C15.9658 14.4367 15.7441 15.0839 15.7441 15.75C15.7441 16.4161 15.9658 17.0633 16.3743 17.5895C16.7827 18.1157 17.3547 18.491 18 18.6562V20.25C18 20.4489 18.079 20.6397 18.2197 20.7803C18.3603 20.921 18.5511 21 18.75 21C18.9489 21 19.1397 20.921 19.2804 20.7803C19.421 20.6397 19.5 20.4489 19.5 20.25V18.6562C20.1438 18.489 20.7139 18.113 21.121 17.5871C21.5282 17.0612 21.7494 16.4151 21.75 15.75ZM18.75 17.25C18.4534 17.25 18.1633 17.162 17.9167 16.9972C17.67 16.8324 17.4777 16.5981 17.3642 16.324C17.2507 16.0499 17.221 15.7483 17.2788 15.4574C17.3367 15.1664 17.4796 14.8991 17.6894 14.6893C17.8991 14.4796 18.1664 14.3367 18.4574 14.2788C18.7484 14.2209 19.05 14.2506 19.324 14.3642C19.5981 14.4777 19.8324 14.67 19.9972 14.9166C20.1621 15.1633 20.25 15.4533 20.25 15.75C20.25 16.1478 20.092 16.5294 19.8107 16.8107C19.5294 17.092 19.1478 17.25 18.75 17.25Z" fill="#2B4360" />
                                </svg>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Table */}

            <CommonTable
                data={filteredData}   // ✅ USE FILTERED DATA
                columns={columns}
                tableTotal={patientTotal}
                totalPages={totalPages}
                loading={loading}
                setActivePage={setActivePage}
                activePage={activePage}
                onRowClick={(row) => {
                    router.push(`/patients/${row.patient_id}`);
                }}
            />

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
                    selectedPatient={selectedPatient}
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
                // selectedPatient={selectedPatient}
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


            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="md"
                // backdrop={false}
                // dialogClassName="delete-modal"
                header="Patient Delete"
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
                        This action cannot be undone. Do you really want to delete this patient?
                    </p>

                    <div className="w-100 border-top pt-3 d-flex justify-content-between align-items-center flex-wrap">

                        <div className="d-flex justify-content-center gap-3 w-100">

                            <button
                                className="btn btn-light border px-4 flex-fill"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>

                            <Button
                                contentSize="small"
                                className="px-4 maiacare-button flex-fill"
                                onClick={() => handleDelete(patientDeleteId || "")}
                            >
                                Delete
                            </Button>

                        </div>


                    </div>
                </div>
            </Modal>
        </div>

    );
}
