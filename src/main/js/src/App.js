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
import {HiOutlineSearch, HiX, HiLibrary, HiHeart} from "react-icons/hi";
import { GiPiranha } from "react-icons/gi";
import Fuse from 'fuse.js'
import Picker from "./components/Picker";
// import toast from "react-hot-toast";

const ALL = "All";
const MY_COMPONENTS = "My Components";

const options = [
    { name: "All" },
    { name: 'Element' },
    { name: 'Form' },
    { name: 'Commerce' },
    { name: 'Navigation' },
    { name: 'Section' },
    { name: 'List' },
];

const menu = [
    {name: "Discover", icon: <GiPiranha/>},
    {name: "My Components", icon: <HiLibrary/>},
    {name: "Favorites", icon: <HiHeart/>},
]

const EMPTY_ENTRY = {
    "title": "",
    "description":"",
    "code":"",
    "id":"",
    "createdBy":"",
    "created":"",
    "category":"",
    "totalLikes": 0,
    "totalDislikes": 0,
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
        "category",
        "code"
    ]
};

function App() {

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    let [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const [data, setData] = useState([]);
    const [dataCache, setDataCache] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedView, setSelectedView] = useState(options[0].name);
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [isEditEntryModalOpen, setIsEditEntryModalOpen] = useState(false);
    const [activeEntry, setActiveEntry] = useState(EMPTY_ENTRY)
    const [searchText, setSearchText] = useState("");
    const [userData, setUserData] = useState({username:"", likes:[], dislikes: [], favorites:[]});
    const [isUserData, setIsUserData] = useState(false);
    const [isFavoritesSelected, setIsFavoritesSelected] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const NO_USER_COMPONENTS_MESSAGE = "You have not created any components";
    const NO_COMPONENTS_MESSAGE = "No components have been added yet";
    const NO_VIEW_COMPONENTS_MESSAGE = "No " + selectedView + " components have been added yet";

    useEffect(() => {
        DataService.getCurrentUserData().then(r =>{
            if (r.status === 200){
                setIsLoggedIn(true);
                setUserData(r.data);
            }
        });
    },[]);

    useEffect(() => {
        loadData()
    },[page,isUserData,isFavoritesSelected]);

    useEffect(() => {
        applyCategoryFilter(selectedView);
    }, [selectedView, dataCache, isFavoritesSelected])

    const handleScroll = (e) => {
        if (e.target.clientHeight + e.target.scrollTop === e.target.scrollHeight && page < totalPages - 1) {
            setPage(page + 1);
        }
    };

    let fuse = new Fuse(data,searchOptions);

    async function login(user){
        try{
            const loginResponse = await DataService.login(user);
            if(loginResponse.status === 200){
                setIsLoggedIn(true);
                setUserData(loginResponse.data);
                const token = loginResponse.headers["jwt-token"];
                localStorage.setItem("token", JSON.stringify(token));
            }
        } catch (e){
            return Promise.reject(e.response.data);
        }
    }

    function logout(){
        DataService.ClearStorage();
        setIsLoggedIn(false);
        setUserData({username:"", likes: [], dislikes: [], favorites: []});
    }

    async function register(user){
        try{
            await DataService.register(user);
        } catch (e){
            await Promise.reject(e.response.data);
        }
    }

    async function addNewEntry(newEntry){
        console.log("New Entry Added");
        await DataService.createEntry(newEntry);
        loadData();
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

    function applyCategoryFilter(selection){
        console.log("applyCategoryFilter. selection parameter: " + selection);
        setSearchText("");
        setSelectedView(selection);
        setData(selection === ALL ? dataCache : dataCache.filter(x => x.category === selection));
    }

    function menuSelected(selected){
        console.log("Menu Selected. selected: " + selected);
        setPage(0);
        setIsUserData(selected === menu[1].name);
        setIsFavoritesSelected(selected === menu[2].name)
    }

    function loadData() {
        console.log(`load data. page: ${page} isUserData: ${isUserData} isFavorites: ${isFavoritesSelected}`);

        DataService.retrieveAllEntries(page,isUserData, isFavoritesSelected).then(response => {
            console.log(response.data);
            if (isFavoritesSelected){
                setTotalPages(0);
                console.log("favorites: " + response.data);
                setDataCache(response.data);
            } else {
                setTotalPages(response.data.totalPages);
                setDataCache(page !== 0 ? dataCache.concat(response.data.entries) : response.data.entries);
            }
        });

    }

    function searchTextChange(event){
        event.preventDefault();
        setSearchText(event.target.value)

        console.log(fuse.search(event.target.value));

        if (event.target.value === ""){
            setData(dataCache);
        }else{
            setData(fuse.search(event.target.value).map(a => a.item));
        }
    }

    function getEmptyMessage(){
        if (selectedView === ALL){
            return NO_COMPONENTS_MESSAGE;
        } else if (selectedView === MY_COMPONENTS){
            return NO_USER_COMPONENTS_MESSAGE;
        }
        return NO_VIEW_COMPONENTS_MESSAGE;
    }

    return (
        <div className="flex flex-col w-screen h-screen bg-gray-200 dark:bg-gray-900">
            <header className="w-full bg-white dark:bg-gray-800 flex justify-between items-center shadow-md z-50">
                <div className="flex space-x-4 pl-4">
                    <GiPiranha className="text-green-700 dark:text-green-300 text-4xl my-4"/>
                    <h1 className="hidden lg:block xl:block text-3xl py-4 text-green-700 dark:text-green-300">JSX Library</h1>
                </div>

                {/*SEARCHBAR*/}
                <div className="flex bg-gray-200 dark:bg-gray-900 items-center rounded-full w-full max-w-md my-3 mx-2">
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

                {/*REGISTER LOGIN ADD LOGOUT*/}
                <div className="flex items-center space-x-2 pr-4">
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
                        : <div className="flex space-x-2"><RegisterModal handleRegister={register} isOpen={isRegisterModalOpen} setIsOpen={setIsRegisterModalOpen}/> <LoginModal handleLogin={login} isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} setIsRegisterModalOpen={setIsRegisterModalOpen} /></div>}
                    <ThemeButton isDarkTheme={true}/>
                </div>
            </header>

            <div onScroll={handleScroll} className="flex-1 overflow-y-auto space-x-4 flex pt-4 px-4">

                {/*SIDEBAR*/}
                <div className="top-0 sticky w-full max-w-xs">
                    {isLoggedIn &&
                    <div className="pb-4">
                        <Picker options={menu} initialValue={menu[0]} onSelectionChanged={menuSelected}/>
                    </div>}
                    <Sidebar options={options} onSelectionChange={applyCategoryFilter}/>
                </div>

                {/*MAIN*/}
                <div className="flex flex-col space-y-4 items-center w-3/4 lg:w-5/6">
                    {data.length === 0
                        ? <h2 className="text-2xl dark:text-gray-200 pt-7">{getEmptyMessage()}</h2>
                        : data.map((entry) => <TabbedView isLoggedIn={isLoggedIn} setIsLoginModalOpen={setIsLoginModalOpen} userData={userData} setUserData={setUserData} entry={entry} allowEdit={isUserData} editEntry={editEntry} key={entry.id} deleteEntry={deleteEntry}/>)}
                </div>

                {/*SPACER TO KEEP EVERYTHING ELSE CENTERED*/}
                {/*<div className="opacity-0 w-64"/>*/}

            </div>

            {/*MODALS*/}
            <NewEntry isOpen={isEntryModalOpen} setIsOpen={setIsEntryModalOpen} addEntry={addNewEntry}/>
            <EditEntry isOpen={isEditEntryModalOpen} setIsOpen={setIsEditEntryModalOpen} entryToEdit={activeEntry} updateEntry={updateEntry}/>
        </div>
    );
}

export default App;
