import React, { Component } from "react";
import styled from "styled-components";
import {
  MdAddBox,
  MdSave,
  MdFolderOpen,
  MdArchive,
  MdAddCircleOutline,
  MdHighlightRemove,
  MdHelp
} from "react-icons/lib/md";

import Tool from "./components/Tool";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background: #444;
`;

const Toolbar = styled.div`
  width: 100%;
  height: 48px;
  align-items: center;
  padding: 0px 16px;
  box-sizing: border-box;
  display: flex;
  background: #555;
`;

const Separator = styled.div`
  width: 1px;
  height: 32px;
  border-left: 1px solid #666;
  margin: 0px 8px;
`;

class App extends Component {
  render() {
    return (
      <Container>
        <Toolbar>
          <Tool tooltip="New Schema" icon={MdAddBox} />
          <Tool tooltip="Open Schema" icon={MdFolderOpen} />
          <Tool tooltip="Save Schema" icon={MdSave} />
          <Separator />
          <Tool tooltip="Export" icon={MdArchive} isDisabled />
          <Separator />
          <Tool tooltip="Add Table" icon={MdAddCircleOutline} isDisabled />
          <Tool tooltip="Remove Table" icon={MdHighlightRemove} isDisabled />
          <Separator />
          <Tool tooltip="Help" icon={MdHelp} />
        </Toolbar>
      </Container>
    );
  }
}

export default App;
