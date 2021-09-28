import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
// import DataService from "../service/DataService";

export default function LoginModal(props) {
    let [isOpen, setIsOpen] = useState(false);
    let [errorMessage, setErrorMessage] = useState("");
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let user = {
        "username": username,
        "password": password
    }

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    async function handleSubmit(data){
        data.preventDefault();
        try{
            await props.login(user);
            setUsername("");
            setPassword("");
            setErrorMessage("");
            closeModal();
        } catch (e){
            setErrorMessage("Invalid username or password")
        }
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
                    onClose={closeModal}>
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0">
                            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
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
                            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
                                {/*TITLE*/}
                                <Dialog.Title
                                    as="h3"
                                    className="text-2xl font-medium text-green-700 dark:text-green-400 flex justify-center">
                                    Login
                                </Dialog.Title>
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex flex-col space-y-4">
                                    {/*USERNAME*/}
                                    <label className="dark:text-white text-lg flex flex-col">
                                        Username
                                        <input
                                            onChange={(e) => {setUsername(e.target.value); setErrorMessage("");}}
                                            type="text" placeholder="Username" name="username"
                                            className="p-2 bg-gray-200 text-gray-400 dark:text-gray-300 dark:bg-gray-700 rounded-lg"/>
                                    </label>
                                    {/*PASSWORD*/}
                                    <div>
                                        <label className="dark:text-white text-lg flex flex-col">
                                            Password
                                            <input
                                                onChange={(e) => {setPassword(e.target.value); setErrorMessage("");}}
                                                type="password" placeholder="Password" name="password"
                                                className="p-2 bg-gray-200 text-gray-400 dark:text-gray-300 dark:bg-gray-700 rounded-lg"/>
                                        </label>
                                        {/*ERROR MESSAGE*/}
                                        <p className="text-red-500 pt-2 align-middle">{errorMessage}</p>
                                    </div>

                                    {/*SUBMIT*/}
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            onClick={closeModal}
                                            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600  text-black dark:text-white transition duration-500 ease-in-out py-2 px-4 mt-4 rounded-lg"
                                            type="submit">Cancel</button>
                                        <button
                                            className="bg-green-700 hover:bg-green-600 transition duration-500 ease-in-out  py-2 px-4 mt-4 rounded-lg text-white"
                                            type="submit">Submit</button>
                                    </div>

                                </form>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}
