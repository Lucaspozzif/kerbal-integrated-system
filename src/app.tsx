import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import { routes } from "./_routes";

import "./styles/reset.css";
import "./styles/styles.css";
import "./styles/tiny5/tiny5-regular.ttf";
import { MainHeader } from "./components/main-header/main-header";
import { LocationBar } from "./components/location-bar/location-bar";

const root = createRoot(document.body);
root.render(
  <HashRouter>
    <MainHeader />
    <Routes>
      {routes.map((route: any) => {
        return <Route path={route.path} element={route.element} />;
      })}
    </Routes>
  </HashRouter>
);
