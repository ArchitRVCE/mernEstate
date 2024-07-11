import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './Pages/Home'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import About from './Pages/About'
import Profile from './Pages/Profile'
import Header from './Components/Header'
import PrivateRoute from './Components/PrivateRoute'
import CreateListing from './Pages/CreateListing'
import UpdateListing from './Pages/UpdateListing'
import Listing from './Pages/Listing'

function App() {
  return (
    <>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/sign-in' element={<SignIn/>}/>
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route path='/about' element={<About/>}/>
          <Route element={<PrivateRoute/>}>
              <Route path='/profile' element={<Profile/>}/>
              <Route path='/create-listing' element={<CreateListing/>}></Route>
              <Route path='/update-listing/:listingId' element={<UpdateListing/>}></Route>
          </Route>
          <Route path='/listing/:listingId' element={<Listing/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
 