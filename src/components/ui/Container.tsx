import { PropsWithChildren } from "react";

function Container({ children }: PropsWithChildren) {
  return <div className="mx-auto w-full max-w-7xl">{children}</div>;
}

export default Container;
