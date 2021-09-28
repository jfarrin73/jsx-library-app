import React, {useState} from "react";
import JsxParser from "react-jsx-parser";

export default function JsxRenderer (props) {

    const [code, setCode] = useState(`<div className="dark:text-white">No code yet</div>`)

    let handleChange = (event)=>{
        props.onChange(event);
        setCode(event.target.value.toString())
        //update the state
    }

    return(
        <div className="flex w-full justify-around">
            <textarea
                rows="10"
                spellCheck={false}
                placeholder="Enter some JSX..." onChange={handleChange}
                className="bg-black text-white p-4 w-1/2 outline-none rounded-lg"/>
            <div className="w-1/2 pl-4 flex justify-center">
                <JsxParser jsx={code} className="w-full" />
            </div>
        </div>

    );
}