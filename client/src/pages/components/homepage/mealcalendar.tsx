import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import {useState} from 'react';

import styles from './mealcalendar.module.css';

export default function MealCalendar(props: any) {
    
    return (  
        <div className={styles.MealCalendarParent}>
            <h1>Good Morning!</h1>
            <h2>04/12</h2>
            <div className={styles.MealCalendarTimes}>
                <div className={styles.Active}>
                    <Image 
                    alt='Morning'
                    src='/icons/icon-morning.svg'
                    height={50}
                    width={50}
                    />
                    <h1>8 am</h1>
                </div>  
                <div>
                    <Image 
                    alt='Day'
                    src='/icons/icon-day.svg'
                    height={50}
                    width={50}
                    />
                    <h1>12 am</h1>
                </div>  
                <div>
                    <Image 
                    alt='Night'
                    src='/icons/icon-night.svg'
                    height={50}
                    width={50}
                    />
                    <h1>5 pm</h1>
                </div>     
            </div>
            <Link href='/' className={styles.MealCalendarItem}>
                <Image 
                alt='recipe image'
                src='/recipeimageexample.jpg'
                height={200}
                width={200}
                />
                <h1>Tuna flaffel</h1>
            </Link>   
        </div>
    )
  }