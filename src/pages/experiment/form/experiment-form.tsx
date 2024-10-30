import { useEffect, useState } from "react";
import { Experiment } from "../../../system/classes/experiment";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LocalHeader } from "../../../components/local-header/local-header";
import { Loading } from "../../../components/loading/loading";
import { TextInput } from "../../../components/text-input/text-input";
import { CheckBox } from "../../../components/checkbox/checkbox";

export function ExperimentForm() {
  const [loading, setLoading] = useState(false);
  const [experiment, setter] = useState(new Experiment());
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
        experiment.set("id", id, setter);
        await experiment.download();
        setter(experiment);
      }
      setLoading(false);
    };

    fetch();
  }, []);

  const tabHandler = () => {
    switch (tab) {
      case "basic-data":
        return (
          <div className='form-tab'>
            <div className='ft-inputs'>
              <p className='ft-label'>Id:</p>
              <TextInput readOnly={true} size={0} value={experiment.get("id")} />

              <p className='ft-label'>Name:</p>
              <TextInput readOnly={mode == "display"} size={2} value={experiment.get("name")} onChange={(e) => experiment.set("name", e.target.value, setter)} />
            </div>
            <div className='checkbox-list'>
              <p className='title'>Can the experiment run on multiple biomes?</p>
              <CheckBox
                selected={experiment.get("landed")}
                title='Landed'
                onClick={() => {
                  experiment.set("landed", !experiment.get("landed"), setter);
                }}
              />
              <CheckBox
                selected={experiment.get("splashed")}
                title='Splashed'
                onClick={() => {
                  experiment.set("splashed", !experiment.get("splashed"), setter);
                }}
              />
              <CheckBox
                selected={experiment.get("flyingLow")}
                title='Flying Low'
                onClick={() => {
                  experiment.set("flyingLow", !experiment.get("flyingLow"), setter);
                }}
              />
              <CheckBox
                selected={experiment.get("flyingHigh")}
                title='Flying High'
                onClick={() => {
                  experiment.set("flyingHigh", !experiment.get("flyingHigh"), setter);
                }}
              />
              <CheckBox
                selected={experiment.get("spaceLow")}
                title='Space Low'
                onClick={() => {
                  experiment.set("spaceLow", !experiment.get("spaceLow"), setter);
                }}
              />
              <CheckBox
                selected={experiment.get("spaceHigh")}
                title='Space High'
                onClick={() => {
                  experiment.set("spaceHigh", !experiment.get("spaceHigh"), setter);
                }}
              />
            </div>
          </div>
        );
      case "register":
        return <div className='form-tab'>
          
        </div>;

      default:
        break;
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
            selected: tab == "register",
            title: "Register",
            onClick: () => setTab("register"),
          },
          {
            long: true,
            selected: mode == "display",
            title: "Save",
            spaced: true,
            onClick: async () => {},
          },
          {
            long: true,
            spaced: true,
            title: "Cancel",
            onClick: () => {
              navigate(-1);
            },
          },
        ]}
        text=''
      />
      {loading ? <Loading /> : tabHandler()}
    </div>
  );
}
