import {Fragment, useEffect, useState} from 'react'
import {Listbox, Transition} from '@headlessui/react'
import {HiCheck, HiSelector} from "react-icons/hi";

const categories = [
    {name: 'Element'},
    {name: 'Form'},
    {name: 'Commerce'},
    {name: 'Navigation'},
    {name: 'Section'},
    {name: 'List'},
]

export default function CategoryPicker({initialValue, onSelectionChanged}) {
    const [selected, setSelected] = useState(categories[0])

    useEffect(() => setSelected(initialValue),[initialValue])

    function selectionChanged(newValue){
        setSelected(newValue);
        onSelectionChanged(newValue.name);
    }

    return (
        <div className="w-72">
            <Listbox value={selected} onChange={selectionChanged}>
                <div className="relative">
                    <Listbox.Button
                        className="relative w-full py-2 pl-3 pr-10 text-left bg-white dark:bg-gray-900 text-green-700 dark:text-green-300 rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                        <span className="block truncate text-lg">{selected.name}</span>
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
                            className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white dark:bg-gray-700 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {categories.map((person, personIdx) => (
                                <Listbox.Option
                                    key={personIdx}
                                    className={({active}) =>
                                        `${active ? 'text-green-700 dark:text-green-300 bg-amber-100' : 'text-gray-900 dark:text-gray-200'}
                                        cursor-default select-none relative py-2 pl-10 pr-4`
                                    }
                                    value={person}>
                                    {({selected, active}) => (
                                        <div>
                                            <span
                                                className={`${
                                                    selected ? 'font-medium' : 'font-normal'
                                                    } block truncate`}>
                                                {person.name}
                                            </span>
                                            {selected ? (
                                                <span
                                                    className="text-green-300 absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <HiCheck/>
                                                </span>
                                            ) : null}
                                        </div>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    )
}
