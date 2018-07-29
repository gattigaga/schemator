import React, { Component } from "react";
import styled from "styled-components";

import ExtensionList from "../presentational/ExtensionList";
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
      keyword: "",
      extensions: []
    };
  }

  render() {
    const { keyword, extensions } = this.state;

    return (
      <Container>
        <Sidebar>
          <SearchWrapper>
            <SearchBox
              value={keyword}
              onChange={event => this.setState({ keyword: event.target.value })}
            />
          </SearchWrapper>
          <ExtensionList keyword={keyword} items={extensions} />
        </Sidebar>
      </Container>
    );
  }
}

Extensions.propTypes = {};

export default Extensions;
