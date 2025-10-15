import React, { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css"; // snow theme

type Props = {
    width?: string | number;
    height?: string | number;
    value?: string;
    onChange: (content: string, text?: any) => void;
    className?: string;
};

type EditorHtmlProps = {
    Quill: any;
    width?: string | number;
    height?: string | number;
    value?: string;
    onChange: (content: string, text?: any) => void;
    className?: string;
}

const EditorHtml = ({ Quill, width = "100%",
    height = 300,
    value = "",
    className, onChange = (_: any) => { } }: EditorHtmlProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<any>(null);
    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: "snow",
                placeholder: "Start typing...",
                modules: {
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline", "strike"],
                        ["link", "image"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["clean"],
                    ],
                },
            });

            // Change handler
            quillRef.current.on('editor-change', () => {
                if (onChange) {
                    const html = quillRef.current!.root.innerHTML;
                    const text = quillRef.current!.getText();
                    onChange(html, text);
                }
            });
        }
       
    }, []);

    useEffect(() => {
        if (quillRef.current) {
             const html = quillRef.current!.root.innerHTML;
            // Set initial value
            if ((value!=html)) {
                quillRef.current.root.innerHTML = value;
            }
        }
    }, [value])

    return <div className={className}>
        <div ref={editorRef} style={{ width, height }} />
    </div>
}

export default function Editor({
    width = "100%",
    height = 300,
    value = "",
    className,
    onChange = () => { },
}: Props) {

    const [loader, setLoader] = useState(true)
    const quillRef = useRef<any>(null);

    useEffect(() => {
        // Run only in browser
        if (typeof window !== "undefined") {
            import("quill").then(({ default: Quill }) => {
                // setQuillCode(Quill)
                quillRef.current = Quill
                setLoader(false)
            });
        }
    }, []);

    return <>
        {quillRef.current && !loader ? <>
            <EditorHtml
                value={value}
                className={className}
                width={width}
                height={height}
                Quill={quillRef.current}
                onChange={onChange}
            />
        </> : <>
            <div className="shine" style={{ width, height }} ></div>
        </>}
    </>;
}
