import { useNavigate } from "react-router-dom";
import { LocalHeader } from "../../components/local-header/local-header";
import { Database as Db } from "../../system/classes/database";
import { useEffect, useState } from "react";

export function Database() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const database = new Db();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const newList = await database.downloadAll();
      setList(newList);
      setLoading(false);
    };

    fetch()
  }, []);
  console.log(list)

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
      {list.map((database) => {
        console.log(database);
        return (
          <div className="listItem">
            <p>teste</p>
          </div>
        );
      })}
    </div>
  );
}
