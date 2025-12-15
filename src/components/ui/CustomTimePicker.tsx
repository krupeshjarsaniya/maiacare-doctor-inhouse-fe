// import React, { useRef } from 'react';
// import { Form } from 'react-bootstrap';
// import { InputFieldLabel, InputFieldHelperText, InputFieldError } from './InputField';

// export const TimePickerFieldGroup = ({
//   label = "",
//   name,
//   value,
//   onChange = () => {},
//   onBlur = () => {},
//   onClick = () => {},
//   placeholder = "",
//   required = false,
//   disabled = false,
//   readOnly = false,
//   error = "",
//   helperText = "",
//   className = "",
//   ...rest
// }: {
//   label?: string;
//   name?: string;
//   value?: string;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
//   onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
//   placeholder?: string;
//   required?: boolean;
//   disabled?: boolean;
//   readOnly?: boolean;
//   error?: string;
//   helperText?: string;
//   className?: string;
//   [key: string]: any;
// }) => {
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleContainerClick = () => {
//     if (inputRef.current) {
//       inputRef.current.showPicker?.(); // For modern browsers
//       inputRef.current.focus();       // Fallback
//     }
//   };

//   return (
//     <div className={`maiacare-input-field-container ${className}`}>
//       <InputFieldLabel label={label} required={required} />

//       <div onClick={handleContainerClick} style={{ cursor: 'pointer' }}>
//         <Form.Control
//           ref={inputRef}
//           className="maiacare-input-field"
//           type="time"
//           name={name}
//           value={value}
//           onChange={onChange}
//           onBlur={onBlur}
//           onClick={onClick}
//           placeholder={placeholder}
//           disabled={disabled}
//           readOnly={readOnly}
//           {...rest}
//         />
//       </div>

//       {error && <InputFieldError error={error} />}
//       {helperText && <InputFieldHelperText helperText={helperText} />}
//     </div>
//   );
// };

import React, { useRef } from 'react';
import { Form } from 'react-bootstrap';
import { InputFieldLabel, InputFieldHelperText, InputFieldError } from './InputField';

export const TimePickerFieldGroup = ({
  label = "",
  name,
  value,
  onChange = () => { },
  onBlur = () => { },
  onClick = () => { },
  placeholder = "",
  required = false,
  disabled = false,
  readOnly = false,
  error = "",
  helperText = "",
  className = "",
  ...rest
}: {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  [key: string]: any;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker?.(); // For modern browsers
      inputRef.current.focus();       // Fallback
    }
  };

  return (
    <div className={`maiacare-input-field-container position-relative ${className}`}>
      <InputFieldLabel label={label} required={required} />

      <div className='position-relative' onClick={handleContainerClick} style={{ cursor: 'pointer' }}>
        <Form.Control
          ref={inputRef}
          className="maiacare-input-field"
          type="time"

          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onClick={onClick}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          {...rest}
        />

        {/* <div className='calender-timepicker-icon' >
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
            <path d="M10.458 1.5625C8.78923 1.5625 7.15793 2.05735 5.77039 2.98448C4.38285 3.9116 3.30139 5.22936 2.66278 6.77111C2.02416 8.31286 1.85707 10.0094 2.18264 11.6461C2.5082 13.2828 3.31179 14.7862 4.4918 15.9662C5.6718 17.1462 7.17522 17.9498 8.81194 18.2754C10.4487 18.6009 12.1452 18.4338 13.6869 17.7952C15.2287 17.1566 16.5464 16.0752 17.4735 14.6876C18.4007 13.3001 18.8955 11.6688 18.8955 10C18.893 7.763 18.0033 5.61833 16.4215 4.03653C14.8397 2.45473 12.695 1.56498 10.458 1.5625ZM10.458 16.5625C9.16007 16.5625 7.89128 16.1776 6.81208 15.4565C5.73288 14.7354 4.89175 13.7105 4.39505 12.5114C3.89835 11.3122 3.76839 9.99272 4.02161 8.71972C4.27482 7.44672 4.89984 6.27739 5.81762 5.35961C6.73541 4.44183 7.90473 3.81681 9.17773 3.5636C10.4507 3.31038 11.7702 3.44034 12.9694 3.93704C14.1685 4.43374 15.1934 5.27487 15.9145 6.35407C16.6356 7.43327 17.0205 8.70206 17.0205 10C17.0187 11.7399 16.3266 13.408 15.0963 14.6383C13.866 15.8686 12.1979 16.5606 10.458 16.5625ZM15.7705 10C15.7705 10.2486 15.6717 10.4871 15.4959 10.6629C15.3201 10.8387 15.0817 10.9375 14.833 10.9375H10.458C10.2094 10.9375 9.97091 10.8387 9.7951 10.6629C9.61928 10.4871 9.52051 10.2486 9.52051 10V5.625C9.52051 5.37636 9.61928 5.1379 9.7951 4.96209C9.97091 4.78627 10.2094 4.6875 10.458 4.6875C10.7067 4.6875 10.9451 4.78627 11.1209 4.96209C11.2967 5.1379 11.3955 5.37636 11.3955 5.625V9.0625H14.833C15.0817 9.0625 15.3201 9.16127 15.4959 9.33709C15.6717 9.5129 15.7705 9.75136 15.7705 10Z" fill="#B0B4C1" />
          </svg>
        </div> */}

        {!value && (
          <div className='calender-timepicker-placeholder'>
            {placeholder}
          </div>
        )}

      </div>

      {error && <InputFieldError error={error} />}
      {helperText && <InputFieldHelperText helperText={helperText} />}
    </div>
  );
};
