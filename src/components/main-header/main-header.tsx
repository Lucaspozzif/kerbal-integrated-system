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
    <div className="main-header">
      <div className="mh-nav-button-list">
        <IconButton
          reversed={true}
          title="back"
          src={pointer}
          onClick={() => {
            navigate(-1);
          }}
        />
        <IconButton
          title="forward"
          src={pointer}
          onClick={() => {
            navigate(1);
          }}
        />
        <IconButton
          selected={tab == "/"}
          title="home"
          src={home}
          onClick={() => {
            navigate("/");
            setTab("/");
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
          selected={tab == "/celestial-body"}
          title="planets"
          src={flask}
          onClick={() => {
            navigate("celestial-body");
            setTab("/celestial-body");
          }}
        />
        <IconButton
          selected={tab == "/documents"}
          title='docs'
          src={file}
          onClick={() => {
            navigate("documents");
            setTab("/documents");
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
    </div>
  );
}
