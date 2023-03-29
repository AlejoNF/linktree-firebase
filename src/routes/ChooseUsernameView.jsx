import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthProvider from "../components/AuthProvider";
import { existUsername, updateUser } from "../firebase/firebase";

const ChooseUsernameView = () => {
  const navigate = useNavigate();
  const [state, setState] = useState(0);
  const [currentUser, setCurrentUser] = useState({});
  const [username, setUserName] = useState("");

  function handleUserLoggedIn(user) {
    navigate("/dashboard");
  }
  function handleUserNotRegistered(user) {
    setCurrentUser(user);
    setState(3);
  }
  function handleUserNotLoggedIn() {
    navigate("/login");
  }

  function handleInputUsername(e) {
    setUserName(e.target.value);
  }

  async function handleContinue() {
    if (username !== "") {
      const exists = await existUsername(username);
      if (exists) {
        setState(5);
      } else {
        const tmp = { ...currentUser };
        tmp.username = username;
        tmp.processCompleted = true;
        await updateUser(tmp);
        setState(6);
      }
    }
  }

  if (state === 3 || state === 5 ) {
    return (
      <div>
        <h1>Bienvenido {currentUser.displayName}</h1>
        <p> Para terminar el proceso elige un nombre de usuario</p>
        { state === 5 ? <p>El nombre de usuario ya existe, escoge otro.</p> : ""}

        <div>
          <input type="text" onChange={handleInputUsername} />
        </div>

        <div>
          <button onClick={handleContinue}>Continue</button>
        </div>
      </div>
    );
  }
  if( state === 6){
    return <div>
      <h1>Felicidades, ya puedes ir a dashboard a crear tus links</h1>
      <Link to="/dashboard">Continue</Link>
    </div>
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

export default ChooseUsernameView;
