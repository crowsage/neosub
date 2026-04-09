import { Video, FileCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function FileUploader(props) {

    const MAX_SIZE = 100 * 1024 * 1024
    const uploadRef = useRef(null)

    const [isDragOver, setIsDragOver] = useState(false)


    function handleChange(e) {
        const file = e.target.files[0]

        if (!file) return

        if (!props.isVideo(file.name)) {
            props.setError("Only video files are allowed")
            return
        }
        if (file.size > MAX_SIZE) {
            props.setError("File must be under 100MB")
            return
        }

        props.setError("")
        props.setVideoFile(file)
    }

    function handleDragOver(e) {
        e.preventDefault()
        setIsDragOver(true)
    }

    function handleDrop(e) {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (!file) return

        if (!props.isVideo(file.name)) {
            props.setError("Only video files are allowed")
            return
        }

        if (file.size > MAX_SIZE) {
            props.setError("File must be under 100MB")
            props.setVideoFile(null)
            uploadRef.current.value = ""
            setIsDragOver(false)
            return
        }


        props.setError("")
        props.setVideoFile(file)
        uploadRef.current.value = ""
        setIsDragOver(false)
    }

    function removeFile(e) {
        e.stopPropagation();
        props.setVideoFile(null);
        uploadRef.current.value = "";
    }

    return (
        <div className="fileUploader"
            onClick={() => uploadRef.current.click()}

            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={() => setIsDragOver(false)}


            style={{
                opacity: `${isDragOver ? 0.5 : 1}`
            }}
        >
            <button className="removeFileBtn" style={{ display: props.videoFile ? "" : "none" }} onClick={removeFile} title="Remove this file.">X</button>
            <input type="file" style={{ display: "none" }} ref={uploadRef} accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska" onChange={handleChange} />
            {props.videoFile ? <FileCheck size={40} /> : <Video size={40} />}
            {props.videoFile ? <h2>{props.videoFile.name}</h2> : <h2>Upload a video file.</h2>}

        </div>
    )
}