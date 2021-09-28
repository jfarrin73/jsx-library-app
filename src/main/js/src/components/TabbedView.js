// import { useState } from 'react'
import { Tab } from '@headlessui/react'
import Preview from "./Preview";
import CodeBlockComponent from "./CodeBlockComponent";
import React from 'react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

// const codeSnippetShort = '<button\n\tclassName="bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">\n\tMy Button\n</button>';

export default function TabbedView(props) {

    return (
        <div className="w-1/2 py-2 px-4 bg-white dark:bg-gray-800 rounded-xl">
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
                                            classNames('text-white py-2 px-4 my-2 rounded-lg',
                                                selected
                                                    ? 'bg-green-700 hover:bg-green-700 bg-opacity-100 hover:bg-opacity-100'
                                                    : 'bg-black dark:bg-white bg-opacity-50 hover:bg-opacity-70 dark:bg-opacity-10 dark:hover:bg-opacity-30'
                                            )
                                        }
                                    >
                                        {label}
                                    </Tab>
                                ))}
                            </Tab.List>
                            <button className="border border-green-500 font-bold text-green-500 py-1.5 px-4 my-2.5 rounded-lg">Copy</button>
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

            <div className="flex justify-end">
                <button
                    onClick={() => alert("Someday this might should you more components by this user")}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1 rounded-md">User123</button>
            </div>

        </div>
    )
}
