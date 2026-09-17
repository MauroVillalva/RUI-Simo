import { exec } from 'child_process';

export async function rebootSystem() {
  exec('sudo /sbin/reboot', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
};