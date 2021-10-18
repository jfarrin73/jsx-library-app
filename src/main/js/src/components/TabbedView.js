import { Tab } from '@headlessui/react'
import Preview from "./Preview";
import CodeBlockComponent from "./CodeBlockComponent";
import React, {useEffect, useRef, useState} from 'react';
import EditMenu from "./EditMenu";
import toast, { Toaster } from 'react-hot-toast';
import {HiHeart, HiThumbUp, HiThumbDown, HiOutlineHeart} from "react-icons/hi";
import DataService from "../service/DataService";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function TabbedView({isLoggedIn,setIsLoginModalOpen,userData,setUserData,entry,allowEdit,editEntry,deleteEntry}) {

    const [isFavorite, setIsFavorite] = useState(false);

    const [likeData, setLikeData] = useState({})

    useEffect(() => {
        setIsFavorite(userData.favorites && userData.favorites.some( x => x.id === entry.id));
    }, [userData.favorites])

    useEffect(() => {
        console.log("user data change");
        setLikeData({
            "like": userData.likes && userData.likes.some(x => x === entry.id),
            "dislike": userData.dislikes && userData.dislikes.some(x => x === entry.id),
            "totalLikes": entry.totalLikes,
            "totalDislikes": entry.totalDislikes})
    },[isLoggedIn,userData]);

    function editHandler(event){
        event.preventDefault();
        editEntry(entry);
    }

    async function like(){
        if (isLoggedIn){
            const result = await DataService.likeEntry(entry);
            setLikeData(result.data);
        } else {
            setIsLoginModalOpen(true);
        }
    }

    async function dislike(){
        if (isLoggedIn){
            const result = await DataService.dislikeEntry(entry);
            setLikeData(result.data);
        } else {
            setIsLoginModalOpen(true);
        }
    }

    async function favoriteEntry(_){
        try {
            const response = await DataService.favoriteEntry(entry);
            toast.success(`${entry.title} ${response.data ? "saved to" : "removed from"} favorites`,
                {
                    style: {
                        border: 'solid 1px #6EE7B750',
                        borderRadius: '10px',
                        background: '#111827',
                        color: '#6EE7B7',
                        boxShadow: "none",
                    },
                });
            setIsFavorite(response.data);

            const newData = userData;
            if (response.data){
                newData.favorites.push(entry);
            } else {
                newData.favorites.splice(newData.favorites.indexOf(entry),1);
            }
            setUserData(newData);

        } catch (e) {
            console.log("Error saving entry to favorites");
        }

    }

    return (
        <div className="w-full py-2 px-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <Tab.Group>
                <div>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl text-gray-700 dark:text-gray-100">{entry.title}</h2>

                        <div className="flex items-start space-x-1">
                            <Tab.List className="flex justify-end space-x-1">
                                {["Preview", "Code"].map((label) => (
                                    <Tab
                                        key={label}
                                        className={({ selected }) =>
                                            classNames('text-white py-2 px-4 my-2 rounded-lg transition ease-in-out duration-500',
                                                selected
                                                    ? 'bg-green-700 hover:bg-green-600 bg-opacity-100 hover:bg-opacity-100'
                                                    : 'bg-black dark:bg-white bg-opacity-50 hover:bg-opacity-70 dark:bg-opacity-10 dark:hover:bg-opacity-30'
                                            )
                                        }>
                                        {label}
                                    </Tab>
                                ))}
                            </Tab.List>
                            {allowEdit && <div className="my-2"><EditMenu entryId={entry.id} onEdit={editHandler} onDelete={deleteEntry}/></div>}
                        </div>

                    </div>
                    <p className="dark:text-gray-400">{entry.description}</p>
                </div>
                <Tab.Panels>
                    <Tab.Panel className='focus:outline-none'>
                        <div className="flex p-4 justify-center">
                            <Preview view={entry.code}/>
                        </div>
                    </Tab.Panel>
                    <Tab.Panel className='focus:outline-none'>
                        <div className="p-4 container mx-auto">
                            <CodeBlockComponent codeString={entry.code}/>
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>

            <div className="flex justify-between">
                <div className="flex text-lg">
                    {isLoggedIn && <button
                        onClick={favoriteEntry}
                        className="hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 p-2 rounded-full text-green-700 dark:text-green-300">
                        {isFavorite ? <HiHeart className="text-green-700 dark:text-green-300"/> : <HiOutlineHeart className="text-gray-500"/>}</button>}
                    <button
                        onClick={_ => like()}
                        className="flex items-center space-x-2 hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 px-2 rounded-full"><p className="text-gray-500">{likeData.totalLikes}</p><HiThumbUp className={`${likeData.like ? "text-green-700 dark:text-green-300" : "text-gray-500 dark:text-gray-500"}`}/></button>
                    <button
                        onClick={_ => dislike()}
                        className="flex items-center space-x-2 hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 px-2 rounded-full"><p className="text-gray-500">{likeData.totalDislikes}</p><HiThumbDown className={`${likeData.dislike ? "text-green-700 dark:text-green-300" : "text-gray-500 dark:text-gray-500"}`}/></button>
                </div>
                <div className="flex space-x-1">
                    <button
                        className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 pb-0.5 rounded-md">{entry.category}</button>
                    <button
                        onClick={() => toast("Coming soon")}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 pb-0.5 rounded-md">{entry.createdBy}</button>
                </div>
            </div>
            <Toaster />
        </div>
    )
}
