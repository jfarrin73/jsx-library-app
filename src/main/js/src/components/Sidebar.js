import {useEffect, useState} from 'react'
import {RadioGroup} from '@headlessui/react'
import {HiChevronDoubleRight} from 'react-icons/hi'

export default function Sidebar({options, onSelectionChange}) {
    const [selected, setSelected] = useState(options[0]);

    // THIS IS A HACKY FIX TO AN ISSUE CAUSED BY OPTIONS CHANGING WHEN ISLOGGED IN CHANGES
    useEffect(() => setSelected(selected));

    function onSelection(newSelection){
        setSelected(newSelection);
        onSelectionChange(newSelection.name);
        console.log("On Selection: " + newSelection.name);
    }

    return (
        <div className="w-64">
            <div className="w-full max-w-md mx-auto cursor-pointer">
                <RadioGroup value={selected} onChange={onSelection}>
                    <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
                    <div className="divide-y divide-gray-200 dark:divide-gray-900 divide-solid">
                        {options.map(option => (
                            <RadioGroup.Option
                                key={option.name}
                                value={option}
                                className="relative  rounded-lg shadow-md bg-white dark:bg-gray-800 cursor-pointer flex focus:outline-none">
                                {({ active, checked }) => (
                                    <div className={`flex items-center justify-between w-full px-5 py-4 rounded-lg ${checked ? 'bg-gray-700' : 'bg-gray-800'}`}>
                                        <div className="text-lg flex-grow">
                                            <RadioGroup.Label
                                                as="p"
                                                className={`font-medium ${
                                                    checked ? 'text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-300'
                                                }`}>
                                                {option.name}
                                            </RadioGroup.Label>
                                        </div>
                                        {checked && (
                                            <div className="text-gray-700 dark:text-gray-300">
                                                <HiChevronDoubleRight className="w-6 h-6" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </RadioGroup.Option>
                        ))}
                    </div>
                </RadioGroup>
            </div>
        </div>
    )
}
