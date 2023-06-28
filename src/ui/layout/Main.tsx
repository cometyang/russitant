import React, { CSSProperties, ReactNode, forwardRef } from "react";
import clsx from "clsx";

type MainProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const Main = forwardRef<HTMLDivElement, MainProps>((props, ref) => {
  return (
    <div ref={ ref } className={ clsx("w-screen h-screen overflow-hidden", props.className) } style={ props.style }>
      { props.children }
    </div>
  );
});

export default Main;