import React, {useState} from "react";
import JsxParser from "react-jsx-parser";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-terminal";

export default function JsxRenderer ({onChange}) {

    const [val, setVal] = useState('<div>\n\t\n</div>');

    let handleChange = (event)=>{
        console.log(event);
        setVal(event);
        // event.preventDefault();
        onChange(event);
    }

    return(
        <div className="flex w-full justify-around lg:flex-row md:flex-col">
            <div>
                <AceEditor
                    placeholder="Enter some JSX"
                    mode="html"
                    theme="terminal"
                    onChange={handleChange}
                    fontSize={16}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={val}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: false,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 2,
                    }}/>
            </div>

            {/*<textarea*/}
            {/*    value={code}*/}
            {/*    rows="10"*/}
            {/*    spellCheck={false}*/}
            {/*    placeholder="Enter some JSX..."*/}
            {/*    onChange={handleChange}*/}
            {/*    className="bg-black text-white p-4 w-1/2 md:w-full sm:w-full outline-none rounded-lg shadow-md"/>*/}
            <div className="w-1/2 md:w-full sm:w-full pl-4 flex justify-center">
                <JsxParser jsx={val} className="w-full" />
            </div>
        </div>

    );
}