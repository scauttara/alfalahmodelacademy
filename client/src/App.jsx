import { Navigate } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import NavBar from './components/NavBar/NavBar.jsx'
import Footer from './components/Footer/Footer.jsx'


function App() {
  const isLoggedIn = !!localStorage.getItem('token')

  if(!isLoggedIn){
    return <Navigate to='/login' replace/>
  }

  return(
    <>
    <NavBar/>
    <Header/>
    <Footer/>

    </>
  )

}

export default App
