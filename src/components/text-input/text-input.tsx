import "./text-input.css";

type TextInputType = {
  readOnly?: boolean;
  selected?: boolean;
  size: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function TextInput({ readOnly = false, selected = false, size, value, onChange }: TextInputType) {
  return <input className={`text-input ${selected ? "selected" : ""} ${readOnly ? "" : "editable"} size${size}`} type='text' value={value} readOnly={readOnly} onChange={onChange} />;
}
