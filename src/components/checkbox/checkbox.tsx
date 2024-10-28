import "./checkbox.css";

type CheckboxType = {
  selected?: boolean;
  title: string;
  inactive?: boolean;
  onClick: () => void;
};

export function CheckBox({
  selected = false,
  inactive = false,
  title,
  onClick,
}: CheckboxType) {
  return (
    <div className="checkbox" onClick={onClick}>
      <div className="checkbox-checker">
        <div className={`cc-dot ${selected ? "selected" : ""}`}></div>
      </div>
      <p className="checkbox-title">{title}</p>
    </div>
  );
}
