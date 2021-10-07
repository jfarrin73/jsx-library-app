import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import toast from "react-hot-toast";
// import DataService from "../service/DataService";

export default function LoginModal({handleLogin}) {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const submitHandler = async (e) => {
        e.preventDefault();
        try{
            await handleLogin({username, password});
            setErrorMessage("");
            setUsername("");
            setPassword("");
            closeModal();
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
                    className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white transition duration-500 ease-in-out rounded-md">
                    Login
                </button>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={()=>{
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
                                className="inline-block w-min max-w-lg px-8 py-6 overflow-hidden align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-md">
                                <Dialog.Title
                                    as="h3"
                                    className="text-3xl font-custom text-center text-gray-900 dark:text-gray-400 mb-14 font-light">
                                    Login
                                </Dialog.Title>
                                {errorMessage !== "" && <p className="text-red-500 text-sm text-left">{errorMessage}</p>}
                                <form className="my-7" onSubmit={submitHandler}>
                                    <div className="flex relative ">
                                        <span class="rounded-l-md inline-flex items-center px-3 bg-white dark:bg-gray-900 border-t border-l border-b border-gray-300 dark:border-gray-700 text-gray-500 shadow-sm text-sm">
                                            <svg className="15" height="15" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1792 710v794q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-794q44 49 101 87 362 246 497 345 57 42 92.5 65.5t94.5 48 110 24.5h2q51 0 110-24.5t94.5-48 92.5-65.5q170-123 498-345 57-39 100-87zm0-294q0 79-49 151t-122 123q-376 261-468 325-10 7-42.5 30.5t-54 38-52 32.5-57.5 27-50 9h-2q-23 0-50-9t-57.5-27-52-32.5-54-38-42.5-30.5q-91-64-262-182.5t-205-142.5q-62-42-117-115.5t-55-136.5q0-78 41.5-130t118.5-52h1472q65 0 112.5 47t47.5 113z">
                                                </path>
                                            </svg>
                                        </span>
                                        <input type="text"
                                               className="rounded-r-lg flex-1 appearance-none border border-gray-300 dark:border-gray-700 w-60 py-2 px-4 bg-white dark:bg-gray-900 text-gray-700 dark:text-white placeholder-gray-400 shadow-sm text-base focus:outline-none focus:border-green-700 dark:focus:border-green-300"
                                               placeholder="Username"
                                               onChange={e => setUsername(e.target.value)}/>
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="flex relative my-2">
                                            <span
                                                className="rounded-l-md inline-flex items-center px-3 bg-white dark:bg-gray-900 border-t border-l border-b border-gray-300 dark:border-gray-700 text-gray-500 shadow-sm text-sm">
                                                 <svg width="15" height="15" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z">
                                                    </path>
                                                </svg>
                                            </span>
                                            <input type="password"
                                                   className="rounded-r-lg flex-1 appearance-none border border-gray-300 dark:border-gray-700 w-60 py-2 px-4 bg-white dark:bg-gray-900 text-gray-700 dark:text-white placeholder-gray-400 shadow-sm text-base focus:outline-none focus:border-green-700 dark:focus:border-green-300"
                                                   placeholder="Password"
                                                   onChange={e => setPassword(e.target.value)}/>
                                        </div>
                                        <a
                                            onClick={_ => toast("Coming soon")}
                                            className="self-end text-gray-700 dark:text-gray-400 cursor-pointer text-mg font-light">Forgot your password?</a>
                                    </div>
                                    <button
                                        className="shadow-md p-2 mt-14 w-full font-custom cursor-pointer rounded-lg text-white focus:outline-none text-xl bg-green-700">
                                        Login
                                    </button>
                                </form>

                                <a
                                    onClick={_ => toast("Coming soon")}
                                    className="text-gray-700 dark:text-gray-400 cursor-pointer text-sm font-light">Don't have an account, yet?</a>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}
