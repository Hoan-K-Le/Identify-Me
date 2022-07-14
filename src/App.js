import {useState, useEffect, useRef} from 'react'
import * as mobilenet from '@tensorflow-models/mobilenet'
// import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu';

function App() {
  // use the useState as a way to save the mobilenet model in the model state
  const [model,setModel] = useState(null)
  const [imgUrl, setImgUrl] = useState(null)
  const imgRef = useRef()


  // there is a delay on the page whenever the user is loading in
  // maybe find a way to let the user know that they are in the process of loading in


// event Handlers
  const handleUpload = (e) => {
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

  const handleIdentify = async (e) => {
    // console.log('making sure the button works')
    //  grabbed the models data by classifying the img reference that we have passed on in the imgurl
    const response = await model.classify(imgRef.current)
    console.log(response)
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
      onChange={handleUpload}
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
      {imgUrl ? <button onClick={handleIdentify} type='button'>What Am I </button> : null}
    </div>
  );
}

export default App;
