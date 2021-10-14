import { Dialog, Transition } from '@headlessui/react'
import {Fragment, useRef, useState} from 'react'
import {useForm} from "react-hook-form";

export default function RegisterModal({handleRegister}) {
    const [errorMessage, setErrorMessage] = useState("");
    const {register, handleSubmit, watch, reset, formState: {errors}} = useForm({mode: 'onChange'});
    const password = useRef({});
    password.current = watch("password", "");

    let [isOpen, setIsOpen] = useState(false);

    const onSubmit = async (data) => {
        try {
            const result = await handleRegister({email: data.email,username: data.username,password: data.password});
            if (result){
                setErrorMessage(result.toLowerCase());
            }else{
                console.log("valid register")
                setErrorMessage("");
                reset();
                closeModal();
            }
        } catch (e) {
            setErrorMessage(e);
        }
    }

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    return (
        <div>
            <div>
                <button
                    type="button"
                    onClick={openModal}
                    className="px-4 py-2 text-sm font-medium bg-green-700 hover:bg-green-600 text-white transition duration-500 ease-in-out rounded-md">
                    Sign Up
                </button>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={() => {
                        reset();
                        closeModal();
                        setErrorMessage("");
                    }}>
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0">
                            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 transition-opacity"/>
                        </Transition.Child>
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true">&#8203;</span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95">
                            <div
                                className="inline-block w-min px-8 py-6 overflow-hidden align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-md">
                                <Dialog.Title
                                    as="h3"
                                    className="text-3xl font-custom text-center text-gray-900 dark:text-gray-400 mb-14 font-light">
                                    Sign Up
                                </Dialog.Title>
                                <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
                                    {/*EMAIL*/}
                                    <input
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[a-z 0-9,.@_-]+$/i,
                                                message: "Invalid email"
                                            }
                                        })}
                                        type="text"
                                        className={`${errors.email ? "border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500" : "border-gray-300 dark:border-gray-700 focus:border-green-700 dark:focus:border-green-300"} rounded-lg appearance-none border w-72 py-2.5 px-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-white placeholder-gray-400 shadow-sm text-base focus:outline-none`}
                                        autoComplete="off"
                                        autoFocus
                                        placeholder="Email"
                                    />
                                    {errors.email &&
                                    <p className="mt-1 text-right text-red-500 text-sm">{errors.email.message}</p>}
                                    {/*USERNAME*/}
                                    <input
                                        {...register("username", {
                                            required: "Username is required", minLength: {
                                                value: 2,
                                                message: "Username is required"
                                            },
                                            maxLength: {
                                                value: 15,
                                                message: "Username is invalid"
                                            },
                                            pattern: {
                                                value: /^[a-z 0-9,.'-]+$/i,
                                                message: "Invalid Username"
                                            }
                                        })}
                                        type="text"
                                        className={`${errors.username ? "border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500" : "border-gray-300 dark:border-gray-700 focus:border-green-700 dark:focus:border-green-300"} rounded-lg appearance-none border w-72 py-2.5 px-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-white placeholder-gray-400 shadow-sm text-base focus:outline-none mt-2`}
                                        autoComplete="off"
                                        autoFocus
                                        placeholder="Username"
                                    />
                                    {errors.username &&
                                    <p className="mt-1 text-right text-red-500 text-sm">{errors.username.message}</p>}

                                    {/* Password */}
                                    <input
                                        {...register("password", {
                                            required: "You must specify a password",
                                            minLength: {
                                                value: 6,
                                                message: "Password must have at least 6 characters"
                                            },
                                        })}
                                        type="password"
                                        className={`${errors.password ? "border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500" : "border-gray-300 dark:border-gray-700 focus:border-green-700 dark:focus:border-green-300"} rounded-lg appearance-none border w-72 py-2.5 px-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-white placeholder-gray-400 shadow-sm text-base focus:outline-none mt-2`}
                                        autoComplete="off"
                                        placeholder="Password"
                                    />
                                    {errors.password &&
                                    <p className="mt-1 text-right text-red-500 text-sm">{errors.password.message}</p>}

                                    {/* Verify Password */}
                                    <input
                                        {...register("verifyPassword", {
                                            validate: value =>
                                                value === password.current || "Passwords do not match"
                                        })}
                                        type="password"
                                        className={`${errors.verifyPassword ? "border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500" : "border-gray-300 dark:border-gray-700 focus:border-green-700 dark:focus:border-green-300"} rounded-lg appearance-none border w-72 py-2.5 px-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-white placeholder-gray-400 shadow-sm text-base focus:outline-none mt-2`}
                                        autoComplete="off"
                                        placeholder="Verify Password"/>
                                    {errors.verifyPassword &&
                                    <p className="mt-1 text-right text-red-500 text-sm">{errors.verifyPassword.message}</p>}

                                    {errorMessage !== "" && <p className="text-red-500 text-sm text-right mt-1">{errorMessage}</p>}

                                    <button type="submit"
                                        className="bg-green-700 shadow-md mt-14 mb-4 w-full font-custom cursor-pointer rounded-lg text-white focus:outline-none text-xl py-2 px-4">
                                        Submit
                                    </button>

                                </form>


                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}
