import { Button } from "@mui/material"
import { createRef, useCallback, useLayoutEffect, useState } from "react"
import './styles.css'
import { useMainContext } from "../../context";

export function CaptureFacialId(props: {captureDone?: (done: boolean) => void}) {
    const videoRef = createRef<HTMLVideoElement>()
    const reviewRef = createRef<HTMLImageElement>()
    const mainContext = useMainContext();
    const [showCapture, setShowCapture] = useState(true)
    const { captureDone } = props;

    useLayoutEffect(() => {
        mainContext.imageCaptureHelper.requestCameraAccess();
        const attachVideo = async () => {
            if (videoRef.current) {
                mainContext.imageCaptureHelper.attachVideoStream(
                    videoRef.current
                )
            }
        }
        attachVideo()
    })

    const capture = useCallback(() => {
        console.log('capture')
        mainContext.imageCaptureHelper.startSelfieCapture()
        mainContext.imageCaptureHelper.showReviewImage(reviewRef.current!)
        setShowCapture(false)
        if(captureDone) captureDone(true)
    }, [showCapture])
    
    const recapture = useCallback(() => {
        console.log('recapture')
        if(captureDone) captureDone(false)
        setShowCapture(true)
    }, [showCapture])

    return (
        <>
        <video className="video-container" style={{ display: showCapture ? 'unset' : 'none' }} ref={videoRef}></video> 
        <img className="video-container" style={{ display: !showCapture ? 'unset' : 'none' }} ref={reviewRef} />  
        <Button fullWidth onClick={capture} variant="outlined">capture</Button>
        <Button fullWidth onClick={recapture} variant="outlined">re-capture</Button>
        </>
    )
}


