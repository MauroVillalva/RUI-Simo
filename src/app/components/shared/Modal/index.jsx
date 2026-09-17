import Styles from './modal.module.css';

const Modal = ({ text, method1, method2 }) => {
  const handleClick = (event) => {
    event.preventDefault();
    if (event.target.id == 'yes') method1();
    if (event.target.id == 'no') method2();
  };

  return <div className={Styles.shadowContainer}>
    <div className={Styles.mainContainer}>
      <p className={Styles.textContainer}>{text}</p>
      <div className={Styles.buttonContainer}>
        <button id="yes" onClick={handleClick}>SI</button>
        <button id="no" onClick={handleClick}>NO</button>
      </div>
    </div>
  </div>
};

export default Modal;