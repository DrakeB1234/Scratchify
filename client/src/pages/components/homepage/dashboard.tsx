import Image from 'next/image'
import Link from 'next/link';
import {useState} from 'react';

import styles from './dashboard.module.css';

export default function Dashboard(props: any) {

    const[toggleDashboard, setToggleDashboard] = useState(false);
    
    return (
        <>
        <div className={styles.DashboardToggle}
        onClick={() => setToggleDashboard(!toggleDashboard)}>
            <h1>Your Dashboard</h1> 
            <Image 
            alt='^'
            src='/icons/navigation/icon-left-arrow.svg'
            height={50}
            width={50}
            style={toggleDashboard ? {transform:'rotate(90deg)'} : {transform:'rotate(270deg)'}}
            />
        </div>
        <div className={styles.DashboardParent}
        style={toggleDashboard ? {display: 'flex'} : {display:'none'}}>
            <h1>Good morning!</h1> 
        </div>
        </>
    )
  }