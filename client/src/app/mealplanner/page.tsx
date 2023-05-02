'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, {useState, useEffect, useRef} from 'react';

// import styles / components
import Navbar from '@/components/navbar/navbar';
import styles from '@/styles/Mealplanner.module.css';

// auth
import { GetSessionAuth } from '@/supabasehelpers/auth';

export default function MealPlanner() {

    const router = useRouter();
    const session = useRef<any>();

    // checks to see is user has a session
    useEffect(() => {
        const getSession = async () => {
            session.current = await GetSessionAuth()
            session.current = session.current.data.session;
            
            // if session is null, redirect user to signin
            if (session.current == null) return router.replace('/signin');
            // else return getRecipes();
        };
        getSession();
    }, []);
    
    return (
        <div className={styles.PlannerParent}>
        <Navbar />
            <div className={styles.PlannerContentParent}>
                <div className={styles.CreateButtonContainer}>
                    <button>Create Meal Plan</button>
                </div>
                {/* <div className={styles.EmptyDateContainer}>
                    <h1>No Meal Plan Set!</h1>
                </div> */}
                <div className={styles.MealParent}>
                    <div className={styles.MealItemParentToday}>
                        <h1>Todays Meal</h1>
                        <div className={styles.MealItemDate}>
                            <div>
                                <h1>Mon Apr 13</h1>
                            </div>
                            <div>
                                <Image 
                                alt=''
                                src='/icons/actions/icon-plusgreen-outline.svg'
                                height={30}
                                width={30}
                                />
                            </div>
                        </div>
                        <div className={styles.MealItemContainer}>
                            <h1>Breakfast</h1>
                            <h2>Oatmeal</h2>
                        </div>
                        <Link href={''} className={styles.MealItemContainer}>
                            <h1>Dinner</h1>
                            <h2>Zuchini Casserole</h2>
                            <h3>Go to Recipe &gt;</h3>
                        </Link>  
                    </div>

                    <div className={styles.MealItemParent}>
                        <div className={styles.MealItemDate}>
                            <div>
                                <h1>Mon Apr 13</h1>
                            </div>
                            <div>
                                <Image 
                                alt=''
                                src='/icons/actions/icon-plusgreen-outline.svg'
                                height={30}
                                width={30}
                                />
                            </div>
                        </div>
                        <div className={styles.MealItemContainer}>
                            <h1>Breakfast</h1>
                            <h2>Oatmeal</h2>
                        </div>
                        <Link href={''} className={styles.MealItemContainer}>
                            <h1>Dinner</h1>
                            <h2>Zuchini Casserole</h2>
                            <h3>Go to Recipe &gt;</h3>
                        </Link>  
                    </div>
                </div>
            </div>
        </div>
    )
}