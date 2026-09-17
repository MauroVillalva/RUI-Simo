'use server'

import jwt from 'jsonwebtoken';
import { readFile } from '@/app/utils/fileHandle'

export async function licenceAuth() {
  try {
    const decoded = jwt.verify(await readFile(process.env.NEXT_SERIAL), process.env.NEXT_SECRET_KEY);

    const productVer = () => {
      let verification = false;

      decoded.productos.forEach(item => {
        if (item == 'rui') verification = true;
      });

      return verification;
    };

    if (!productVer()) {
      return {
        message: 'Unauthorized: Invalid Product Key',
        validation: false
      };
    };

    if (new Date(decoded.fechaFin) < new Date()) {
      return {
        message: 'Licencia expirada, contacte con el proveedor',
        validation: false
      };
    };

    return {
      data: decoded,
      validation: true
    };

  } catch (e) {
    return {
      message: 'Error al comprobar la licencia: ' + e,
      validation: false
    };
  };
};

export async function publicAuth(key) {
  try {
    const authToken = key;

    if (!authToken) {
      return {
        message: 'Unauthorized: No Authorization header',
        validation: false
      };
    };

    const decodedAuth = jwt.verify(authToken, process.env.NEXT_API_SECRET_KEY);

    if (!decodedAuth.serie) {
      return {
        message: 'Unauthorized: Invalid Authorization',
        validation: false
      };
    };

    const decoded = jwt.verify(await readFile(process.env.NEXT_SERIAL), process.env.NEXT_SECRET_KEY);

    const productVer = () => {
      let verification = false;

      decoded.productos.forEach(item => {
        if (item == 'rui') verification = true;
      });

      return verification;
    };

    if (decodedAuth.serie != decoded.serie || !productVer()) {
      return {
        message: 'Unauthorized: Invalid Product Key',
        validation: false
      };
    };

    if (new Date(decoded.fechaFin) < new Date()) {
      return {
        message: 'Licencia expirada, contacte con el proveedor',
        validation: false
      };
    };

    return {
      data: decoded,
      validation: true
    };

  } catch (e) {
    console.error('Token verification failed:', e.message);
    return {
      message: e.message,
      validation: false
    };
  };
}