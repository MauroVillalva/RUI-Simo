
import { readJson } from '@/app/utils/jsonHandle.js';

const regex1 = /\\r/g;
const regex2 = /\\n/g;
const regex3 = /\\x02/g;
const regex4 = /\\x03/g;

export const readWeight = (port) => {

  const fetchLogData = async () => {
    try {
      const config = await readJson();
      let conf = await config.portTwo;

      const portCheck = port.toString() == '1';
      if (portCheck) conf = await config.portOne;

      const { path, numberInit, numberFin, statusInit, statusFin, statusBo } = conf;

      const pathCheck = path?.substring(0, 3) != 'COM' && path?.substring((path?.length - 4), (path?.length - 1)) != 'USB';

      const response = await fetch('/api/v1/serialport', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
        }
      });

      const data = await response.json();

      let result = data?.com1;
      if (pathCheck && portCheck) result = data?.com1;
      if (pathCheck && !portCheck) result = data?.com2;
      if (!pathCheck && portCheck) result = data?.usb1;
      if (!pathCheck && !portCheck) result = data?.usb2;

      let compString = result;
      let compRep = compString?.replace(regex1, "\r")
        .replace(regex2, "\n")
        .replace(regex3, "\x02")
        .replace(regex4, "\x03");

      let numSelected = ' ';
      let charSelected = ' ';

      const dataSplt = compRep?.split('');

      await dataSplt?.map((item, index) => {
        if (index >= numberInit && index <= numberFin) {
          numSelected = numSelected + item?.toString();
        };
      });

      await dataSplt?.map((item, index) => {
        if (index >= statusInit && index <= statusFin) {
          charSelected = charSelected + item?.toString();
        };
      });

      const dataToNum = Number(numSelected.trim());

      const statusChar = charSelected;

      return {
        weight: dataToNum,
        validWeight: !Number.isNaN(dataToNum),
        statusChar: statusChar,
        statusBo: statusBo.toString().toLowerCase() == 'true',
        error: false,
        message: ''
      };
    } catch (err) {
      return {
        weight: '',
        statusChar: '',
        statusBo: false,
        error: true,
        message: err.message
      };
    };
  };

  return fetchLogData();
};