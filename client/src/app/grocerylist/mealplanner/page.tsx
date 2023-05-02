'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, {useState} from 'react';

// import styles / components
import Navbar from '@/components/navbar/navbar';
import styles from '@/styles/Mealplanner.module.css';

export default function Signup() {
    
    return (
        <div className={styles.SearchParent}>
        <Navbar />
        <div className={styles.SearchRecipeParent}>
            
        </div>
        </div>
    )
}