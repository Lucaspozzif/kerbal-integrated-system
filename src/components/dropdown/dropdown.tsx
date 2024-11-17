import { useState } from "react";

type DropdownType = {
  callback: (id: string) => void; // Define a função callback que aceita o id do item selecionado
  items: {
    id: string;
    title: string;
  }[];
  placeholder: string;
  inactive: boolean;
};

export function Dropdown({ callback, items, placeholder, inactive }: DropdownType) {
  const [selectedId, setter] = useState("");
  const [colapsed, setColapsed] = useState(false);

  return (
    <div className='dropdown'>
      <div className='dd-title'>
        <p className='title'>{placeholder}</p>
      </div>
      <div className={`dd-lista ${colapsed ? "colapsed" : ""}`}>
        {items.map((item) => (
          <div
            key={item.id}
            className={`dd-item ${selectedId == item.id ? "selected" : ""}`}
            onClick={() => {
              setter(item.id);
              callback(item.id);
            }}
          >
            <p className='title'>{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
