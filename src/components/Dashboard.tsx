"use client";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { Card, Row, Col, } from "react-bootstrap";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import Appointments from "../assets/images/Appointments.png";
import ActivePatients from "../assets/images/Active Patients.png";
import NewPatients from "../assets/images/New Patients.png";
import '../style/dashboard.css';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    // Tooltip,
    ResponsiveContainer,
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Profiledoctor from "@/assets/images/Profile-doctor.png"

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Legend,
    Filler,
    BarElement,
    ArcElement,
    ChartOptions,
    ChartData,
    Tooltip,
} from "chart.js";
import Image from "next/image";
import { InputSelect } from "./ui/InputSelect";

import dynamic from "next/dynamic";
import { ImOffice } from "react-icons/im";
import ContentContainer from "./ui/ContentContainer";

const LineChart = dynamic(() => import("react-chartjs-2").then(mod => mod.Line), { ssr: false });
const BarChart = dynamic(() => import("react-chartjs-2").then(mod => mod.Bar), { ssr: false });
const DoughnutChart = dynamic(() => import("react-chartjs-2").then(mod => mod.Doughnut), { ssr: false });

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Legend,
    Filler,
    BarElement,
    ArcElement,
    Tooltip,
);
interface TreatmentData {
    id: string;
    name: string;
    patients: number;
    successRate: number;
    color: string;
    iconColor: string;
}



// ---------- Interfaces ----------
interface DashboardData {
    appointments: number;
    appointmentsChange: number;
    activePatients: number;
    activePatientsChange: number;
    newPatients: number;
    newPatientsChange: number;
    noShowRate: number;
    noShowRateChange: number;
    patientOverview: { male: number; female: number };
    appointmentData: {
        months: string[];
        ivfTreatment: number[];
        kitTreatment: number[];
        icsiTreatment: number[];
        gametefreezing: number[];
        pgtTesting: number[];
    };
    dropoutData: { labels: string[]; values: number[] };
}

interface WaveChartProps {
    width?: number;
    height?: number;
}
const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {

};

// ---------- WaveChart Component ----------
const WaveChart: React.FC<WaveChartProps> = ({ width = 800, height = 400 }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<ChartJS | null>(null);

    const ivfStages = [
        "Fertility  Assessment",
        "Stimulation",
        "Egg Retrieval",
        "Fertilisation",
        "IVF",
        "Embryo Culture",
        "Embryo Transfer",
        "Pregnancy Test",
    ];

    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext("2d");
        if (!ctx) return;

        if (chartInstanceRef.current) chartInstanceRef.current.destroy();

        // Generate wave-like values
        const generateWaveData = (): number[] => {
            const points = [];
            const numPoints = 200; // smooth line mate vadhu points

            for (let i = 0; i < numPoints; i++) {
                const x = (i / (numPoints - 1)) * 8 * Math.PI; // 8 stage mate

                // Fertility Assessment → Stimulation
                const wave1 = 20 * Math.sin(x * 0.5) + 20;

                // Stimulation → Egg Retrieval
                const wave2 = 30 * Math.sin(x * 0.6 + 1) + 30;

                // Egg Retrieval → Fertilisation
                const wave3 = 40 * Math.sin(x * 0.7 + 2) + 40;

                // Fertilisation → IVF
                const wave4 = 25 * Math.sin(x * 0.9 + 2) + 20;

                // IVF → Embryo Culture
                const wave5 = 35 * Math.sin(x * 0.8 + 3) + 30;

                // Embryo Culture → Embryo Transfer
                const wave6 = 30 * Math.sin(x * 0.7 + 4) + 25;

                // Embryo Transfer → Pregnancy Test
                const wave7 = 20 * Math.sin(x * 0.5 + 5) + 20;

                points.push(Math.max(0, (wave1 + wave2 + wave3 + wave4 + wave5 + wave6 + wave7) / 7));
            }

            console.log(points);

            return points;
        };

        const waveData = generateWaveData();
        const labels = Array.from({ length: waveData.length }, () => "");

        const chartData: ChartData<"line"> = {

            datasets: [
                {
                    label: "IVF Process Journey",
                    data: waveData,
                    borderColor: "#2c3e50",
                    backgroundColor: "rgba(174, 204, 237, 0.6)",
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                },
            ],
            labels,
        };

        const chartOptions: ChartOptions<"line"> = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: {
                x: { display: false, grid: { display: false } }, // hide axis, use bottom labels
                y: {
                    beginAtZero: true,
                    max: 140,
                    ticks: { stepSize: 20, color: "#6c757d", font: { size: 12 } },
                    grid: { color: "rgba(0,0,0,0.1)", lineWidth: 1 },
                    border: { display: false },
                },
            },
            animation: { duration: 2000, easing: "easeInOutQuart" },
        };

        chartInstanceRef.current = new ChartJS(ctx, { type: "line", data: chartData, options: chartOptions });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, [width, height]);

    return (
        <div className="card shadow-sm">
            <div className="px-3 pt-3 text-center">
                <div className="d-flex align-items-center justify-content-between px-2">
                    <h6 className="mb-0 d-flex align-items-start justify-content-start dashboard-chart-heading">Patient Dropout Rate</h6>

                    <InputSelect
                        className="dashboard-chart-dropdown1 p-0 "
                        name="ivf"
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            handleChange(e);
                        }}
                        onBlur={(e: React.FocusEvent<HTMLSelectElement>) => { }}
                        required={false}
                        disabled={false}
                        placeholder="IVF"
                        options={[

                            { id: "1", value: "1", label: "IVF1" },
                            { id: "2", value: "2", label: "IVF2" },
                            { id: "3", value: "3", label: "IVF3" },
                        ]}
                    />
                </div>

            </div>

            <div className="card-body px-4">
                <div style={{ height: `${height}px`, width: "100%" }}>
                    <canvas ref={chartRef} className="dashboard-chart-canvas" />
                </div>

                {/* IVF Stages below chart */}
                <div
                    className="d-flex justify-content-between flex-wrap mt-3 patient-journey-chart-details"

                >
                    {ivfStages.map((stage, idx) => (
                        <span key={idx} className="text-center flex-fill patient-journey-charts" >
                            {stage}
                        </span>
                    ))}
                </div>
            </div>


        </div>
    );
};

// ---------- Dashboard Component ----------
const Dashboard: React.FC = () => {
    const [formData, setFormData] = useState<FormData>();
    const initialData = {
        appointments: 18,
        appointmentsChange: 40,
        activePatients: 131,
        activePatientsChange: 25,
        newPatients: 32,
        newPatientsChange: 55,
        noShowRate: 24,
        noShowRateChange: -10,
        patientOverview: { male: 45, female: 55 },
        appointmentData: {
            months: ["Jan", "Feb", "Mar", "Apr"],
            ivfTreatment: [3800, 2600, 3300, 3500],
            kitTreatment: [1900, 3200, 2200, 1600],
            icsiTreatment: [3200, 2400, 1400, 2400],
            gametefreezing: [800, 1200, 800, 1000],
            pgtTesting: [600, 800, 400, 800],
        },
        dropoutData: {
            labels: [
                "Fertility Assessment ",
                "Stimulation",
                "Egg Retrieval",
                "Fertilisation",
                "IVF",
                "Embryo Culture",
                "Embryo Transfer",
                "Pregnancy Test",
            ],
            values: [20, 35, 25, 45, 40, 35, 30, 25],
        },
    };

    const [data, setData] = useState<DashboardData | any>(initialData);


    useEffect(() => {
        const interval = setInterval(() => {
            setData((prev: DashboardData | any) => ({
                ...prev,
                appointments: Math.floor(Math.random() * 50) + 10,
                activePatients: Math.floor(Math.random() * 200) + 100,
                newPatients: Math.floor(Math.random() * 60) + 20,
                noShowRate: Math.floor(Math.random() * 40) + 10,
                appointmentsChange: Math.floor(Math.random() * 100) - 50,
                activePatientsChange: Math.floor(Math.random() * 60) - 30,
                newPatientsChange: Math.floor(Math.random() * 80) - 40,
                noShowRateChange: Math.floor(Math.random() * 40) - 20,
            }));
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const formatChange = (change: number) => {
        const isPositive = change >= 0;
        const color = isPositive ? "dashboard-card-green" : "dashboard-card-orange";
        const icon = isPositive ? "↗" : "↘";
        return (
            <span className={color}>
                {icon} {Math.abs(change)}% <span className="dashboard-card-subtitle">last month</span>
            </span>
        );
    };

    const appointmentChartData = {
        labels: data.appointmentData.months,
        datasets: [
            { label: "IVF Treatment", data: data.appointmentData.ivfTreatment, backgroundColor: "#D45F35" },
            { label: "Kit Treatment", data: data.appointmentData.kitTreatment, backgroundColor: "#DB7A57" },
            { label: "ICSI Treatment", data: data.appointmentData.icsiTreatment, backgroundColor: "#E29578" },
            { label: "Gamete Freezing", data: data.appointmentData.gametefreezing, backgroundColor: "#EAAF9A" },
            { label: "PGT Testing", data: data.appointmentData.pgtTesting, backgroundColor: "#F1CABB" },
        ],
    };

    const options: ChartOptions<"bar"> = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom", // ✅ this is allowed
                labels: {
                    padding: 30,
                    boxHeight: 10,
                    boxWidth: 10,
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            title: {
                display: true,
                // text: "Appointment Overview",
                align: "start", // ✅ "start" | "center" | "end"
            },
        },
    };

    const patientChartData = {
        labels: ["Female", "Male"],
        datasets: [
            {
                data: [data.patientOverview.female, data.patientOverview.male],
                backgroundColor: ["#E29578", "#2B4360"],
                cutout: "70%",
            },
        ],
    };


    const treatmentData: TreatmentData[] = [
        {
            id: 'ivf',
            name: 'IVF',
            patients: 650,
            successRate: 55,
            color: '#5A94D9',
            iconColor: '#5A94D9'
        },
        {
            id: 'gamete',
            name: 'Gamete Freezing',
            patients: 300,
            successRate: 87,
            color: '#F4C47E',
            iconColor: '#F4C47E'
        },
        {
            id: 'icsi',
            name: 'ICSI',
            patients: 450,
            successRate: 66,
            color: '#869BB5',
            iconColor: '#869BB5'
        },
        {
            id: 'pgt',
            name: 'PGT Testing',
            patients: 280,
            successRate: 96,
            color: '#1CB384',
            iconColor: '#1CB384'
        }
    ];

    // 🔹 Instead of patients, now based on successRate
    const totalSuccessRate = treatmentData.reduce((sum, treatment) => sum + treatment.successRate, 0);

    const generateProgressSegments = () => {
        return treatmentData.map((treatment) => {
            const percentage = (treatment.successRate / totalSuccessRate) * 100;
            return {
                ...treatment,
                percentage
            };
        });
    };

    const progressSegments = generateProgressSegments();

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    const consultations = [
        {
            name: "Anicka Jain",
            date: "12 May 2024",
            time: "10:00 AM – 10:30 AM",
            tags: ["Fertility Support", "IVF", "IUI"],
            image: Profiledoctor,
            type: "upcoming",
        },
        {
            name: "Arjun Sharma",
            date: "12 May 2024",
            time: "11:00 AM – 11:30 AM",
            tags: ["Fertility Support", "IVF", "IUI"],
            image: Profiledoctor,
            type: "upcoming",
        },
    ];

    const requests = [
        {
            name: "Anicka Jain",
            date: "12 May 2024",
            time: "10:00 AM – 10:30 AM",
            tags: ["Fertility Support", "IVF", "IUI"],
            image: Profiledoctor,
        },
        {
            name: "Arjun Sharma",
            date: "12 May 2024",
            time: "11:00 AM – 11:30 AM",
            tags: ["Fertility Support", "IVF", "IUI"],
            image: Profiledoctor,
        },
    ];


    return (
        <>
            <div className="py-2">
                {/* Top Stats */}
                <Row className="mb-3">

                    <Col className="mb-3" md={4}>
                        <Card className="consultations-card">
                            <Card.Body>
                                <Card.Title className="phisical-assessment-accordion-title-showData">
                                    {/* <Image src={Appointments} alt="Active Patients" width={38} height={38} className="me-3"></Image> */}

                                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none" className="me-3">
                                        <rect width="38" height="38" rx="19" fill="#E6F3F2" />
                                        <path d="M25.804 10.8356H23.7629V10.1552C23.7629 9.97478 23.6912 9.80172 23.5637 9.67413C23.4361 9.54653 23.263 9.47485 23.0826 9.47485C22.9021 9.47485 22.7291 9.54653 22.6015 9.67413C22.4739 9.80172 22.4022 9.97478 22.4022 10.1552V10.8356H15.5985V10.1552C15.5985 9.97478 15.5268 9.80172 15.3992 9.67413C15.2716 9.54653 15.0986 9.47485 14.9181 9.47485C14.7377 9.47485 14.5646 9.54653 14.4371 9.67413C14.3095 9.80172 14.2378 9.97478 14.2378 10.1552V10.8356H12.1967C11.8358 10.8356 11.4897 10.979 11.2345 11.2341C10.9793 11.4893 10.8359 11.8354 10.8359 12.1963V25.8037C10.8359 26.1646 10.9793 26.5107 11.2345 26.7659C11.4897 27.0211 11.8358 27.1644 12.1967 27.1644H25.804C26.1649 27.1644 26.511 27.0211 26.7662 26.7659C27.0214 26.5107 27.1648 26.1646 27.1648 25.8037V12.1963C27.1648 11.8354 27.0214 11.4893 26.7662 11.2341C26.511 10.979 26.1649 10.8356 25.804 10.8356ZM14.2378 12.1963V12.8767C14.2378 13.0571 14.3095 13.2302 14.4371 13.3578C14.5646 13.4854 14.7377 13.5571 14.9181 13.5571C15.0986 13.5571 15.2716 13.4854 15.3992 13.3578C15.5268 13.2302 15.5985 13.0571 15.5985 12.8767V12.1963H22.4022V12.8767C22.4022 13.0571 22.4739 13.2302 22.6015 13.3578C22.7291 13.4854 22.9021 13.5571 23.0826 13.5571C23.263 13.5571 23.4361 13.4854 23.5637 13.3578C23.6912 13.2302 23.7629 13.0571 23.7629 12.8767V12.1963H25.804V14.9178H12.1967V12.1963H14.2378ZM25.804 25.8037H12.1967V16.2785H25.804V25.8037ZM20.0209 19.3402C20.0209 19.542 19.961 19.7393 19.8489 19.9072C19.7368 20.075 19.5774 20.2058 19.3909 20.2831C19.2044 20.3603 18.9992 20.3805 18.8013 20.3411C18.6033 20.3018 18.4214 20.2046 18.2787 20.0618C18.136 19.9191 18.0388 19.7373 17.9994 19.5393C17.96 19.3413 17.9802 19.1361 18.0575 18.9496C18.1347 18.7632 18.2655 18.6038 18.4334 18.4916C18.6012 18.3795 18.7985 18.3196 19.0004 18.3196C19.271 18.3196 19.5306 18.4272 19.722 18.6185C19.9134 18.8099 20.0209 19.0695 20.0209 19.3402ZM23.7629 19.3402C23.7629 19.542 23.7031 19.7393 23.5909 19.9072C23.4788 20.075 23.3194 20.2058 23.1329 20.2831C22.9464 20.3603 22.7412 20.3805 22.5433 20.3411C22.3453 20.3018 22.1635 20.2046 22.0207 20.0618C21.878 19.9191 21.7808 19.7373 21.7414 19.5393C21.7021 19.3413 21.7223 19.1361 21.7995 18.9496C21.8768 18.7632 22.0076 18.6038 22.1754 18.4916C22.3432 18.3795 22.5405 18.3196 22.7424 18.3196C23.013 18.3196 23.2726 18.4272 23.464 18.6185C23.6554 18.8099 23.7629 19.0695 23.7629 19.3402ZM16.2789 22.742C16.2789 22.9439 16.219 23.1412 16.1069 23.309C15.9947 23.4768 15.8354 23.6076 15.6489 23.6849C15.4624 23.7621 15.2572 23.7823 15.0592 23.743C14.8613 23.7036 14.6794 23.6064 14.5367 23.4637C14.394 23.3209 14.2968 23.1391 14.2574 22.9411C14.218 22.7432 14.2382 22.538 14.3155 22.3515C14.3927 22.165 14.5235 22.0056 14.6913 21.8935C14.8592 21.7813 15.0565 21.7215 15.2583 21.7215C15.529 21.7215 15.7886 21.829 15.98 22.0204C16.1714 22.2118 16.2789 22.4714 16.2789 22.742ZM20.0209 22.742C20.0209 22.9439 19.961 23.1412 19.8489 23.309C19.7368 23.4768 19.5774 23.6076 19.3909 23.6849C19.2044 23.7621 18.9992 23.7823 18.8013 23.743C18.6033 23.7036 18.4214 23.6064 18.2787 23.4637C18.136 23.3209 18.0388 23.1391 17.9994 22.9411C17.96 22.7432 17.9802 22.538 18.0575 22.3515C18.1347 22.165 18.2655 22.0056 18.4334 21.8935C18.6012 21.7813 18.7985 21.7215 19.0004 21.7215C19.271 21.7215 19.5306 21.829 19.722 22.0204C19.9134 22.2118 20.0209 22.4714 20.0209 22.742ZM23.7629 22.742C23.7629 22.9439 23.7031 23.1412 23.5909 23.309C23.4788 23.4768 23.3194 23.6076 23.1329 23.6849C22.9464 23.7621 22.7412 23.7823 22.5433 23.743C22.3453 23.7036 22.1635 23.6064 22.0207 23.4637C21.878 23.3209 21.7808 23.1391 21.7414 22.9411C21.7021 22.7432 21.7223 22.538 21.7995 22.3515C21.8768 22.165 22.0076 22.0056 22.1754 21.8935C22.3432 21.7813 22.5405 21.7215 22.7424 21.7215C23.013 21.7215 23.2726 21.829 23.464 22.0204C23.6554 22.2118 23.7629 22.4714 23.7629 22.742Z" fill="#70AAA4" />
                                    </svg>

                                    Total Consultations</Card.Title>
                                <h2 className="dashboard-subheader mt-3 mb-0">{data.activePatients}</h2>
                                {formatChange(data.activePatientsChange)}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className="mb-3" md={4}>
                        <Card className="consultations-card">
                            <Card.Body>
                                <Card.Title className="phisical-assessment-accordion-title-showData">
                                    {/* <Image src={ActivePatients} alt="New Patients" width={38} height={38} className="me-3"></Image> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none" className="me-3">
                                        <rect width="38" height="38" rx="19" fill="#FDDCF9" />
                                        <path d="M27.7532 26.1438C26.458 23.9045 24.4619 22.2989 22.1325 21.5377C23.2848 20.8518 24.18 19.8066 24.6807 18.5626C25.1814 17.3187 25.2599 15.9447 24.9042 14.6518C24.5485 13.3589 23.7782 12.2185 22.7117 11.4058C21.6451 10.593 20.3412 10.1528 19.0003 10.1528C17.6593 10.1528 16.3555 10.593 15.2889 11.4058C14.2223 12.2185 13.4521 13.3589 13.0963 14.6518C12.7406 15.9447 12.8192 17.3187 13.3199 18.5626C13.8206 19.8066 14.7158 20.8518 15.868 21.5377C13.5386 22.298 11.5426 23.9037 10.2474 26.1438C10.1999 26.2212 10.1684 26.3074 10.1547 26.3972C10.141 26.4871 10.1455 26.5787 10.1679 26.6668C10.1902 26.7548 10.23 26.8375 10.2848 26.91C10.3396 26.9825 10.4084 27.0432 10.487 27.0886C10.5657 27.1341 10.6527 27.1633 10.7428 27.1746C10.833 27.1859 10.9245 27.179 11.0119 27.1543C11.0994 27.1297 11.181 27.0878 11.252 27.0311C11.323 26.9743 11.3819 26.904 11.4252 26.8242C13.0275 24.0551 15.8595 22.4018 19.0003 22.4018C22.141 22.4018 24.9731 24.0551 26.5753 26.8242C26.6187 26.904 26.6776 26.9743 26.7486 27.0311C26.8196 27.0878 26.9012 27.1297 26.9886 27.1543C27.0761 27.179 27.1676 27.1859 27.2577 27.1746C27.3479 27.1633 27.4349 27.1341 27.5135 27.0886C27.5922 27.0432 27.661 26.9825 27.7158 26.91C27.7706 26.8375 27.8104 26.7548 27.8327 26.6668C27.8551 26.5787 27.8595 26.4871 27.8459 26.3972C27.8322 26.3074 27.8007 26.2212 27.7532 26.1438ZM14.2377 16.2785C14.2377 15.3365 14.517 14.4157 15.0404 13.6325C15.5637 12.8493 16.3075 12.2389 17.1777 11.8784C18.048 11.5179 19.0056 11.4236 19.9294 11.6074C20.8533 11.7912 21.7019 12.2447 22.3679 12.9108C23.034 13.5769 23.4876 14.4255 23.6714 15.3493C23.8551 16.2732 23.7608 17.2308 23.4003 18.101C23.0399 18.9713 22.4294 19.7151 21.6462 20.2384C20.863 20.7617 19.9422 21.041 19.0003 21.041C17.7376 21.0397 16.527 20.5375 15.6341 19.6446C14.7413 18.7517 14.2391 17.5412 14.2377 16.2785Z" fill="#E69BC2" />
                                    </svg>
                                    Free Consultations</Card.Title>
                                <h2 className="dashboard-subheader mt-3 mb-0">{data.newPatients}</h2>
                                {formatChange(data.newPatientsChange)}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className="mb-3" md={4}>
                        <Card className="consultations-card">
                            <Card.Body>
                                <Card.Title className="phisical-assessment-accordion-title-showData">
                                    {/* <Image src={NewPatients} alt="No Show Rate" width={38} height={38} className="me-3"></Image> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none" className="me-3">
                                        <rect width="38" height="38" rx="19" fill="#FFEDCB" />
                                        <path d="M29.8859 19.6802C29.8859 19.8607 29.8142 20.0337 29.6866 20.1613C29.559 20.2889 29.386 20.3606 29.2055 20.3606H27.8448V21.7213C27.8448 21.9018 27.7731 22.0748 27.6455 22.2024C27.5179 22.33 27.3449 22.4017 27.1644 22.4017C26.984 22.4017 26.8109 22.33 26.6833 22.2024C26.5558 22.0748 26.4841 21.9018 26.4841 21.7213V20.3606H25.1233C24.9429 20.3606 24.7698 20.2889 24.6422 20.1613C24.5146 20.0337 24.443 19.8607 24.443 19.6802C24.443 19.4998 24.5146 19.3267 24.6422 19.1991C24.7698 19.0715 24.9429 18.9998 25.1233 18.9998H26.4841V17.6391C26.4841 17.4587 26.5558 17.2856 26.6833 17.158C26.8109 17.0304 26.984 16.9587 27.1644 16.9587C27.3449 16.9587 27.5179 17.0304 27.6455 17.158C27.7731 17.2856 27.8448 17.4587 27.8448 17.6391V18.9998H29.2055C29.386 18.9998 29.559 19.0715 29.6866 19.1991C29.8142 19.3267 29.8859 19.4998 29.8859 19.6802ZM24.9643 24.6852C25.0805 24.8234 25.1369 25.0022 25.1213 25.1821C25.1057 25.362 25.0192 25.5283 24.881 25.6445C24.7427 25.7607 24.5639 25.8171 24.384 25.8015C24.2041 25.7859 24.0378 25.6994 23.9216 25.5611C22.2105 23.5234 19.8581 22.4017 17.2991 22.4017C14.7401 22.4017 12.3877 23.5234 10.6766 25.5611C10.5604 25.6993 10.3941 25.7856 10.2143 25.8012C10.0345 25.8167 9.85584 25.7602 9.71768 25.6441C9.57953 25.5279 9.49318 25.3616 9.47763 25.1818C9.46208 25.002 9.5186 24.8233 9.63476 24.6852C10.9053 23.1731 12.4855 22.0989 14.2417 21.524C13.1751 20.8597 12.354 19.8661 11.9024 18.6936C11.4508 17.521 11.3934 16.2333 11.7388 15.0252C12.0843 13.8171 12.8138 12.7544 13.817 11.9978C14.8203 11.2413 16.0426 10.832 17.2991 10.832C18.5556 10.832 19.778 11.2413 20.7812 11.9978C21.7844 12.7544 22.5139 13.8171 22.8594 15.0252C23.2048 16.2333 23.1474 17.521 22.6958 18.6936C22.2443 19.8661 21.4231 20.8597 20.3565 21.524C22.1127 22.0989 23.6929 23.1731 24.9643 24.6852ZM17.2991 21.0409C18.1738 21.0409 19.0288 20.7816 19.7561 20.2956C20.4833 19.8097 21.0501 19.119 21.3849 18.3109C21.7196 17.5028 21.8072 16.6137 21.6365 15.7558C21.4659 14.8979 21.0447 14.1099 20.4262 13.4915C19.8077 12.873 19.0197 12.4518 18.1619 12.2811C17.304 12.1105 16.4148 12.1981 15.6067 12.5328C14.7986 12.8675 14.108 13.4344 13.622 14.1616C13.1361 14.8889 12.8767 15.7439 12.8767 16.6186C12.8781 17.791 13.3444 18.9151 14.1735 19.7442C15.0026 20.5732 16.1266 21.0396 17.2991 21.0409Z" fill="#DDA01E" />
                                    </svg>
                                    Paid Consultations</Card.Title>
                                <h2 className="dashboard-subheader mt-3 mb-0">{data.noShowRate}</h2>
                                {formatChange(data.noShowRateChange)}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>


                <Row className="mb-3">
                    {/* Upcoming Section */}

                    <Col className="mb-3" lg={6}>
                        <ContentContainer>
                            <div className="">
                                {/* <h6 className="fw-semibold mb-3">Upcoming Consultations</h6> */}
                                <div className="d-flex justify-content-between align-items-center">
                                    <Card.Title className="Upcoming-Consultations">Upcoming Consultations</Card.Title>
                                    <div className="patient-journey-up-icon1 border p-2 rounded" >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                            <path d="M18.914 6.33984V16.0898C18.914 16.2888 18.835 16.4795 18.6943 16.6202C18.5537 16.7608 18.3629 16.8398 18.164 16.8398C17.9651 16.8398 17.7743 16.7608 17.6337 16.6202C17.493 16.4795 17.414 16.2888 17.414 16.0898V8.15016L6.69462 18.8705C6.55389 19.0112 6.36301 19.0903 6.16399 19.0903C5.96497 19.0903 5.7741 19.0112 5.63337 18.8705C5.49264 18.7297 5.41357 18.5389 5.41357 18.3398C5.41357 18.1408 5.49264 17.9499 5.63337 17.8092L16.3537 7.08984H8.41399C8.21508 7.08984 8.02431 7.01083 7.88366 6.87017C7.74301 6.72952 7.66399 6.53876 7.66399 6.33984C7.66399 6.14093 7.74301 5.95017 7.88366 5.80951C8.02431 5.66886 8.21508 5.58984 8.41399 5.58984H18.164C18.3629 5.58984 18.5537 5.66886 18.6943 5.80951C18.835 5.95017 18.914 6.14093 18.914 6.33984Z" fill="#2B4360" />
                                        </svg>
                                    </div>
                                </div>
                                {consultations.map((item, i) => (

                                    <div className="border p-3 mt-2 rounded-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <img src={item.image.src} width={90} height={90} className="rounded-3" />

                                            <div className="flex-grow-1">
                                                <div className="d-flex consultation-icon-image">
                                                    <div className="mb-1">
                                                        <span className="Upcoming-Consultations-title">{item.name}</span>
                                                    </div>
                                                    <div className="patient-journey-up-icon1 border p-1 rounded" >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 25 25" fill="none">
                                                            <path d="M18.914 6.33984V16.0898C18.914 16.2888 18.835 16.4795 18.6943 16.6202C18.5537 16.7608 18.3629 16.8398 18.164 16.8398C17.9651 16.8398 17.7743 16.7608 17.6337 16.6202C17.493 16.4795 17.414 16.2888 17.414 16.0898V8.15016L6.69462 18.8705C6.55389 19.0112 6.36301 19.0903 6.16399 19.0903C5.96497 19.0903 5.7741 19.0112 5.63337 18.8705C5.49264 18.7297 5.41357 18.5389 5.41357 18.3398C5.41357 18.1408 5.49264 17.9499 5.63337 17.8092L16.3537 7.08984H8.41399C8.21508 7.08984 8.02431 7.01083 7.88366 6.87017C7.74301 6.72952 7.66399 6.53876 7.66399 6.33984C7.66399 6.14093 7.74301 5.95017 7.88366 5.80951C8.02431 5.66886 8.21508 5.58984 8.41399 5.58984H18.164C18.3629 5.58984 18.5537 5.66886 18.6943 5.80951C18.835 5.95017 18.914 6.14093 18.914 6.33984Z" fill="#2B4360" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {/* <div className="small text-muted">
                  📅 {item.date} &nbsp; | &nbsp; 🕒 {item.time}
                </div> */}

                                                <div className="profile-title mb-1">
                                                    <span>
                                                        <svg className="me-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 17 18" fill="none">
                                                            <path d="M12.375 1.1875C12.5076 1.1875 12.6347 1.24022 12.7285 1.33398C12.8223 1.42775 12.875 1.55489 12.875 1.6875V2.3125H14.625C14.9068 2.3125 15.1767 2.42477 15.376 2.62402C15.5752 2.82328 15.6875 3.09321 15.6875 3.375V14.625C15.6875 14.9068 15.5752 15.1767 15.376 15.376C15.1767 15.5752 14.9068 15.6875 14.625 15.6875H3.375C3.09321 15.6875 2.82328 15.5752 2.62402 15.376C2.42477 15.1767 2.3125 14.9068 2.3125 14.625V3.375C2.3125 3.09321 2.42477 2.82328 2.62402 2.62402C2.82328 2.42477 3.09321 2.3125 3.375 2.3125H5.125V1.6875C5.125 1.55489 5.17772 1.42775 5.27148 1.33398C5.36525 1.24022 5.49239 1.1875 5.625 1.1875C5.75761 1.1875 5.88475 1.24022 5.97852 1.33398C6.07228 1.42775 6.125 1.55489 6.125 1.6875V2.3125H11.875V1.6875C11.875 1.55489 11.9277 1.42775 12.0215 1.33398C12.1153 1.24022 12.2424 1.1875 12.375 1.1875ZM3.3125 14.6875H14.6875V6.6875H3.3125V14.6875ZM3.3125 5.6875H14.6875V3.3125H12.875V3.9375C12.875 4.07011 12.8223 4.19725 12.7285 4.29102C12.6347 4.38478 12.5076 4.4375 12.375 4.4375C12.2424 4.4375 12.1153 4.38478 12.0215 4.29102C11.9277 4.19725 11.875 4.07011 11.875 3.9375V3.3125H6.125V3.9375C6.125 4.07011 6.07228 4.19725 5.97852 4.29102C5.88475 4.38478 5.75761 4.4375 5.625 4.4375C5.49239 4.4375 5.36525 4.38478 5.27148 4.29102C5.17772 4.19725 5.125 4.07011 5.125 3.9375V3.3125H3.3125V5.6875Z" fill="#8A8D93" stroke="#8A8D93" stroke-width="0.125" />
                                                        </svg>
                                                        {item.date}</span>
                                                    <span className='ms-2'>
                                                                                                              <svg className="me-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
<path d="M9 1.75C10.9222 1.75205 12.7648 2.51678 14.124 3.87598C15.4832 5.23517 16.248 7.07781 16.25 9C16.25 10.4339 15.825 11.8361 15.0283 13.0283C14.2317 14.2205 13.0991 15.1495 11.7744 15.6982C10.4498 16.2469 8.99219 16.39 7.58594 16.1104C6.17958 15.8306 4.88698 15.1409 3.87305 14.127C2.85912 13.113 2.16939 11.8204 1.88965 10.4141C1.60998 9.00781 1.75308 7.55025 2.30176 6.22559C2.85046 4.90091 3.77953 3.76831 4.97168 2.97168C6.08939 2.22485 7.39161 1.80453 8.73145 1.75488L9 1.75ZM11.3916 3.22559C10.2496 2.75261 8.99258 2.62897 7.78027 2.87012C6.56805 3.11133 5.45504 3.70707 4.58105 4.58105C3.70707 5.45504 3.11133 6.56805 2.87012 7.78027C2.62897 8.99258 2.75261 10.2496 3.22559 11.3916C3.69857 12.5335 4.49974 13.5095 5.52734 14.1963C6.49091 14.8401 7.6135 15.2033 8.76855 15.2461L9 15.25C10.657 15.2481 12.2453 14.5887 13.417 13.417C14.5887 12.2453 15.2481 10.657 15.25 9C15.25 7.76387 14.883 6.55515 14.1963 5.52734C13.5095 4.49974 12.5335 3.69857 11.3916 3.22559ZM9 4.5625C9.13261 4.5625 9.25975 4.61522 9.35352 4.70898C9.44728 4.80275 9.5 4.92989 9.5 5.0625V8.5H12.9375C13.0701 8.5 13.1972 8.55272 13.291 8.64648C13.3848 8.74025 13.4375 8.86739 13.4375 9C13.4375 9.13261 13.3848 9.25975 13.291 9.35352C13.1972 9.44728 13.0701 9.5 12.9375 9.5H9C8.86739 9.5 8.74025 9.44728 8.64648 9.35352C8.55272 9.25975 8.5 9.13261 8.5 9V5.0625C8.5 4.92989 8.55272 4.80275 8.64648 4.70898C8.74025 4.61522 8.86739 4.5625 9 4.5625Z" fill="#8A8D93" stroke="#8A8D93" stroke-width="0.125"/>
</svg>
                                                        {item.time}</span>
                                                </div>

                                                <div className="mt-2 d-flex gap-2 flex-wrap ">
                                                    {item.tags.map((t, index) => (
                                                        <span key={index} className="badge rounded-pill box-border-orange border-box-orange-font">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex mt-3 gap-2">
                                            {/* <button className="btn btn-outline-secondary rounded-pill w-50">Reschedule</button>
              <button className="btn btn-primary rounded-pill w-50">Start Consultation</button> */}
                                            <Button className="w-50 consultation-button" variant="outline" disabled={false}>
                                                <svg className="me-2" xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                                    <path d="M9.375 4.06253V7.28206L12.0445 8.88362C12.1525 8.94572 12.247 9.02871 12.3225 9.12774C12.398 9.22677 12.453 9.33986 12.4844 9.46039C12.5157 9.58093 12.5227 9.7065 12.505 9.82977C12.4872 9.95303 12.4451 10.0715 12.3811 10.1783C12.317 10.2852 12.2323 10.3781 12.132 10.4519C12.0316 10.5256 11.9175 10.5786 11.7964 10.6077C11.6754 10.6368 11.5497 10.6416 11.4268 10.6216C11.3038 10.6017 11.1861 10.5574 11.0805 10.4914L7.95547 8.61643C7.81659 8.53318 7.70164 8.41537 7.62182 8.27449C7.542 8.1336 7.50003 7.97445 7.5 7.81253V4.06253C7.5 3.81389 7.59877 3.57543 7.77459 3.39961C7.9504 3.2238 8.18886 3.12503 8.4375 3.12503C8.68614 3.12503 8.9246 3.2238 9.10041 3.39961C9.27623 3.57543 9.375 3.81389 9.375 4.06253ZM8.4375 2.57408e-05C7.41023 -0.00261939 6.39265 0.198622 5.44371 0.592089C4.49478 0.985555 3.63336 1.56342 2.90938 2.29221C2.54297 2.66253 2.20625 3.02424 1.875 3.38596V2.81253C1.875 2.56389 1.77623 2.32543 1.60041 2.14961C1.4246 1.9738 1.18614 1.87503 0.9375 1.87503C0.68886 1.87503 0.450403 1.9738 0.274587 2.14961C0.0987721 2.32543 0 2.56389 0 2.81253V5.93753C0 6.18617 0.0987721 6.42462 0.274587 6.60044C0.450403 6.77625 0.68886 6.87503 0.9375 6.87503H4.0625C4.31114 6.87503 4.5496 6.77625 4.72541 6.60044C4.90123 6.42462 5 6.18617 5 5.93753C5 5.68889 4.90123 5.45043 4.72541 5.27461C4.5496 5.0988 4.31114 5.00003 4.0625 5.00003H2.95078C3.35938 4.53128 3.77891 4.07971 4.23906 3.61409C5.06419 2.78873 6.11425 2.22483 7.25804 1.99288C8.40183 1.76092 9.58862 1.87119 10.6701 2.30991C11.7516 2.74862 12.6798 3.49633 13.3387 4.45958C13.9976 5.42284 14.3581 6.55892 14.375 7.72587C14.3919 8.89282 14.0645 10.0389 13.4338 11.0208C12.8031 12.0028 11.8969 12.7771 10.8286 13.2469C9.76032 13.7168 8.57723 13.8614 7.4272 13.6627C6.27717 13.464 5.2112 12.9308 4.3625 12.1297C4.18161 11.959 3.94031 11.8671 3.69168 11.8743C3.44305 11.8815 3.20745 11.9871 3.03672 12.168C2.86599 12.3489 2.7741 12.5902 2.78128 12.8388C2.78846 13.0874 2.89411 13.323 3.075 13.4938C4.00236 14.3691 5.12992 15.0042 6.35921 15.3435C7.5885 15.6827 8.88216 15.7159 10.1272 15.4401C11.3723 15.1644 12.5309 14.588 13.502 13.7613C14.473 12.9347 15.2269 11.8829 15.6979 10.6978C16.1689 9.51268 16.3426 8.2303 16.2038 6.96262C16.0651 5.69493 15.6182 4.48048 14.902 3.42529C14.1859 2.37011 13.2223 1.50627 12.0955 0.909204C10.9686 0.312137 9.71275 -6.95695e-06 8.4375 2.57408e-05Z" fill="#2B4360" />
                                                </svg>
                                                Reschedule
                                            </Button>
                                            <Button className="w-50 consultation-button" variant="default" disabled={false} type="submit">
                                                Start Consultation
                                            </Button>
                                        </div>
                                    </div>

                                ))}
                            </div>
                        </ContentContainer>
                    </Col>

                    {/* Request Section */}
                    <Col className="mb-3" lg={6}>
                        <ContentContainer className="">
                            {/* <h6 className=" mb-3 Upcoming-Consultations">Consultations Request</h6> */}
                            <div className="d-flex justify-content-between align-items-center">
                                <Card.Title className="Upcoming-Consultations">Consultations Request</Card.Title>
                                <div className="patient-journey-up-icon1 border p-2 rounded" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                        <path d="M18.914 6.33984V16.0898C18.914 16.2888 18.835 16.4795 18.6943 16.6202C18.5537 16.7608 18.3629 16.8398 18.164 16.8398C17.9651 16.8398 17.7743 16.7608 17.6337 16.6202C17.493 16.4795 17.414 16.2888 17.414 16.0898V8.15016L6.69462 18.8705C6.55389 19.0112 6.36301 19.0903 6.16399 19.0903C5.96497 19.0903 5.7741 19.0112 5.63337 18.8705C5.49264 18.7297 5.41357 18.5389 5.41357 18.3398C5.41357 18.1408 5.49264 17.9499 5.63337 17.8092L16.3537 7.08984H8.41399C8.21508 7.08984 8.02431 7.01083 7.88366 6.87017C7.74301 6.72952 7.66399 6.53876 7.66399 6.33984C7.66399 6.14093 7.74301 5.95017 7.88366 5.80951C8.02431 5.66886 8.21508 5.58984 8.41399 5.58984H18.164C18.3629 5.58984 18.5537 5.66886 18.6943 5.80951C18.835 5.95017 18.914 6.14093 18.914 6.33984Z" fill="#2B4360" />
                                    </svg>
                                </div>
                            </div>
                            {requests.map((item, i) => (
                                <div className="" key={i}>
                                    <div className="border p-3 mt-2 rounded-3">
                                        <div className="d-flex align-items-center gap-3">
                                            {/* <img src={item.image} width={55} height={55} className="rounded" /> */}
                                            <img src={item.image.src} width={90} height={90} className="rounded-3" />
                                            <div className="flex-grow-1">
                                                {/* <h6 className="fw-semibold mb-1">{item.name}</h6> */}
                                                <div className="d-flex consultation-icon-image">
                                                    <div className="mb-1">
                                                        <span className="Upcoming-Consultations-title">{item.name}</span>
                                                    </div>
                                                    <div className="patient-journey-up-icon1 border p-1 rounded" >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 25 25" fill="none">
                                                            <path d="M18.914 6.33984V16.0898C18.914 16.2888 18.835 16.4795 18.6943 16.6202C18.5537 16.7608 18.3629 16.8398 18.164 16.8398C17.9651 16.8398 17.7743 16.7608 17.6337 16.6202C17.493 16.4795 17.414 16.2888 17.414 16.0898V8.15016L6.69462 18.8705C6.55389 19.0112 6.36301 19.0903 6.16399 19.0903C5.96497 19.0903 5.7741 19.0112 5.63337 18.8705C5.49264 18.7297 5.41357 18.5389 5.41357 18.3398C5.41357 18.1408 5.49264 17.9499 5.63337 17.8092L16.3537 7.08984H8.41399C8.21508 7.08984 8.02431 7.01083 7.88366 6.87017C7.74301 6.72952 7.66399 6.53876 7.66399 6.33984C7.66399 6.14093 7.74301 5.95017 7.88366 5.80951C8.02431 5.66886 8.21508 5.58984 8.41399 5.58984H18.164C18.3629 5.58984 18.5537 5.66886 18.6943 5.80951C18.835 5.95017 18.914 6.14093 18.914 6.33984Z" fill="#2B4360" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {/* <div className="small text-muted">
                                                    📅 {item.date} &nbsp; | &nbsp; 🕒 {item.time}
                                                </div> */}

                                                <div className="profile-title mb-1">
                                                    <span>
                                                        <svg className="me-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 17 18" fill="none">
                                                            <path d="M12.375 1.1875C12.5076 1.1875 12.6347 1.24022 12.7285 1.33398C12.8223 1.42775 12.875 1.55489 12.875 1.6875V2.3125H14.625C14.9068 2.3125 15.1767 2.42477 15.376 2.62402C15.5752 2.82328 15.6875 3.09321 15.6875 3.375V14.625C15.6875 14.9068 15.5752 15.1767 15.376 15.376C15.1767 15.5752 14.9068 15.6875 14.625 15.6875H3.375C3.09321 15.6875 2.82328 15.5752 2.62402 15.376C2.42477 15.1767 2.3125 14.9068 2.3125 14.625V3.375C2.3125 3.09321 2.42477 2.82328 2.62402 2.62402C2.82328 2.42477 3.09321 2.3125 3.375 2.3125H5.125V1.6875C5.125 1.55489 5.17772 1.42775 5.27148 1.33398C5.36525 1.24022 5.49239 1.1875 5.625 1.1875C5.75761 1.1875 5.88475 1.24022 5.97852 1.33398C6.07228 1.42775 6.125 1.55489 6.125 1.6875V2.3125H11.875V1.6875C11.875 1.55489 11.9277 1.42775 12.0215 1.33398C12.1153 1.24022 12.2424 1.1875 12.375 1.1875ZM3.3125 14.6875H14.6875V6.6875H3.3125V14.6875ZM3.3125 5.6875H14.6875V3.3125H12.875V3.9375C12.875 4.07011 12.8223 4.19725 12.7285 4.29102C12.6347 4.38478 12.5076 4.4375 12.375 4.4375C12.2424 4.4375 12.1153 4.38478 12.0215 4.29102C11.9277 4.19725 11.875 4.07011 11.875 3.9375V3.3125H6.125V3.9375C6.125 4.07011 6.07228 4.19725 5.97852 4.29102C5.88475 4.38478 5.75761 4.4375 5.625 4.4375C5.49239 4.4375 5.36525 4.38478 5.27148 4.29102C5.17772 4.19725 5.125 4.07011 5.125 3.9375V3.3125H3.3125V5.6875Z" fill="#8A8D93" stroke="#8A8D93" stroke-width="0.125" />
                                                        </svg>
                                                        {item.date}</span>
                                                    <span className='ms-2'>
                                                      <svg className="me-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
<path d="M9 1.75C10.9222 1.75205 12.7648 2.51678 14.124 3.87598C15.4832 5.23517 16.248 7.07781 16.25 9C16.25 10.4339 15.825 11.8361 15.0283 13.0283C14.2317 14.2205 13.0991 15.1495 11.7744 15.6982C10.4498 16.2469 8.99219 16.39 7.58594 16.1104C6.17958 15.8306 4.88698 15.1409 3.87305 14.127C2.85912 13.113 2.16939 11.8204 1.88965 10.4141C1.60998 9.00781 1.75308 7.55025 2.30176 6.22559C2.85046 4.90091 3.77953 3.76831 4.97168 2.97168C6.08939 2.22485 7.39161 1.80453 8.73145 1.75488L9 1.75ZM11.3916 3.22559C10.2496 2.75261 8.99258 2.62897 7.78027 2.87012C6.56805 3.11133 5.45504 3.70707 4.58105 4.58105C3.70707 5.45504 3.11133 6.56805 2.87012 7.78027C2.62897 8.99258 2.75261 10.2496 3.22559 11.3916C3.69857 12.5335 4.49974 13.5095 5.52734 14.1963C6.49091 14.8401 7.6135 15.2033 8.76855 15.2461L9 15.25C10.657 15.2481 12.2453 14.5887 13.417 13.417C14.5887 12.2453 15.2481 10.657 15.25 9C15.25 7.76387 14.883 6.55515 14.1963 5.52734C13.5095 4.49974 12.5335 3.69857 11.3916 3.22559ZM9 4.5625C9.13261 4.5625 9.25975 4.61522 9.35352 4.70898C9.44728 4.80275 9.5 4.92989 9.5 5.0625V8.5H12.9375C13.0701 8.5 13.1972 8.55272 13.291 8.64648C13.3848 8.74025 13.4375 8.86739 13.4375 9C13.4375 9.13261 13.3848 9.25975 13.291 9.35352C13.1972 9.44728 13.0701 9.5 12.9375 9.5H9C8.86739 9.5 8.74025 9.44728 8.64648 9.35352C8.55272 9.25975 8.5 9.13261 8.5 9V5.0625C8.5 4.92989 8.55272 4.80275 8.64648 4.70898C8.74025 4.61522 8.86739 4.5625 9 4.5625Z" fill="#8A8D93" stroke="#8A8D93" stroke-width="0.125"/>
</svg>
                                                        {item.time}</span>
                                                </div>

                                                <div className="mt-2 d-flex gap-2 flex-wrap ">
                                                    {item.tags.map((t, index) => (
                                                        <span key={index} className="badge rounded-pill box-border-orange border-box-orange-font">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex mt-3 gap-2">
                                            <button className="btn btn-outline-danger consultation-button  w-50">
                                                <svg className="me-2" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 11 11" fill="none">
                                                    <path d="M10.2826 9.22193C10.4234 9.36282 10.5026 9.55392 10.5026 9.75318C10.5026 9.95243 10.4234 10.1435 10.2826 10.2844C10.1417 10.4253 9.95056 10.5045 9.7513 10.5045C9.55204 10.5045 9.36095 10.4253 9.22005 10.2844L5.25193 6.31505L1.28255 10.2832C1.14165 10.4241 0.950558 10.5032 0.751301 10.5032C0.552044 10.5032 0.360947 10.4241 0.220051 10.2832C0.0791548 10.1423 2.96917e-09 9.95118 0 9.75193C-2.96917e-09 9.55267 0.0791548 9.36157 0.220051 9.22068L4.18943 5.25255L0.221301 1.28318C0.0804046 1.14228 0.00125003 0.951183 0.00125003 0.751926C0.00125003 0.552669 0.0804046 0.361572 0.221301 0.220676C0.362197 0.0797797 0.553293 0.000624897 0.752551 0.000624895C0.951808 0.000624893 1.1429 0.0797797 1.2838 0.220676L5.25193 4.19005L9.2213 0.220051C9.3622 0.0791546 9.55329 -3.31963e-09 9.75255 0C9.95181 3.31963e-09 10.1429 0.0791546 10.2838 0.220051C10.4247 0.360947 10.5039 0.552043 10.5039 0.751301C10.5039 0.950558 10.4247 1.14165 10.2838 1.28255L6.31443 5.25255L10.2826 9.22193Z" fill="#E85966" />
                                                </svg>
                                                Decline</button>
                                            <button className="btn btn-outline-success consultation-button  w-50">
                                                <svg className="me-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none">
                                                    <path d="M14.5306 5.03057L6.5306 13.0306C6.46092 13.1005 6.37813 13.156 6.28696 13.1938C6.1958 13.2317 6.09806 13.2512 5.99935 13.2512C5.90064 13.2512 5.8029 13.2317 5.71173 13.1938C5.62057 13.156 5.53778 13.1005 5.4681 13.0306L1.9681 9.53057C1.89833 9.4608 1.84299 9.37798 1.80524 9.28683C1.76748 9.19568 1.74805 9.09798 1.74805 8.99932C1.74805 8.90066 1.76748 8.80296 1.80524 8.71181C1.84299 8.62066 1.89833 8.53783 1.9681 8.46807C2.03786 8.3983 2.12069 8.34296 2.21184 8.30521C2.30299 8.26745 2.40069 8.24802 2.49935 8.24802C2.59801 8.24802 2.69571 8.26745 2.78686 8.30521C2.87801 8.34296 2.96083 8.3983 3.0306 8.46807L5.99997 11.4374L13.4693 3.96932C13.6102 3.82842 13.8013 3.74927 14.0006 3.74927C14.1999 3.74927 14.391 3.82842 14.5318 3.96932C14.6727 4.11021 14.7519 4.30131 14.7519 4.50057C14.7519 4.69983 14.6727 4.89092 14.5318 5.03182L14.5306 5.03057Z" fill="#2ECF98" />
                                                </svg>
                                                Confirm</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </ContentContainer>
                    </Col>
                </Row>


                {/* Charts */}
                <Row className="mb-4">

                    <Col className="mb-3" lg={4}>
                        <Card className="h-100 consultations-card consultations-layout">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                    <Card.Title className="dashboard-chart-heading">Patient Overview</Card.Title>
                                    <div className="patient-journey-up-icon1 border p-2 rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                            <path d="M18.914 6.33984V16.0898C18.914 16.2888 18.835 16.4795 18.6943 16.6202C18.5537 16.7608 18.3629 16.8398 18.164 16.8398C17.9651 16.8398 17.7743 16.7608 17.6337 16.6202C17.493 16.4795 17.414 16.2888 17.414 16.0898V8.15016L6.69462 18.8705C6.55389 19.0112 6.36301 19.0903 6.16399 19.0903C5.96497 19.0903 5.7741 19.0112 5.63337 18.8705C5.49264 18.7297 5.41357 18.5389 5.41357 18.3398C5.41357 18.1408 5.49264 17.9499 5.63337 17.8092L16.3537 7.08984H8.41399C8.21508 7.08984 8.02431 7.01083 7.88366 6.87017C7.74301 6.72952 7.66399 6.53876 7.66399 6.33984C7.66399 6.14093 7.74301 5.95017 7.88366 5.80951C8.02431 5.66886 8.21508 5.58984 8.41399 5.58984H18.164C18.3629 5.58984 18.5537 5.66886 18.6943 5.80951C18.835 5.95017 18.914 6.14093 18.914 6.33984Z" fill="#2B4360" />
                                        </svg>
                                    </div>
                                </div>
                                <div >
                                    <DoughnutChart data={patientChartData} options={{ responsive: true }} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    {/* <Col lg={8}>
                        <WaveChart height={400} />
                        
                    </Col> */}

                    <Col className="mb-3" lg={8}>
                        <Card
                            className="h-100 border-0 shadow-sm"
                            style={{
                                borderRadius: "12px",
                                backgroundColor: "#FFFFFF",
                            }}
                        >
                            <Card.Body className="p-4">
                                {/* Title and Expand Icon */}
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <Card.Title
                                        className="fw-semibold mb-0"
                                        style={{ color: "#1F2937" }}
                                    >
                                        Patient Age Distribution
                                    </Card.Title>
                                    <div className="patient-journey-up-icon1 border p-2 rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                            <path d="M18.914 6.33984V16.0898C18.914 16.2888 18.835 16.4795 18.6943 16.6202C18.5537 16.7608 18.3629 16.8398 18.164 16.8398C17.9651 16.8398 17.7743 16.7608 17.6337 16.6202C17.493 16.4795 17.414 16.2888 17.414 16.0898V8.15016L6.69462 18.8705C6.55389 19.0112 6.36301 19.0903 6.16399 19.0903C5.96497 19.0903 5.7741 19.0112 5.63337 18.8705C5.49264 18.7297 5.41357 18.5389 5.41357 18.3398C5.41357 18.1408 5.49264 17.9499 5.63337 17.8092L16.3537 7.08984H8.41399C8.21508 7.08984 8.02431 7.01083 7.88366 6.87017C7.74301 6.72952 7.66399 6.53876 7.66399 6.33984C7.66399 6.14093 7.74301 5.95017 7.88366 5.80951C8.02431 5.66886 8.21508 5.58984 8.41399 5.58984H18.164C18.3629 5.58984 18.5537 5.66886 18.6943 5.80951C18.835 5.95017 18.914 6.14093 18.914 6.33984Z" fill="#2B4360" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="d-flex align-items-center gap-4 mb-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <span
                                            className="rounded-circle d-inline-block"
                                            style={{ width: 10, height: 10, backgroundColor: "#70AAA4" }}
                                        ></span>
                                        <span className="text-muted small" style={{ fontSize: "13px" }}>
                                            Male
                                        </span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <span
                                            className="rounded-circle d-inline-block"
                                            style={{ width: 10, height: 10, backgroundColor: "#E29578" }}
                                        ></span>
                                        <span className="text-muted small" style={{ fontSize: "13px" }}>
                                            Female
                                        </span>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div style={{ width: "100%", height: "320px" }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={[
                                                { age: "25 - 29", male: 85, female: 0 },
                                                { age: "30 - 34", male: 20, female: 60 },
                                                { age: "35 - 39", male: 60, female: 90 },
                                                { age: "40 - 44", male: 80, female: 40 },
                                                { age: "45 - 49", male: 75, female: 80 },
                                                { age: "50+", male: 20, female: 50 },
                                            ]}
                                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                        >
                                            {/* Gradient Fill */}
                                            <defs>
                                                <linearGradient id="colorMale" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#70AAA4" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#70AAA4" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorFemale" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#E29578" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#E29578" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>

                                            {/* Background Grid */}
                                            <CartesianGrid
                                                stroke="#E5E7EB"
                                                strokeDasharray="0"
                                                horizontal={true}
                                                vertical={false}
                                            />

                                            {/* X and Y Axis */}
                                            <XAxis
                                                dataKey="age"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                                                padding={{ left: 30, }}
                                            />
                                            <YAxis
                                                ticks={[0, 15, 30, 45, 60, 75, 90, 105]}
                                                domain={[0, 105]}
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                                            />

                                            {/* Tooltip */}
                                            {/* <Tooltip
                                                cursor={false}
                                                contentStyle={{
                                                    backgroundColor: "#FFFFFF",
                                                    border: "1px solid #E5E7EB",
                                                    borderRadius: "8px",
                                                    fontSize: "12px",
                                                }}
                                            /> */}

                                            {/* Area Lines */}
                                            <Area
                                                type="monotone"
                                                dataKey="male"
                                                stroke="#70AAA4"
                                                fill="url(#colorMale)"
                                                fillOpacity={1}
                                                strokeWidth={2}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="female"
                                                stroke="#E29578"
                                                fill="url(#colorFemale)"
                                                fillOpacity={1}
                                                strokeWidth={2}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                </Row>

                {/* <Row>
                    <Col lg={8}>
                        <Card>
                            <Card.Body>

                                <div className="d-flex justify-content-between align-items-center">
                                    <Card.Title className="dashboard-chart-heading">Appointment Overview</Card.Title>
                                    <div className="patient-journey-up-icon1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                            <path d="M18.914 6.33984V16.0898C18.914 16.2888 18.835 16.4795 18.6943 16.6202C18.5537 16.7608 18.3629 16.8398 18.164 16.8398C17.9651 16.8398 17.7743 16.7608 17.6337 16.6202C17.493 16.4795 17.414 16.2888 17.414 16.0898V8.15016L6.69462 18.8705C6.55389 19.0112 6.36301 19.0903 6.16399 19.0903C5.96497 19.0903 5.7741 19.0112 5.63337 18.8705C5.49264 18.7297 5.41357 18.5389 5.41357 18.3398C5.41357 18.1408 5.49264 17.9499 5.63337 17.8092L16.3537 7.08984H8.41399C8.21508 7.08984 8.02431 7.01083 7.88366 6.87017C7.74301 6.72952 7.66399 6.53876 7.66399 6.33984C7.66399 6.14093 7.74301 5.95017 7.88366 5.80951C8.02431 5.66886 8.21508 5.58984 8.41399 5.58984H18.164C18.3629 5.58984 18.5537 5.66886 18.6943 5.80951C18.835 5.95017 18.914 6.14093 18.914 6.33984Z" fill="#2B4360" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="appointment-overview-charts">
                                    <Bar data={appointmentChartData} options={options} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                  
                </Row> */}
            </div>






        </>
    );
};

export default Dashboard;
