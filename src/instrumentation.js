'use server'

import {
  initSindesys,
  confSindesys,
  readSindesys,
  serialCOM,
  loopSindesys
} from '@/app/helper/portReader';

import { licenceAuth } from '@/app/helper/auth';

import { readJson } from './app/utils/jsonHandle';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {

    console.log('Verificando licencia...');
    const auth = await licenceAuth();

    if (auth.validation) {
      console.log(auth.data);

      const jsonConfig = await readJson();

      const pathOne = await jsonConfig?.portOne?.path;
      const pathTwo = await jsonConfig?.portTwo?.path;
      const portOneCheck = pathOne?.substring(0, 3) == 'COM' || pathOne?.substring((pathOne?.length - 4), (pathOne?.length - 1)) == 'USB';
      const portTwoCheck = pathTwo?.substring(0, 3) == 'COM' || pathTwo?.substring((pathTwo?.length - 4), (pathTwo?.length - 1)) == 'USB';
      const checkPathSin = () => {
        if (portOneCheck && portTwoCheck) return;
        if (!portOneCheck) return 1;
        if (!portTwoCheck) return 2;
      };

      let longOne = await jsonConfig?.portOne?.stringLength;
      if (portOneCheck) longOne = 8;
      let longTwo = await jsonConfig?.portTwo?.stringLength;
      if (portTwoCheck) longTwo = 8;
      const sum = 1 + Number(longOne) + Number(longTwo);

      setTimeout(() => console.log('Iniciando funciones bases del servidor...'), 4000);

      if (portOneCheck) setTimeout(async () => {
        console.log('Iniciando llamada al Puerto 1...');
        setInterval(async () => {
          await serialCOM(1);
        }, 1000);
      }, 5000);

      if (portTwoCheck) setTimeout(async () => {
        console.log('Iniciando llamada al Puerto 2...');
        setInterval(async () => {
          await serialCOM(2);
        }, 1000);
      }, 7000);

      // console.log('Iniciando loop Sindesys...');
      // if (!portOneCheck || !portTwoCheck) await loopSindesys(checkPathSin());

      if (!portOneCheck || !portTwoCheck) setTimeout(async () => {
        console.log('Iniciando Sindesys...');
        await initSindesys(checkPathSin());
      }, 9000);

      if (!portOneCheck) setTimeout(async () => {
        console.log('Configurando puerto 1 Sindesys...');
        await confSindesys(1);
      }, 11000);

      if (!portTwoCheck) setTimeout(async () => {
        console.log('Configurando puerto 2 Sindesys...');
        await confSindesys(2);
      }, 13000);

      if (!portOneCheck || !portTwoCheck) setTimeout(async () => {
        console.log('Iniciando lectura Sindesys...');
        setInterval(async () => {
          await readSindesys(checkPathSin(), sum);
        }, 1000);
      }, 18000);

      setTimeout(() => console.log('Sistema listo!'), 20000);
    } else {
      console.log(auth.message);
    };
  };
};