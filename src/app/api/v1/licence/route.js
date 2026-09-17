import fs from 'fs';
import jwt from 'jsonwebtoken';
import { NextResponse } from "next/server";

import { readFile } from '@/app/utils/fileHandle'

export async function GET(req) {
  try {
    const apiSecret = process.env.NEXT_API_SECRET_KEY;
    const auth = await req.headers.get('authorization');

    if (!auth) {
      return NextResponse.json({
        message: 'Unauthorized: No Authorization header',
        validation: false
      }, { status: 401 });
    };

    const authToken = auth.split(' ')[1].replace(/[<>]/g, "");

    if (!authToken) {
      return NextResponse.json({
        message: 'Unauthorized: Invalid Authorization header format',
        validation: false
      }, { status: 401 });
    };

    const decodedAuth = jwt.verify(authToken, apiSecret);

    if (!decodedAuth.serie) {
      return NextResponse.json({
        message: 'Unauthorized: Invalid Authorization',
        validation: false
      }, { status: 401 });
    };

    const token = await readFile(process.env.NEXT_SERIAL);

    const decoded = jwt.verify(token, process.env.NEXT_SECRET_KEY);

    const productVer = () => {
      let verification = false;

      decoded.productos.forEach(item => {
        if (item == 'rui') verification = true;
      });

      return verification;
    };

    if (decodedAuth.serie != decoded.serie || !productVer()) {
      return NextResponse.json({
        message: 'Unauthorized: Invalid Product Key',
        validation: false
      }, { status: 401 });
    };

    if (new Date(decoded.fechaFin) < new Date()) {
      return NextResponse.json({
        message: 'Licencia expirada, contacte con el proveedor',
        data: decoded,
        validation: false
      }, { status: 200 });
    };

    return NextResponse.json({
      data: decoded,
      validation: true
    });

  } catch (e) {
    console.error('Token verification failed:', e.message);
    return NextResponse.json({
      message: e.message,
      validation: false
    }, { status: 400 });
  };
};

export async function POST(req) {
  try {
    const apiSecret = process.env.NEXT_API_SECRET_KEY;
    const auth = await req.headers.get('authorization');
    const { newLic } = await req.json();
    console.log(newLic);

    if (!auth) {
      return NextResponse.json({
        message: 'Unauthorized: No Authorization header',
        validation: false
      }, { status: 401 });
    };

    const authToken = auth.split(' ')[1].replace(/[<>]/g, "");

    if (!authToken) {
      return NextResponse.json({
        message: 'Unauthorized: Invalid Authorization header format',
        validation: false
      }, { status: 401 });
    };

    const decodedAuth = jwt.verify(authToken, apiSecret);

    if (!decodedAuth.serie) {
      return NextResponse.json({
        message: 'Unauthorized: Invalid Authorization',
        validation: false
      }, { status: 401 });
    };

    const secret = process.env.NEXT_SECRET_KEY;
    const token = await readFile(process.env.NEXT_SERIAL);

    if (newLic == token) {
      return NextResponse.json({
        message: 'Problem: Same Token provided',
        validation: false
      }, { status: 400 });
    };

    const decoded = jwt.verify(newLic, secret);

    const productVer = () => {
      let verification = false;

      decoded.productos.forEach(item => {
        if (item == 'rui') verification = true;
      });

      return verification;
    };

    if (decodedAuth.serie != decoded.serie || !productVer()) {
      return NextResponse.json({
        message: 'Unauthorized: Invalid Product Key',
        validation: false
      }, { status: 401 });
    };

    if (new Date(decoded.fechaFin) < new Date()) {
      return NextResponse.json({
        message: 'Licencia expirada, contacte con el proveedor',
        validation: false
      }, { status: 401 });
    };

    const genLic = async () => {
      fs.writeFile(`/home/mgv/${decoded.serie}.licence`, newLic, (err) => {
        if (err) {
          console.error('Error writing file:', err);
          return;
        };
        console.log('Licence data written successfully!');
      });

      console.log('licencia generada con éxito:');
      console.log(decoded);
    };

    await genLic();

    return NextResponse.json({
      data: decoded,
      validation: true
    });

  } catch (e) {
    console.error('Token verification failed:', e.message);
    return NextResponse.json({
      message: e.message,
      validation: false
    }, { status: 400 });
  };
};
