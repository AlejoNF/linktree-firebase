import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthProvider from "../components/AuthProvider";
import { auth,} from "../firebase/firebase";



const LoginView = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  //Creamos unos estados de resultado,
  // 0 inicializado,
  // 1 Loading 
  //2 Login succes 
  //3 logged but not registered 
  //4 (nadie logeado)Login with google, 
  //5 ya existe un usuario, 
  //6 nuevo usuario, click para continuar
  //7 username no existe
  const [state, setCurrentState] = useState(0);

  // useEffect(() => {
  //   setCurrentState(1);
  //   onAuthStateChanged(auth,async (user)=> {
  //     if(user){
  //         if (user) {
  //           const isRegistered = await userExist(user.uid);
  //           if (isRegistered) {
  //             navigate('/dashboard');
  //             setCurrentState(2);
  //           } else {
  //             navigate('/choose-username')
  //             setCurrentState(3);
  //           }
  //         } else {
  //           setCurrentState(4);
  //           console.log("No hay nadie autenticado.");
  //         }
  //     }
  //   })
  //  }, [navigate]);

  async function handleOnClick() {
    const googleProvider = new GoogleAuthProvider();
    await signInWithGoogle(googleProvider);

    async function signInWithGoogle(googleProvider) {
      try {
        const res = await signInWithPopup(auth, googleProvider);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  }
  function handleUserLoggedIn(user){
    navigate('/dashboard')
  }
  function handleUserNotRegistered(user){
    navigate('/choose-username')
  }
  function handleUserNotLoggedIn(){
    setCurrentState(4)
  }

  // if (state === 2) {
  //   return <div>Estas autenticado y registrado</div>;
  // }
  // if (state === 3) {
  //   return <div>Estas autenticado pero no registrado</div>;
  // }
  if (state === 4) {
    <div>
      <button onClick={handleOnClick}> Login with google</button>
    </div>;
  }

  if (state === 5) {
    <div>
      <button onClick={handleOnClick}> Login with google</button>
    </div>;
  }

  return (
    <AuthProvider
      onUserLoggedIn={handleUserLoggedIn}
      onUserNotRegistered={handleUserNotRegistered}
      onUserNotLoggedIn={handleUserNotLoggedIn}
    >
      <div>Loading . . .</div>
    </AuthProvider>
  );
};

export default LoginView;
