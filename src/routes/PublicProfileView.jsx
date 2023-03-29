import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  existUsername,
  getProfilePictureUrl,
  getUserPublicProfileInfo,
} from "../firebase/firebase";

const PublicProfileView = () => {
  const params = useParams();
  const [profile, setProfile] = useState(null);
  const [url, setUrl] = useState("");
  const [state, setState] = useState(0)

  useEffect(() => {
    getProfile();
    async function getProfile() {
      const username = params.username;
      try {
        const userUid = await existUsername(username);
        if (userUid) {
          const userInfo = await getUserPublicProfileInfo(userUid);
          setProfile(userInfo);
          const url = await getProfilePictureUrl(
            userInfo.profileInfo.profilePicture
          );
          setUrl(url)
        }else{
          setState(7)
        }
      } catch (error) {}
    }
  }, [params]);

  if(state === 7){
    return <div>
      <h1>Username Doesn't exist</h1>
    </div>
  }

  return (
    <div>
      <div>
        <img src={url} alt="" />
      </div>
      <h2>{profile?.profileInfo.username}</h2>
      <h3>{profile?.profileInfo.displayName}</h3>
      <div>{profile?.linksInfo.map((link)=> (<div>
        <a href={link.url}> {link.title}</a>
      </div>))}</div>
    </div>
  );
};

export default PublicProfileView;
