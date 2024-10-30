import { useNavigate } from "react-router-dom";
import { LocalHeader } from "../../components/local-header/local-header";
import { CelestialBody as Cb } from "../../system/classes/celestial-body";
import { useEffect, useState } from "react";
import { TextInput } from "../../components/text-input/text-input";
import { TextButton } from "../../components/text-button/text-button";

export function CelestialBody() {
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [celestialBody, setter] = useState(new Cb());
  const [tab, setTab] = useState(0);
  const [popup, setPopup] = useState("none");

  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [safetyText, setSafetyText] = useState("");

  const selectedId = celestialBody.get("id");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      if (list.length < 1) {
        setList(await celestialBody.downloadInterval(tab * 3, tab * 3 + 3));
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
            className="blur"
            onClick={() => {
              setPopup("none");
            }}
          >
            <div
              className="popup"
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
                      const searchResults = await celestialBody.downloadSearch(
                        search
                      );
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
                text={`Selected: ${celestialBody.get("name") || "none"}`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="ft-sheet">
                <div className="fts-line">
                  <TextInput readOnly={true} size={0} value="Id" />
                  <TextInput readOnly={true} size={2} value="Name" />
                  <TextInput readOnly={true} size={1} value="Uploaded On" />
                  <TextInput readOnly={true} size={0} value="Biomes" />
                </div>
                {results.map((file: Cb) => {
                  const date = new Date(file.get("created"));

                  // Get day, month, and year
                  const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
                  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
                  const year = date.getFullYear();
                  return (
                    <div
                      className="fts-line"
                      onClick={() => {
                        if (file.get("id") == celestialBody.get("id")) {
                          setter(new Cb());
                        } else {
                          setter(file);
                        }
                      }}
                    >
                      <TextInput
                        selected={file.get("id") == celestialBody.get("id")}
                        readOnly={true}
                        size={0}
                        value={file.get("id")}
                      />
                      <TextInput
                        selected={file.get("id") == celestialBody.get("id")}
                        readOnly={true}
                        size={2}
                        value={file.get("name")}
                      />
                      <TextInput
                        selected={file.get("id") == celestialBody.get("id")}
                        readOnly={true}
                        size={1}
                        value={`${day}-${month}-${year}`}
                      />
                      <TextInput
                        selected={file.get("id") == celestialBody.get("id")}
                        readOnly={true}
                        size={0}
                        value={file.get("biomes").length}
                      />
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
            className="blur"
            onClick={() => {
              setPopup("none");
              setSafetyText("");
            }}
          >
            <div
              className="popup"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="textbox">
                <p className="text">
                  Are you sure you want to delete this Document?
                </p>
                <p className="text">This action is PERMANENT!</p>
              </div>
              <div className="ft-sheet">
                <div className="fts-line">
                  <TextInput readOnly={true} size={2} value="Name" />
                  <TextInput readOnly={true} size={1} value="Uploaded On" />
                </div>
                {[""].map(() => {
                  const date = new Date(celestialBody.get("created"));

                  // Get day, month, and year
                  const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
                  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
                  const year = date.getFullYear();
                  return (
                    <div className="fts-line">
                      <TextInput
                        readOnly={true}
                        size={0}
                        value={celestialBody.get("id")}
                      />
                      <TextInput
                        readOnly={true}
                        size={2}
                        value={celestialBody.get("name")}
                      />
                      <TextInput
                        readOnly={true}
                        size={1}
                        value={`${day}-${month}-${year}`}
                      />
                      <TextInput
                        readOnly={true}
                        size={0}
                        value={celestialBody.get("biomes").length}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex-textbox">
                <p className="ft-label">Type The celestial body name:</p>
                <TextInput
                  size={2}
                  value={safetyText}
                  onChange={(e) => {
                    setSafetyText(e.target.value);
                  }}
                />
              </div>
              <div className="textbox">
                <TextButton
                  title="Delete"
                  selected={safetyText != celestialBody.get("name")}
                  onClick={async () => {
                    if (safetyText == celestialBody.get("name")) {
                      setLoading(true);
                      await celestialBody.delete();
                      setPopup("none");
                      setter(new Cb());
                      setList(
                        await celestialBody.downloadInterval(
                          tab * 3,
                          tab * 3 + 3
                        )
                      );
                      setSafetyText("");
                      setLoading(false);
                    }
                  }}
                />
              </div>
              <div className="exit-button">
                <TextButton
                  title="Cancel"
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
    <div className="page">
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
        text={`Interval: Today - ${tab * 3 + 3} Months ago | Selected: ${
          celestialBody.get("name") || "none"
        }`}
      />
      <div className="ft-sheet">
        <div className="fts-line">
          <TextInput readOnly={true} size={0} value="Id" />
          <TextInput readOnly={true} size={2} value="Name" />
          <TextInput readOnly={true} size={1} value="Uploaded On" />
          <TextInput readOnly={true} size={0} value="Biomes" />
        </div>
        {list.map((file: Cb) => {
          const date = new Date(file.get("created"));

          // Get day, month, and year
          const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
          const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
          const year = date.getFullYear();
          return (
            <div
              className="fts-line"
              onClick={() => {
                if (file.get("name") == celestialBody.get("name")) {
                  setter(new Cb());
                } else {
                  setter(file);
                }
                console.log(file, celestialBody);
              }}
            >
              <TextInput
                selected={file.get("id") == celestialBody.get("id")}
                readOnly={true}
                size={0}
                value={file.get("id")}
              />
              <TextInput
                selected={file.get("id") == celestialBody.get("id")}
                readOnly={true}
                size={2}
                value={file.get("name")}
              />
              <TextInput
                selected={file.get("id") == celestialBody.get("id")}
                readOnly={true}
                size={1}
                value={`${day}-${month}-${year}`}
              />
              <TextInput
                selected={file.get("id") == celestialBody.get("id")}
                readOnly={true}
                size={0}
                value={file.get("biomes").length}
              />
            </div>
          );
        })}
        <TextButton
          title="load"
          onClick={async () => {
            setLoading(true);
            setTab(tab + 1);
            setList(await celestialBody.downloadInterval(0, tab * 3 + 3));

            setLoading(false);
          }}
        />
      </div>
    </div>
  );
}
