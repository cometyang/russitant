import React, { CSSProperties, ReactNode, forwardRef } from "react";
import "../tailwind.css";

type MainProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const Main = forwardRef<HTMLDivElement, MainProps>((props, ref) => {
  return (
    <div ref={ ref } className={ props.className } style={ props.style }>
      { props.children }
    </div>
  );
});

export default Main;