import Styles from './img.module.css';

const Img = ({ className, text, src, alt, onClick }) => {

  return (
    <p onClick={onClick}>
      <img src={src} className={className} alt={alt}></img>
      {text}
    </p>
  );
};

export default Img;
