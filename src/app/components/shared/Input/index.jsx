import Styles from './input.module.css';

const Input = ({
  type,
  text,
  id,
  defaultValue,
  value,
  placeHolder,
  readOnly,
  styleField,
  styleLabel,
  styleInput,
  name,
  error,
  register,
  onChange,
  checked
}) => {

  function valError() {
    if (type === 'search' || name === 'username' || name === 'password') {
      return (Styles.input);
    } else if (error) {
      return (Styles.error);
    } else {
      return (Styles.good);
    };
  };

  return (
    <fieldset className={styleField}>
      <label htmlFor={id} className={styleLabel} >
        {text}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue || ''}
        placeholder={placeHolder || ''}
        readOnly={readOnly}
        className={valError()}
        onChange={onChange}
        checked={checked}
      >
      </input>
      {error && <p> {error} </p>}
    </fieldset>
  );
};

export default Input;
