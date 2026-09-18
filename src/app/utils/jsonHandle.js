'use server'

import fs from 'fs';

export const readJson = async () => {
  const data = new Promise((resolve, reject) => {
    fs.readFile('/home/mgv/config.json', 'utf8', (err, data) => {
      if (err) {
        reject(`Error reading file (readJson): ${err}`);
        return;
      }
      resolve(data);
    });
  });
  const jsonConfig = JSON.parse(await data);
  return jsonConfig;
};

export const writeJson = async (data) => {
  const jsonString = JSON.stringify(data, null, 2);

  try {
    await fs.promises.writeFile('/home/mgv/config.json', jsonString);
    console.log('JSON data written successfully!');
  } catch (err) {
    console.error(`Error writing file (writeJson): ${err}`);
    throw err;
  };
};
