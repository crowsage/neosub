import { CircleX, CircleCheck } from "lucide-react"
import { BASE_URL } from "../App"

export default function JobStatus(props) {
    console.log(props.jobId)
    return (

        <div className={`jobStatusMain ${props.status}`}>
            {props.status === "processing" &&

                <div className="loaderMain">

                    <div className="loader">
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                    <p>Transcribing...</p>
                </div>

            }
            {props.status === "failed" &&

                <div className="failedMain">
                    <CircleX size={35} />
                    <span>There was a problem while transcribing.</span>
                </div>

            }
            {props.status === "done" &&

                <div className="doneMain">
                    <CircleCheck size={35} />
                    <a href={`${BASE_URL}/subtitles/jobs/${props.jobId}/download/`} className="downloadBtn">
                        Download SRT
                    </a>
                </div>

            }

        </div>
    )

}