import "./main-header.css";

import { useLocation, useNavigate } from "react-router-dom";
import { connecting, file, flask, group, home, launch, pointer, product, profile, satellite } from "../../_global";
import { IconButton } from "../icon-button/icon-button";
import { useState } from "react";

export function MainHeader() {
  const [tab, setTab] = useState("/main_window");
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className='main-header'>
      <div className='mh-nav-button-list'>
        <IconButton reversed={true} title='back' src={pointer} onClick={() => {}} />
        <IconButton title='forward' src={pointer} onClick={() => {}} />
        <IconButton
          selected={location.pathname == "/main_window"}
          title='home'
          src={home}
          onClick={() => {
            navigate("main_window");
            setTab("main_window");
          }}
        />
      </div>
      <div className='mh-nav-button-list'>
        <IconButton
          selected={tab == "/missions"}
          title='missions'
          src={launch}
          onClick={() => {
            navigate("missions");
            setTab("/missions");
          }}
        />
        <IconButton
          selected={tab == "/modules"}
          title='modules'
          src={satellite}
          onClick={() => {
            navigate("modules");
            setTab("/modules");
          }}
        />
        <IconButton
          selected={tab == "/yard"}
          title='yard'
          src={product}
          onClick={() => {
            navigate("yard");
            setTab("/yard");
          }}
        />
        <IconButton
          selected={tab == "/team"}
          title='team'
          src={group}
          onClick={() => {
            navigate("team");
            setTab("/team");
          }}
        />
        <IconButton
          selected={tab == "/science"}
          title='science'
          src={flask}
          onClick={() => {
            navigate("science");
            setTab("/science");
          }}
        />
        <IconButton
          selected={tab == "/norms"}
          title='norms'
          src={file}
          onClick={() => {
            navigate("norms");
            setTab("/norms");
          }}
        />
        <IconButton
          selected={tab == "/database"}
          title='database'
          src={connecting}
          onClick={() => {
            navigate("database");
            setTab("/database");
          }}
        />
      </div>
      <div className='mh-nav-button-list'>
        <IconButton
          selected={location.pathname == "/profile"}
          title='profile'
          src={profile}
          onClick={() => {
            navigate("profile");
            setTab("/profile");
          }}
        />
      </div>
    </div>
  );
}
