import { useEffect, useRef, useState, FC, ClipboardEvent, KeyboardEvent } from 'react';

interface OTPInputsProps {
  onChange: (otp: string) => void;
  length?: number;
  className?: string;
}

const OTPInputs: FC<OTPInputsProps> = ({ onChange, length = 4, className }) => {
const [otpValues, setOtpValues] = useState<Array<string | number>>(Array(length).fill(''));
  const inputRefs = useRef([]);

  const handleInputChange = (
    index: string | number,
    value: string | number
  ) => {
    const newOtpValues = [...otpValues];
    newOtpValues[Number(index)] = value;
    setOtpValues(newOtpValues);

    if (value && Number(index) < otpValues.length - 1) {
      inputRefs.current[Number(index) + 1].focus();
    }
  };

const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
  const pasteData = e.clipboardData.getData('text');
  const cleanedData = pasteData.replace(/\D/g, '').slice(0, 6);

  const newOtpValues = [...otpValues];
  cleanedData.split('').forEach((char: string | number, index: number) => {
    if (index < otpValues.length) {
      newOtpValues[index] = char;
    }
  });

  setOtpValues(newOtpValues);
};

const handleKeyDown = (
  e: KeyboardEvent<HTMLInputElement>,
  index: string | number
) => {
  if (e.key === 'Backspace') {
    e.preventDefault();
    const newOtpValues = [...otpValues];
    newOtpValues[Number(index)] = '';

    if (Number(index) > 0) {
      setOtpValues(newOtpValues);
      inputRefs.current[Number(index) - 1].focus();
    } else {
      setOtpValues(newOtpValues);
    }
  }
};

  useEffect(() => {
    onChange(otpValues.join(''));
  }, [onChange, otpValues]);

  return (
    <article
      id="otp"
      className={`w-full flex flex-row gap-4 text-center flex-wrap ${className}`}
      onPaste={handlePaste}
    >
      {otpValues.map((value, index) => {
        return (
          <input
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            className={`border-[1px] border-secondary h-10 w-10 text-center form-control focus:border-[1.5px] focus:border-primary rounded outline-none  max-md:w-8 max-md:h-8`}
            type="text"
            value={value}
            onChange={(e) => {
              handleInputChange(index, e.target.value);
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
            maxLength={1}
          />
        );
      })}
    </article>
  );
};

export default OTPInputs;
