import React from "react";
// import SyntaxHighlighter from 'react-syntax-highlighter';
// import { twilight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyBlock, dracula, hybrid, codepen } from "react-code-blocks";

const CodeBlockComponent = ({codeString}) => {
    return (
        // <SyntaxHighlighter language="javascript" style={twilight}>
        //     {props.codeString}
        // </SyntaxHighlighter>

        <div>
            <CopyBlock
                language={"jsx"}
                text={codeString}
                showLineNumbers={true}
                theme={hybrid}
                wrapLines={true}
                codeBlock
            />
        </div>

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