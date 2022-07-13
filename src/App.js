import {useState, useEffect} from 'react'
import * as mobilenet from '@tensorflow-models/mobilenet'

function App() {
  // use the useState as a way to save the model
  const [model,setModel] = useState(null)
  return (
    <div className="App">
      <h1>happy new year!</h1>
      {/* able to upload files locally, or if you happen to use the app on the phone, then itll trigger the camera */}
      <input type='file' accept='image/*' capture='camera'/>
    </div>
  );
}

export default App;
