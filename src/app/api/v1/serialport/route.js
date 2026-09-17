import { NextResponse } from "next/server";

import { readLastLine } from '@/app/helper/portReader.js';
import { publicAuth } from '@/app/helper/auth';

export async function GET(req) {
  try {
    const token = await req.headers.get('authorization');

    if (!token) {
      return NextResponse.json({
        message: 'Unauthorized: No Authorization header',
        validation: false
      }, { status: 401 });
    };

    const authToken = token.split(' ')[1].replace(/[<>]/g, "");

    if (!authToken) {
      return NextResponse.json({
        message: 'Unauthorized: Invalid Authorization header format',
        validation: false
      }, { status: 401 });
    };

    const auth = await publicAuth(authToken);

    if (auth.validation) {
      let split = [];
      let split2 = [];
      const res1 = await readLastLine(1);
      const res2 = await readLastLine(2);
      const res3 = await readLastLine(3);
      const res4 = await readLastLine(4);
      split = res3?.split('|');
      split2 = res4?.split('|');

      return NextResponse.json({
        usb1: res1,
        usb2: res2,
        com1: split2[0],
        com2: split2[1],
      });
    };

    return NextResponse.json({
      message: auth.message
    });

  } catch (e) {
    return NextResponse.json({
      message: e.message
    });
  }
};
