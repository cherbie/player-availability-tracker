import React from "react";
import Container from "react-bootstrap/Container";

export default props => {
  return <Container className="pb-5 pt-2">{props.children}</Container>;
};