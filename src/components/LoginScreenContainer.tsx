'use client';

import Image from 'next/image';
import { MdMailOutline } from "react-icons/md";
import { BiHide, BiLockAlt, BiShow } from "react-icons/bi";

import Logo from "../assets/images/Maia Logo.png";
import FacebookIcon from "../assets/images/Facebook_Icon.png";
import GoogleIcon from "../assets/images/Google_Icon.png";
import PregnecyWomanLogin from "../assets/images/Pregnecy_Woman_Login.png";
import { Col, Container, Row } from 'react-bootstrap';
import PillsImage from "../assets/images/pills.png";
import Maia from "@/assets/images/maia.png";
import "@/style/login.css"
import { LoginForms } from './form/LoginForms';


export default function LoginScreenContainer() {

    return (
        <>
            <Container fluid>
                <Row className='min-vh-100' >

                    <Col md={6} className="d-flex align-items-center justify-content-center">
                        <div className='forgot-passwored-detail'>
                            <div className='d-flex justify-content-center align-item-center'>

                                <Image src={Maia}
                                    alt="maia-care"
                                    className="img-fluid maia-care-image "
                                />
                            </div>
                            <h2 className="login-title text-center mt-3" >
                                Log In To Your Account.

                            </h2>
                            <p className="login-subtitle text-center">Please enter details to access your dashboard</p>

                            <LoginForms />
                            
                        </div>
                    </Col>

                    <Col
                        md={6}
                        className="d-none d-md-flex align-items-center justify-content-center position-relative p-0 image-col"
                    >
                        <Image
                            src={PillsImage}
                            alt="Pills spilling"
                            className="img-fluid w-100 h-100 image-full"
                        />

                        <div className="image-overlay-text text-center w-100">
                            “Managing your pharmacy, <br /> made easy!”
                        </div>
                    </Col>
                </Row>
            </Container>
        </>

    );
}
