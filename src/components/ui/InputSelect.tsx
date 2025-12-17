// "use client";
// import React from 'react'
// import { Form } from 'react-bootstrap'
// import { InputFieldLabel, InputFieldError, InputFieldHelperText } from './InputField';

// export default function InputSelect({
//     label="",
//     name,
//     defaultValue,
//     value,
//     onChange,
//     onBlur,
//     onClick,
//     required,
//     disabled,
//     error,
//     helperText,
//     className,
//     options = [],
//     placeholder="Select",
//     ...rest
// }: {
//     label?: string;
//     name?: string;
//     defaultValue?: string;
//     value?: string;
//     onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//     onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
//     onClick?: (e: React.MouseEvent<HTMLSelectElement>) => void;   
//     required?: boolean;
//     disabled?: boolean;
//     error?: string;
//     helperText?: string;
//     className?: string;
//     options?: { id: string, value: string, label: string }[];
//     [key: string]: any;
//     placeholder?: string;
// }) {
//   return (
//     <div className={`maiacare-input-field-container ${className}`}>
//       {label && <InputFieldLabel label={label} required={required} />}
//       <Form.Select
//         name={name}
//         value={value || defaultValue}
//         onChange={onChange}
//         onBlur={onBlur}
//         onClick={onClick}
//         // required={required}
//         disabled={disabled}
//         className={`maiacare-input-field`}
//         {...rest}
//       >
//         <option value={""}>{placeholder}</option>
//         {options.map(option => (
//           <option key={option.id} value={option.value}>{option.label}</option>
//         ))}
//       </Form.Select>
//       {error && <InputFieldError error={error} />}
//       {helperText && <InputFieldHelperText helperText={helperText} />}
//     </div>
//   )
// }




"use client";
import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import { InputFieldLabel, InputFieldError, InputFieldHelperText } from './InputField';
import Select from 'react-dropdown-select';
import  { MultiSelect }  from 'react-multi-select-component';

type OptionType = { value: string; label: string };

interface InputSelectMultiSelectProps {
  values: OptionType[];
  onChange: (values: OptionType[]) => void; // expose as full objects for flexibility
  options: { id: string, value: string, label: string }[];
  placeholder?: string;
  addPlaceholder?: string;
  label?: string;
  name?: string;
  required?: boolean;
  dropdownHandle?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  selectedOptionColor?: string;
  selectedOptionBorderColor?: string;
  [key: string]: any;
}

interface MultiSelectWithCheckboxProps {
  values: OptionType[];
  onChange: (values: OptionType[]) => void; // expose as full objects for flexibility
  options: { id: string, value: string, label: string }[];
  placeholder?: string;
  label?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  selectedOptionColor?: string;
  selectedOptionBorderColor?: string;
  [key: string]: any;
}


export function InputSelect({
  label = "",
  name,
  defaultValue,
  value,
  onChange,
  onBlur,
  onClick,
  required,
  disabled,
  error,
  helperText,
  className,
  options = [],
  placeholder = "Select",
  ...rest
}: {
  label?: string;
  name?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  options?: { id: string, value: string, label: string }[];
  placeholder?: string;
  [key: string]: any;
}) {
  return (
    <div className={`maiacare-input-field-container ${className}`}>
      {label && <InputFieldLabel label={label} required={required} />}
      <Form.Select
        name={name}
        // value={value || defaultValue}
        value={value ?? ""} 
        onChange={onChange}
        onBlur={onBlur}
        onClick={onClick}
        // required={required}
        // disabled={disabled}
        className={`maiacare-input-field ${className}`}
        {...rest}

      >
        <option value={""} disabled={disabled}>{placeholder}</option>
        {options.map(option => (
          <option key={option.id} value={option.value}>{option.label}</option>

        ))}
      </Form.Select>
      {error && <InputFieldError error={error} />}
      {helperText && <InputFieldHelperText helperText={helperText} />}
    </div>
  )
}

export function InputSelectMultiSelect({
  values,
  onChange,
  options,
  placeholder,
  addPlaceholder,
  label,
  name,
  required,
  dropdownHandle,
  disabled,
  error,
  helperText,
  className = "",
  selectedOptionColor = "var(--border-box)",
  selectedOptionBorderColor = "var(--border-box)",
  ...rest
}: InputSelectMultiSelectProps) {
  const handleRemove = (value: string) => {
    const newValues = values.filter((v) => v.value !== value);
    onChange(newValues);
  };

  return (
    <div className={`maiacare-input-field-container ${className}`}>
      {label && <InputFieldLabel label={label} required={required} />}

      <Select
        {...rest}
        name={name}
        className="maiacare-input-field custom-react-dropdown"
        options={options}
        multi={true}
        closeOnSelect={true}
        dropdownHandle={dropdownHandle}
        dropdownHandleRenderer={({ state }) => (

          <svg xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
            className={`transition-transform duration-300 ${state.dropdown ? "rotate-180" : "rotate-0"
              }`}
          >
            <path d="M16.9396 9.06491L10.6896 15.3149C10.6025 15.4023 10.499 15.4717 10.3851 15.519C10.2711 15.5663 10.1489 15.5906 10.0256 15.5906C9.90216 15.5906 9.77999 15.5663 9.66604 15.519C9.55208 15.4717 9.44859 15.4023 9.36149 15.3149L3.11149 9.06491C2.93537 8.88879 2.83643 8.64992 2.83643 8.40084C2.83643 8.15177 2.93537 7.9129 3.11149 7.73678C3.28761 7.56066 3.52648 7.46172 3.77555 7.46172C4.02462 7.46172 4.26349 7.56066 4.43961 7.73678L10.0263 13.3235L15.6131 7.736C15.7892 7.55988 16.028 7.46094 16.2771 7.46094C16.5262 7.46094 16.7651 7.55988 16.9412 7.736C17.1173 7.91212 17.2162 8.15099 17.2162 8.40006C17.2162 8.64914 17.1173 8.88801 16.9412 9.06413L16.9396 9.06491Z"
              fill="currentColor" />
          </svg>

        )}
        values={values}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(vals) => onChange(vals)}
        addPlaceholder={addPlaceholder || placeholder}
      />
      {values.length > 0 && (
        <p className="my-2 maiacare-input-field-helper-text">
          {values.length} selected
        </p>
      )}
      {values.length > 0 && (
        <div className="mt-2 d-flex gap-2 flex-wrap">
          {values.map((item) => (
            <div key={item.value} className="input-select-item-box" style={{ color: selectedOptionColor, borderColor: selectedOptionBorderColor }}>
              {item.label}
              <span
                className="ms-2 cursor-pointer"
                onClick={() => handleRemove(item.value)}
              >
                ✕
              </span>
            </div>
          ))}
        </div>
      )}

      {error && <InputFieldError error={error} />}
      {helperText && <InputFieldHelperText helperText={helperText} />}

    </div>
  );

}

export function MultiSelectWithCheckbox({
  values,
  onChange,
  options,
  placeholder = "Select",
  label,
  name,
  required,
  disabled,
  error,
  helperText,
  className = "",
  selectedOptionColor = "var(--border-box)",
  selectedOptionBorderColor = "var(--border-box)",
  ...rest
}: MultiSelectWithCheckboxProps) {

  const [isOpen, setIsOpen] = useState(false); // track dropdown open/close
  return (
    <>

      <div className={`maiacare-input-field-container custom-react-dropdown ${className}`}>
        {label && <InputFieldLabel label={label} required={required} />}

        {/* <MultiSelect
          // className="maiacare-input-field"
          options={options}
          value={values}
          onChange={onChange}
          
          labelledBy="Select Status"
          disableSearch={true} // disables search bar
          hasSelectAll={false} // removes "Select All" option
          onMenuToggle={(state: boolean) => setIsOpen(state)} // detect open/close
          overrideStrings={{
            selectSomeItems: placeholder, // placeholder text
            allItemsAreSelected: "All selected",
          }}
          //  show placeholder while open or empty, show selection after close
          valueRenderer={(values) => {
            if (isOpen || values.length === 0) {
              return placeholder; // placeholder while open
            }
            return values.map((s) => s.label).join(", "); // show selected when closed
          }}
        /> */}
      </div>

      {error && <InputFieldError error={error} />}
      {helperText && <InputFieldHelperText helperText={helperText} />}

    </>
  )

}