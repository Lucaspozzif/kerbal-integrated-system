import { useEffect, useState } from "react";
import { TextInput } from "../../../components/text-input/text-input";
import { CelestialBody as CB } from "../../../system/classes/celestial-body";
import { SheetButton } from "../../../components/sheet-button/sheet-button";
import { trash } from "../../../_global";
import { TextButton } from "../../../components/text-button/text-button";
import { LocalHeader } from "../../../components/local-header/local-header";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckBox } from "../../../components/checkbox/checkbox";

export function CelestialBodyForm() {
  const [loading, setLoading] = useState(false);
  const [celestialBody, setter] = useState(new CB());
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
        celestialBody.set("id", id, setter);
        await celestialBody.download();
        setter(celestialBody);
      }
      setLoading(false);
    };

    fetch();
  }, []);

  if (!celestialBody.get("biomes")) {
    celestialBody.set("biomes", [], setter);
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
              !celestialBody.get("name") ||
              celestialBody.get("name") == "" ||
              mode == "display",
            title: "Save",
            spaced: true,
            onClick: async () => {
              setLoading(true);
              if (
                !celestialBody.get("name") ||
                celestialBody.get("name") == "" ||
                mode == "display"
              )
                return;

              if (!celestialBody.get("biomes")) {
                celestialBody.set("biomes", [], setter);
              }
              const biomes = celestialBody.get("biomes");

              for (const item of biomes) {
                if (item.id.startsWith("$")) {
                  item.id = await celestialBody.generateId(
                    `${celestialBody.get("name")}`,
                    2
                  ); // Generate new fileId
                }
              }
              if (!celestialBody.get("id")) {
                celestialBody.set(
                  "id",
                  await celestialBody.generateId("celestial-bodies", 4)
                );
              }
              await celestialBody.upload();

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
          <p className="ft-label">Id:</p>
          <TextInput readOnly={true} size={1} value={celestialBody.get("id")} />

          <p className="ft-label">Name:</p>
          <TextInput
            readOnly={mode == "display"}
            size={1}
            value={celestialBody.get("name")}
            onChange={(e) => {
              celestialBody.set("name", e.target.value, setter);
            }}
          />
          <div></div>
          <div className="gap-div">
            <CheckBox
              title="Has Land"
              selected={celestialBody.get("hasLand")}
              onClick={() =>
                celestialBody.set(
                  "hasLand",
                  !celestialBody.get("hasLand"),
                  setter
                )
              }
            />
            <CheckBox
              title="Has Atmosphere"
              selected={celestialBody.get("hasAtmosphere")}
              onClick={() =>
                celestialBody.set(
                  "hasAtmosphere",
                  !celestialBody.get("hasAtmosphere"),
                  setter
                )
              }
            />
          </div>
        </div>
        <div className="ft-sheet">
          <div className="fts-line">
            <TextInput readOnly={true} size={0} value="Id" />
            <TextInput readOnly={true} size={2} value="Biomes" />
          </div>
          {celestialBody.get("biomes").map((biome: any, index: number) => {
            return (
              <div className="fts-line">
                <TextInput readOnly={true} size={0} value={biome.id} />
                <TextInput
                  readOnly={mode == "display"}
                  size={2}
                  value={biome.name}
                  onChange={(e) => {
                    // Find the index of the file with the matching ID
                    const index = celestialBody
                      .get("biomes")
                      .findIndex((fileIn: any) => fileIn.id === biome.id);

                    if (index !== -1) {
                      // Update the description of the matched file
                      const updatedData = [...celestialBody.get("biomes")]; // Clone the array to avoid mutation
                      updatedData[index].name = e.target.value;

                      // Set the updated files back into the celestialBody
                      celestialBody.set("biomes", updatedData, setter);
                    }
                  }}
                />
                {mode == "display" ? (
                  <></>
                ) : (
                  <SheetButton
                    src={trash}
                    onClick={() => {
                      const updatedData = [
                        ...celestialBody.get("biomes"),
                      ].filter((_, i) => {
                        return i !== index;
                      });

                      celestialBody.set("biomes", updatedData, setter);
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
                const updatedData = [...celestialBody.get("biomes")];
                updatedData.push({
                  id: `$${Date.now()}`,
                  value: "",
                });
                celestialBody.set("biomes", updatedData, setter);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
