import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "../Modal";
import Input from "../inputs/input";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import Button from "../Button";

interface SettingsModalProps {
  currentUser?: User;
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  currentUser,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  });

  const image = watch("image");

  const handleUpload = (result: any) => {
    setValue("image", result?.info?.secure_url),
      {
        shouldValidate: true,
      };
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios
      .patch(`/api/settings`, data)
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Failed to update user"))
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form className="w-full p-8"  onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Profile
            </h2>
            <p
              className="mt-1
                    text-sm
                    leading-6
                    text-gray-600
                    "
            >
              Update your profile information
            </p>

            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                disabled={isLoading}
                label="Name"
                id="name"
                errors={errors}
                required
                register={register}
                name="name"
              />

              <div>
                <label
                  className="
                            block
                            text-sm
                            font-medium
                            text-gray-900
                            leading-6
                            "
                >
                  Photo
                </label>
              </div>

              <div
                className="
                        mt-2
                        flex
                        items-center
                        gap-x-3
                        "
              >
                <Image
                  width="40"
                  height="40"
                  className="rounded-full"
                  src={image || currentUser?.image || "/placeholder.png"}
                  alt="profile image"
                />

                <CldUploadButton
                  options={{ maxFiles: 1 }}
                  onUpload={handleUpload}
                  uploadPreset="z8h3jgxj"
                >
                  <Button disabled={isLoading} secondary type="button">
                    Change
                  </Button>
                </CldUploadButton>
              </div>
            </div>
          </div>
          <div className="
          mt-6
          flex
          items-center
            justify-end
            gap-x-6
          ">
            <Button
              disabled={isLoading}
              type="submit"
              secondary
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              type="submit"
            >
              Save
            </Button>

          </div>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;
