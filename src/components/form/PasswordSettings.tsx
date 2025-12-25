import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { InputFieldGroup } from '../ui/InputField';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { setHeaderData } from '@/utils/redux/slices/headerSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/utils/redux/store';
import { useRouter } from 'next/navigation';
import { changePassword } from '@/utils/apis/apiHelper';

type FormError = Partial<Record<keyof FormData, string>>;
type FormData = {
    currentpassword: string;
    newpassword: string;
    confirmpassword: string;
};

function PasswordSettings() {

    const router = useRouter();
    const dispatch: AppDispatch = useDispatch();
    useEffect(() => {
        dispatch(setHeaderData({ title: "Settings", subtitle: "Settings" }));
    }, []);

    const initialFormError: FormError = {};

    const [formError, setFormError] = useState<FormError>(initialFormError);
    const [formData, setFormData] = useState<FormData>({
        currentpassword: "",
        newpassword: "",
        confirmpassword: "",

    });

    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        number: false,
        lowercase: false,
        uppercase: false,
        specialChar: false,
    });

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormError((prev) => ({ ...prev, [name]: "" }));

        if (name === "newpassword") {
            setPasswordValidation({
                minLength: value.length >= 8,
                number: /[0-9]/.test(value),
                lowercase: /[a-z]/.test(value),
                uppercase: /[A-Z]/.test(value),
                specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value),
            });
        }
    };

    const renderIcon = (condition: boolean) => {
        return condition ? (
            // Tick icon svg
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="12" viewBox="0 0 11 12" fill="none">
                <path d="M1.71875 6.64844L4.125 9.05469L9.625 3.55469" stroke="#AFDC81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ) : (
            // Dot icon svg
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="12" viewBox="0 0 11 12" fill="none">
                <circle cx="5.5" cy="5.96094" r="2" fill="#3E4A57" />
            </svg>
        );
    };

    const validateForm = (data: FormData): FormError => {
        const errors: FormError = {};

        if (!data.currentpassword.trim()) errors.currentpassword = "Current Password is required";
        if (!data.newpassword.trim()) errors.newpassword = "New Password is required";
        if (!data.confirmpassword.trim()) errors.confirmpassword = "Confirm Password is required";

        // Enhanced password validation for new password
        if (data.newpassword) {
            const password = data.newpassword;
            let passwordError = "";

            if (password.length < 8) {
                passwordError = "Minimum 8 characters";
            } else if (!/(?=.*[a-z])/.test(password)) {
                passwordError = "At least one lowercase letter";
            } else if (!/(?=.*[A-Z])/.test(password)) {
                passwordError = "At least one uppercase letter";
            } else if (!/(?=.*\d)/.test(password)) {
                passwordError = "At least one number";
            } else if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
                passwordError = "At least one special character (e.g., !@#$%^&*)";
            }

            if (passwordError) {
                errors.newpassword = passwordError;
            }
        }

        if (data.newpassword && data.confirmpassword && data.newpassword !== data.confirmpassword) {
            errors.confirmpassword = "Passwords do not match";
        }

        return errors;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // const errors = validateForm(formData);
        // setFormError(errors);
        // console.log("errors", errors);
        // if (Object.keys(errors).length === 0) {

        //     setFormError(initialFormError);
        // }
        const passData = { oldPassword: formData.currentpassword, newPassword: formData.confirmpassword }

        changePassword(passData)
            .then((response) => {

                console.log("response", response.data);
                if (response.status == 200) {
                    router.push("/dashboard");
                    console.log("Password changed successfully");
                } else {
                    const errors = validateForm(formData);
                    setFormError(errors);
                    if (Object.keys(errors).length === 0) {

                        setFormError(initialFormError);
                    }
                    console.log("Error");
                }

            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <p className="settings-accordion-subtitle my-4">For your security, please enter your current password followed by your new password.</p>
            <form onSubmit={handleSubmit} className='setting-passwored-label'>
                <InputFieldGroup
                    label="Current Password"
                    name="currentpassword"
                    type="password"

                    value={formData.currentpassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                    }}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => { }}
                    placeholder="Enter current password"
                    required={true}
                    disabled={false}
                    readOnly={false}
                    error={formError.currentpassword}
                />

                <InputFieldGroup
                    label="New Password"
                    name="newpassword"
                    type="password"
                    className='mt-3'
                    value={formData.newpassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                    }}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => { }}
                    placeholder="Enter new password"
                    required={true}
                    disabled={false}
                    readOnly={false}
                    error={formError.newpassword}
                />

                <div className="my-3">
                    <p className="settings-accordion-subtitle mb-2">Your password must meet the following requirements:</p>
                    <div className="d-flex align-items-center gap-2">
                        {renderIcon(passwordValidation.number)}
                        <span
                            className={`password-requirements ${passwordValidation.number ? "active" : ""
                                }`}
                        >
                            At least one number
                        </span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        {renderIcon(passwordValidation.minLength)}
                        <span
                            className={`password-requirements ${passwordValidation.minLength ? "active" : ""
                                }`}
                        >
                            Minimum 8 characters
                        </span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        {renderIcon(passwordValidation.lowercase)}
                        <span
                            className={`password-requirements ${passwordValidation.lowercase ? "active" : ""
                                }`}
                        >
                            At least one lowercase letter
                        </span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        {renderIcon(passwordValidation.uppercase)}
                        <span
                            className={`password-requirements ${passwordValidation.uppercase ? "active" : ""
                                }`}
                        >
                            At least one uppercase letter
                        </span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        {renderIcon(passwordValidation.specialChar)}
                        <span
                            className={`password-requirements ${passwordValidation.specialChar ? "active" : ""
                                }`}
                        >
                            At least one special character (e.g., !@#$%^&*)
                        </span>
                    </div>

                    {/* <div className="d-flex align-items-center gap-2">
                        {renderIcon(passwordValidation.number)}
                        <span className="password-requirements active">At least one number</span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        {renderIcon(passwordValidation.minLength)}
                        <span className="password-requirements">Minimum 8 characters</span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        {renderIcon(passwordValidation.lowercase)}
                        <span className="password-requirements">At least one lowercase letter</span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        {renderIcon(passwordValidation.uppercase)}
                        <span className="password-requirements">At least one uppercase letter</span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        {renderIcon(passwordValidation.specialChar)}
                        <span className="password-requirements">At least one special character (e.g., !@#$%^&*)</span>
                    </div> */}
                </div>

                <InputFieldGroup
                    label="Confirm Password"
                    name="confirmpassword"
                    type="password"

                    value={formData.confirmpassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                    }}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => { }}
                    placeholder="Re-enter password"
                    required={true}
                    disabled={false}
                    readOnly={false}
                    error={formError.confirmpassword}
                />
                <div className="d-flex justify-content-end align-items-center gap-3 mt-3">

                    <a className="forgate-password" onClick={() => router.push("/forgotppassword")}>Forgot Password?</a>

                    <Button variant="default" disabled={false} type="submit" contentSize="medium">
                        Save Password
                    </Button>
                </div>

            </form>
        </>
    )
}

export default PasswordSettings