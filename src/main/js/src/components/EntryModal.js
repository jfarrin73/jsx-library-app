import React, {useEffect} from "react";
import {Dialog, Transition} from '@headlessui/react'
import {Fragment, useState} from 'react'
import JsxRenderer from "./JsxRenderer";
import Picker from "./Picker";
// import {HiCheck, HiSelector} from "react-icons/hi";

const categories = [
    {name: 'Element'},
    {name: 'Form'},
    {name: 'Commerce'},
    {name: 'Navigation'},
    {name: 'Section'},
    {name: 'List'},
]

export default function EntryModal({isOpen,setIsOpen,entry,saveHandler}) {
    let [code, setCode] = useState("");
    let [description, setDescription] = useState("");
    let [title, setTitle] = useState("");
    let [category, setCategory] = useState("");

    useEffect(() => {
        if (isOpen){
            console.log("entry passed to EntryModal: " + entry.title);
            setTitle(entry.title);
            setDescription(entry.description);
            setCode(entry.code);
            setCategory(entry.category);
        }
    },[isOpen]);

    async function handleSubmit(event) {
        event.preventDefault();
        setIsOpen(false);
        entry.description = description;
        entry.title = title;
        entry.code = code;
        entry.category = category;
        saveHandler(entry);
    }

    return (
        <div>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-50 overflow-y-auto"
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
                                className="inline-block lg:w-3/4 md:w-full sm:w-full p-6 mr-4 mt-4 overflow-hidden text-left align-top transition-all transform bg-gray-100 dark:bg-gray-800 shadow-xl rounded-2xl">
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-2xl font-medium leading-6 text-green-700 dark:text-green-300">
                                                New Component
                                            </Dialog.Title>
                                            <label>
                                                <input
                                                    type="button" value="Save"
                                                    onClick={handleSubmit}
                                                   className="bg-green-700 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md cursor-pointer transition ease-in-out duration-500"/>
                                            </label>
                                        </div>

                                        <div className="flex space-x-4">
                                            <input
                                                type="text" placeholder="Title" value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="outline-none rounded-lg shadow-md p-2 text-xl bg-white dark:bg-gray-900 dark:text-white placeholder-gray-400 w-full"/>
                                            <Picker options={categories} initialValue={{name:category}} onSelectionChanged={c => setCategory(c)}/>
                                        </div>
                                        <textarea
                                            type="text" placeholder="Description" value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="outline-none rounded-lg align-text-top align-top shadow-md h-24 p-2 bg-white dark:bg-gray-900 dark:text-white placeholder-gray-400"/>

                                        <JsxRenderer onChange={(e => setCode(e))}/>
                                    </div>
                            </div>
                        </Transition.Child>
                    </div>

                </Dialog>
            </Transition>


        </div>
    )
}
