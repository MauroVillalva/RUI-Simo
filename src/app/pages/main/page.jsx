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

  const [licenceMessage, setLicenceMessage] = useState('');
  const [licenceWarning, setLicenceWarning] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchLicenceStatus();

    const intervalid = setInterval(async () => {
      await fetchLogData(1);
      await fetchLogData(2);
    }, 1000);

    return () => clearInterval(intervalid);
  }, []);

  const fetchLicenceStatus = async () => {
    try {
      const response = await fetch('/api/v1/licence', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
        },
      });

      const data = await response.json();

      if (!data?.validation || !data?.data?.fechaFin) {
        return;
      }

      const expirationDate = new Date(data.data.fechaFin);
      const now = new Date();

      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      const daysRemaining = Math.ceil(
        (expirationDate.getTime() - now.getTime()) / millisecondsPerDay
      );

      if (daysRemaining > 30) {
        setLicenceMessage('Licencia activa');
        setLicenceWarning(false);
      } else if (daysRemaining > 1) {
        setLicenceMessage(`Su licencia expira en ${daysRemaining} días`);
        setLicenceWarning(true);
      } else if (daysRemaining === 1) {
        setLicenceMessage('Su licencia expira en 1 día');
        setLicenceWarning(true);
      } else {
        setLicenceMessage('Su licencia expira hoy');
        setLicenceWarning(true);
      }
    } catch (err) {
      console.error('Error al consultar la licencia:', err.message);
    }
  };

  const fetchLogData = async (port) => {
    try {
      const logData = await readWeight(port);
      const { weight, validWeight, statusChar, error, message, statusBo } = logData;

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

      if (portCheck) {
        setErrOne(false);

        if (validWeight) {
          setWeightOne(weight);
        };
      } else {
        setErrTwo(false);

        if (validWeight) {
          setWeightTwo(weight);
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

    {licenceMessage && (
      <div className={`${Styles.licenceStatus} ${licenceWarning ? Styles.licenceWarning : Styles.licenceActive}`}>
        {licenceMessage}
      </div>
    )}
    
    <button className={Styles.configButtonBack} onClick={handleClick}>CONFIG</button>
  </div>
};