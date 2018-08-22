import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Markdown from "react-markdown";
import "typeface-roboto";

import imgLogo from "../../assets/images/icon-black-256.png";
import PluginListContainer from "./PluginListContainer";
import SearchBox from "../presentational/SearchBox";
import SmallButton from "../presentational/SmallButton";

const { remote } = window.require("electron");
const fs = window.require("fs-extra");

const Container = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
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

const BlankWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContentWrapper = styled.div`
  flex: 1;
  flex-direction: column;
  display: flex;
  background: #383838;
  box-sizing: border-box;
  overflow: auto;
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
  color: #ccc;
  margin-top: 0px;
  margin-bottom: 8px;
`;

const Author = styled.p`
  font-family: Roboto;
  font-size: 16px;
  color: #888;
  margin: 0px;
  margin-bottom: 32px;
`;

const Description = styled.p`
  font-family: Roboto;
  font-size: 16px;
  color: #ccc;
  margin: 0px;
`;

const StyledButton = styled(SmallButton)`
  margin-top: 16px;
`;

const StyledMarkdown = styled(Markdown)`
  font-family: Roboto;
  color: #ccc;
  padding: 32px;
  box-sizing: border-box;
  flex: 1;
  min-height: min-content;

  & a {
    color: white;
  }

  & img {
    max-width: 100%;
  }
`;

export class Plugins extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: "",
      item: null
    };

    this.deletePlugin = this.deletePlugin.bind(this);
  }

  /**
   * Delete an installed plugin from it's path.
   *
   * @memberof Plugins
   */
  deletePlugin() {
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
    const { plugins, plugin } = this.props;

    return (
      <Container>
        <Sidebar>
          <SearchWrapper>
            <SearchBox
              value={keyword}
              onChange={event => this.setState({ keyword: event.target.value })}
            />
          </SearchWrapper>
          <PluginListContainer
            keyword={keyword}
            onClickItem={item => {
              const plugin = plugins.find(plugin => item.id === plugin.id);

              this.setState({
                item: plugin
              });
            }}
            active={item && item.id}
          />
        </Sidebar>
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
              <StyledButton
                caption="Delete"
                onClick={this.deleteplugin}
                isDisabled={plugin && plugin.id === item.id}
              />
            </DetailWrapper>
            <StyledMarkdown source={item.readme} />
          </ContentWrapper>
        )}
      </Container>
    );
  }
}

Plugins.propTypes = {
  plugins: PropTypes.array,
  plugin: PropTypes.object
};

const mapStateToProps = ({ plugins, plugin }) => ({
  plugins,
  plugin
});

export default connect(mapStateToProps)(Plugins);
