import { useEffect, useState } from "react";
import { TextInput } from "../../../components/text-input/text-input";
import { Database } from "../../../system/classes/database";
import { SheetButton } from "../../../components/sheet-button/sheet-button";
import { trash } from "../../../_global";
import { TextButton } from "../../../components/text-button/text-button";
import { LocalHeader } from "../../../components/local-header/local-header";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function DatabaseForm() {
  const [loading, setLoading] = useState(false);
  const [database, setter] = useState(new Database());
  const [tab, setTab] = useState("basic-data");

  const [mode, setMode] = useState("display");

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setMode(location.pathname.split("/")[2]);
      if (id) {
        database.set("name", id, setter);
        await database.download();
        setter(database);
      }
      setLoading(false);
    };

    fetch();
  }, []);

  if (!database.get("data")) {
    database.set("data", [], setter);
  }
  return (
    <div className="page">
      <LocalHeader
        buttons={[
          {
            long: true,
            selected: tab == "basic-data",
            title: "Basic Data",
            onClick: () => setTab("basic-data"),
          },
          {
            long: true,
            selected: tab == "",
            spaced: true,
            title: mode != "display" ? "Display" : "Edit",
            onClick: () => {
              if (mode == "display") setMode("edit");
              else setMode("display");
            },
          },
          {
            long: true,
            selected:
              !database.get("name") ||
              database.get("name") == "" ||
              mode == "display",
            title: "Save",
            spaced: true,
            onClick: async () => {
              setLoading(true);
              if (
                !database.get("name") ||
                database.get("name") == "" ||
                mode == "display"
              ) {
                return;
              }

              if (!database.get("data")) {
                database.set("data", [], setter);
              }
              const data = database.get("data");

              // Update all files in this group with the new groupId and individual file IDs
              for (const item of data) {
                if (item.id.startsWith("$")) {
                  item.id = await database.generateId(
                    `db-${database.get("name")}`,
                    2
                  ); // Generate new fileId
                }
              }

              await database.upload();

              setLoading(false);
              navigate(-1);
            },
          },
          {
            long: true,
            title: "Cancel",
            onClick: () => {
              navigate(-1);
            },
          },
        ]}
        text={""}
      />
      <div className="form-tab">
        <div className="ft-inputs">
          <p className="ft-label">Name:</p>
          <TextInput
            readOnly={database.get("created")}
            size={2}
            value={database.get("name")}
            onChange={(e) => {
              if (!database.get("created")) {
                database.set("name", e.target.value, setter);
              }
            }}
          />
        </div>
        <div className="ft-sheet">
          <div className="fts-line">
            <TextInput readOnly={true} size={0} value="Id" />
            <TextInput readOnly={true} size={2} value="Value" />
          </div>
          {database.get("data").map((item: any, index: number) => {
            return (
              <div className="fts-line">
                <TextInput readOnly={true} size={0} value={item.id} />
                <TextInput
                  readOnly={mode == "display"}
                  size={2}
                  value={item.value}
                  onChange={(e) => {
                    // Find the index of the file with the matching ID
                    const index = database
                      .get("data")
                      .findIndex((fileIn: any) => fileIn.id === item.id);

                    if (index !== -1) {
                      // Update the description of the matched file
                      const updatedData = [...database.get("data")]; // Clone the array to avoid mutation
                      updatedData[index].value = e.target.value;

                      // Set the updated files back into the database
                      database.set("data", updatedData, setter);
                    }
                  }}
                />
                {mode == "display" ? (
                  <></>
                ) : (
                  <SheetButton
                    src={trash}
                    onClick={() => {
                      const updatedData = [...database.get("data")].filter(
                        (_, i) => {
                          return i !== index;
                        }
                      );

                      database.set("data", updatedData, setter);
                    }}
                  />
                )}
              </div>
            );
          })}
          {mode == "display" ? (
            <></>
          ) : (
            <TextButton
              title="add Item"
              onClick={() => {
                const updatedData = [...database.get("data")];
                updatedData.push({
                  id: `$${Date.now()}`,
                  value: "",
                });
                database.set("data", updatedData, setter);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
