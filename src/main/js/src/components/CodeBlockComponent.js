import React from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { twilight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlockComponent = (props) => {
    return (
        <SyntaxHighlighter language="javascript" style={twilight}>
            {props.codeString}
        </SyntaxHighlighter>

    );
};

export default CodeBlockComponent;

// import { CopyBlock } from "react-code-blocks";
//
// export default function CodeBlockComponent(props) {
//     return (
//         <CopyBlock
//             theme="A11y Dark"
//             text={props.code}
//
//         />
//     );
// }