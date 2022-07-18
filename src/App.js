import {useState, useEffect, useRef} from 'react'
import * as mobilenet from '@tensorflow-models/mobilenet'
// import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu';
import { ModelLoggingVerbosity } from '@tensorflow/tfjs-layers/dist/base_callbacks';


function App() {
  // use the useState as a way to save the mobilenet model in the model state
  const [model,setModel] = useState(null)
  const [imgUrl, setImgUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  // grabbing the data to display the predictions from the model
  const [data, setData] = useState([])
  const imgRef = useRef()
  const imageUrl = useRef()
  
  
  
  



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
    } catch(err) {
      console.warn('ERRORRRR', err)
      setLoading(false)
    }
  }
  
  // event Handlers
  const handleChange = (e) => {
    setImgUrl(e.target.value)
    setData([])
  }

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
  
  const handleIdentify = async () => {
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
  
  
  
  if(loading) {
    // if the user is still loading in to site,
    return (
      <>
      <img src='https://earthsky.org/upl/2019/06/b19e465cc4d37398ab2b72e9ba239e1a.jpg' 
      alt='loadingscreen'
       width='300'
        height='300'/>
      <h1>Loading in..., woof</h1></>
      )
  }
  
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
      {/* image url from website  */}
      <input type='text' ref={imageUrl} onChange={handleChange}/>
      <div>
        {imgUrl ? <img src={imgUrl}
         alt='picture'
          crossOrigin='anonymous'
           ref={imgRef} /> : null}
      </div>
      {/* if the image exist, show the button, otherwise hide it */}
      {imgUrl ? <button onClick={handleIdentify} type='button'>What Am I </button> : null}
      {data.length > 0 ? <div>
        {data.map((data, idx) => {
          return (
            <div key={`dataKey${idx}`}>
              <h3>Ai Guess: {data.className} {(data.probability * 100).toFixed(2)}%</h3>
              
            </div>
          
          )
        })}
        
        
      </div> : null}
    </div>
  );
}

export default App;
