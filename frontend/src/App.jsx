import { useEffect, useState } from "react"
import FileUploader from "./components/FileUploader"
import { Link, Shield } from "lucide-react"
import JobStatus from "./components/JobStatus"


export const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

export default function App() {
  const [status, setStatus] = useState("idle")
  const [videoFile, setVideoFile] = useState(null)
  const [error, setError] = useState("")
  const [jobId, setJobId] = useState("")


  // Check if its a video
  const isVideo = (fileName) => {
    return /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(fileName);
  };


  async function getStatus(jobId) {
    try {

      const response = await fetch(`${BASE_URL}/subtitles/jobs/${jobId}/`)
      if (!response.ok) throw new Error("Failed to fetch status")
      const data = await response.json()
      return data.status
    } catch (err) {
      console.error(err)
      return "failed"
    }
  }


  async function handleStart(e) {

    e.preventDefault()
    setError("")


    //Checking if file is a video file
    if (!videoFile || !isVideo(videoFile.name)) {
      setError("This format is not supported!")
      setStatus("idle")
      return
    }


    // Creating Form Data to send file
    const formData = new FormData();
    formData.append("video", videoFile);


    setStatus("processing")

    try {

      const response = await fetch(`${BASE_URL}/subtitles/upload/`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        setJobId(data.job_id)
      } else {
        setError("Upload failed")
        setStatus("idle")
      }
    } catch (err) {
      console.error(err)
      setError("Network error. Please try again.")
      setStatus("idle")
    }
  }




  useEffect(() => {

    if (jobId) {

      const myInterval = setInterval(async () => {

        const currentStatus = await getStatus(jobId)

        if (currentStatus === "done") {
          setStatus("done")
          clearInterval(myInterval)
        }
        else if (currentStatus === "failed") {
          setStatus("failed")
          clearInterval(myInterval)
        }

      }, 4000);

      return () => clearInterval(myInterval)
    }
  }, [jobId])
  return (
    <div className="mainContainer">
      <header className="navbar">
        <h1>NeoSub</h1>

        <div className="action">

          <a href="https://github.com/CrowSage/neosub" target="_"><Link size={16} />View on GitHub</a>
          {/* <button className="themeChangeBtn"><Sun strokeWidth={1} size={30} /></button> */}
        </div>
      </header>

      <section className="mainSection">
        <h2 className="tagline">Automatic Subtitle Generator</h2>
        <p className="description">Upload a video and get subtitles in seconds.</p>
        <p className="formats">MP4, MOV, AVI, MKV, WebM supported (max 100MB)</p>

        <div className="privacyNote">
          <Shield size={14} />
          <span>Your videos are not stored after processing.</span>
        </div>

        {status === "idle" && <FileUploader
          setVideoFile={setVideoFile}
          videoFile={videoFile}
          setError={setError}
          isVideo={isVideo}
        />}
        {status !== "idle" && <JobStatus status={status} jobId={jobId} isVideo={isVideo} />}

        {error && <span className="errorMsg">{error}</span>}
        <button title="Click to start transcription." className="startBtn" disabled={!videoFile || status === "processing" || status === "done"} onClick={handleStart}>{status === "processing" ? "Processing..." : "Start"}</button>
      </section>

    </div>
  )
}