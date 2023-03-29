import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { auth, getUserInfo, registerNewUser, userExist } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({
  children,
  onUserLoggedIn,
  onUserNotLoggedIn,
  onUserNotRegistered,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user) {
          const isRegistered = await userExist(user.uid);
          if (isRegistered) {
            const userInfo = await getUserInfo(user.uid);
            if (userInfo.processCompleted) {
              onUserLoggedIn(userInfo);
            } else {
              onUserNotRegistered(userInfo);
            }
          } else {
            await registerNewUser({
              uid: user.uid,
              displayName: user.displayName,
              profilePicture: "",
              username: "",
              processCompleted: false,
            });
            onUserNotRegistered(user);
          }
        } else {
          onUserNotLoggedIn();
        }
      }
    });
  }, [navigate, onUserLoggedIn, onUserNotRegistered, onUserNotLoggedIn]);
  return <div>{children}</div>;
};

export default AuthProvider;
