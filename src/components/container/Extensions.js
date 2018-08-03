import React, { Component } from "react";
import styled from "styled-components";

import ExtensionListContainer from "./ExtensionListContainer";
import SearchBox from "../presentational/SearchBox";

const Container = styled.div`
  height: 100%;
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
      </Container>
    );
  }
}

export default Extensions;
