import "./icon-button.css";

type IconButtonType = {
  reversed?: boolean;
  selected?: boolean;
  title: string;
  src: string;
  onClick: () => void;
};

export function IconButton({ reversed = false, selected = false, title, src, onClick }: IconButtonType) {
  return (
    <div className={`icon-button ${selected ? "selected" : ""}`} onClick={onClick}>
      <img className={`ib-image ${reversed ? "reversed" : ""}`} src={src} />
      <p className='ib-title'>{title}</p>
    </div>
  );
}
