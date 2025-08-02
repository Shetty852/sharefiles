import React from 'react'

import Navbar from './components/Navbar'
import Home from './components/Home'
import Send from './components/Send'
import Receive from './components/Receive'
import Bottom from './components/Bottom'
const App = () => {
  
  // Set the document title
  React.useEffect(() => {
    document.title = 'ShareFiles - Files Everywhere';
  }, []);
 
  return (
    <div>
      <Navbar/>
      <Home/>
      <Send/>
      <Receive/>
      <Bottom/>
    </div>
  )
}

export default App