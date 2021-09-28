import React from "react";
import JsxParser from "react-jsx-parser";

export default function Preview(props){
    return (
        <div className="pl-4 flex justify-center">
            <JsxParser jsx={props.view} className="w-full" />
        </div>
    );
}