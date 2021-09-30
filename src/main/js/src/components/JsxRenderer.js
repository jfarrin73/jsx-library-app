import React from "react";
import JsxParser from "react-jsx-parser";

export default function JsxRenderer ({onChange,code}) {

    let handleChange = (event)=>{
        event.preventDefault();
        onChange(event);
    }

    return(
        <div className="flex w-full justify-around">
            <textarea
                value={code}
                rows="10"
                spellCheck={false}
                placeholder="Enter some JSX..."
                onChange={handleChange}
                className="bg-black text-white p-4 w-1/2 outline-none rounded-lg shadow-md"/>
            <div className="w-1/2 pl-4 flex justify-center">
                <JsxParser jsx={code} className="w-full" />
            </div>
        </div>

    );
}