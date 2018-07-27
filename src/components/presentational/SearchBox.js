import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import "typeface-roboto";

const Input = styled.input`
  width: 100%;
  background: #2b2b2b;
  border: 1px solid #444;
  outline: none;
  color: white;
  font-family: Roboto;
  font-size: 12px;
  padding: 8px;
  box-sizing: border-box;
`;

const SearchBox = ({ className, value, onChange }) => (
  <Input className={className} value={value} onChange={onChange} />
);

SearchBox.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default SearchBox;
