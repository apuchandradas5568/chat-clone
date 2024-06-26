'use client'

import ReactSelect from 'react-select'

interface SelectProps {
    label?: string
    value?:Record<string, any>
    options: Record<string, any>[]
    onChange: (value: Record<string, any>) => void
    disabled?: boolean
}

const Select:React.FC<SelectProps> = ({
    label, value, options, onChange, disabled
}) => {
  return (
    <div
    className="z-[100]"
    >

        <label className="block text-sm font-medium leading-6 text-gray-900">
            {label}
        </label>


        <div className="mt-2">
            <ReactSelect
            isDisabled={disabled}
            value={value}
            onChange={(value) => onChange(value)}
            options={options}
            isMulti
            menuPortalTarget={document.body}
            styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
            classNames={
                {
                    control: () => 'text-sm'
                }
            }
            />
        </div>

    </div>
  )
}

export default Select