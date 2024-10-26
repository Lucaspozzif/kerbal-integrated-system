import { Database } from "./pages/database/database";
import { DatabaseForm } from "./pages/database/form/database-form";
import { Docs } from "./pages/docs/docs";
import { DocsForm } from "./pages/docs/form/docs-form";
import { Home } from "./pages/home/home";
import { ModulesForm } from "./pages/modules/form/modules-form";
import { Modules } from "./pages/modules/modules";

export const routes = [
  { path: "/main_window", element: <Home /> },

  { path: "/modules", element: <Modules /> },
  { path: "/modules/create", element: <ModulesForm /> },

  { path: "/database", element: <Database /> },
  { path: "/database/create", element: <DatabaseForm /> },

  { path: "/documents", element: <Docs /> },
  { path: "/documents/create/:id", element: <DocsForm /> },
];
