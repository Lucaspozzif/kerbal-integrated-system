import { useState } from "react";
import { TextInput } from "../../../components/text-input/text-input";
import { LocalHeader } from "../../../components/local-header/local-header";
import { SheetButton } from "../../../components/sheet-button/sheet-button";
import { trash } from "../../../_global";
import { TextButton } from "../../../components/text-button/text-button";

export function DatabaseForm() {
  const [data, setData] = useState<{ [key: string]: string }>({
    "0001": "Teste",
    "0002": "rte",
  });

  const getNextId = () => {
    const keys = Object.keys(data);
    const maxId = keys.length ? Math.max(...keys.map((key) => parseInt(key))) : 0;
    return (maxId + 1).toString().padStart(4, "0");
  };

  const handleAdd = () => {
    const newId = getNextId();
    setData({
      ...data,
      [newId]: "",
    });
  };

  const handleDelete = (id: string) => {
    const newData = { ...data };
    delete newData[id];
    setData(newData);
  };

  const handleChange = (id: string, value: string) => {
    setData({
      ...data,
      [id]: value,
    });
  };

  return (
    <div className='page'>
      <LocalHeader buttons={[]} text={""} />
      <div className='form-tab'>
        <div className='ft-inputs'>
          <p className='ft-label'>Database Name:</p>
          <TextInput size={2} />
        </div>

        <div className='ft-sheet'>
          <div className='fts-line'>
            <TextInput readOnly={true} size={0} value='Id' />
            <TextInput readOnly={true} size={2} value='Value' />
          </div>

          {Object.entries(data).map(([id, value]) => (
            <div className='fts-line' key={id}>
              <TextInput readOnly={true} size={0} value={id} />
              <TextInput size={2} value={value} onChange={(e) => handleChange(id, e.target.value)} />
              <SheetButton src={trash} onClick={() => handleDelete(id)} />
            </div>
          ))}
          <div className='fts-line'>
            <TextButton onClick={handleAdd} title='add line' />
          </div>
        </div>
      </div>
    </div>
  );
}
