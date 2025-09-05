import React from 'react'

const Input = ({ type = "text", name, placeholder, registerProp, error }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {/* Label */}
            <label
                htmlFor={name}

            >
            </label>

            {/* Input */}
            <input
                id={name}
                type={type}
                placeholder={placeholder}
                className={`w-full mt-2 px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-black focus:bg-white focus:outline-none transition-all duration-300 text-black placeholder-gray-500  ${error ? "border-red-500 bg-red-50 focus:border-red-500" : "border-gray-200 bg-gray-50 focus:border-black focus:bg-white"}`}
                {...registerProp}
            />

            {error && (
                <p className="text-red-500 text-sm mt-1">
                    {error.message}
                </p>
            )}
        </div>
    );
}

export default React.memo(Input);

