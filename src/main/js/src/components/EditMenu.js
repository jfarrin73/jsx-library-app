import { Menu, Transition } from '@headlessui/react'
import { Fragment} from 'react'
import { HiDotsVertical } from 'react-icons/hi'
import DataService from "../service/DataService";

export default function EditMenu({entryId,onEdit,onDelete}) {

    return (
        <div>
            <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="inline-flex justify-center p-3 text-sm font-medium text-green-700 dark:text-green-300 hover:bg-black rounded-full hover:bg-opacity-10">
                    <HiDotsVertical
                        className="w-5 h-5 text-violet-200 hover:text-violet-100"
                        aria-hidden="true"/>
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="absolute right-0 z-50 w-56 mt-2 origin-top-right bg-white dark:bg-gray-700 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1 ">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={onEdit}
                                        className={`${
                                            active ? 'bg-violet-500 text-black dark:text-white' : 'text-gray-900 dark:text-gray-300'
                                        } group flex rounded-md items-center w-full p-2 text-sm`}>
                                        {active ? (
                                            <EditActiveIcon
                                                className="w-5 h-5 mr-2"
                                                aria-hidden="true"/>
                                        ) : (
                                            <EditInactiveIcon
                                                className="w-5 h-5 mr-2"
                                                aria-hidden="true"/>
                                        )}
                                        Edit
                                    </button>
                                )}
                            </Menu.Item>
                            {/*<Menu.Item>*/}
                            {/*    {({ active }) => (*/}
                            {/*        <button*/}
                            {/*            className={`${*/}
                            {/*                active ? 'bg-violet-500 text-black dark:text-white' : 'text-gray-900 dark:text-gray-300'*/}
                            {/*            } group flex rounded-md items-center w-full p-2 text-sm`}*/}
                            {/*        >*/}
                            {/*            {active ? (*/}
                            {/*                <DuplicateActiveIcon*/}
                            {/*                    className="w-5 h-5 mr-2"*/}
                            {/*                    aria-hidden="true"*/}
                            {/*                />*/}
                            {/*            ) : (*/}
                            {/*                <DuplicateInactiveIcon*/}
                            {/*                    className="w-5 h-5 mr-2"*/}
                            {/*                    aria-hidden="true"*/}
                            {/*                />*/}
                            {/*            )}*/}
                            {/*            Duplicate*/}
                            {/*        </button>*/}
                            {/*    )}*/}
                            {/*</Menu.Item>*/}
                        </div>

                        <div className="px-1 py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={(e) => onDelete(entryId)}
                                        className={`${
                                            active ? 'bg-violet-500 text-black dark:text-white' : 'text-gray-900 dark:text-gray-300'
                                        } group flex rounded-md items-center w-full p-2 text-sm`}
                                    >
                                        {active ? (
                                            <DeleteActiveIcon
                                                className="w-5 h-5 mr-2 text-violet-400"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <DeleteInactiveIcon
                                                className="w-5 h-5 mr-2 text-violet-400"
                                                aria-hidden="true"
                                            />
                                        )}
                                        Delete
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}

function EditInactiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 13V16H7L16 7L13 4L4 13Z"
                fill="#6EE7B7"
                stroke="#047857"
                strokeWidth="2"
            />
        </svg>
    )
}

function EditActiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 13V16H7L16 7L13 4L4 13Z"
                fill="#047857"
                stroke="#6EE7B7"
                strokeWidth="2"
            />
        </svg>
    )
}

function DuplicateInactiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 4H12V12H4V4Z"
                fill="#EDE9FE"
                stroke="#A78BFA"
                strokeWidth="2"
            />
            <path
                d="M8 8H16V16H8V8Z"
                fill="#EDE9FE"
                stroke="#A78BFA"
                strokeWidth="2"
            />
        </svg>
    )
}

function DuplicateActiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 4H12V12H4V4Z"
                fill="#8B5CF6"
                stroke="#C4B5FD"
                strokeWidth="2"
            />
            <path
                d="M8 8H16V16H8V8Z"
                fill="#8B5CF6"
                stroke="#C4B5FD"
                strokeWidth="2"
            />
        </svg>
    )
}

function DeleteInactiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="5"
                y="6"
                width="10"
                height="10"
                fill="#6EE7B7"
                stroke="#047857"
                strokeWidth="2"
            />
            <path d="M3 6H17" stroke="#047857" strokeWidth="2" />
            <path d="M8 6V4H12V6" stroke="#047857" strokeWidth="2" />
        </svg>
    )
}

function DeleteActiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="5"
                y="6"
                width="10"
                height="10"
                fill="#047857"
                stroke="#6EE7B7"
                strokeWidth="2"
            />
            <path d="M3 6H17" stroke="#6EE7B7" strokeWidth="2" />
            <path d="M8 6V4H12V6" stroke="#6EE7B7" strokeWidth="2" />
        </svg>
    )
}
