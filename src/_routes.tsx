import { CelestialBody } from "./pages/celestial-body/celestial-body";
import { CelestialBodyForm } from "./pages/celestial-body/form/celestial-body-form";
import { Database } from "./pages/database/database";
import { DatabaseForm } from "./pages/database/form/database-form";
import { Docs } from "./pages/docs/docs";
import { DocsForm } from "./pages/docs/form/docs-form";
import { Experiment } from "./pages/experiment/experiment";
import { ExperimentForm } from "./pages/experiment/form/experiment-form";
import { Home } from "./pages/home/home";
import { ModulesForm } from "./pages/modules/form/modules-form";
import { Modules } from "./pages/modules/modules";

export const routes = [
  { path: "/", element: <Home /> },

  { path: "/documents", element: <Docs /> },
  { path: "/documents/create/", element: <DocsForm /> },
  { path: "/documents/edit/:id", element: <DocsForm /> },
  { path: "/documents/display/:id", element: <DocsForm /> },

  { path: "/database", element: <Database /> },
  { path: "/database/create", element: <DatabaseForm /> },
  { path: "/database/edit/:id", element: <DatabaseForm /> },
  { path: "/database/display/:id", element: <DatabaseForm /> },

  { path: "science", element: <Experiment /> },
  { path: "science/create", element: <ExperimentForm /> },
  { path: "science/edit/:id", element: <ExperimentForm /> },
  { path: "science/display/:id", element: <ExperimentForm /> },

  { path: "celestial-body", element: <CelestialBody /> },
  { path: "celestial-body/create", element: <CelestialBodyForm /> },
  { path: "celestial-body/edit/:id", element: <CelestialBodyForm /> },
  { path: "celestial-body/display/:id", element: <CelestialBodyForm /> },
];
