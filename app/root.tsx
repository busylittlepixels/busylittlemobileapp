import { ReactNode } from "react";

import { DefaultRootProps } from "@measured/puck";
// import { Footer } from "./components/Footer";
// import { Header } from "./components/Header";

export type RootProps = {
  children: ReactNode;
  title: string;
} & DefaultRootProps;

function Root({ children, editMode }: RootProps) {
  return (
    <>
     
      {children}
    
    </>
  );
}

export default Root;