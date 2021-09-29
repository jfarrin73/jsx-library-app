import React, {useEffect, useState} from 'react';
import './App.css';
import ThemeButton from "./components/ThemeButton";
import CodeBlockComponent from "./components/CodeBlockComponent";
import TabbedView from "./components/TabbedView";
// import Preview from "./components/Preview";
// import JsxParser from "react-jsx-parser";
import JsxRenderer from "./components/JsxRenderer";
import NewEntryModal from "./components/NewEntryModal";
import DataService from "./service/DataService";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import Sidebar from "./components/Sidebar";

// const codeSnippetShort = '<button className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">My Button</button>';
// const codeSnippetShort2 = '<button className="bg-green-700 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">My Button</button>';

// const data =
//     [{
//         "id": 1,
//         "title": "My Icon Button",
//         "description": "This is my icon button",
//         "code": codeSnippetShort
//     },
//     {
//         "id": 2,
//         "title": "My Button",
//         "description": "This is my button",
//         "code": codeSnippetShort2
//     }]

const DISCOVER = "Discover";
const MY_COMPONENTS = "My Components";

const options = [
    { name: "Discover" },
    { name: 'Element' },
    { name: 'Form' },
    { name: 'Commerce' },
    { name: 'Navigation' },
    { name: 'Section' },
    { name: 'List' },
    { name: MY_COMPONENTS }
]

const defaultOptions = [
    { name: "Discover" },
    { name: 'Element' },
    { name: 'Form' },
    { name: 'Commerce' },
    { name: 'Navigation' },
    { name: 'Section' },
    { name: 'List' },
]


// const codeSnippetLong = 'import React, {useState} from \'react\';\n' +
//     'import { FaMoon } from "react-icons/fa";\n' +
//     'import { FaSun } from "react-icons/fa";\n' +
//     '\n' +
//     'export default function ThemeButton(){\n' +
//     '\n' +
//     '    const [isDark, setDarkTheme] = useState(true);\n' +
//     '\n' +
//     '    return (\n' +
//     '        <button className="group bg-gray-700 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md px-2 my-3 mx-4 group flex justify-center items-center w-12" onClick={() => {\n' +
//     '            if (document.documentElement.classList.contains(\'dark\')){\n' +
//     '                document.documentElement.classList.remove(\'dark\')\n' +
//     '                setDarkTheme(false);\n' +
//     '            } else {\n' +
//     '                document.documentElement.classList.add(\'dark\')\n' +
//     '                setDarkTheme(true);\n' +
//     '            }\n' +
//     '        }}>\n' +
//     '            <div className="text-gray-300 group-hover:text-white text-2xl">\n' +
//     '                {(isDark) ? <FaMoon/> : <FaSun/>}\n' +
//     '            </div>\n' +
//     '\n' +
//     '        </button>\n' +
//     '    )\n' +
//     '}';

function App() {

    const [data, setData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    let [selectedView, setSelectedView] = useState("");

    const NO_USER_COMPONENTS_MESSAGE = "You have not created any components";
    const NO_COMPONENTS_MESSAGE = "No components have been added yet";
    const NO_VIEW_COMPONENTS_MESSAGE = "No " + selectedView + " components have been added yet";

    useEffect(() => {
        DataService.getCurrentUserName().then(r =>{
            if (r.status === 200){
                setIsLoggedIn(true);
            }
        });
    },[]);

    useEffect(() => loadData("Discover"),[]);

    async function login(user){
        try{
            const loginResponse = await DataService.login(user);
            setIsLoggedIn(true);
            const token = loginResponse.headers["jwt-token"];
            localStorage.setItem("token", JSON.stringify(token));
            localStorage.setItem("username", JSON.stringify(loginResponse.data.username));
        } catch (e){
            return Promise.reject(e.response.data);
        }
    }

    function logout(){
        DataService.ClearStorage();
        setIsLoggedIn(false);
    }

    async function register(user){
        try{
            console.log("App register: " + user.username);
            const registerResponse = await DataService.register(user);
            let tempPassword = registerResponse.data;
            alert("Your temporary password is: " + tempPassword);
            tempPassword = "";
            // setIsLoggedIn(true);
            // const token = loginResponse.headers["jwt-token"];
            // localStorage.setItem("token", JSON.stringify(token));
        } catch (e){
            return Promise.reject(e.response.data);
        }
    }

    async function addNewEntry(newEntry){
        await DataService.createEntry(newEntry); //.then(r => {
        loadData(selectedView);
    }

    function sidebarSelected(selection){
        console.log("selection: " + selection);
        setSelectedView(selection);
        loadData(selection);
    }

    function loadData(selection){
        console.log("Load Data");
        if (selection === DISCOVER) {
            DataService.retrieveAllEntries("", false).then(response => setData(response.data));
        } else if (selection === MY_COMPONENTS) {
            DataService.retrieveAllEntries("", true).then(response => setData(response.data));
        } else {
            DataService.retrieveAllEntries(selection, false).then(response => setData(response.data));
        }
    }

    function getEmptyMessage(){
        console.log("Get Empty Message");
        if (selectedView === DISCOVER){
            return NO_COMPONENTS_MESSAGE;
        } else if (selectedView === MY_COMPONENTS){
            return NO_USER_COMPONENTS_MESSAGE;
        }
        return NO_VIEW_COMPONENTS_MESSAGE;
    }


    return (
        <div className="flex flex-col h-screen w-screen bg-gray-200 dark:bg-gray-900">
            <header className="w-full bg-white dark:bg-gray-800 flex justify-between items-center shadow-md z-9">
                <h1 className="text-3xl p-4 text-green-700 dark:text-green-300">React JSX Library</h1>
                <div className="flex items-center space-x-2 px-4">
                    {isLoggedIn
                        ? <div className="flex space-x-2">
                            <NewEntryModal addEntry={addNewEntry}/>
                            <button
                                type="button"
                                onClick={logout}
                                className="px-4 py-2 my-3 text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white transition duration-500 ease-in-out rounded-md">
                                Log Out
                            </button>
                        </div>
                        : <div className="flex space-x-2"><RegisterModal register={register}/> <LoginModal login={login}/></div>}
                    <ThemeButton isDarkTheme={true}/>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto space-x-4 flex justify-center items-start pt-4">

                <Sidebar options={isLoggedIn ? options : defaultOptions} onSelectionChange={sidebarSelected}/>

                <div className="w-1/2 flex flex-col space-y-4 items-center">
                    {data.length === 0
                        ? <h2 className="text-2xl dark:text-gray-200 pt-7">No components yet</h2>
                        : data.map((entry) => <TabbedView entry={entry} key={entry.id}/>)}

                    {/*<div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-full">*/}
                    {/*    <div className="flex justify-between items-start">*/}
                    {/*        <h2 className="text-gray-700 dark:text-gray-100 text-2xl mb-4">Component Editor</h2>*/}
                    {/*        <button*/}
                    {/*            className="bg-green-700 hover:bg-green-600 text-white py-2 px-4 rounded-lg">Save*/}
                    {/*        </button>*/}
                    {/*    </div>*/}

                    {/*    <JsxRenderer/>*/}

                    {/*</div>*/}

                    {/*<div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-full">*/}
                    {/*    <div className="flex justify-between items-start mb-4">*/}
                    {/*        <div>*/}
                    {/*            <h2 className="text-gray-700 dark:text-gray-100 text-2xl">Theme Button</h2>*/}
                    {/*            <p className="dark:text-gray-400">This is a complete component of a button to toggle between light and dark theme using Tailwind css</p>*/}
                    {/*        </div>*/}
                    {/*        <button className="border border-green-500 font-bold text-green-500 py-2 px-4 my-2 rounded-lg">Copy</button>*/}
                    {/*    </div>*/}

                    {/*    <div>*/}
                    {/*        <CodeBlockComponent codeString={codeSnippetLong}/>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>


                {/*SPACER TO KEEP EVERYTHING ELSE CENTERED*/}
                {/*<div className="opacity-0 w-64"/>*/}

            </div>
        </div>
    );
}

export default App;
