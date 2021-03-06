import { useState, useEffect, useRef } from 'react'
// importing a pretrain image classification
import * as mobilenet from '@tensorflow-models/mobilenet'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-cpu'
import { ModelLoggingVerbosity } from '@tensorflow/tfjs-layers/dist/base_callbacks'
// importing a second trained-model object detection
import * as cocossd from '@tensorflow-models/coco-ssd'
import Webcam from 'react-webcam'
import { DrawBox } from './drawbox'

function App() {
  // use the useState as a way to save the mobilenet model in the model state
  const [model, setModel] = useState(null)
  const [imgUrl, setImgUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  // grabbing the data to display the predictions from the model
  const [data, setData] = useState([])
  const imgRef = useRef()
  const imageUrl = useRef()
  const picRef = useRef()
  const [playing, setPlaying] = useState(false)

  const theCoco = async () => {
    const network = await cocossd.load()

    //  setting the loop and it will detect the objects
    setInterval(() => {
      detect(network)
    }, 10)
  }

  const detect = async network => {
    // this is to see if the data is available to be used
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Getting the video properties
      const video = webcamRef.current.video
      const videoWidth = webcamRef.current.video.videoWidth
      const videoHeight = webcamRef.current.video.videoHeight

      // setting the webcam video widdth and height
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      // this is setting the canvas/rectangle width and height
      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight

      //  make object detection
      const obj = await network.detect(video)
      console.log(obj)
      // Draw mesh
      const ctx = canvasRef.current.getContext('2d')

      //  make the drawBox object detection
      DrawBox(obj, ctx)
    }
  }

  useEffect(() => {
    theCoco()
  }, [])

  // there is a delay on the page whenever the user is loading in
  // maybe find a way to let the user know that they are in the process of loading in
  const load_model = async () => {
    setLoading(true)
    try {
      // set the mobilenet tensorflow model inside the state model
      const model = await mobilenet.load()
      setModel(model)
      // set the loading to false if the model is loading
      setLoading(false)
    } catch (err) {
      console.warn('ERRORRRR', err)
      setLoading(false)
    }
  }

  // event Handlers
  const handleSubmit = () => {
    picRef.current.click()
  }

  const handleChange = e => {
    setImgUrl(e.target.value)
    setData([])
  }

  const handleUpload = e => {
    // destructoring the files
    const { files } = e.target
    // what if there is no files? how to check if there is a file
    if (files.length > 0) {
      // creates a url for the file that is passed in the parameter on index 0
      const url = URL.createObjectURL(files[0])
      // set the image
      setImgUrl(url)
    } else {
      setImgUrl(null)
    }
  }

  const handleIdentify = async () => {
    // to get rid of the text url after identifying the image
    imageUrl.current.value = ''
    // console.log('making sure the button works')
    //  grabbed the models data by classifying the img reference that we have passed on in the imgurl
    const data = await model.classify(imgRef.current)
    console.log(data)
    setData(data)
  }

  // making sure it runs one time only
  useEffect(() => {
    load_model()
  }, []) // have an empty array for dependencies

  if (loading) {
    // if the user is still loading in to site,
    return (
      <>
        <div className="justify-center flex items-center">
          <img
            src="https://earthsky.org/upl/2019/06/b19e465cc4d37398ab2b72e9ba239e1a.jpg"
            alt="loadingscreen"
            width="1400"
            height="1000"
          />
        </div>
        <h1 className="text-3xl text-center">Loading in... woof</h1>
      </>
    )
  }

  return (
    <div className="bg-gray-400 h-screen">
      <input
        className="invisible"
        onChange={handleUpload}
        type="file"
        //  accept all image files
        accept="image/*"
        // if you're on your phone, it'll trigger the camera
        capture="camera"
        ref={picRef}
      />
      <div className="flex justify-center items-center ">
        <h1 className="text-3xl font-sans-serif">IDENTIFY ME!</h1>
      </div>

      <div className="justify-between grids-cols-3 flex items-center p-20">
        <button
          className="border  bg-gray-300 btn-gray-300 hover:bg-gray-400 hover:scale-105 text-gray-800 font-bold py-2 px-4 rounded-xl inline-flex items-center "
          type="submit"
          onClick={handleSubmit}
        >
          <svg
            class="fill-current w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
          </svg>
          <span>Upload</span>
        </button>
        <span className="font-bold text-xl">OR</span>

        <button
          className="border  bg-gray-300 btn-gray-300 hover:bg-gray-400 hover:scale-105 text-gray-800 font-bold py-2 px-4 rounded-xl inline-flex items-center"
          onClick={setPlaying}
        >
          Object Detection
        </button>
        <span className="font-bold text-xl">OR</span>
        {/* image url from website  */}
        <input
          className="border border-xl bg-gray-200 text-center rounded-xl border-solid hover:scale-105"
          type="text"
          placeholder="Image address here"
          ref={imageUrl}
          onChange={handleChange}
        />
      </div>
      {/* image url from website  */}

      <div className="flex justify-center items-center rounded-xl">
        {imgUrl ? (
          <img
            className="rounded-xl shadow-xl"
            src={imgUrl}
            alt="picture"
            crossOrigin="anonymous"
            ref={imgRef}
          />
        ) : null}
        {/* if the image exist, show the button, otherwise hide it */}
      </div>

      <div className="flex justify-center items-center p-10">
        {imgUrl ? (
          <button
            className="border bg-gray-300 btn-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-xl hover:scale-105 inline-flex items-center "
            onClick={handleIdentify}
            type="button"
          >
            <span>Classify Me</span>
          </button>
        ) : null}
      </div>

      {playing ? (
        <Webcam
          ref={webcamRef}
          muted={true}
          capture="camera"
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zindex: 9,
            width: 680,
            height: 400,
          }}
        />
      ) : null}

      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zindex: 8,
          width: 580,
          height: 400,
        }}
      />

      <div className="flex justify-center items-center p-2">
        {data.length > 0 ? (
          <div>
            {data.map((data, idx) => {
              return (
                <div className="text-xl p-2" key={`dataKey${idx}`}>
                  <h3 className="">
                    Ai Guess: {data.className}{' '}
                    {(data.probability * 100).toFixed(2)}%
                  </h3>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default App
