"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const MessageInput: React.FC<MessageInputProps> = ({
  register,
  id,
  errors,
  required,
  placeholder,
  type,
}) => {
  return (
    <div
      className="
    relative
    w-full 
    "
    >
      <input
        {...register(id, { required })}
        id={id}
        placeholder={placeholder}
        autoComplete={id}
        type={type}
        className="
      text-black
      font-light
      py-2
      px-4
      bg-neutral-100
      w-full
      rounded-full
        focus:outline-none
      "
      />
    </div>
  );
};

export default MessageInput;
