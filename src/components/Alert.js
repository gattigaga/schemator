import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import styled from "styled-components";
import { connect } from "react-redux";

import "typeface-roboto";

import { setAlert } from "../store/actions";

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

const Button = styled.button`
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

export const Alert = ({ isOpen, message, icon, iconColor, showAlert }) => {
  const Icon = styled(icon)`
    font-size: 48px;
    color: ${({ iconColor }) => iconColor};
    margin-right: 24px;
  `;

  const closeAlert = () => showAlert({ isOpen: false });

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
      onRequestClose={closeAlert}
    >
      <Row>
        <Icon iconColor={iconColor} />
        <Message>{message}</Message>
      </Row>
      <ButtonWrapper>
        <Button onClick={closeAlert}>OK</Button>
      </ButtonWrapper>
    </Modal>
  );
};

Alert.propTypes = {
  isOpen: PropTypes.bool,
  message: PropTypes.string,
  icon: PropTypes.func,
  iconColor: PropTypes.string,
  showAlert: PropTypes.func
};

const mapStateToProps = ({ alert }) => ({ ...alert });

const mapDispatchToProps = dispatch => ({
  showAlert: options => dispatch(setAlert(options))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Alert);
