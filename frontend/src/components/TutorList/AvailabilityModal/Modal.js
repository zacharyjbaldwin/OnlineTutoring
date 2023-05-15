import React from 'react';
import ReactDOM from 'react-dom';

import Backdrop from './Backdrop';
import './Modal.css';

const ModalOverlay = props => {
  const content = (
    <div className='modal'>
      {props.children}
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
};

const Modal = props => {
  return (
    <React.Fragment>
      <Backdrop onClick={props.onCancel} />
      <ModalOverlay {...props} />
    </React.Fragment>
  );
};

export default Modal;
