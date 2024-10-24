import { useState } from "react";
import { TextInput } from "../../../components/text-input/text-input";
import { LocalHeader } from "../../../components/local-header/local-header";
import { SheetButton } from "../../../components/sheet-button/sheet-button";
import { trash } from "../../../_global";
import { TextButton } from "../../../components/text-button/text-button";
import { Database } from "../../../system/classes/database";

export function DatabaseForm() {
  const [database, setter] = useState(new Database());

  const handleAdd = async () => {
    const newId = await database.generateId();
    database.set(
      "data",
      {
        ...database.get("data"),
        [newId]: "",
      },
      setter
    );
  };

  const handleDelete = (id: string) => {
    const updatedData = { ...database.get("data") };
    delete updatedData[id];
    database.set("data", updatedData, setter);
  };

  const handleChange = (id: string, value: string) => {
    database.set("data", { ...database.get("data"), [id]: value }, setter);
  };

  return (
    <div className="page">
      <LocalHeader
        buttons={[{ title: "Save", onClick: () => database.upload() }]}
        text={""}
      />
      <div className="form-tab">
        <div className="ft-inputs">
          <p className="ft-label">Database Name:</p>
          <TextInput
            size={2}
            onChange={(e) => {
              database.set("name", e.target.value, setter);
            }}
          />
        </div>

        <div className="ft-sheet">
          <div className="fts-line">
            <TextInput readOnly={true} size={0} value="Id" />
            <TextInput readOnly={true} size={2} value="Value" />
          </div>

          {database.get("data") ? (
            Object.entries(database.get("data")).map(([id, value]: any) => (
              <div className="fts-line" key={id}>
                <TextInput readOnly={true} size={0} value={id} />
                <TextInput
                  size={2}
                  value={value}
                  onChange={(e) => handleChange(id, e.target.value)}
                />
                <SheetButton src={trash} onClick={() => handleDelete(id)} />
              </div>
            ))
          ) : (
            <></>
          )}
          <div className="fts-line">
            <TextButton
              onClick={() => {
                if (database.get("name") !== undefined || "") handleAdd();
              }}
              title="add line"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
