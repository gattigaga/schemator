import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "typeface-roboto";

import imgLogo from "../../assets/images/icon-black-256.png";
import ExtensionListContainer from "./ExtensionListContainer";
import SearchBox from "../presentational/SearchBox";
import SmallButton from "../presentational/SmallButton";

const { remote } = window.require("electron");
const fs = window.require("fs-extra");

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
`;

const BlankWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContentWrapper = styled.div`
  flex: 1;
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

const DetailWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid #555;
  padding: 32px;
  box-sizing: border-box;
`;

const Name = styled.h1`
  font-family: Roboto;
  color: white;
  margin-top: 0px;
  margin-bottom: 8px;
`;

const Author = styled.p`
  font-family: Roboto;
  font-size: 16px;
  color: #aaa;
  margin: 0px;
  margin-bottom: 32px;
`;

const Description = styled.p`
  font-family: Roboto;
  font-size: 16px;
  color: white;
  margin: 0px;
`;

const StyledButton = styled(SmallButton)`
  margin-top: 16px;
`;

class Extensions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: "",
      item: null
    };

    this.deleteExtension = this.deleteExtension.bind(this);
  }

  /**
   * Delete an installed extension from it's path.
   *
   * @memberof Extensions
   */
  deleteExtension() {
    const { item } = this.state;
    const { dialog } = remote;
    const mainWindow = remote.getCurrentWindow();

    const choice = dialog.showMessageBox(mainWindow, {
      type: "question",
      buttons: ["Yes", "No"],
      title: "Plugin would be deleted",
      message: "Are you sure you want to delete this plugin ?"
    });

    if (choice === 0) {
      if (fs.existsSync(item.path)) {
        fs.removeSync(item.path);

        dialog.showMessageBox(
          mainWindow,
          {
            type: "info",
            message:
              "Plugin successfully deleted, Press OK to reload Schemator!",
            buttons: ["OK"]
          },
          response => {
            if (response === 0) {
              mainWindow.reload();
            }
          }
        );
      } else {
        dialog.showMessageBox(mainWindow, {
          type: "info",
          message: "Plugin doesn't exists !",
          buttons: ["OK"]
        });
      }
    }
  }

  render() {
    const { keyword, item } = this.state;
    const { extensions, extension } = this.props;

    return (
      <Container>
        <Sidebar>
          <SearchWrapper>
            <SearchBox
              value={keyword}
              onChange={event => this.setState({ keyword: event.target.value })}
            />
          </SearchWrapper>
          <ExtensionListContainer
            keyword={keyword}
            onClickItem={item => {
              const extension = extensions.find(
                extension => item.id === extension.id
              );

              this.setState({
                item: extension
              });
            }}
            active={item && item.id}
          />
        </Sidebar>
        <Page>
          {!item ? (
            <BlankWrapper>
              <Logo src={imgLogo} />
              <Caption>Schemator</Caption>
            </BlankWrapper>
          ) : (
            <ContentWrapper>
              <DetailWrapper>
                <Name>{item.name}</Name>
                <Author>by {item.author}</Author>
                <Description>{item.description}</Description>
                {item.type === "external" && (
                  <StyledButton
                    caption="Delete"
                    onClick={this.deleteExtension}
                    isDisabled={extension && extension.id === item.id}
                  />
                )}
              </DetailWrapper>
            </ContentWrapper>
          )}
        </Page>
      </Container>
    );
  }
}

Extensions.propTypes = {
  extensions: PropTypes.array,
  extension: PropTypes.object
};

const mapStateToProps = ({ extensions, extension }) => ({
  extensions,
  extension
});

export default connect(mapStateToProps)(Extensions);
