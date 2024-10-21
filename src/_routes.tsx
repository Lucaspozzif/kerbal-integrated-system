import { Home } from "./pages/home/home";
import { ModulesForm } from "./pages/modules/form/modules-form";
import { Modules } from "./pages/modules/modules";

export const routes = [
  { path: "/main_window", element: <Home /> },

  { path: "/modules", element: <Modules /> },
  { path: "/modules/create", element: <ModulesForm /> },
];
