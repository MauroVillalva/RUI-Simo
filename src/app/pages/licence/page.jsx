'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Modal from '@/app/components/shared/Modal';

import Styles from './page.module.css';

export default function LicencePage() {
  const [licence, setLicence] = useState('');
  const [errorVal, setErrorVal] = useState(false);
  const [errorMes, setErrorMes] = useState('');
  const [modal, setModal] = useState(false);
  const modalText = 'EL SISTEMA SE REINICIARÁ PARA APLICAR LOS CAMBIOS, DESEA CONTINUAR?'
  const closeModal = () => {
    setModal(false);
  };

  const router = useRouter();

  useEffect(() => {
    setTimeout(async () => {
      const response = await fetch('/api/v1/licence', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
        },
      });

      const data = await response.json();

      if (!data.validation) {
        setErrorVal(true);
        setErrorMes(data.message);
      }

      setLicence(data.data);
    }, 3000)
  }, []);

  const handleSubmit = async () => {

    const res = await fetch(`/api/v1/licence`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
      },
      body: JSON.stringify({
        newLic: document.getElementById("licence").value
      }),
    });

    const data = await res.json();

    if (!data?.validation) {
      setErrorVal(true);
      setErrorMes(data?.message);
    } else if (data?.validation) {
      setErrorVal(false);
      setErrorMes('');
    };

    setModal(false);

    const data2 = await fetch("/api/v1/system", {
      method: "GET",
      headers: { 'Content-Type': 'application/json' }
    });

    const res2 = await data2.json();

    console.log(res2.data);
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (e.target.name == 'config') router.push('/pages/config');
    if (e.target.name == 'main') router.push('/pages/main');
  };

  const handleForm = (e) => {
    e.preventDefault();
    setModal(true);
  };

  const productList = () => {
    return <ul className={Styles.productList}>
      {licence?.productos?.map((item) => { return <li key={item}>{item}</li> })}
    </ul>
  };

  const expDate = () => {
    const date = new Date(licence?.fechaFin);

    const day = ((date.getDate() < 10) && ('0' + date.getDate()) || date.getDate()) || '-';
    const month = (((date.getMonth() + 1) < 10) && ('0' + (date.getMonth() + 1)) || date.getMonth() + 1) || '-';
    const year = date.getFullYear() || '-';

    return `${year}/${month}/${day}`;
  };

  return <div className={Styles.mainContainer}>
    {modal && <Modal text={modalText} method1={handleSubmit} method2={closeModal} />}
    <h1>Sobre su licencia</h1>
    <ul className={Styles.licenceList}>
      <li>{`Nombre: ${licence?.nombre || '-'}`}</li>
      <li>{`CUIT: ${licence?.cuit || '-'}`}</li>
      <li>{`Serie: ${licence?.serie || '-'}`}</li>
      <li>Productos:
        {productList()}
      </li>
      <li>{`Fecha de expiración: ${expDate()}`}</li>
    </ul>
    <form className={Styles.licenceForm}>
      <fieldset>
        <label> Registrar una nueva licencia
          <input name='licence' id='licence'></input>
        </label>
      </fieldset>
      <button className={Styles.configButtonSave} onClick={handleForm}>ENVIAR</button>
      {errorVal && <p className={Styles.errorMsg}>{errorMes}</p>}
    </form>
    <div className={Styles.buttonsContainer}>
      <button className={Styles.configButtonBack} onClick={handleClick} name='config'>CONFIG</button>
      <button className={Styles.configButtonBack} onClick={handleClick} name='main'>PRINCIPAL</button>
    </div>
  </div>
};