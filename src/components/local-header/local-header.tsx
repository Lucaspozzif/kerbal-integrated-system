import "./local-header.css";

import { LocationBar } from "../location-bar/location-bar";
import { TextButton, TextButtonType } from "../text-button/text-button";
import { useLocation } from "react-router-dom";

type LocalHeaderType = {
  buttons: TextButtonType[];
  text: string;
};

export function LocalHeader({ buttons, text }: LocalHeaderType) {
  const location = useLocation();

  return (
    <div className='local-header'>
      <LocationBar value={location.pathname} />
      <div className='lh-button-bar'>
        {buttons.map((button) => {
          return <TextButton spaced={button.spaced} selected={button.selected} long={button.long} title={button.title} onClick={button.onClick} />;
        })}
        <p className='lh-text'>{text}</p>
      </div>
    </div>
  );
}
