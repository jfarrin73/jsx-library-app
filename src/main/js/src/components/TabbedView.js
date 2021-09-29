// import { useState } from 'react'
import { Tab } from '@headlessui/react'
import Preview from "./Preview";
import CodeBlockComponent from "./CodeBlockComponent";
import React from 'react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function TabbedView(props) {

    return (
        <div className="w-full py-2 px-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <Tab.Group>
                <div>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl text-gray-700 dark:text-gray-100">{props.entry.title}</h2>

                        <div className="flex items-start">
                            <Tab.List className="flex justify-end space-x-1 pr-1">
                                {["Preview", "Code"].map((label) => (
                                    <Tab
                                        key={label}
                                        className={({ selected }) =>
                                            classNames('text-white py-2 px-4 my-2 rounded-lg transition ease-in-out duration-500',
                                                selected
                                                    ? 'bg-green-700 hover:bg-green-600  bg-opacity-100 hover:bg-opacity-100 '
                                                    : 'bg-black dark:bg-white bg-opacity-50 hover:bg-opacity-70 dark:bg-opacity-10 dark:hover:bg-opacity-30'
                                            )
                                        }
                                    >
                                        {label}
                                    </Tab>
                                ))}
                            </Tab.List>
                            <button className="border border-green-700 font-bold text-green-700 dark:text-green-500 dark:border-green-500 py-1.5 px-4 my-2.5 rounded-lg">Copy</button>
                        </div>

                    </div>
                    <p className="dark:text-gray-400">{props.entry.description}</p>
                </div>
                <Tab.Panels>
                    <Tab.Panel className='focus:outline-none'>
                        <div className="flex p-4 justify-center">
                            <Preview view={props.entry.code}/>
                        </div>
                    </Tab.Panel>
                    <Tab.Panel className='focus:outline-none'>
                        <div className="flex justify-center p-4">
                            <CodeBlockComponent codeString={props.entry.code}/>
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>

            <div className="flex justify-end space-x-1">
                <button
                    className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 pb-0.5 rounded-md">{props.entry.category}</button>
                <button
                    onClick={() => alert("Someday this might should you more components by this user")}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 pb-0.5 rounded-md">{props.entry.createdBy}</button>
            </div>

        </div>
    )
}
