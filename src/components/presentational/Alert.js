import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import styled from "styled-components";

import "typeface-roboto";

const Row = styled.div`
  display: flex;
`;

const Message = styled.p`
  font-family: Roboto;
  font-size: 16px;
  margin: 0px;
`;

const ButtonWrapper = styled.div`
  text-align: center;
`;

export const Button = styled.button`
  width: 96px;
  background: #555;
  color: white;
  padding: 8px;
  border: 0px;
  border-radius: 4px;
  font-family: Roboto;
  font-size: 16px;
  margin-top: 24px;
  outline: none;
  align-self: center;

  &:hover {
    background: #444;
  }
`;

const Alert = ({
  isOpen,
  message,
  icon,
  iconColor,
  onRequestClose,
  onClickOK
}) => {
  const Icon = styled(icon)`
    font-size: 48px;
    margin-right: 24px;
  `;

  return (
    <Modal
      style={{
        overlay: {
          background: "rgba(0, 0, 0, 0.5)"
        },
        content: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 320,
          height: 110,
          padding: 24,
          background: "white"
        }
      }}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <Row>
        <Icon color={iconColor} />
        <Message>{message}</Message>
      </Row>
      <ButtonWrapper>
        <Button onClick={onClickOK}>OK</Button>
      </ButtonWrapper>
    </Modal>
  );
};

Alert.propTypes = {
  isOpen: PropTypes.bool,
  message: PropTypes.string,
  icon: PropTypes.func,
  iconColor: PropTypes.string,
  onRequestClose: PropTypes.func,
  onClickOK: PropTypes.func
};

export default Alert;
