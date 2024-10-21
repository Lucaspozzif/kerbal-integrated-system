import { useState } from "react";
import { LocalHeader } from "../../components/local-header/local-header";
import { useNavigate } from "react-router-dom";

export function Modules() {
  const navigate = useNavigate();

  return (
    <div className='page'>
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
    </div>
  );
}
