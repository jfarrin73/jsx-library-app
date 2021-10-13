import {useState} from 'react'
import {RadioGroup} from '@headlessui/react'
import {HiChevronDoubleRight} from 'react-icons/hi'

export default function Sidebar({options, onSelectionChange}) {
    const [selected, setSelected] = useState(options[0]);

    // THIS IS A HACKY FIX TO AN ISSUE CAUSED BY OPTIONS CHANGING WHEN ISLOGGED IN CHANGES
    // useEffect(() => setSelected(selected),[]);

    function onSelection(newSelection){
        setSelected(newSelection);
        onSelectionChange(newSelection.name);
        console.log("On Selection: " + newSelection.name);
    }

    return (
        <div className="w-full">
            <h3 className="text-xl dark:text-gray-300 font-bold px-4 py-2">Filter</h3>
            <div className="cursor-pointer">
                <RadioGroup value={selected} onChange={onSelection}>
                    <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
                    <div className=" divide-gray-200 dark:divide-gray-800 border-t-2 border-gray-700">
                        {options.map(option => (
                            <RadioGroup.Option
                                key={option.name}
                                value={option}
                                className="cursor-pointer flex focus:outline-none group">
                                {({ active, checked }) => (
                                    <div className={`flex items-center justify-between rounded-lg w-full px-5 py-2 ${checked ? 'bg-white dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
                                        <div className="text-lg flex-grow">
                                            <RadioGroup.Label
                                                as="p"
                                                className={`font-medium ${
                                                    checked ? 'text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-300'
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
