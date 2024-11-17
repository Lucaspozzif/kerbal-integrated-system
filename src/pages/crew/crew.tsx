import { useNavigate } from "react-router-dom";
import { LocalHeader } from "../../components/local-header/local-header";
import { useEffect, useState } from "react";
import { Document } from "../../system/classes/document";
import { TextInput } from "../../components/text-input/text-input";
import { TextButton } from "../../components/text-button/text-button";

export function Docs() {
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [document, setter] = useState(new Document());
  const [tab, setTab] = useState(0);
  const [popup, setPopup] = useState("none");

  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [safetyText, setSafetyText] = useState("");
  
  const selectedId = document.get("id");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      if (list.length < 1) {
        setList(await document.downloadInterval(tab * 3, tab * 3 + 3));
      }
      setLoading(false);
    };
    fetch();
  });

  const popupHandler = () => {
    switch (popup) {
      case "search":
        return (
          <div
            className='blur'
            onClick={() => {
              setPopup("none");
            }}
          >
            <div
              className='popup'
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <LocalHeader
                buttons={[
                  { title: "Create", onClick: () => navigate("create") },
                  {
                    title: "Edit",
                    onClick: () => {
                      if (selectedId) {
                        navigate(`edit/${selectedId}`);
                      }
                    },
                  },
                  {
                    title: "Search",
                    onClick: async () => {
                      setSearchLoading(true);
                      const searchResults = await document.downloadSearch(search);
                      setResults(searchResults);
                      setSearchLoading(false);
                    },
                  },
                  {
                    title: "Display",
                    onClick: () => {
                      if (selectedId) {
                        navigate(`display/${selectedId}`);
                      }
                    },
                  },
                  {
                    title: "Delete",
                    onClick: () => {
                      if (selectedId) {
                        setPopup("delete");
                      }
                    },
                  },
                ]}
                text={`Selected: ${document.get("name") || "none"}`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className='ft-sheet'>
                <div className='fts-line'>
                  <TextInput readOnly={true} size={0} value='Id' />
                  <TextInput readOnly={true} size={2} value='Name' />
                  <TextInput readOnly={true} size={1} value='Uploaded On' />
                  <TextInput readOnly={true} size={3} value='Description' />
                </div>
                {results.map((file) => {
                  const date = new Date(file.created);

                  // Get day, month, and year
                  const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
                  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
                  const year = date.getFullYear();
                  return (
                    <div
                      className='fts-line'
                      onClick={() => {
                        if (file.id == document.get("id")) {
                          setter(new Document());
                        } else {
                          setter(new Document(file));
                        }
                      }}
                    >
                      <TextInput selected={file.id == document.get("id")} readOnly={true} size={0} value={file.id} />
                      <TextInput selected={file.id == document.get("id")} readOnly={true} size={2} value={file.name} />
                      <TextInput selected={file.id == document.get("id")} readOnly={true} size={1} value={`${day}-${month}-${year}`} />
                      <TextInput selected={file.id == document.get("id")} readOnly={true} size={3} value={file.long} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case "delete":
        return (
          <div
            className='blur'
            onClick={() => {
              setPopup("none");
              setSafetyText("");
            }}
          >
            <div
              className='popup'
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className='textbox'>
                <p className='text'>Are you sure you want to delete this Document?</p>
                <p className='text'>This action is PERMANENT!</p>
              </div>
              <div className='ft-sheet'>
                <div className='fts-line'>
                  <TextInput readOnly={true} size={0} value='Id' />
                  <TextInput readOnly={true} size={2} value='Name' />
                  <TextInput readOnly={true} size={1} value='Uploaded On' />
                  <TextInput readOnly={true} size={3} value='Description' />
                </div>
                {[""].map(() => {
                  const date = new Date(document.get("created"));

                  // Get day, month, and year
                  const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
                  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
                  const year = date.getFullYear();
                  return (
                    <div className='fts-line'>
                      <TextInput readOnly={true} size={0} value={document.get("id")} />
                      <TextInput readOnly={true} size={2} value={document.get("name")} />
                      <TextInput readOnly={true} size={1} value={`${day}-${month}-${year}`} />
                      <TextInput readOnly={true} size={3} value={document.get("long")} />
                    </div>
                  );
                })}
              </div>
              <div className='flex-textbox'>
                <p className='ft-label'>Type The document name:</p>
                <TextInput
                  size={2}
                  value={safetyText}
                  onChange={(e) => {
                    setSafetyText(e.target.value);
                  }}
                />
              </div>
              <div className='textbox'>
                <TextButton
                  title='Delete'
                  selected={safetyText != document.get("name")}
                  onClick={async () => {
                    if (safetyText == document.get("name")) {
                      setLoading(true);
                      await document.delete();
                      setPopup("none");
                      setter(new Document());
                      setList(await document.downloadInterval(tab * 3, tab * 3 + 3));
                      setSafetyText("");
                      setLoading(false);
                    }
                  }}
                />
              </div>
              <div className='exit-button'>
                <TextButton
                  title='Cancel'
                  onClick={() => {
                    setPopup("none");
                    setSafetyText("");
                  }}
                />
              </div>
            </div>
          </div>
        );
      default:
        return <></>;
    }
  };

  return (
    <div className='page'>
      {popupHandler()}
      <LocalHeader
        buttons={[
          { title: "Create", onClick: () => navigate("create") },
          {
            title: "Edit",
            onClick: () => {
              if (selectedId) {
                navigate(`edit/${selectedId}`);
              }
            },
          },
          {
            title: "Display",
            onClick: () => {
              if (selectedId) {
                navigate(`display/${selectedId}`);
              }
            },
          },
          { title: "Search", onClick: () => setPopup("search") },
          {
            title: "Delete",
            onClick: () => {
              if (selectedId) {
                setPopup("delete");
              }
            },
          },
        ]}
        text={`Interval: Today - ${tab * 3 + 3} Months ago | Selected: ${document.get("name") || "none"}`}
      />
      <div className='ft-sheet'>
        <div className='fts-line'>
          <TextInput readOnly={true} size={0} value='Id' />
          <TextInput readOnly={true} size={2} value='Name' />
          <TextInput readOnly={true} size={1} value='Uploaded On' />
          <TextInput readOnly={true} size={3} value='Description' />
        </div>
        {list.map((file) => {
          const date = new Date(file.created);

          // Get day, month, and year
          const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
          const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
          const year = date.getFullYear();
          return (
            <div
              className='fts-line'
              onClick={() => {
                if (file.id == document.get("id")) {
                  setter(new Document());
                } else {
                  setter(new Document(file));
                }
              }}
            >
              <TextInput selected={file.id == document.get("id")} readOnly={true} size={0} value={file.id} />
              <TextInput selected={file.id == document.get("id")} readOnly={true} size={2} value={file.name} />
              <TextInput selected={file.id == document.get("id")} readOnly={true} size={1} value={`${day}-${month}-${year}`} />
              <TextInput selected={file.id == document.get("id")} readOnly={true} size={3} value={file.long} />
            </div>
          );
        })}
        <TextButton
          title='load'
          onClick={async () => {
            setLoading(true);
            setTab(tab + 1);
            setList(await document.downloadInterval(0, tab * 3 + 3));

            setLoading(false);
          }}
        />
      </div>
    </div>
  );
}
