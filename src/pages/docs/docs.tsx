import { useNavigate } from "react-router-dom";
import { LocalHeader } from "../../components/local-header/local-header";

export function Docs() {
  const navigate = useNavigate();

  return (
    <LocalHeader
      buttons={[
        { title: "Create", onClick: () => navigate("create") },
        { title: "Edit", onClick: () => navigate("edit") },
        { title: "Display", onClick: () => navigate("display") },
        { title: "Search", onClick: () => navigate("search") },
        { title: "Delete", onClick: () => navigate("delete") },
      ]}
      text={""}
    />
  );
}
