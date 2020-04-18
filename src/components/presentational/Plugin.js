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

const Name = styled.p`
  color: #ccc;
  font-size: 12px;
  font-family: "Roboto";
  font-weight: bold;
  margin: 0px;
  margin-bottom: 4px;
`;

const Author = styled.p`
  color: #888;
  font-size: 11px;
  font-family: "Roboto";
  font-weight: bold;
  margin: 0px;
  margin-bottom: 4px;
`;

const Description = styled.p`
  color: #ccc;
  font-family: "Roboto";
  font-size: 11px;
  margin: 0px;
`;

const Plugin = ({ image, name, author, description, onClick, isActive }) => {
  const suffix = description.length > 22 ? "..." : "";
  const excerpt = description.slice(0, 22) + suffix;

  return (
    <Container onClick={onClick} isActive={isActive}>
      <Image src={image} />
      <div>
        <Name>{name}</Name>
        <Author>{author}</Author>
        <Description>{excerpt}</Description>
      </div>
    </Container>
  );
};

Plugin.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
  author: PropTypes.string,
  description: PropTypes.string,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
};

export default Plugin;
