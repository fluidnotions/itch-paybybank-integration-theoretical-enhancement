


export class ImageCaptureHelper {
	private stream: MediaStream | null = null
	private videoElement: HTMLVideoElement | null = null
	reviewSelfieImageStr: string | null = null

	async requestCameraAccess(): Promise<boolean> {
		if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
			const granted = await this.startVideoStream()
			return granted
		}
		return false
	}

	stopVideoStream() {
		this.stream?.getTracks().forEach((track: MediaStreamTrack) => {
			track.stop()
		})
	}

	showReviewImage(reviewImage: HTMLImageElement) {
		if (this.reviewSelfieImageStr) {
			reviewImage.src = this.reviewSelfieImageStr
		} 
	}


	 startSelfieCapture() {
		if (!this.videoElement) {
			throw new Error('videoElement not set')
		}
		const canvas = document.createElement('canvas')
		canvas.width = 144
		canvas.height = 144
		const context: CanvasRenderingContext2D = canvas.getContext('2d')!

		const imageDimension = 460

		const xCenterOfImage = this.videoElement.videoWidth / 2
		const yCenterOfImage = this.videoElement.videoHeight / 2

		context.drawImage(
			this.videoElement,
			xCenterOfImage - imageDimension / 2,
			yCenterOfImage - imageDimension / 2,
			imageDimension,
			imageDimension,
			0,
			0,
			canvas.width,
			canvas.height,
		)

		this.reviewSelfieImageStr = canvas.toDataURL('image/png')
	}

	async attachVideoStream(videoElement: HTMLVideoElement): Promise<void> {
		this.videoElement = videoElement
		videoElement.autoplay = true
		videoElement.playsInline = true
		if (!this.stream) {
			await this.startVideoStream()
		}
		if ('srcObject' in videoElement) {
			videoElement.srcObject = this.stream
		} else if (this.stream?.getTracks()[0]) {
			; (videoElement as any).src = window.URL.createObjectURL((this.stream as unknown) as MediaSource)
		}
	}

	async startVideoStream(): Promise<boolean> {
		let videoStream: MediaStream | undefined
		try {
			const video = {
				facingMode: 'user',
				width: { min: 1280 },
				aspectRatio: 16 / 9,
			}
			videoStream = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video,
			})
			this.stream = videoStream
		} finally {
			return !!videoStream
		}
	}

}
