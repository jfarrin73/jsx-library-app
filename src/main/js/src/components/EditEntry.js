import React from "react";
import EntryModal from "./EntryModal";

export default function EditEntry({isOpen,setIsOpen,updateEntry,entryToEdit}) {

    return (
        <EntryModal isOpen={isOpen} setIsOpen={setIsOpen} entry={entryToEdit} saveHandler={updateEntry}/>
    )
}
