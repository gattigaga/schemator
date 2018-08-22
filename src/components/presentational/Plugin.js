import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import "typeface-roboto";

const Container = styled.div`
  width: 100%;
  padding: 8px 16px;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  background: ${({ isActive }) => (isActive ? "#3b3b3b" : "#333")};
  display: flex;

  &:hover {
    background: #383838;
  }
`;

const Image = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  margin-right: 12px;
`;

const Wrapper = styled.div``;

const Name = styled.h4`
  color: #ccc;
  font-size: 12px;
  font-family: Roboto;
  margin: 0px;
  margin-bottom: 4px;
`;

const Author = styled.h5`
  color: #888;
  font-size: 11px;
  font-family: Roboto;
  margin: 0px;
  margin-bottom: 4px;
`;

const Description = styled.p`
  color: #ccc;
  font-family: Roboto;
  font-size: 11px;
  margin: 0px;
`;

const Plugin = ({ image, name, author, description, onClick, isActive }) => (
  <Container onClick={onClick} isActive={isActive}>
    <Image src={image} />
    <Wrapper>
      <Name>{name}</Name>
      <Author>{author}</Author>
      <Description>{description}</Description>
    </Wrapper>
  </Container>
);

Plugin.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
  author: PropTypes.string,
  description: PropTypes.string,
  onClick: PropTypes.func,
  isActive: PropTypes.bool
};

export default Plugin;
