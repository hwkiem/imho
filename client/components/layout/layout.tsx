import React from "react";
import { Wrapper, WrapperVariant } from "./wrapper";
import { NavBar } from "../section/navbar";

interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
