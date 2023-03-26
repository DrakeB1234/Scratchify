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
            src='/icons/navigation/icon-left-orangearrow.svg'
            height={50}
            width={50}
            style={toggleDashboard ? {transform:'rotate(90deg)'} : {transform:'rotate(270deg)'}}
            />
        </div>
        <div className={styles.DashboardParent}
        style={toggleDashboard ? {display: 'flex'} : {display:'none'}}>
            <div className={styles.DashboardContent}>
                <h1>My Dashboard</h1>
                <div className={styles.DashboardLinks}>
                    <Link href='/mealplanner'>Meal Planner</Link>
                    <Link href='/grocerylist'>Grocery List</Link>
                    <Link href='/myrecipes'>My Recipes</Link>
                </div>
                <div className={styles.DashboardMeal}>
                    <h1>Todays Meal</h1>
                    <h2>Apr 13 | Lunch</h2>
                    <Link href='/mealplanner'>
                        <Image 
                        alt='recipeimg'
                        src='/recipeimageexample.jpg'
                        height={200}
                        width={200}
                        />
                        <h1>Zuchini Stew</h1>
                    </Link>
                </div>
            </div>
        </div>
        </>
    )
  }