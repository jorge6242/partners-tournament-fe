import React from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

export default function Editor2({ onChange, content }){
    return (
          <SunEditor onBlur={e => onChange(e.srcElement.innerHTML)} setContents={content} />
      );
}