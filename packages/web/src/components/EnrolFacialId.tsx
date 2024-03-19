import { CaptureFacialId } from ".";
import { emitter } from "../context";

export function EnrolFacialId() {
    const captureDone = (done: boolean) => {
        console.log('Capture done:', done)
        emitter.emit('enableNext', done);
    }
    return <CaptureFacialId captureDone={captureDone} />
}