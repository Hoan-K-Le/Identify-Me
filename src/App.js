import {useState, useEffect} from 'react'
import * as mobilenet from '@tensorflow-models/mobilenet'
// import axios from 'axios'

function App() {
  // use the useState as a way to save the mobilenet model in the model state
  const [model,setModel] = useState(null)
  const [imgUrl, setImgUrl] = useState(null)

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
    </div>
  );
}

export default App;
