import { useNavigate } from "react-router-dom";
import { LocalHeader } from "../../components/local-header/local-header";
import { Database as Db } from "../../system/classes/database";

export function Database() {
  const navigate = useNavigate();
  const database = new Db();
  
  return (
    <div className="page">
      <LocalHeader
        buttons={[
          { title: "Create", onClick: () => navigate("create") },
          { title: "Display", onClick: () => navigate("display") },
          { title: "Search", onClick: () => navigate("search") },
        ]}
        text={""}
      />
    </div>
  );
}
