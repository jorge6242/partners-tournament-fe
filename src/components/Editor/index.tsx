import React, {useState, useRef, FunctionComponent} from 'react';
import JoditEditor from "jodit-react";
import Beautify from "./beautify.min.js";
import Ace from "./ace.js";

type ComponentProps = {
	onChange: Function;
	content: string;
  };

const CustomEditor: FunctionComponent<ComponentProps> = ({ onChange, content }) => {
	const editor = useRef(null)

	const config = {
		readonly: false, // all options from https://xdsoft.net/jodit/doc/
		beautifyHTMLCDNUrlsJS:  "./beautify.min.js",
		sourceEditorCDNUrlsJS: "./ace.js",
		disablePlugins: 'table,iframe'
	}
	return (
            <JoditEditor
            	ref={editor}
                value={content}
                config={config}
		        onBlur={(newContent: any) => onChange(newContent)} // preferred to use only this option to update the content for performance reasons
            />
        );
}

export default CustomEditor;