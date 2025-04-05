import React, { useEffect, useState } from "react";
import Singup from "../components/Singup";
import SingIn from "../components/SingIn";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OAuth from "../components/OAuth";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [isNewUser, setIsNewUser] = useState(true);
    const [isFormSubmit, setIsFormSubmit] = useState(false);
    const [responseData, setResponseData] = useState();
    const navigate = useNavigate();

    // Handle user notifications
    const handleToastify = async () => {
        if (responseData?.success) {
            setIsNewUser(!isNewUser);
            toast.success(responseData.message, { autoClose: 2000 });
        }
    };

    useEffect(() => {
        if (isFormSubmit) {
            handleToastify();
            setIsFormSubmit(false);
        }
    }, [responseData]);

    useEffect(() => {
        if (currentUser?.email) {
            navigate("/profile");
        }
    }, [currentUser, navigate]);

    return (
        <>
            {currentUser?.email ? (
                <section className="form-section py-20">
                    <div className="container">
                        <p className="text-base md:text-xl text-center text-brand-blue font-heading font-bold">
                            User exists! Redirecting to profile page...
                        </p>
                    </div>
                </section>
            ) : (
                <section className="form-section py-10 md:py-20">
                    <div className="container">
                        <div className="form-container px-6 sm:px-10 bg-white py-8 pb-10 sm:py-12 sm:pb-14 max-w-lg mx-auto rounded-lg border-[1px] border-brand-blue/50 shadow-lg shadow-brand-blue/30">
                            
                            {/* FORM HEADING */}
                            <h1 className="text-left text-brand-blue mb-5 font-semibold font-heading text-lg sm:text-2xl">
                                {isNewUser ? "Login" : "Create an account"}
                            </h1>

                            {/* LOGIN OR SIGNUP FORM */}
                            {isNewUser ? (
                                <SingIn />
                            ) : (
                                <Singup userState={{ setResponseData, setIsFormSubmit }} />
                            )}

                            {/* SWITCH BETWEEN LOGIN & SIGNUP */}
                            <p className="text-center font-heading text-gray-800 mt-5">
                                {isNewUser ? "Don’t have an account?" : "Already have an account?"}
                                <u
                                    className="ml-1 text-brand-blue cursor-pointer font-semibold"
                                    onClick={() => setIsNewUser(!isNewUser)}
                                >
                                    {isNewUser ? "Create an account" : "Login"}
                                </u>
                            </p>

                            <OAuth />
                            <ToastContainer limit={1} />
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </>
    );
};

export default Login;
