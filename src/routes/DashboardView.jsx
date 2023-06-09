import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthProvider from "../components/AuthProvider";
import DashboardWrapper from "../components/DashboardWrapper";
import { v4 as uuid } from "uuid";
import {
  deleteLink,
  getLinks,
  insertNewLink,
  updateLink,
} from "../firebase/firebase";
import Link from "../components/Link";

const DashboardView = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [state, setCurrentState] = useState(0);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState([]);

  async function handleUserLoggedIn(user) {
    setCurrentUser(user);
    setCurrentState(2);
    const resLinks = await getLinks(user.uid);
    setLinks([...resLinks]);
  }
  function handleUserNotRegistered(user) {
    navigate("/login");
  }
  function handleUserNotLoggedIn() {
    navigate("/login");
  }
  if (state === 0) {
    return (
      <div>
        <AuthProvider
          onUserLoggedIn={handleUserLoggedIn}
          onUserNotLoggedIn={handleUserNotLoggedIn}
          onUserNotRegistered={handleUserNotRegistered}
        >
          Loading
        </AuthProvider>
      </div>
    );
  }

  function handleOnSubmit(e) {
    e.preventDefault();
    addLink();
  }

  function addLink() {
    if (title !== "" && url !== "") {
      const newLink = {
        id: uuid(),
        title: title,
        url: url,
        uid: currentUser.uid,
      };
      const res = insertNewLink(newLink);
      newLink.docId = res.id;
      setTitle("");
      setUrl("");
      setLinks([...links, newLink]);
    }
  }

  function handleOnChange(e) {
    const value = e.target.value;
    if (e.target.name === "title") {
      setTitle(value);
    }
    if (e.target.name === "url") {
      setUrl(value);
    }
  }

  async function handleDeleteLink(docId) {
    await deleteLink(docId);
    const tmp = links.filter((link) => link.docId !== docId);
    setLinks([...tmp])
  }

  async function handleUpdateLink(docId, title, url) {
    const link = links.find((item) => item.docId === docId);
    link.title = title;
    link.url = url;
    await updateLink(docId, link);
  }

  return (
    <DashboardWrapper>
      <div>
        <h1>Dashboard</h1>

        <form action="" onSubmit={handleOnSubmit}>
          <label htmlFor="title">Title</label>
          <input type="text" name="title" onChange={handleOnChange} />

          <label htmlFor="url">Url</label>
          <input type="url" name="url" onChange={handleOnChange} />

          <input type="submit" value="Create a new link" />
        </form>

        <div>
          {links.map((link) => (
            <Link
              key={link.docId}
              docId={link.docId}
              url={link.url}
              title={link.title}
              onDelete={handleDeleteLink}
              onUpdate={handleUpdateLink}
            ></Link>
          ))}
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default DashboardView;
