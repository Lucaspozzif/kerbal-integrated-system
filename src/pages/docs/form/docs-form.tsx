import { useEffect, useState, version } from "react";
import { LocalHeader } from "../../../components/local-header/local-header";
import { TextInput } from "../../../components/text-input/text-input";
import { exportIcon, edit, importIcon } from "../../../_global";
import { useLocation, useParams } from "react-router-dom";
import { SheetButton } from "../../../components/sheet-button/sheet-button";
import { TextButton } from "../../../components/text-button/text-button";
import { Loading } from "../../../components/loading/loading";
import { Document } from "../../../system/classes/document";

export function DocsForm() {
  const [loading, setLoading] = useState(false);
  const [document, setter] = useState(new Document());
  const [tab, setTab] = useState("basic-data");

  const [mode, setMode] = useState("display");
  const [fileMode, setfileMode] = useState("display");

  const [selectedGroup, setSelectedGroup] = useState("");

  const { id } = useParams();
  const location: any = useLocation();
  const navigate = useNavigate();

  const tempFiles = [];

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setMode(location.pathname.split("/")[1]);
      if (id) {
        document.set("id", id, setter);
        await document.download();
        setter(document);
      }
      setLoading(false);
    };

    fetch();
  }, []);

  const tabHandler = () => {
    const lastVersions = document.lastVersionIds();

    switch (tab) {
      case "basic-data":
        return (
          <div className='form-tab'>
            <div className='ft-inputs'>
              <p className='ft-label'>Id:</p>
              <TextInput readOnly={true} size={0} value={document.get("id")} />

              <p className='ft-label'>Name:</p>
              <TextInput readOnly={mode == "display"} size={2} value={document.get("name")} onChange={(e) => document.set("name", e.target.value, setter)} />

              <p className='ft-label'>Long:</p>
              <TextInput readOnly={mode == "display"} size={3} value={document.get("long")} onChange={(e) => document.set("long", e.target.value, setter)} />
            </div>
          </div>
        );

      case "files":
        if (!document.get("files")) {
          document.set("files", [], setter);
        }
        return (
          <div className='form-tab'>
            <div className='ft-sheet'>
              <div className='fts-line'>
                <TextInput readOnly={true} size={0} value='Id' />
                <TextInput readOnly={true} size={2} value='Name' />
                <TextInput readOnly={true} size={0} value='Ver' />
                <TextInput readOnly={true} size={2} value='Uploaded On' />
                <TextInput readOnly={true} size={3} value='Description' />
              </div>
              {document.get("files").map((file: any) => {
                return (
                  <div className='fts-line'>
                    <div
                      className='fts-line'
                      onClick={() => {
                        setTab("file-form");
                        setSelectedGroup(file.name);
                        setfileMode("display");
                      }}
                    >
                      <TextInput readOnly={true} size={0} value={file.id} />
                      <TextInput readOnly={true} size={2} value={file.name} />
                      <TextInput readOnly={true} size={0} value={file.ver} />
                      <TextInput readOnly={true} size={2} value={file.uploaded} />
                      <TextInput readOnly={true} size={3} value={file.description} />
                    </div>
                    <SheetButton
                      src={exportIcon}
                      onClick={async () => {
                        setLoading(true);
                        await document.downloadFile(file.id);
                        setLoading(false);
                      }}
                    />
                    {mode != "display" && lastVersions.includes(file.id) ? (
                      <SheetButton
                        src={edit}
                        onClick={() => {
                          setTab("file-form");
                          setSelectedGroup(file.groupId);
                          setfileMode("edit");
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                );
              })}
              {mode != "display" ? (
                <TextButton
                  title='add File'
                  onClick={() => {
                    const tempGroup = `$${Date.now()}`;
                    setTab("file-form");
                    setSelectedGroup(tempGroup);
                    setfileMode("edit");
                    const updatedFiles = document.get("files");
                    updatedFiles.push({
                      id: `$${Date.now()}`,
                      groupId: tempGroup,
                      name: selectedGroup,
                      description: "",
                      version: "00",
                      uploaded: `${Date.now()}`,
                    });

                    document.set("files", updatedFiles, setter);
                  }}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        );

      case "file-form":
        const files: any[] = document.get("files").filter((file: any) => file.group == selectedGroup);
        const lastVersion: string = files
          .reduce((max: any, file: any) => (parseInt(file.version) > parseInt(max.version) ? file : max), files[0])
          .toString()
          .startPad(2, "0");

        return (
          <div className='form-tab'>
            <div className='ft-inputs'>
              <p className='ft-label'>Last Version:</p>
              <TextInput readOnly={true} size={0} value={lastVersion} />

              <p className='ft-label'>Name:</p>
              <TextInput
                readOnly={selectedGroup != "" || !selectedGroup.startsWith("$")}
                size={2}
                value={files[0]?.name}
                onChange={(e) => {
                  const updatedFiles = document.get("files").forEach((file: any) => {
                    if (file.group.startsWith("$")) file.name = e.target.value;
                  });
                  document.set("files", updatedFiles, setter);
                }}
              />
            </div>

            <div className='ft-sheet'>
              <div className='fts-line'>
                <TextInput readOnly={true} size={0} value='Id' />
                <TextInput readOnly={true} size={0} value='Ver' />
                <TextInput readOnly={true} size={2} value='Uploaded On' />
                <TextInput readOnly={true} size={3} value='Description' />
              </div>
              {files.map((file: any) => {
                return (
                  <div className='fts-line'>
                    <TextInput readOnly={true} size={0} value={file.id} />
                    <TextInput readOnly={true} size={0} value={file.ver} />
                    <TextInput readOnly={true} size={2} value={file.uploaded} />
                    <TextInput
                      readOnly={!file.id.startsWith("$") || mode == "display"}
                      size={3}
                      value={file.description}
                      onChange={(e) => {
                        const updatedFiles = document.get("files").forEach((file: any) => {
                          if (file.id.startsWith("$")) file.description = e.target.value;
                        });
                        document.set("files", updatedFiles, setter);
                      }}
                    />
                    {file.id.startsWith("$") ? (
                      <SheetButton
                        src={importIcon}
                        onClick={() => {
                          document.importFile(/**Placeholder */ "");
                        }}
                      />
                    ) : (
                      <SheetButton
                        src={exportIcon}
                        onClick={() => {
                          document.exportFile(/**Placeholder */ "");
                        }}
                      />
                    )}
                  </div>
                );
              })}
              {fileMode != "display" ? (
                <TextButton
                  title='add File'
                  onClick={() => {
                    const updatedFiles = document.get("files");
                    updatedFiles.push({
                      id: `$${serverTimestamp()}`,
                      groupId: selectedGroup,
                      name: "",
                      description: "",
                      version: (parseInt(lastVersion) + 1).toString().padStart(2, "0"),
                      uploaded: "",
                    });
                    document.set("files", updatedFiles, setter);
                  }}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        );

      default:
        return <div className='tab'></div>;
    }
  };

  return (
    <div className='page'>
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
            title: mode != "display" ? "Display" : "Edit",
            onClick: () => {
              if (mode == "display") setMode("edit");
              else setMode("display");
            },
          },
          {
            long: true,
            selected: tab == "",
            title: "Save",
            onClick: async () => {
              setLoading(true);
              document.get("files").forEach(async (file: any) => {
                if (id.startsWith("$")) {
                  file.id = await document.generateId("files", 4);
                  file.uploaded = serverTimestamp();
                }
              });
              if (!document.get("id")) {
                document.set("id", await document.generateId("documents", 4));
                await document.upload();
              }
              setLoading(false);
            },
          },
        ]}
        text={""}
      />
      {loading ? <Loading /> : tabHandler()}
    </div>
  );
}
