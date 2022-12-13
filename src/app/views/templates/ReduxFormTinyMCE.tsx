import React from 'react';
import TinyMCE from 'react-tinymce';

export function ReduxFormTinyMCE(props) {
  return (
    <TinyMCE
      content={props.input.value}
      config={{
        plugins: 'code autolink link image lists preview autoresize',
        autoresize_min_height: 750,
        allow_conditional_comments: true,
        skin: false,
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright',
      }}
      onChange={d => {
        props.input.onChange(d.level.content);
      }}
    />
  );
}
