import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import "typeface-roboto";

const Container = styled.div`
  width: 100%;
  height: 72px;
  padding: 0px 8px;
  box-sizing: border-box;
  background: #222;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  height: 36px;
`;

const Label = styled.label`
  font-family: Roboto;
  font-size: 12px;
  color: white;
  margin-right: 12px;
`;

export const Input = styled.input`
  outline: none;
`;

const TableOption = ({ value, onChange }) => (
  <Container>
    <Row>
      <Input
        type="checkbox"
        checked={value.id}
        onChange={event => onChange(event, "id")}
      />
      <Label>ID</Label>
      <Input
        type="checkbox"
        checked={value.rememberToken}
        onChange={event => onChange(event, "rememberToken")}
      />
      <Label>Remember Token</Label>
    </Row>
    <Row>
      <Input
        type="checkbox"
        checked={value.softDeletes}
        onChange={event => onChange(event, "softDeletes")}
      />
      <Label>Soft Deletes</Label>
      <Input
        type="checkbox"
        checked={value.timestamps}
        onChange={event => onChange(event, "timestamps")}
      />
      <Label>Timestamps</Label>
    </Row>
  </Container>
);

TableOption.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func
};

TableOption.defaultProps = {
  value: {
    id: false,
    rememberToken: false,
    softDeletes: false,
    timestamps: false
  }
};

export default TableOption;
