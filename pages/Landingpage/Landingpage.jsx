import Home from "./Home";
import Features from "./Features";
import About from "./AboutSection";
import Contact from "./ContactSection";
import Newcontact from "./Newcontact";
import Footer from "./Footer";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Landingpage(){
   const navigate = useNavigate();

   useEffect(() => {
    if (localStorage.getItem('username') && localStorage.getItem('userId')) {
      navigate('/Mainpage');
    }
    // Listen for login in other tabs
    const onStorage = (e) => {
      if (e.key === 'login') {
        if (localStorage.getItem('username') && localStorage.getItem('userId')) {
          navigate('/Mainpage');
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [navigate]);


  return (
    <> 
       <Home/>
       <Features/>
       <About/>
       <Newcontact />
       <Footer/>   
    </>
  );
}
export default Landingpage