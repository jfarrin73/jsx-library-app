import React from "react";
import {Dialog, Transition} from '@headlessui/react'
import {Fragment, useState} from 'react'
import JsxRenderer from "./JsxRenderer";
import CategoryPicker from "./CategoryPicker";

export default function NewEntryModal({addEntry}) {
    let [isOpen, setIsOpen] = useState(false);

    let [code, setCode] = useState("<div>My Component</div>");
    let [description, setDescription] = useState("component description");
    let [title, setTitle] = useState("My Component");
    let [category, setCategory] = useState("Element");

    let newEntry = {
        "title": title,
        "description": description,
        "code": code,
        "created": "",
        category: category
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsOpen(false);
        addEntry(newEntry);
    }

    return (
        <div>
            <div className="flex items-center justify-center">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="px-4 py-2 my-3 rounded-lg bg-gradient-to-r from-green-400 to-green-700 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md"
                >
                    Add
                </button>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={() => setIsOpen(false)}>
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0">
                            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50"/>
                        </Transition.Child>

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95">
                            <div
                                className="inline-block w-1/2 p-6 mt-8 overflow-hidden text-left align-top transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
                                <div className="">

                                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-2xl font-medium leading-6 text-gray-900 dark:text-gray-100">
                                                New Component
                                            </Dialog.Title>
                                            <label>
                                                <input type="submit" value="Save"
                                                       className="bg-green-700 hover:bg-green-600 text-white py-2 px-4 rounded-lg"/>
                                            </label>
                                        </div>

                                        <div className="flex space-x-4">
                                            <input
                                                type="text" placeholder="Title"
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="outline-none rounded-lg p-2 text-xl bg-gray-900 dark:text-white placeholder-gray-400 w-1/2"/>
                                            <CategoryPicker onSelectionChanged={c => setCategory(c)}/>
                                        </div>
                                        <input
                                            type="text" placeholder="Description"
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="outline-none rounded-lg p-2 bg-gray-900 dark:text-white placeholder-gray-400"/>

                                        <JsxRenderer onChange={(e => setCode(e.target.value))}/>
                                    </form>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>

                </Dialog>
            </Transition>


        </div>
    )
}
