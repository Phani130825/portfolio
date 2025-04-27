import React, { forwardRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = forwardRef((props, ref) => {
  return <ReactQuill {...props} ref={ref} />;
});

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor; 