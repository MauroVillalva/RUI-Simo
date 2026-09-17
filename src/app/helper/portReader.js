'use server'

import { SerialPort } from "serialport";
import { ByteLengthParser } from "serialport";

import fs from 'fs';
const logFilePath = '/home/mgv/log.txt';
const logFilePath2 = '/home/mgv/log2.txt';
const logFilePath3 = '/home/mgv/log3.txt';
const logFilePath4 = '/home/mgv/log4.txt';
const maxLines = 100;

import { readJson } from '@/app/utils/jsonHandle.js';
import { licenceAuth } from '@/app/helper/auth';

function checkLogSpace(message, port) {

  let logPath = logFilePath2;
  if (port.toString() == '1') {
    logPath = logFilePath;
  };

  fs.readFile(logPath, 'utf8', (err, data) => {
    let lines = [];
    if (!err) {
      lines = data?.split('\n').filter(line => line.trim() !== '');
    } else if (err.code !== 'ENOENT') {
      console.error('Error leyendo el archivo: ', err);
      return new Error(err);
    };

    if (lines?.length > maxLines) {
      lines = lines?.slice(lines?.length - maxLines);
    };

    logMessage(message, lines, logPath);
  });
};

function logMessage(message, lines, logPath) {
  try {
    let newLines = lines;

    const date = new Date();
    const day = ((date.getDate() + 1) < 10) && ('0' + (date.getDate() + 1)) || date.getDate() + 1;
    const month = ((date.getMonth() + 1) < 10) && ('0' + (date.getMonth() + 1)) || date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = (date.getHours() < 10) && ('0' + date.getHours()) || date.getHours();
    const min = (date.getMinutes() < 10) && ('0' + date.getMinutes()) || date.getMinutes();
    const sec = (date.getSeconds() < 10) && ('0' + date.getSeconds()) || date.getSeconds();

    const timeStamp = `${year}/${month}/${day} - ${hour}:${min}:${sec} `;
    const logEntry = `${timeStamp} - ${message}`;
    newLines.push(logEntry);

    const updatedContent = newLines.join('\n');

    fs.writeFile(logPath, updatedContent, (err) => {
      if (err) {
        console.error('Error reescribiendo el archivo log.txt: ', err);
      };
    });
  } catch (error) {
    console.error(error);
  };
};

export async function readLastLine(port) {
  let logPath = logFilePath;
  if (port.toString() == '2') logPath = logFilePath2;
  if (port.toString() == '3') logPath = logFilePath3;
  if (port.toString() == '4') logPath = logFilePath4;

  const lineReaded = new Promise((resolve, reject) => {
    try {
      fs.readFile(logPath, 'utf8', (err, data) => {
        let lines = [];
        if (!err) {
          lines = data.split('\n').filter(line => line.trim() !== '');
        } else if (err.code !== 'ENOENT') {
          console.error('Error leyendo el archivo: ', err);
          reject(err);
        };

        lines = lines.slice(-1);

        const lastLine = lines[0]?.substring(25, lines[0].length);
        resolve(lastLine);
      });
    } catch (err) {
      console.error('Error en la promesa leyendo el archivo: ', err.message);
    };
  });

  return await lineReaded;
};

/*///////////////////*/

export async function serialCOM(port) {
  try {
    const jsonConfig = await readJson();
    let config = jsonConfig.portTwo;
    if (await port.toString() == '1') config = await jsonConfig.portOne;

    const { portNumber, path, baudRate, dataBits, parity, stopBits, stringLength } = await config;

    const serialPort = new SerialPort({
      path: path,
      baudRate: Number(baudRate),
      dataBits: Number(dataBits),
      parity: parity,
      stopBits: Number(stopBits),
      autoOpen: true,
      lock: false
    });

    serialPort.on('error', (err) => {
      if (serialPort.isOpen) {
        serialPort.close();
      };
      // console.error("Error caught: ", err.message);
      checkLogSpace(("Error caught: ", err.message), portNumber);
    });

    if (serialPort.isOpen) {
      serialPort.close();
    };

    // LISTAR LOS PUERTOS DISPONIBLES
    // SerialPort.list().then(ports => {
    //   ports.forEach(port => {
    //     console.log(port.path);
    //   });
    // }).catch(err => {
    //   console.error('Error listing ports', err);
    // });

    const parser = serialPort.pipe(new ByteLengthParser({ length: Number(stringLength), delimiter: '\r', encoding: 'ascii' }))

    function checkData() {
      return new Promise(function (resolve, reject) {
        parser.on('readable', () => {
          try {
            let data = parser.read();
            serialPort.close();
            resolve(data);
          } catch (e) {
            // console.log('Error obteniendo datos de la balanza');
            // console.log('Error: ' + e);
            serialPort.close();
            checkLogSpace(("Error caught: ", e.message), portNumber);
            reject(('Error obteniendo datos de la balanza: ', e));
          };
        });

        serialPort.on('error', (err) => {
          if (serialPort.isOpen) {
            serialPort.close();
          };
          // console.error("Error caught in Parser Promise: ", err.message);
          reject(("Error caught in Parser Promise: ", err.message));
        });

        setTimeout(() => resolve('No hay lectura'), 1000);
      });
    };

    let res = await SerialPort.list().then(ports => {
      let re = false;
      ports.forEach(port => {
        if (port.path == path) re = true;
      });
      return re;
    });

    const data = {
      avaible: res,
      data: await checkData()
    }

    // const dataToNum = Number(data.data.replace(/[^a-zA-Z0-9 ]/g, ""));

    checkLogSpace(data.data, portNumber);
  } catch (e) {
    // console.log('Hubo un error en la función de serialCom: ' + e);
    checkLogSpace(("Error caught: ", e.message), portNumber);
    return 'error: ' + e;
  };
};


export const initSindesys = async (port) => {
  try {
    const jsonConfig = await readJson();
    let config = jsonConfig.portTwo;
    if (await port.toString() == '1') config = await jsonConfig.portOne;

    const { path } = await config;

    const portResult = new Promise((resolve, reject) => {
      const serialPort = new SerialPort({
        path: path,
        baudRate: 9600
      });

      serialPort.on('error', (err) => {
        if (serialPort.isOpen) {
          serialPort.close();
        };
        console.error("Error caught: ", err.message);
        reject(("Error caught: ", err.message));
      });

      if (serialPort.isOpen) {
        serialPort.close();
      };

      const parser2 = serialPort.pipe(new ByteLengthParser({ length: Number(2), delimiter: '\r\n', encoding: 'ascii' }));

      parser2.on('data', function (data) {
        try {
          console.log(data.toString());
          if (serialPort.isOpen) {
            serialPort.close();
          };
          resolve(data.toString());
        } catch (e) {
          console.log('Error obteniendo datos de la balanza');
          console.log('Error: ' + e);
          serialPort.close();
          reject(('Error obteniendo datos: ' + e));
        }
      });

      serialPort.write('INIT');
    });

    return await portResult
  } catch (e) {
    console.error('Error al inicializar Sindesys: ', e);
  };
};

export const confSindesys = async (port) => {
  try {
    const jsonConfig = await readJson();
    let config = jsonConfig.portTwo;
    if (await port.toString() == '1') config = await jsonConfig.portOne;

    const { portNumber, path, baudRate, dataBits, parity, stopBits, stringLength } = config;

    const baudRateFixed = () => {
      let b = baudRate.toString();
      const bN = b.length

      for (let i = bN; i < 6; i++) {
        b = '0' + b;
      };

      return b;
    };

    const parityFixed = () => {
      switch (parity) {
        case 'none':
          return 'N';
        case 'odd':
          return 'O';
        case 'even':
          return 'E';
        default:
          return 'N';
      };
    };

    const longFixed = () => {
      if (stringLength > 99) {
        return `${stringLength}`;
      } else if (stringLength > 9) {
        return `0${stringLength}`;
      } else {
        return `00${stringLength}`;
      };
    };

    const command = `CONF${portNumber}${baudRateFixed()}${dataBits}${parityFixed()}${stopBits}${longFixed()}`;

    const portResult = new Promise((resolve, reject) => {
      const serialPort = new SerialPort({
        path: path,
        baudRate: 9600
      });

      serialPort.on('error', (err) => {
        if (serialPort.isOpen) {
          serialPort.close();
        };
        console.error("Error caught: ", err.message);
        reject(("Error caught: ", err.message));
      });

      if (serialPort.isOpen) {
        serialPort.close();
      };

      const parser = serialPort.pipe(new ByteLengthParser({ length: Number(2) }));

      parser.on('data', function (data) {
        try {
          console.log(data.toString());
          if (serialPort.isOpen) {
            serialPort.close();
          };
          resolve(data.toString());
        } catch (e) {
          console.log('Error obteniendo datos de la balanza');
          console.log('Error: ' + e);
          serialPort.close();
          reject(('Error obteniendo datos: ' + e));
        }
      });

      serialPort.write(command);

      setTimeout(() => resolve('ER'), 5000);
    });

    return await portResult;
  } catch (e) {
    console.error('Error al configurar Sindesys: ', e);
  };
};

export const readSindesys = async (port, readLength) => {
  try {
    const jsonConfig = await readJson();
    const confOne = jsonConfig.portOne;
    const confTwo = jsonConfig.portTwo;
    let config = jsonConfig.portTwo;
    if (await port.toString() == '1') config = await jsonConfig.portOne;

    const { path } = config;

    const portResult = new Promise((resolve, reject) => {
      const serialPort = new SerialPort({
        path: path,
        baudRate: 9600,
        lock: false
      });

      serialPort.on('error', (err) => {
        if (serialPort.isOpen) {
          serialPort.close();
        };
        reject(("Error caught: ", err.message));
      });

      if (serialPort.isOpen) {
        serialPort.close();
      };

      const byteParser = new ByteLengthParser({ length: readLength });
      const parser = serialPort.pipe(byteParser);

      parser.on('data', function (data) {
        try {
          const dat = data.toString();
          const regx = /(\W\s*)/g

          const customSplit = () => {
            const splitter = dat?.split('|');
            let readPortOne = splitter[0];
            let readPortTwo = splitter[1];

            let portOneResult = '';
            let portTwoResult = '';
            const oneFrag = readPortOne?.split('');
            const twoFrag = readPortTwo?.split('');

            let regex1 = /\r/g;
            let regex2 = /\n/g;
            let regex3 = /\x02/g;
            let regex4 = /\x03/g;

            let oneStr = readPortOne;
            let oneRep = oneStr?.replace(regex1, "\\r")
              .replace(regex2, "\\n")
              .replace(regex3, "\\x02")
              .replace(regex4, "\\x03");

            let twoStr = readPortTwo;
            let twoRep = twoStr?.replace(regex1, "\\r")
              .replace(regex2, "\\n")
              .replace(regex3, "\\x02")
              .replace(regex4, "\\x03");

            for (let i = 0; i < oneFrag?.length; i++) {
              if (i >= confOne.numberInit && i <= confOne.numberFin) {
                portOneResult = portOneResult + oneFrag[i];
              };
            };

            for (let i = 0; i < twoFrag?.length; i++) {
              if (i >= confTwo.numberInit && i <= confTwo.numberFin) {
                portTwoResult = portTwoResult + twoFrag[i];
              };
            };

            const cleanRes = (portRead) => {
              const rx = portRead?.split(regx);
              let result = [];

              for (let i = 0; i < rx?.length; i++) {
                if (!regx?.test(rx[i]) && rx[i] != '') {
                  result.push(rx[i]);
                };
              };

              return result;
            };

            const newString = `${cleanRes(readPortOne)} | ${cleanRes(readPortTwo)}`;
            const newMethodString = `${oneRep} | ${twoRep}`;

            return [newString, newMethodString];
          };

          if (serialPort.isOpen) {
            serialPort.close();
          };

          const newData = customSplit();

          resolve(newData);
        } catch (e) {
          console.log('Error obteniendo datos de la balanza');
          console.log('Error: ' + e);
          serialPort.close();
          reject(('Error obteniendo datos: ' + e));
        }
      });

      serialPort.write('READ');
    });

    const auth = await licenceAuth();

    if (auth.validation) {
      const promiseRes = await portResult;
      checkLogSpace2(promiseRes[0], "log3");
      checkLogSpace2(promiseRes[1], "log4");
      return await portResult;
    }

    checkLogSpace2(auth.message, "log3");
    return auth.message;
  } catch (e) {
    console.error('Error al leer Sindesys: ', e);
  };
};

export const loopSindesys = async (port) => {
  try {
    const jsonConfig = await readJson();
    let config = jsonConfig.portTwo;
    if (await port.toString() == '1') config = await jsonConfig.portOne;

    const { path } = await config;

    const portResult = new Promise((resolve, reject) => {
      const serialPort = new SerialPort({
        path: path,
        baudRate: 9600,
        lock: false
      });

      serialPort.on('error', (err) => {
        if (serialPort.isOpen) {
          serialPort.close();
        };
        console.error("Error caught: ", err.message);
        reject(("Error caught: ", err.message));
      });

      if (serialPort.isOpen) {
        serialPort.close();
      };

      const parser2 = serialPort.pipe(new ByteLengthParser({ length: Number(2), delimiter: '\r\n', encoding: 'ascii' }));

      parser2.on('data', function (data) {
        try {
          console.log(data.toString());
          if (serialPort.isOpen) {
            serialPort.close();
          };
          resolve(data.toString());
        } catch (e) {
          console.log('Error obteniendo datos de la balanza');
          console.log('Error: ' + e);
          serialPort.close();
          reject(('Error obteniendo datos: ' + e));
        }
      });

      serialPort.write('LOOP');

      setTimeout(() => resolve('ER'), 10000);
    });

    return await portResult
  } catch (e) {
    console.error('Error al inicializar Sindesys: ', e);
  };
};

/*///////////////////*/

function checkLogSpace2(message, fileName) {
  //  INICIALIZAR UNA VARIABLE Y VERIFICAR DE QUE PUERTO SE MANDA
  let logPath = `/home/mgv/${fileName}.txt`;

  //  VERIFICAR EL TAMAÑO DEL LOG Y RETORNAR SU CONTENIDO CORTADO
  fs.readFile(logPath, 'utf8', (err, data) => {
    let lines = [];
    if (!err) {
      lines = data?.split('\n').filter(line => line?.trim() !== '');
    } else if (err.code !== 'ENOENT') {
      console.error('Error leyendo el archivo: ', err);
      return new Error(err);
    };

    if (lines?.length > maxLines) {
      lines = lines?.slice(lines?.length - maxLines);
    };

    logMessage2(message, lines, logPath);
  });
};

function logMessage2(message, lines, logPath) {
  try {
    let newLines = lines;

    //  DESGLOSAR LA HORA PARA QUE QUEDE MEJOR LEGIBLE
    const date = new Date();
    const day = ((date.getDate() + 1) < 10) && ('0' + (date.getDate() + 1)) || date.getDate() + 1;
    const month = ((date.getMonth() + 1) < 10) && ('0' + (date.getMonth() + 1)) || date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = (date.getHours() < 10) && ('0' + date.getHours()) || date.getHours();
    const min = (date.getMinutes() < 10) && ('0' + date.getMinutes()) || date.getMinutes();
    const sec = (date.getSeconds() < 10) && ('0' + date.getSeconds()) || date.getSeconds();

    //  CREAR EL TIMESTAMP Y EL MENSAJE A AGREGAR, LUEGO MPUSHEARLO EN LA LISTA
    const timeStamp = `${year}/${month}/${day} - ${hour}:${min}:${sec} `;
    const logEntry = `${timeStamp} - ${message}`;
    newLines.push(logEntry);

    //  ESTO ES PARA AGREGAR LINEAS AL TXT
    // fs.appendFile(logFilePath, logEntry, (err) => {
    //   if (err) {
    //     console.error('Error escribiendo el archivo log.txt: ', err);
    //   };
    // });

    // HACER DE LA LISTA UN STRING
    const updatedContent = newLines.join('\n');

    // RECREAR EL ARCHIVO DESDE CERO CON LOS NUEVOS DATOS
    fs.writeFile(logPath, updatedContent, (err) => {
      if (err) {
        console.error('Error reescribiendo el archivo log.txt: ', err);
      };
    });
  } catch (error) {
    console.error(error);
  };
};