import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { toast } from 'react-toastify';

const Signup = ({ userState }) => {
    const { setResponseData, setIsFormSubmit } = userState;
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, dirtyFields },
    } = useForm();

    // Handle form submission
    const onSubmit = async (formData) => {
        setLoading(true);
        setApiError('');
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Signup failed');

            setIsFormSubmit(true);
            setResponseData(data);
            reset();
        } catch (error) {
            setApiError(error.message);
        }
        setLoading(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* USERNAME INPUT */}
                <input
                    {...register('username', { required: true })}
                    type="text"
                    placeholder="Username"
                    className="form_input"
                />
                {errors.username && (
                    <span className="text-red-700 font-semibold text-sm">This field is required</span>
                )}

                {/* EMAIL INPUT */}
                <input
                    {...register('email', { required: true })}
                    type="email"
                    placeholder="Email"
                    className={`form_input mt-3 ${dirtyFields.email ? 'bg-gray-200 text-gray-900' : 'bg-white'}`}
                />
                {errors.email && (
                    <span className="text-red-700 font-semibold text-sm">This field is required</span>
                )}

                {/* PASSWORD INPUT WITH TOGGLE */}
                <div className="relative">
                    <input
                        {...register('password', { required: true })}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        className={`form_input mt-3 pr-10 ${
                            dirtyFields?.password ? 'bg-gray-200 text-gray-900' : 'bg-white'
                        }`}                        
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
                    </button>
                </div>
                {errors.password && (
                    <span className="text-red-700 font-semibold text-sm">This field is required</span>
                )}

                {/* DISPLAY API ERROR */}
                {apiError && <p className="text-red-600 text-sm">{apiError}</p>}

                {/* SUBMIT BUTTON */}
                <button
                    type="submit"
                    disabled={loading}
                    className="btn bg-brand-blue text-white mt-5 rounded-md w-full hover:bg-brand-blue/90"
                >
                    {loading ? 'Loading...' : 'Create an account'}
                </button>
            </form>
        </>
    );
};

export default Signup;
