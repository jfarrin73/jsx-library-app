import React, {useState} from 'react';
import { FaMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa";

export default function ThemeButton(){

    const [isDark, setDarkTheme] = useState(true);

    return (
        <button className="group bg-gray-300 dark:bg-gray-700 rounded-md p-2 group flex justify-center items-center" onClick={() => {
            if (document.documentElement.classList.contains('dark')){
                document.documentElement.classList.remove('dark')
                setDarkTheme(false);
            } else {
                document.documentElement.classList.add('dark')
                setDarkTheme(true);
            }
        }}>
            <div className="dark:text-gray-300 text-gray-700 dark:group-hover:text-white group-hover:text-gray-900 text-xl">
                {(isDark) ? <FaMoon/> : <FaSun/>}
            </div>

        </button>
    )
}