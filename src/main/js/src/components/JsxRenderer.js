import React from "react";
import JsxParser from "react-jsx-parser";

export default function JsxRenderer ({onChange,code}) {

    let handleChange = (event)=>{
        event.preventDefault();
        onChange(event);
    }

    return(
        <div className="flex w-full justify-around lg:flex-row md:flex-col">
            <textarea
                value={code}
                rows="10"
                spellCheck={false}
                placeholder="Enter some JSX..."
                onChange={handleChange}
                className="bg-black text-white p-4 w-1/2 md:w-full sm:w-full outline-none rounded-lg shadow-md"/>
            <div className="w-1/2 md:w-full sm:w-full pl-4 flex justify-center">
                <JsxParser jsx={code} className="w-full" />
            </div>
        </div>

    );
}