import React, { useRef } from 'react';
import { Form } from 'react-bootstrap';
import { InputFieldLabel, InputFieldHelperText, InputFieldError } from './InputField';

export const DatePickerFieldGroup = ({
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
  iconColor = "var(--color-radio-lable)",
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
  iconColor?: string;
  [key: string]: any;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker?.(); // Preferred if supported (modern browsers)
      inputRef.current.focus(); // Fallback for older support
    }
  };
  const today = new Date().toISOString().split('T')[0];  
  return (
    <div className={`maiacare-input-field-container  ${className}`}>
      <InputFieldLabel label={label} required={required} />

      <div className='position-relative' onClick={handleContainerClick} style={{ cursor: 'pointer' }}>
        <Form.Control
          ref={inputRef}
          className="maiacare-input-field w-100"
          type={"date"}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onClick={onClick}
          placeholder={placeholder}
          // required={required}
          disabled={disabled}
          readOnly={readOnly}
          // max={today}
          {...rest}
        // style={{ color: "#3E4A57" }}
        />

        <div className='calender-timepicker-icon'>
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
            <path d="M17.2166 2.33984H15.6541V2.02734C15.6541 1.7787 15.5553 1.54025 15.3795 1.36443C15.2036 1.18862 14.9652 1.08984 14.7166 1.08984C14.4679 1.08984 14.2295 1.18862 14.0536 1.36443C13.8778 1.54025 13.7791 1.7787 13.7791 2.02734V2.33984H8.15405V2.02734C8.15405 1.7787 8.05528 1.54025 7.87947 1.36443C7.70365 1.18862 7.46519 1.08984 7.21655 1.08984C6.96791 1.08984 6.72946 1.18862 6.55364 1.36443C6.37782 1.54025 6.27905 1.7787 6.27905 2.02734V2.33984H4.71655C4.30215 2.33984 3.90472 2.50446 3.6117 2.79749C3.31867 3.09051 3.15405 3.48794 3.15405 3.90234V16.4023C3.15405 16.8167 3.31867 17.2142 3.6117 17.5072C3.90472 17.8002 4.30215 17.9648 4.71655 17.9648H17.2166C17.631 17.9648 18.0284 17.8002 18.3214 17.5072C18.6144 17.2142 18.7791 16.8167 18.7791 16.4023V3.90234C18.7791 3.48794 18.6144 3.09051 18.3214 2.79749C18.0284 2.50446 17.631 2.33984 17.2166 2.33984ZM6.27905 4.21484C6.27905 4.46348 6.37782 4.70194 6.55364 4.87776C6.72946 5.05357 6.96791 5.15234 7.21655 5.15234C7.46519 5.15234 7.70365 5.05357 7.87947 4.87776C8.05528 4.70194 8.15405 4.46348 8.15405 4.21484H13.7791C13.7791 4.46348 13.8778 4.70194 14.0536 4.87776C14.2295 5.05357 14.4679 5.15234 14.7166 5.15234C14.9652 5.15234 15.2036 5.05357 15.3795 4.87776C15.5553 4.70194 15.6541 4.46348 15.6541 4.21484H16.9041V6.08984H5.02905V4.21484H6.27905ZM5.02905 16.0898V7.96484H16.9041V16.0898H5.02905Z"
              fill={iconColor} />
          </svg>
        </div>

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