import {useState, useEffect, useRef} from 'react'
import * as mobilenet from '@tensorflow-models/mobilenet'
import axios from 'axios'

function App() {
  // use the useState as a way to save the mobilenet model in the model state
  const [model,setModel] = useState(null)
  const [imgUrl, setImgUrl] = useState(null)
  const imgRef = useRef()


  const imageUpload = (e) => {
    // destructoring the files 
    const {files} = e.target
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

  const load_model = async () => {
    try {
      // set the mobilenet tensorflow model inside the state model
      const model = await mobilenet.load()
      setModel(model)
    } catch(err) {
      console.warn('ERRORRRR', err)
    }
  }

  // making sure it runs one time only 
  useEffect(() => {
    load_model()
  }, []) // have an empty array for dependencies


  return (
    <div className="App">
      <h1>IDENTIFY ME!</h1>
      {/* able to upload files locally*/}
      <input
      onChange={imageUpload}
       type='file' 
      //  accept all image files
      accept='image/*' 
      // if you're on your phone, it'll trigger the camera
      capture='camera' />
      <div>
        {imgUrl ? <img src={imgUrl}
         alt='picture'
          crossOrigin='anonymous'
           ref={imgRef} /> : null}
      </div>
      {/* if the image exist, show the button, otherwise hide it */}
      {imgUrl ? <button type='button'>What Am I </button> : null}
    </div>
  );
}

export default App;
