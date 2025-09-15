import React from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form'

const RTE = ({ name, control, defaultvalue = '' }) => {
    return (
        <>
            <Controller
                name={name || 'description'}
                control={control}
                rules={{required:'This field is required'}}
                render={({ field: { onChange,value } }) => (
                    <Editor
                        apiKey={import.meta.env.VITE_TINY_MCE_KEY}
                        init={{
                            initialValue: defaultvalue,
                            height: 500,
                            menubar: false,
                            skin: "oxide-dark",     // dark theme
                            content_css: "dark",    // dark content area
                            plugins: [
                                "advlist",
                                "autolink",
                                "lists",
                                "link",
                                "charmap",
                                "preview",
                                "anchor",
                                "searchreplace",
                                "visualblocks",
                                "code",
                                "fullscreen",
                                "insertdatetime",
                                "table",
                                "wordcount",
                            ],
                            toolbar:
                                "undo redo | blocks | " +
                                "bold italic underline strikethrough | " +
                                "alignleft aligncenter alignright alignjustify | " +
                                "bullist numlist outdent indent | " +
                                "removeformat | code preview fullscreen",
                            block_formats:
                                "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6",
                            branding: false,
                        }}
                        value={value}
                        onEditorChange={onChange}
                    />
                )}




            />

        </>

    )
}

export default RTE