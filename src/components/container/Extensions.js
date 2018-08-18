import React, { Component } from "react";
import styled from "styled-components";
import "typeface-roboto";

import imgLogo from "../../assets/images/icon-black-256.png";
import ExtensionListContainer from "./ExtensionListContainer";
import SearchBox from "../presentational/SearchBox";

const Container = styled.div`
  flex: 1;
  display: flex;
`;

const Sidebar = styled.div`
  width: 240px;
  height: 100%;
  background: #333;
  display: flex;
  flex-direction: column;
`;

const SearchWrapper = styled.div`
  padding: 12px;
`;

const Page = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  width: 256px;
  height: 256px;
`;

const Caption = styled.h1`
  font-family: Roboto;
  font-size: 32px;
  color: #555;
`;

class Extensions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: ""
    };
  }

  render() {
    const { keyword } = this.state;

    return (
      <Container>
        <Sidebar>
          <SearchWrapper>
            <SearchBox
              value={keyword}
              onChange={event => this.setState({ keyword: event.target.value })}
            />
          </SearchWrapper>
          <ExtensionListContainer keyword={keyword} />
        </Sidebar>
        <Page>
          <Logo src={imgLogo} />
          <Caption>Schemator</Caption>
        </Page>
      </Container>
    );
  }
}

export default Extensions;
