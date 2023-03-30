import React from 'react';

// import styles / components
import Navbar from '@/components/navbar/navbar';
import styles from '../styles/Home.module.css';

export default function Home() {
    return (
        <>
            <Navbar />
            <main className={styles.HomeParent}>
                Im the home
            </main>
        </>
    )
}