import { useNavigate } from "react-router-dom";
import { LocalHeader } from "../../components/local-header/local-header";

export function Database() {
  const navigate = useNavigate();

  return (
    <div className='page'>
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
