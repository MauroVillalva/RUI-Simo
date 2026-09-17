'use client'

import { useEffect, useState } from 'react';

import { dateHandler } from '@/app/helper/helpers.js';

const Square = ({ port, error, weight, styles, statusChar, statusBo }) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setDate(new Date());
    }, 1000);
  }, []);

  const { day, month, year, hour, min, sec } = dateHandler(date);

  return <div className={styles.portContainer}>
    <h1 className={styles.portTitle}>{`PUERTO ${port}`}</h1>
    <div className={styles.portReadingContainer}>
      <p className={styles.portReadingContainerTitle}>LECTURA</p>
      <div className={styles.portReadingWeightContainer}>
        <p className={styles.portReadingWeightContainerWeight}>{weight}</p>
        <div className={styles.portReadingWeightContainerStatus}>
          <p className={styles.portReadingWeightContainerStatusChar}>{(statusBo && statusChar) && statusChar || ''}</p>
          <p className={styles.portReadingWeightContainerStatusTitle}>ESTADO</p>
        </div>
        <div className={styles.portReadingDateContainer}>
          <p className={styles.portReadingDateContainerDate} suppressHydrationWarning={true}>{error && '00/00/0000' || `${day}/${month}/${year}`}</p>
          <p className={styles.portReadingDateContainerHour} suppressHydrationWarning={true}>{error && '00:00:00' || `${hour}:${min}:${sec}`}</p>
        </div>
      </div>
      <p className={styles.portReadingContainerLoading}>{error && 'INACTIVO' || 'ACTIVO'}</p>
    </div>
  </div>
};

export default Square;