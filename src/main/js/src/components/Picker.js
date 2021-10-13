import {Fragment, useEffect, useState} from 'react'
import {Listbox, Transition} from '@headlessui/react'
import {HiSelector,HiOutlineSearch} from "react-icons/hi";

export default function Picker({options,initialValue, onSelectionChanged}) {
    const [selected, setSelected] = useState(options[0])

    useEffect(() => setSelected(initialValue),[initialValue])

    function selectionChanged(newValue){
        setSelected(newValue);
        onSelectionChanged(newValue.name);
    }

    return (
        <div className="w-full">
            <Listbox value={selected} onChange={selectionChanged}>
                <div className="relative">
                    <Listbox.Button
                        className="relative w-full py-2 pl-3 pr-10 text-left bg-white dark:bg-gray-900 text-green-700 dark:text-green-300 flex items-center rounded-lg shadow-md cursor-pointer ring-1 ring-gray-200 dark:ring-gray-700 sm:text-sm">
                        <span
                            className="text-green-300 text-lg">
                            {selected.icon}
                        </span>
                        <span className="block truncate text-lg pl-3">{selected.name}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <HiSelector
                              className="w-5 h-5 text-gray-400"
                              aria-hidden="true" />
                        </span>
                </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <Listbox.Options
                            className="absolute w-full z-50 mt-1 overflow-auto text-base bg-white dark:bg-gray-900 rounded-md shadow-lg max-h-60 ring-1 ring-gray-200 dark:ring-gray-700 sm:text-sm">
                            {options.map((option, personIdx) => (
                                <Listbox.Option
                                    key={personIdx}
                                    className={({active, selected}) =>
                                        `${selected ? 'text-green-700 dark:text-green-300 bg-amber-100' : 'text-gray-900 dark:text-gray-200'}
                                        ${active && 'bg-black bg-opacity-10 dark:bg-opacity-20'}
                                        cursor-pointer select-none relative py-2 pl-10 pr-4`
                                    }
                                    value={option}>

                                    <div>
                                        <span
                                            className="block truncate text-lg">
                                            {option.name}
                                        </span>
                                        <span
                                            className="text-green-300 absolute inset-y-0 left-0 flex items-center pl-3">
                                            {option.icon}
                                        </span>
                                    </div>

                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    )
}
