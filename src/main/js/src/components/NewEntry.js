import React from "react";
import EntryModal from "./EntryModal";

export default function NewEntry({isOpen,setIsOpen,addEntry}) {

    let entry = {
        "title": "",
        "description": "",
        "code": "",
        "category": "Element",
        "createdBy": "",
        "id": ""
    }

    return (
        <EntryModal isOpen={isOpen} setIsOpen={setIsOpen} entry={entry} saveHandler={addEntry}/>
    )
}
