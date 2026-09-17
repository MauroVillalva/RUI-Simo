import Styles from './select.module.css';

const Select = ({
  text,
  id,
  values,
  fakeVals,
  defaultValue,
  placeHolder,
  readOnly,
  styleField,
  styleLabel,
  styleSelect,
  name,
  onChange,
}) => {

  return (
    <fieldset className={styleField}>
      <label htmlFor={id} className={styleLabel} >
        {text}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue || ''}
        placeholder={placeHolder || ''}
        readOnly={readOnly}
        className={Styles.input}
        onChange={onChange}
      >
        {values?.map((val, index) => {
          return (
            <option key={index} value={val}>{(fakeVals && fakeVals[index]) || val}</option>
          );
        })}
      </select>
    </fieldset>
  );
};

export default Select;
