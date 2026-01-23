import { useRef, useMemo, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// We'll import this dynamically only on the client
let ImageResize: any = null;

interface QuillEditorProps {
    value: string;
    onChange: (content: string) => void;
    imageHandler: () => void;
    videoHandler: () => void;
}

export interface QuillEditorHandle {
    getEditor: () => any;
}

const QuillEditor = forwardRef<QuillEditorHandle, QuillEditorProps>(({ value, onChange, imageHandler, videoHandler }, ref) => {
    const quillRef = useRef<ReactQuill>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useImperativeHandle(ref, () => ({
        getEditor: () => quillRef.current?.getEditor()
    }));

    useEffect(() => {
        const setupQuill = async () => {
            if (typeof window !== 'undefined') {
                try {
                    const ImageResizeModule = await import('quill-image-resize-module-react');
                    ImageResize = ImageResizeModule.default;

                    // In Quill 2.0, we check via Quill.import
                    try {
                        if (ImageResize && !Quill.import('modules/imageResize')) {
                            Quill.register('modules/imageResize', ImageResize);
                        }
                    } catch (e) {
                        // If Quill.import throws, it likely means it's not registered
                        Quill.register('modules/imageResize', ImageResize);
                    }

                    setIsLoaded(true);
                } catch (error) {
                    console.error("Failed to load Quill ImageResize:", error);
                    setIsLoaded(true);
                }
            }
        };
        setupQuill();
    }, []);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image', 'video', 'clean']
            ],
            handlers: {
                image: imageHandler,
                video: videoHandler
            }
        },
        imageResize: isLoaded && ImageResize ? {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize']
        } : false
    }), [isLoaded, imageHandler, videoHandler]);

    if (!isLoaded) return <div className="h-[350px] w-full bg-muted animate-pulse rounded-md" />;

    return (
        <ReactQuill
            ref={quillRef}
            theme="snow"
            value={value}
            onChange={onChange}
            className="quill h-[300px]"
            modules={modules}
        />
    );
});

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;
