import { useEffect, useState } from "react";
import { LocalHeader } from "../../../components/local-header/local-header";
import { TextInput } from "../../../components/text-input/text-input";
import { exportIcon, edit, importIcon } from "../../../_global";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  const [tempFiles, setTempFiles] = useState<any>({});

  const { id } = useParams();
  const location: any = useLocation();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setMode(location.pathname.split("/")[2]);
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
                        setSelectedGroup(file.groupId);
                        setfileMode(mode);
                      }}
                    >
                      <TextInput readOnly={true} size={0} value={file.groupId} />
                      <TextInput readOnly={true} size={2} value={file.name} />
                      <TextInput readOnly={true} size={0} value={file.version} />
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
                      name: "",
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
        const files: any[] = document.get("files").filter((file: any) => file.groupId === selectedGroup);
        const lastVersion: string = [...files]
          .sort((a: { version: string }, b: { version: string }) => parseInt(a.version) - parseInt(b.version))
          .pop()
          .version.toString()
          .padStart(2, "0");

        return (
          <div className='form-tab'>
            <div className='ft-inputs'>
              <p className='ft-label'>Last Version:</p>
              <TextInput readOnly={true} size={0} value={lastVersion} />

              <p className='ft-label'>Name:</p>
              <TextInput
                readOnly={!selectedGroup.startsWith(`$`) || fileMode == "display"}
                size={2}
                value={files[0]?.name}
                onChange={(e) => {
                  const updatedFiles = document.get("files").map((file: any) => {
                    if (file.groupId.startsWith("$")) file.name = e.target.value;
                    return file;
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
                    <TextInput readOnly={true} size={0} value={file.version} />
                    <TextInput readOnly={true} size={2} value={file.uploaded} />
                    <TextInput
                      readOnly={!file.id.startsWith("$") || mode == "display"}
                      size={3}
                      value={file.description}
                      onChange={(e) => {
                        // Find the index of the file with the matching ID
                        const index = document.get("files").findIndex((fileIn: any) => fileIn.id === file.id);

                        if (index !== -1) {
                          // Update the description of the matched file
                          const updatedFiles = [...document.get("files")]; // Clone the array to avoid mutation
                          updatedFiles[index].description = e.target.value;

                          // Set the updated files back into the document
                          document.set("files", updatedFiles, setter);
                        }
                      }}
                    />
                    {file.id.startsWith("$") ? (
                      <input
                        className='sheet-button'
                        src={importIcon}
                        type='file'
                        onChange={(e) => {
                          const doc = e.target.files[0];
                          setTempFiles((prevFiles: any) => ({ ...prevFiles, [file.id]: doc }));
                        }}
                      />
                    ) : (
                      <SheetButton
                        src={exportIcon}
                        onClick={() => {
                          document.downloadFile(file.id);
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
                      id: `$${Date.now()}`,
                      groupId: selectedGroup,
                      name: files[0].name,
                      description: "",
                      version: (parseInt(lastVersion) + 1).toString().padStart(2, "0"),
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
              if (!document.get("files")) {
                document.set("files", [], setter);
              }

              // Group files by their current groupId
              const groupedFiles = new Map<string, any[]>();

              document.get("files").forEach((file: any) => {
                if (!groupedFiles.has(file.groupId)) {
                  groupedFiles.set(file.groupId, []);
                }
                groupedFiles.get(file.groupId)!.push(file);
              });

              // Iterate over each group and generate a new groupId only once per group
              for (const [groupId, files] of groupedFiles.entries()) {
                let newGroupId = groupId;

                // If the groupId starts with '$', generate a new one
                if (groupId.startsWith("$")) {
                  newGroupId = await document.generateId("groups", 4); // Generate new groupId
                }

                // Update all files in this group with the new groupId and individual file IDs
                for (const file of files) {
                  if (file.id.startsWith("$")) {
                    const oldId = file.id;
                    file.id = await document.generateId("files", 4); // Generate new fileId
                    await document.uploadFile(file.id, tempFiles[oldId]);
                  }
                  file.groupId = newGroupId; // Assign the new groupId
                  file.uploaded = Date.now(); // Set upload timestamp
                }
              }

              // Upload the document if needed
              if (!document.get("id")) {
                document.set("id", await document.generateId("documents", 4));
              }
              await document.upload();

              setLoading(false);
              navigate(-1);
            },
          },
        ]}
        text={""}
      />
      {loading ? <Loading /> : tabHandler()}
    </div>
  );
}
