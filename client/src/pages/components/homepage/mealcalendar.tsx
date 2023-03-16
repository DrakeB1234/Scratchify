import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import {useState} from 'react';

import styles from './mealcalendar.module.css';

export default function MealCalendar(props: any) {
    
    return (  
        <div className={styles.MealCalendarParent}>
            <h1>Good Morning!</h1>
            <h2>Apr 14</h2>
            <div className={styles.MealCalendarIcons}>
                <Image 
                alt='Morning'
                src='/icons/icon-morning.svg'
                height={50}
                width={50}
                />
                <Image 
                alt='Day'
                src='/icons/icon-day.svg'
                height={50}
                width={50}
                />
                <Image 
                alt='Night'
                src='/icons/icon-night.svg'
                height={40}
                width={40}
                />
            </div>
        </div>
    )
  }