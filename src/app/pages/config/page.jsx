'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { writeJson, readJson } from '@/app/utils/jsonHandle.js';
import config from '/home/mgv/config.json';

import Modal from '@/app/components/shared/Modal';

import Styles from '../main/page.module.css';

export default function MainPage() {
  const [modal, setModal] = useState(false);
  const [conf, setConf] = useState(config);

  const modalText = 'EL SISTEMA SE REINICIARÁ PARA APLICAR LOS CAMBIOS, DESEA CONTINUAR?';

  const closeModal = () => {
    setModal(false);
  };

  const router = useRouter();

  useEffect(() => {
    setTimeout(async () => setConf(await readJson()), 100);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    router.push('/pages/main');
  };

  const saveChanges = async () => {
    const newConfig = structuredClone(conf);

    // newConfig.portOne.path = document.getElementById("onepath").value;
    newConfig.portOne.baudRate = document.getElementById("onebaudRate").value;
    newConfig.portOne.dataBits = document.getElementById("onedataBits").value;
    newConfig.portOne.parity = document.getElementById("oneparity").value;
    newConfig.portOne.stopBits = document.getElementById("onestopBits").value;
    newConfig.portOne.stringLength = document.getElementById("onestringlength").value;
    newConfig.portOne.numberInit = document.getElementById("onenumberInit").value;
    newConfig.portOne.numberFin = document.getElementById("onenumberFin").value;
    newConfig.portOne.statusBo = document.getElementById("onestatusBo").value;
    newConfig.portOne.statusInit = document.getElementById("onestatusInit").value;
    newConfig.portOne.statusFin = document.getElementById("onestatusFin").value;

    // newConfig.portTwo.path = document.getElementById("twopath").value;
    newConfig.portTwo.baudRate = document.getElementById("twobaudRate").value;
    newConfig.portTwo.dataBits = document.getElementById("twodataBits").value;
    newConfig.portTwo.parity = document.getElementById("twoparity").value;
    newConfig.portTwo.stopBits = document.getElementById("twostopBits").value;
    newConfig.portTwo.stringLength = document.getElementById("twostringlength").value;
    newConfig.portTwo.numberInit = document.getElementById("twonumberInit").value;
    newConfig.portTwo.numberFin = document.getElementById("twonumberFin").value;
    newConfig.portTwo.statusBo = document.getElementById("twostatusBo").value;
    newConfig.portTwo.statusInit = document.getElementById("twostatusInit").value;
    newConfig.portTwo.statusFin = document.getElementById("twostatusFin").value;

    await writeJson(newConfig);

    setModal(false);

    const data = await fetch("/api/v1/system", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const res = await data.json();

    router.push('/pages/main');
    console.log(res.data);
  };

  return (
    <div className={Styles.mainContainer}>

      {modal && (
        <Modal
          text={modalText}
          method1={saveChanges}
          method2={closeModal}
        />
      )}

      <div className={Styles.portsContainer}>

        {/* PUERTO 1 */}
        <div className={Styles.portContainer}>

          <h1 className={Styles.portTitle}>PUERTO 1</h1>

          <div className={Styles.configContainer}>

            {/* <fieldset className={Styles.fieldset}>
              <input
                type="text"
                name="path"
                className={Styles.input}
                id="onepath"
                defaultValue={conf?.portOne?.path}
              />
              <label className={Styles.label} htmlFor="onepath">
                Ruta
              </label>
            </fieldset> */}

            <fieldset className={Styles.fieldset}>
              <input
                type="number"
                name="baudRate"
                className={Styles.input}
                id="onebaudRate"
                defaultValue={conf?.portOne?.baudRate}
              />
              <label className={Styles.label} htmlFor="onebaudRate">
                Baudrate
              </label>
            </fieldset>

            <fieldset className={Styles.fieldset}>
              <input
                type="number"
                name="dataBits"
                className={Styles.input}
                id="onedataBits"
                defaultValue={conf?.portOne?.dataBits}
              />
              <label className={Styles.label} htmlFor="onedataBits">
                Bits
              </label>
            </fieldset>

            <fieldset className={Styles.fieldset}>
              <select
                name="parity"
                className={Styles.input}
                id="oneparity"
                defaultValue={conf?.portOne?.parity}
              >
                <option value="none">Sin paridad</option>
                <option value="even">Par</option>
                <option value="odd">Inpar</option>
              </select>

              <label className={Styles.label} htmlFor="oneparity">
                Paridad
              </label>
            </fieldset>

            <fieldset className={Styles.fieldset}>
              <input
                type="number"
                name="stopBits"
                className={Styles.input}
                id="onestopBits"
                defaultValue={conf?.portOne?.stopBits}
              />
              <label className={Styles.label} htmlFor="onestopBits">
                Stop Bit
              </label>
            </fieldset>

            <fieldset className={Styles.fieldset}>
              <input
                type="number"
                name="stringlength"
                className={Styles.input}
                id="onestringlength"
                defaultValue={conf?.portOne?.stringLength}
              />
              <label className={Styles.label} htmlFor="onestringlength">
                Largo
              </label>
            </fieldset>

            <fieldset className={Styles.fieldset}>
              <input
                type="number"
                name="numberInit"
                className={Styles.input}
                id="onenumberInit"
                defaultValue={conf?.portOne?.numberInit}
              />
              <label className={Styles.label} htmlFor="onenumberInit">
                Num Ini
              </label>
            </fieldset>

            <fieldset className={Styles.fieldset}>
              <input
                type="number"
                name="numberFin"
                className={Styles.input}
                id="onenumberFin"
                defaultValue={conf?.portOne?.numberFin}
              />
              <label className={Styles.label} htmlFor="onenumberFin">
                Num Fin
              </label>
            </fieldset>

            <fieldset className={Styles.fieldset}>
              <select
                name="statusBo"
                className={Styles.input}
                id="onestatusBo"
                defaultValue={conf?.portOne?.statusBo}
              >
                <option value={true}>Si</option>
                <option value={false}>No</option>
              </select>

              <label className={Styles.label} htmlFor="onestatusBo">
                Estado
              </label>
            </fieldset>

            <fieldset className={Styles.fieldset}>
              <input
                type="number"
                name="statusInit"
                className={Styles.input}
                id="onestatusInit"
                defaultValue={conf?.portOne?.statusInit}
              />
              <label className={Styles.label} htmlFor="onestatusInit">
                Estado Ini
              </label>
            </fieldset>

            <fieldset className={Styles.fieldset}>
              <input
                type="number"
                name="statusFin"
                className={Styles.input}
                id="onestatusFin"
                defaultValue={conf?.portOne?.statusFin}
              />
              <label className={Styles.label} htmlFor="onestatusFin">
                Estado Fin
              </label>
            </fieldset>

          </div>
        </div>

        {/* PUERTO 2 */}
        <div className={Styles.portContainer}>

          <h1 className={Styles.portTitle}>PUERTO 2</h1>

          <div className={Styles.configContainer}>

            {/* <fieldset className={Styles.fieldset}>
              <input
                type="text"
                name="path"
                className={Styles.input}
                id="twopath"
                defaultValue={conf?.portTwo?.path}
              />
              <label className={Styles.label} htmlFor="twopath">
                Ruta
              </label>
            </fieldset> */}

            <fieldset className={Styles.fieldset}>
              <input
                type="number"
                name="baudRate"
                className={Styles.input}
                id="twobaudRate"
                defaultValue={conf?.portTwo?.baudRate}
              />
              <label className={Styles.label} htmlFor="twobaudRate">
                Baudrate
              </label>
            </fieldset>

            <fieldset className={Styles.fieldset}>
              <input
                type="number"
                name="dataBits"
                className={Styles.input}
                id="twodataBits"
                defaultValue={conf?.portTwo?.dataBits}
              />
              <label className={Styles.label} htmlFor="twodataBits">
                Bits
              </label>
            </fieldset>

            <fieldset className={Styles.fieldset}>
              <select
                name="parity"
                className={Styles.input}
                id="twoparity"
                defaultValue={conf?.portTwo?.parity}
              >
                <option value="none">Sin paridad</option>
                <option value="even">Par</option>
                <option value="odd">Inpar</option>
              </select>

              <label className={Styles.label} htmlFor="twoparity">
                Paridad
              </label>
            </fieldset>

            <fieldset className={Styles.fieldset}>
              <input
                type="number"
                name="stopBits"
                className={Styles.input}
                id="twostopBits"
                defaultValue={conf?.portTwo?.stopBits}
              />
              <label className={Styles.label} htmlFor="twostopBits">
                Stop Bit
              </label>
            </fieldset>

            <fieldset className={Styles.fieldset}>
              <input
                type="number"
                name="stringlength"
                className={Styles.input}
                id="twostringlength"
                defaultValue={conf?.portTwo?.stringLength}
              />
              <label className={Styles.label} htmlFor="twostringlength">
                Largo
              </label>
            </fieldset>

            <fieldset className={Styles.fieldset}>
              <input
                type="number"
                name="numberInit"
                className={Styles.input}
                id="twonumberInit"
                defaultValue={conf?.portTwo?.numberInit}
              />
              <label className={Styles.label} htmlFor="twonumberInit">
                Num Ini
              </label>
            </fieldset>

            <fieldset className={Styles.fieldset}>
              <input
                type="number"
                name="numberFin"
                className={Styles.input}
                id="twonumberFin"
                defaultValue={conf?.portTwo?.numberFin}
              />
              <label className={Styles.label} htmlFor="twonumberFin">
                Num Fin
              </label>
            </fieldset>

            <fieldset className={Styles.fieldset}>
              <select
                name="statusBo"
                className={Styles.input}
                id="twostatusBo"
                defaultValue={conf?.portTwo?.statusBo}
              >
                <option value={true}>Si</option>
                <option value={false}>No</option>
              </select>

              <label className={Styles.label} htmlFor="twostatusBo">
                Estado
              </label>
            </fieldset>

            <fieldset className={Styles.fieldset}>
              <input
                type="number"
                name="statusInit"
                className={Styles.input}
                id="twostatusInit"
                defaultValue={conf?.portTwo?.statusInit}
              />
              <label className={Styles.label} htmlFor="twostatusInit">
                Estado Ini
              </label>
            </fieldset>

            <fieldset className={Styles.fieldset}>
              <input
                type="number"
                name="statusFin"
                className={Styles.input}
                id="twostatusFin"
                defaultValue={conf?.portTwo?.statusFin}
              />
              <label className={Styles.label} htmlFor="twostatusFin">
                Estado Fin
              </label>
            </fieldset>

          </div>
        </div>

      </div>

      <div className={Styles.configButtonsContainer}>
        <button
          className={Styles.configButtonSave}
          onClick={() => setModal(true)}
        >
          GUARDAR
        </button>

        <button
          className={Styles.configButtonBack}
          onClick={handleClick}
        >
          VOLVER
        </button>
      </div>

    </div>
  );
};