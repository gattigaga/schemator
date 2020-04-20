import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Markdown from "react-markdown";
import "typeface-roboto";

import imgLogo from "../assets/images/icon-black-256.png";
import PluginList from "./PluginList";
import SmallButton from "./SmallButton";

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
  font-size: 12px;
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

const SearchBox = styled.input`
  width: 100%;
  background: #2b2b2b;
  border: 1px solid #444;
  outline: none;
  color: white;
  font-family: Roboto;
  font-size: 12px;
  padding: 8px;
  box-sizing: border-box;

  &:focus {
    border-color: #777;
  }
`;

const Plugins = () => {
  const [keyword, setKeyword] = useState("");
  const [item, setItem] = useState(null);

  const { plugins, plugin } = useSelector(({ plugins, plugin }) => ({
    plugins,
    plugin,
  }));

  const deletePlugin = () => {
    const { dialog } = remote;
    const mainWindow = remote.getCurrentWindow();

    const choice = dialog.showMessageBox(mainWindow, {
      type: "question",
      buttons: ["Yes", "No"],
      title: "Plugin would be deleted",
      message: "Are you sure you want to delete this plugin ?",
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
            buttons: ["OK"],
          },
          (response) => {
            if (response === 0) {
              mainWindow.reload();
            }
          }
        );
      } else {
        dialog.showMessageBox(mainWindow, {
          type: "info",
          message: "Plugin doesn't exists !",
          buttons: ["OK"],
        });
      }
    }
  };

  return (
    <Container>
      <Sidebar>
        <SearchWrapper>
          <SearchBox
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </SearchWrapper>
        <PluginList
          keyword={keyword}
          items={plugins}
          active={item && item.id}
          onClickItem={setItem}
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
            <Author>Author : {item.author}</Author>
            <Description>{item.description}</Description>
            <StyledButton
              caption="Delete"
              onClick={deletePlugin}
              isDisabled={plugin && plugin.id === item.id}
            />
          </DetailWrapper>
          <StyledMarkdown source={item.readme} />
        </ContentWrapper>
      )}
    </Container>
  );
};

export default Plugins;
