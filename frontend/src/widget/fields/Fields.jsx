import React, { useEffect, useRef, useState } from "react";
import { ArrowUpTrayIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

const Wrapper = React.memo(({ label, required, children }) => {
  return (
    <div>
      {label && (
        <label className="block text-[13px] font-medium text-gray-700 mb-1">
          <b>{label}</b>
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
    </div>
  );
});

const Input = ({
  style,
  className = "",
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  readOnly = false,
  disabled = false,
  placeholder = "",
  prefix = "",
  maxLength = "",
  autoComplete = "off",
  min = "",
  max = "",
  validationType = "",
}) => {
  const gstPattern =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}Z[0-9A-Z]{1}$/;

  const panPattern =
    /^[A-Z]{0,5}$|^[A-Z]{5}[0-9]{0,4}$|^[A-Z]{5}[0-9]{4}[A-Z]{0,1}$/;

  const handleChange = (e) => {
    let val = e.target.value;

    if (type === "name" && !validationType) {
      val = val.replace(/[^a-zA-Z\s]/g, "");
      val = val.replace(/\b\w/g, (c) => c.toUpperCase());
    }
    if (validationType === "alpha") {
      // Allow only letters and spaces
      val = val.replace(/[^a-zA-Z\s]/g, "");
    }

    if (type === "number") {
      val = val.replace(/[^0-9]/g, "");
    }

    if (validationType === "bankAccno") {
      // val = val.replace(/[^0-9]/g, "");

      if (val) {
        if (val.length > 18) {
          val = val.slice(0, 18);
        }

        if (val.length < 8) {
          console.error(
            "Invalid bank account number: must be at least 8 digits",
          );
        }
      }
    }

    if (validationType === "ifsc") {
      val = val.toUpperCase().replace(/[^A-Z0-9]/g, "");
    }

    if (validationType === "pincode") {
      val = val.replace(/[^0-9]/g, "");
      if (val.length > 6) {
        val = val.slice(0, 6);
      }

      if (val && parseInt(val.charAt(0), 10) === 0) {
        val = "";
      }
    }

    if (validationType === "mobile") {
      val = val.replace(/[^0-9]/g, "");
      if (val && parseInt(val.charAt(0), 10) <= 5) {
        val = "";
      }
      if (val && parseInt(val.charAt(0), 10) === 0) {
        val = "";
      }
    }

    if (type === "password") {
      // No transformation needed here
      // val = val;
    }

    if (validationType === "pan") {
      val = val.toUpperCase();
      if (!panPattern.test(val)) return;
    }
    if (validationType === "otp") {
      val = val.replace(/[^0-9]/g, "");
      if (maxLength) {
        if (val.length > maxLength) val = val.slice(0, maxLength);
      } else {
        if (val.length > 6) val = val.slice(0, 6);
      }
    }

    if (validationType === "gst") {
      val = val.toUpperCase();
      if (!gstPattern.test(val)) return;
    }

    if (validationType === "email") {
      const firstChar = val.charAt(0);
      if (firstChar && !/^[a-zA-Z0-9]/.test(firstChar)) {
        val = "";
      }
      val = val.replace(/[^a-zA-Z0-9@._-]/g, "");
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (val && !emailPattern.test(val)) {
        // You can handle error display elsewhere
      }
    }
    if (validationType === "uidaicode") {
      val = val.toUpperCase();
      val = val.replace(/[^A-Z0-9-_]/g, "");
    }

    onChange({
      ...e,
      target: { ...e.target, name: name, value: val },
    });
  };

  const handleKeyDown = (e) => {
    if (type === "number") {
      if (
        !/[0-9]/.test(e.key) &&
        e.key !== "Backspace" &&
        e.key !== "ArrowLeft" &&
        e.key !== "ArrowRight" &&
        e.key !== "Tab"
      ) {
        e.preventDefault();
      }
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("Text");
    if (type === "password") {
      // allow everything for password
    }

    if (type === "number") {
      const pasted = e.clipboardData.getData("Text");
      if (/[^0-9]/.test(pasted)) e.preventDefault();
    }

    if (validationType === "pan") {
      const pasted = e.clipboardData.getData("Text").toUpperCase();
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pasted)) e.preventDefault();
    }

    if (validationType === "gst") {
      const pasted = e.clipboardData.getData("Text").toUpperCase();
      const gstPartialPattern = /^[0-9A-Z]{0,15}$/;
      if (!gstPartialPattern.test(pasted)) {
        e.preventDefault();
      }
    }
  };

  return (
    <Wrapper label={label} required={required}>
      <div className="relative">
        {prefix && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600 text-sm">
            {prefix}
          </span>
        )}
        <input
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          type={type === "number" ? "text" : type}
          maxLength={
            validationType === "pan"
              ? 10
              : validationType === "gst"
                ? 15
                : maxLength
          }
          name={name}
          value={value ?? ""}
          onChange={handleChange}
          readOnly={readOnly}
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          style={style}
          min={min}
          max={max}
          className={
            className
              ? className
              : `w-full h-12 border rounded-lg ${
                  prefix ? "pl-10" : "pl-3"
                } pr-3 text-sm bg-gray-50`
          }
        />
      </div>
    </Wrapper>
  );
};

// Select component

const Select = ({
  label,
  style,
  name,
  value,
  onChange,
  multiple = false,
  required = false,
  disabled = false,
  placeholder = "Select",
  options = [],
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle selection logic
  const handleSelect = (optValue) => {
    if (!multiple) {
      onChange({
        target: { name, value: optValue },
      });
      setOpen(false);
    } else {
      const currentValues = Array.isArray(value) ? value : [];
      const newValue = currentValues.includes(optValue)
        ? currentValues.filter((v) => v !== optValue)
        : [...currentValues, optValue];

      onChange({
        target: { name, value: newValue },
      });
    }
  };

  // Display text for selected values
  const displayText = multiple
    ? options
        .filter((opt) => Array.isArray(value) && value.includes(opt.value))
        .map((opt) => opt.label)
        .join(", ") || placeholder
    : options.find((opt) => opt.value === value)?.label || placeholder;

  // If not multiple, use normal <select>
  if (!multiple) {
    return (
      <Wrapper label={label} required={required}>
        <select
          name={name}
          autoComplete="off"
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          style={style}
          className="w-full border rounded-lg px-3 py-3 text-md bg-gray-50"
        >
          <option value="">{placeholder}</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Wrapper>
    );
  }

  // Custom dropdown (with checkboxes) for multiple = true
  return (
    <Wrapper label={label} required={required}>
      <div ref={ref} className="relative">
        <div
          onClick={() => !disabled && setOpen((prev) => !prev)}
          className={`flex justify-between items-center w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-pointer ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          <span
            className={`truncate ${
              displayText === placeholder ? "text-gray-400" : "text-gray-900"
            }`}
          >
            {displayText}
          </span>
          <ChevronDownIcon className="w-4 h-4 text-gray-500 ml-2" />
        </div>

        {open && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-56 overflow-auto">
            {options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(opt.value)}
                  onChange={() => handleSelect(opt.value)}
                  className="mr-2 accent-blue-600"
                />
                {opt.label}
              </label>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

const FilterSelect = ({
  placeholder,
  label,
  name,
  value,
  onChange,
  options = [],
}) => (
  <div className="flex items-center gap-2">
    {label && (
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        {label}
      </label>
    )}
    <select
      name={name}
      value={value}
      autoComplete="off"
      onChange={onChange}
      className="border rounded-lg px-3 py-2 text-sm bg-gray-50"
    >
      <option value="">
        {label === "Search by" ? "Select key" : placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const UploadFile = ({
  fileOpener,
  label,
  name,
  required = false,
  disabled = false,
  multiple = false,
  accept = "all",
  onChange,
  value,
}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const getAcceptMime = (types) => {
    const map = {
      pdf: "application/pdf",
      image: "image/jpeg,image/jpg,image/png",
      img: "image/jpeg,image/jpg,image/png",
      csv: "text/csv",
      html: "text/html",
      text: "text/plain",
      doc: "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",

      // ✅ Excel support
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      excel:
        "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      all: "*",
    };

    if (!types) return "*";

    if (types.includes(",")) {
      return types
        .split(",")
        .map((t) => map[t.trim()] || t.trim())
        .join(",");
    }

    return map[types] || types;
  };

  const mimeTypes = getAcceptMime(accept);

  const emitFile = (file) => {
    if (!file) {
      onChange?.({
        target: {
          name,
          value: file ?? null,
        },
      });
    }
    if (file) {
      if (disabled) return;

      onChange?.({
        target: {
          name,
          value: file ?? null,
        },
      });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    emitFile(e.dataTransfer.files?.[0]);
  };

  const handleFileUpload = (e) => {
    emitFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Wrapper label={value ? "Click to view" : label} required={required}>
      {!value && (
        <div
          className={`
          border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center
          text-center cursor-pointer transition
          ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            !disabled && setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <ArrowUpTrayIcon className="w-6 text-gray-400" />

          <p className="text-gray-500 mt-3">
            Choose a file or drag & drop it here
          </p>
          <p className="text-gray-400 text-xs">Maximum File Size: 50MB</p>

          <button
            type="button"
            disabled={disabled}
            className="mt-4 px-4 py-2 border rounded-md bg-white hover:bg-gray-50"
          >
            Browse Files
          </button>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={mimeTypes}
            multiple={multiple}
            disabled={disabled}
            onChange={handleFileUpload}
          />
        </div>
      )}

      {value && (
        <div className="flex gap-2">
          <div className="w-full flex items-center gap-3 border rounded-xl p-3 bg-white mt-2">
            <div
              onClick={fileOpener}
              className="p-4 bg-blue-50 rounded-md cursor-pointer"
            >
              <img src={FileIcon} className="w-5" title="View File" />
            </div>

            {/* IMPORTANT: min-w-0 allows flex truncation */}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{value.name}</p>
              <p className="text-xs text-gray-500">
                Size: {formatFileSize(value.size)}
              </p>
            </div>

            <button
              title="Remove"
              type="button"
              className="text-gray-500 bg-inherit hover:text-red-600 p-2"
              onClick={() => emitFile(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

const TextArea = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  readOnly = false,
  disabled = false,
  placeholder = "",
  prefix = "",
  maxLength = "",
  autoComplete = "off",
  min = "",
  max = "",
  className = "",
  validationType = "",
}) => {
  const handleChange = (e) => {
    let val = e.target.value;
    if (type === "number") {
      val = val.replace(/[^0-9]/g, "");
    }
    if (type === "alphabet") {
      val = val.replace(/[^a-zA-Z\s]/g, "");
      val = val.replace(/\b\w/g, (c) => c.toUpperCase());
    }
    if (validationType === "address") {
      val = val.replace(/[^a-zA-Z0-9 .@/\\,:\-_]/g, "");
    }

    onChange({
      ...e,
      target: { ...e.target, name: name, value: val },
    });
  };

  const handleKeyDown = (e) => {
    if (type === "number") {
      if (
        !/[0-9]/.test(e.key) &&
        e.key !== "Backspace" &&
        e.key !== "ArrowLeft" &&
        e.key !== "ArrowRight" &&
        e.key !== "Tab"
      ) {
        e.preventDefault();
      }
    }
  };

  const handlePaste = (e) => {
    if (type === "number") {
      const pasted = e.clipboardData.getData("Text");
      if (/[^0-9]/.test(pasted)) e.preventDefault();
    }
  };

  return (
    <Wrapper label={label} required={required}>
      <div className="relative">
        <textarea
          autoComplete="off"
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          type={type === "number" ? "text" : type}
          maxLength={maxLength}
          name={name}
          value={value ?? ""}
          onChange={handleChange}
          readOnly={readOnly}
          disabled={disabled}
          placeholder={placeholder}
          min={min}
          max={max}
          className={
            className
              ? className
              : `w-full border rounded-lg ${
                  prefix ? "pl-10" : "pl-3"
                } pr-3 py-2 text-sm bg-gray-50`
          }
        />
      </div>
    </Wrapper>
  );
};

const ToolbarIconButton = ({ title = "", onClick, Icon, className = "" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-10 h-10 flex items-center justify-center border rounded-lg bg-white hover:bg-gray-50 ${className}`}
    >
      {Icon && <Icon className="w-5 h-5 text-gray-600" />}
    </button>
  );
};

// Toolbar button with icon + label (for Filters, etc.)
const ToolbarButton = ({
  title = "",
  onClick,
  Icon,
  children,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex items-center gap-2 border rounded-lg px-4 py-2 text-sm bg-white text-gray-700 hover:bg-gray-50 ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 text-gray-600" />}
      <span>{children}</span>
    </button>
  );
};

const RadioCardGroup = ({
  label,
  name,
  value,
  options,
  required = false,
  onChange,
}) => {
  const gridCols =
    options.length > 3
      ? "grid-cols-3"
      : options.length === 3
        ? "grid-cols-3"
        : "grid-cols-2";

  return (
    <div className="space-y-4">
      <Wrapper label={label} required={required}>
        <div className={`grid ${gridCols} gap-4`}>
          {options.map((option) => {
            const isSelected =
              value?.toLowerCase() === option.value.toLowerCase();

            return (
              <label
                key={option.value}
                className={`w-full rounded-lg py-2 border text-center cursor-pointer transition-colors
                  ${
                    isSelected
                      ? "bg-[#E6ECF3] text-[#044586] border-[#044586]"
                      : "bg-gray-50 text-black border-gray-300 hover:bg-[#E6ECF3] hover:text-[#044586] hover:border-[#044586]"
                  }`}
              >
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  onChange={onChange}
                  className="hidden"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </Wrapper>
    </div>
  );
};

// Compound export
const Field = {
  RadioCardGroup,
  Input,
  Select,
  TextArea,
  FilterSelect,
  ToolbarIconButton,
  UploadFile,
  ToolbarButton,
};
export default Field;
