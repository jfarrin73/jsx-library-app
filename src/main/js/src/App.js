import React, {useEffect, useState} from 'react';
import './App.css';
import ThemeButton from "./components/ThemeButton";
import TabbedView from "./components/TabbedView";
import DataService from "./service/DataService";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import Sidebar from "./components/Sidebar";
import EditEntry from "./components/EditEntry";
import NewEntry from "./components/NewEntry";
import { HiOutlineSearch,HiX } from "react-icons/hi";
import { GiPiranha } from "react-icons/gi";
import Fuse from 'fuse.js'

const ALL = "All";
const MY_COMPONENTS = "My Components";

const defaultOptions = [
    { name: "All" },
    { name: 'Element' },
    { name: 'Form' },
    { name: 'Commerce' },
    { name: 'Navigation' },
    { name: 'Section' },
    { name: 'List' },
]

const EMPTY_ENTRY = {
    "title": "",
    "description":"",
    "code":"",
    "id":"",
    "createdBy":"",
    "created":"",
    "category":""
}

const searchOptions = {
    isCaseSensitive: false,
    includeScore: false,
    shouldSort: true,
    includeMatches: false,
    findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    // threshold: 0.6,
    // distance: 100,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    keys: [
        "title",
        "category"
    ]
};

function App() {

    const [data, setData] = useState([]);
    const [dataCache, setDataCache] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    let [selectedView, setSelectedView] = useState("");
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [isEditEntryModalOpen, setIsEditEntryModalOpen] = useState(false);
    const [activeEntry, setActiveEntry] = useState(EMPTY_ENTRY)
    const [options, setOptions] = useState(defaultOptions);
    const [searchText, setSearchText] = useState("");

    const [isUserData, setIsUserData] = useState(false);

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

    useEffect(() => loadData(),[]);

    let fuse = new Fuse(data,searchOptions);

    async function login(user){
        try{
            const loginResponse = await DataService.login(user);
            console.log("User Login")
            setIsLoggedIn(true);
            const token = loginResponse.headers["jwt-token"];
            localStorage.setItem("token", JSON.stringify(token));
        } catch (e){
            return Promise.reject(e.response.data);
        }
    }

    function logout(){
        DataService.ClearStorage();
        setIsLoggedIn(false);
        options.pop();
        setOptions(options);
    }

    async function register(user){
        try{
            console.log("App register: " + user.username);
            await DataService.register(user);
        } catch (e){
            // TODO: need to reject promise?
            // await Promise.reject(e.response.data);
            return e.response.data.message;
        }
    }

    async function addNewEntry(newEntry){
        console.log("New Entry Added");
        await DataService.createEntry(newEntry);
        loadData(selectedView);
    }

    function editEntry(entry){
        console.log("entry title to edit: " + entry.title);
        setActiveEntry(entry);
        setIsEditEntryModalOpen(true);
    }

    async function updateEntry(entry){
        await DataService.updateEntry(entry);
        setActiveEntry(EMPTY_ENTRY);
    }

    async function deleteEntry(entryId){
        setData(data.filter(x => x.id !== entryId));
        await DataService.deleteEntry(entryId);
    }

    function sidebarSelected(selection){
        console.log("selection: " + selection);
        setSelectedView(selection);
        setData(selection === ALL ? dataCache : dataCache.filter(x => x.category === selection));
    }

    function loadData(isUserData) {
        isUserData = isUserData || false;
        console.log("Load Data");
        DataService.retrieveAllEntries("", isUserData).then(response => {
            setData(response.data);
            setDataCache((response.data));
        });
    }

    function menuSelected(isMyComponents){
        console.log("Menu Selected. isMyComponents: " + isMyComponents);
        console.log("selectedView: " + selectedView);
        setIsUserData(!isUserData);
        loadData(isMyComponents);
        // TODO: this isn't working. It's supposed to filter the items based on the currently selected view
        sidebarSelected(selectedView);
    }

    function searchTextChange(event){
        event.preventDefault();
        setSearchText(event.target.value)

        console.log(fuse.search(event.target.value));

        if (event.target.value === ""){
            loadData(selectedView);
        }else{
            setData(fuse.search(event.target.value).map(a => a.item));
        }
    }

    function getEmptyMessage(){
        console.log("Get Empty Message");
        if (selectedView === ALL){
            return NO_COMPONENTS_MESSAGE;
        } else if (selectedView === MY_COMPONENTS){
            return NO_USER_COMPONENTS_MESSAGE;
        }
        return NO_VIEW_COMPONENTS_MESSAGE;
    }

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-200 dark:bg-gray-900">
            <header className="w-full bg-white dark:bg-gray-800 flex justify-between items-center shadow-md z-50">
                <div className="flex space-x-4 pl-4">
                    <GiPiranha className="text-green-700 dark:text-green-300 text-4xl my-4"/>
                    {isLoggedIn
                        ? <div className="flex px-4 space-x-2">
                              <button
                                  onClick={_ => menuSelected(false)}
                                  className={`${isUserData ? "text-green-700 dark:text-green-300" : "text-gray-700 dark:text-gray-300"} text-2xl font-semibold py-2 px-2 transition ease-in-out duration-500`}>Discover</button>
                              <button
                                  onClick={_ => menuSelected(true)}
                                  className={`${isUserData ? "text-gray-700 dark:text-gray-300" : "text-green-700 dark:text-green-300" } text-2xl font-semibold py-2 px-2 transition ease-in-out duration-500`}>My Components</button>
                          </div>
                        : <h1 className="text-3xl py-4 text-green-700 dark:text-green-300">JSX Library</h1>}

                </div>

                <div className="flex bg-gray-200 dark:bg-gray-900 items-center rounded-full w-96 my-3">
                    <HiOutlineSearch className="text-gray-400 text-xl ml-3 w-6"/>
                    <input
                        type="text" placeholder="Search..." value={searchText}
                        onChange={searchTextChange}
                        className="px-4 py-2 text-xl text-black dark:text-white w-full bg-transparent outline-none"/>

                    <div className="w-10">
                        {searchText !== "" && <button
                                                  onClick={() => setSearchText("")}
                                                  className={"hover:bg-gray-800 text-gray-400 text-xl p-2 mr-1 rounded-full"}>
                                                  <HiX />
                                              </button>}
                    </div>

                </div>

                <div className="flex items-center space-x-2 px-4">
                    {isLoggedIn
                        ? <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={() => setIsEntryModalOpen(true)}
                                className="px-4 py-2 my-3 rounded-lg bg-green-700 hover:bg-green-600 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md transition duration-500 ease-in-out">
                                Add
                            </button>
                            <button
                                type="button"
                                onClick={logout}
                                className="px-4 py-2 my-3 text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white transition duration-500 ease-in-out rounded-md shadow-md">
                                Log Out
                            </button>
                        </div>
                        : <div className="flex space-x-2"><RegisterModal handleRegister={register}/> <LoginModal handleLogin={login}/></div>}
                    <ThemeButton isDarkTheme={true}/>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto space-x-4 flex justify-center items-start pt-4">

                <Sidebar options={options} onSelectionChange={sidebarSelected}/>

                <div className="w-1/2 flex flex-col space-y-4 items-center">
                    {data.length === 0
                        ? <h2 className="text-2xl dark:text-gray-200 pt-7">{getEmptyMessage()}</h2>
                        : data.map((entry) => <TabbedView entry={entry} allowEdit={selectedView === MY_COMPONENTS} editEntry={editEntry} key={entry.id} deleteEntry={deleteEntry}/>)}
                </div>

                {/*SPACER TO KEEP EVERYTHING ELSE CENTERED*/}
                {/*<div className="opacity-0 w-64"/>*/}

            </div>

            <NewEntry isOpen={isEntryModalOpen} setIsOpen={setIsEntryModalOpen} addEntry={addNewEntry}/>
            <EditEntry isOpen={isEditEntryModalOpen} setIsOpen={setIsEditEntryModalOpen} entryToEdit={activeEntry} updateEntry={updateEntry}/>
        </div>
    );
}

export default App;
