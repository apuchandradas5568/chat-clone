'use client'

import Button from "@/app/components/Button";
import Modal from "@/app/components/Modal";
import Select from "@/app/components/inputs/Select";
import Input from "@/app/components/inputs/input";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface GroupChatModalProps {
    isOpen?: boolean;
    onClose: () => void;
    users: User[]
}

const GroupChatModal:React.FC<GroupChatModalProps> = ({isOpen, onClose, users}) => {


    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            members: []
        }
    })

    const members = watch('members')

    const onSubmit:SubmitHandler<FieldValues> = (data: FieldValues) => {

        setIsLoading(true)
        axios.post('/api/conversations', {
            ...data,
            isGroup: true
        })
        .then(() => {
            router.refresh()
            onClose()
        })
        .catch(() => toast.error('Failed to create group chat'))
        .finally(() => setIsLoading(false))
    }




  return (
    <Modal
    isOpen={isOpen}
    onClose={onClose}
   
    >

        <form className="w-full p-8" onSubmit={handleSubmit(onSubmit)} >
            <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Create a group chat
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Start a conversation with multiple people
                        </p>


                        <div className="mt-10 flex flex-col gap-y-8">
                            <Input
                            register={register}
                            name="name"
                            label="Group name"
                            errors={errors}
                            required
                            disabled={isLoading}
                            id="name"
                            />
                            <Select
                            label="Members"
                            options={users.map((user)=>({
                                label: user.name,
                                value: user.id
                            }))}
                            onChange={(value) => setValue('members', value)}
                            value={members}
                            disabled={isLoading}

                            />
                        </div>

                    </div>
            </div>


                                <div className="mt-6 flex items-center justify-end gap-x-6">

                                    <Button
                                    disabled={isLoading}
                                    onClick={onClose}
                                    type="button"
                                    secondary
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                    disabled={isLoading}
                                    type="submit"
                                    >
                                        Create
                                    </Button>
                                </div>

        </form>

    </Modal>
  )
}

export default GroupChatModal