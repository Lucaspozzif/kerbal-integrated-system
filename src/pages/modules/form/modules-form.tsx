import { useState } from "react";
import { LocalHeader } from "../../../components/local-header/local-header";
import { TextInput } from "../../../components/text-input/text-input";
import { IconButton } from "../../../components/icon-button/icon-button";
import { printIcon } from "../../../_global";
import { exportIcon } from "../../../_global";
import { importIcon } from "../../../_global";

export function ModulesForm() {
  const [tab, setTab] = useState("basic-data");

  const tabHandler = () => {
    switch (tab) {
      case "basic-data":
        return (
          <div className='form-tab'>
            <div className='ft-inputs'>
              <p className='ft-label'>Id:</p>
              <TextInput readOnly={true} size={0} />

              <p className='ft-label'>Name:</p>
              <TextInput size={2} />

              <p className='ft-label'>Alias:</p>
              <TextInput size={2} />

              <p className='ft-label'>Long:</p>
              <TextInput size={3} />

              <p className='ft-label'>Type:</p>
              <TextInput readOnly={true} size={2} />

              <p className='ft-label'>Status:</p>
              <TextInput readOnly={true} size={2} />
            </div>
          </div>
        );
      case "measures":
        return (
          <div className='form-tab'>
            <div className='ft-inputs'>
              <p className='ft-label'>Mass:</p>
              <TextInput size={1} />

              <p className='ft-label'>Height:</p>
              <TextInput size={1} />

              <p className='ft-label'>Width:</p>
              <TextInput size={1} />

              <p className='ft-label'>Depth:</p>
              <TextInput size={1} />
            </div>
          </div>
        );
      case "operations":
        return (
          <div className='form-tab'>
            <div className='ft-inputs'>
              <p className='ft-label'>Crew capacity:</p>
              <TextInput size={0} />

              <p className='ft-label'>Comm. Range:</p>
              <TextInput size={0} />

              <p className='ft-label'>Life Sup.:</p>
              <TextInput size={0} />
            </div>
            <div className='ft-sheet'>
              <div className='fts-line'>
                <TextInput readOnly={true} size={1} value='Dock. Port' />
                <TextInput readOnly={true} size={0} value='Units' />
                <TextInput readOnly={true} size={0} value='Using' />
              </div>
              <div className='fts-line'>
                <TextInput readOnly={true} size={1} value='Dock. Port' />
                <TextInput size={0} />
                <TextInput size={0} />
              </div>
            </div>
          </div>
        );
      case "finances":
        return (
          <div className='form-tab'>
            <div className='ft-sheet'>
              <div className='fts-line'>
                <TextInput readOnly={true} size={0} value='TypeId' />
                <TextInput readOnly={true} size={1} value='Type' />
                <TextInput readOnly={true} size={1} value='Value' />
              </div>
              <div className='fts-line'>
                <TextInput size={0} />
                <TextInput readOnly={true} size={1} />
                <TextInput size={1} />
              </div>
            </div>
          </div>
        );
      case "advanced":
        return (
          <div className='form-tab'>
            <div className='ft-button-list'>
              <IconButton title='Print' src={printIcon} onClick={() => {}} />
              <IconButton title='Export' src={exportIcon} onClick={() => {}} />
              <IconButton title='Import' src={importIcon} onClick={() => {}} />
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
          { long: true, selected: tab == "basic-data", title: "Basic Data", onClick: () => setTab("basic-data") },
          { long: true, selected: tab == "measures", title: "Measures", onClick: () => setTab("measures") },
          { long: true, selected: tab == "operations", title: "Operations", onClick: () => setTab("operations") },
          { long: true, selected: tab == "finances", title: "Finances", onClick: () => setTab("finances") },
          { long: true, selected: tab == "advanced", spaced: true, title: "Advanced", onClick: () => setTab("advanced") },
          { long: true, selected: tab == "", spaced: true, title: "Display", onClick: () => {} },
          { long: true, selected: tab == "", title: "Unsaved", onClick: () => {} },
        ]}
        text={""}
      />
      {tabHandler()}
    </div>
  );
}
