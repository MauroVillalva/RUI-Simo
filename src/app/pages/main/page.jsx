'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { readWeight } from '@/app/components/controllers/weightController.jsx';

import Square from '@/app/components/shared/Square';
import Styles from './page.module.css';

export default function MainPage() {
  const [weightOne, setWeightOne] = useState(0);
  const [signOne, setSignOne] = useState('');
  const [statusOne, setStatusOne] = useState(false);
  const [errOne, setErrOne] = useState(false);

  const [weightTwo, setWeightTwo] = useState(0);
  const [signTwo, setSignTwo] = useState('');
  const [statusTwo, setStatusTwo] = useState(false);
  const [errTwo, setErrTwo] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const intervalid = setInterval(async () => {
      await fetchLogData(1);
      await fetchLogData(2);
    }, 1000);
    intervalid;
  }, []);

  const fetchLogData = async (port) => {
    try {
      const logData = await readWeight(port);
      const { weight, statusChar, error, message, statusBo } = logData;

      const portCheck = port.toString() == '1';

      if (error) {
        throw new Error(message);
      };

      if (portCheck) {
        setSignOne(statusChar);
        setStatusOne(statusBo.toString().toLowerCase() == 'true');
      } else {
        setSignTwo(statusChar);
        setStatusTwo(statusBo.toString().toLowerCase() == 'true');
      };

      if (weight.toString() != 'NaN') {
        if (portCheck) {
          setErrOne(false);
          setWeightOne(weight);
        } else {
          setErrTwo(false);
          setWeightTwo(weight);
        };
      } else {
        if (portCheck) {
          setErrOne(true);
        } else {
          setErrTwo(true);
        };
      };
    } catch (err) {
      console.error("Error caught Front:", err.message);
      setErrOne(true);
      setErrTwo(true);
      setWeightOne('-');
      setWeightTwo('-');
    };
  };

  const handleClick = (e) => {
    e.preventDefault();
    router.push('/pages/config');
  };

  return <div className={Styles.mainContainer}>
    <div className={Styles.portsContainer}>
      <Square port={1} error={errOne} weight={weightOne} styles={Styles} statusChar={signOne} statusBo={statusOne} />
      <Square port={2} error={errTwo} weight={weightTwo} styles={Styles} statusChar={signTwo} statusBo={statusTwo} />
    </div>
    <button className={Styles.configButtonBack} onClick={handleClick}>CONFIG</button>
  </div>
};