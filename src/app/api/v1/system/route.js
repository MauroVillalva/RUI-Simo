import { NextResponse } from "next/server";
import { exec } from 'child_process';

async function rebootSystem() {
  exec('sudo /sbin/reboot', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
};

export async function GET() {
  try {
    rebootSystem();
    return NextResponse.json({
      data: 'Petición realizada con éxito!'
    });

  } catch (e) {
    return NextResponse.json({
      message: e.message
    });
  }
};
