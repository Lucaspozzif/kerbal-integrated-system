import { useState } from "react";
import { LocalHeader } from "../../../components/local-header/local-header";
import { TextInput } from "../../../components/text-input/text-input";
import { IconButton } from "../../../components/icon-button/icon-button";
import { printIcon, importIcon, exportIcon } from "../../../_global";
import { Document } from "../../../system/classes/document";

export function DocsForm() {
  const [tab, setTab] = useState("basic-data");
  const [document, setter] = useState(new Document());

  console.log(document);

  const tabHandler = () => {
    switch (tab) {
      case "basic-data":
        return (
          <div className="form-tab">
            <div className="ft-inputs">
              <p className="ft-label">Id:</p>
              <TextInput readOnly={true} size={0} value={document.get("id")} />
              <p className="ft-label">Name:</p>
              <TextInput
                size={2}
                value={document.get("name")}
                onChange={(e) => document.set("name", e.target.value, setter)}
              />

              <p className="ft-label">Long:</p>
              <TextInput
                size={3}
                value={document.get("long")}
                onChange={(e) => document.set("long", e.target.value, setter)}
              />

              <p className="ft-label">Type:</p>
              <TextInput
                readOnly={true}
                size={2}
                value={document.get("type")}
              />

              <p className="ft-label">Status:</p>
              <TextInput
                readOnly={true}
                size={2}
                value={document.get("status")}
              />
            </div>
          </div>
        );
      case "files":
        return (
          <div className="form-tab">
            <div className="ft-sheet">
              <div className="fts-line">
                <TextInput readOnly={true} size={1} value="Dock. Port" />
                <TextInput readOnly={true} size={0} value="Units" />
                <TextInput readOnly={true} size={0} value="Using" />
              </div>
              <div className="fts-line">
                <TextInput readOnly={true} size={1} value="Dock. Port" />
                <TextInput size={0} />
                <TextInput size={0} />
              </div>
            </div>
          </div>
        );
      default:
        return <div className="tab"></div>;
    }
  };

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
            selected: tab == "files",
            title: "Files",
            onClick: () => setTab("files"),
          },
          {
            long: true,
            selected: tab == "",
            spaced: true,
            title: "Display",
            onClick: () => {},
          },
          {
            long: true,
            selected: tab == "",
            title: "Unsaved",
            onClick: () => {},
          },
        ]}
        text={""}
      />
      {tabHandler()}
    </div>
  );
}
