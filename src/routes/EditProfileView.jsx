import { async } from "@firebase/util";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthProvider from "../components/AuthProvider";
import DashboardWrapper from "../components/DashboardWrapper";
import { getProfilePictureUrl, setUserProfilePicture, updateUser } from "../firebase/firebase";

const EditProfileView = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [state, setCurrentState] = useState(0);
  const [profileUrl, setProfileUrl] = useState(null);
  const fileRef = useRef();

  async function handleUserLoggedIn(user) {
    setCurrentUser(user);
    const url = await getProfilePictureUrl(user.profilePicture)
    setProfileUrl(url)
    setCurrentState(2);
  }
  function handleUserNotRegistered(user) {
    navigate("/login");
  }
  function handleUserNotLoggedIn() {
    navigate("/login");
  }

  function handleOpenFilePicker() {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }

  function handleChangeFile(e) {
    const files = e.target.files;
    const fileReader = new FileReader();
    if (fileReader && files && files.length > 0) {
      fileReader.readAsArrayBuffer(files[0]);
      fileReader.onload = async function () {
        const imageData = fileReader.result;
        const res = await setUserProfilePicture(currentUser.uid, imageData);
        if (res) {
          const tmpUser = { ...currentUser };
          tmpUser.profilePicture = res.metadata.fullPath;
          await updateUser(tmpUser);
          setCurrentUser({...tmpUser})
          const url = await getProfilePictureUrl(currentUser.profilePicture)
          setProfileUrl(url)
        }
      };
    }
  }
  return (
    <AuthProvider
      onUserLoggedIn={handleUserLoggedIn}
      onUserNotLoggedIn={handleUserNotLoggedIn}
      onUserNotRegistered={handleUserNotRegistered}
    >
      <DashboardWrapper>
        <div>
          <h2>Edit Profile info</h2>
          <div>
            <div>
              <img src={profileUrl} alt="" width={100} />
            </div>
            <div>
              <button onClick={handleOpenFilePicker}>
                Choose new profile picture{" "}
              </button>
              <input
                ref={fileRef}
                type="file"
                style={{ display: "none" }}
                onChange={handleChangeFile}
              />
            </div>
          </div>
        </div>
      </DashboardWrapper>
    </AuthProvider>
  );
};

export default EditProfileView;
