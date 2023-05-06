'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, {useState, useEffect, useRef} from 'react';

// import styles / components
import Navbar from '@/components/navbar/navbar';
import AddMealPopup from './addMealPopup/addMealPopup';
import EditMealPopup from './editMealPopup/editMealPopup';
import styles from '@/styles/Mealplanner.module.css';

// auth
import { GetSessionAuth } from '@/supabasehelpers/auth';
import { AddMealItem, GetSavedRecipes, GetUserMealPlanner } from '@/supabasehelpers/database';

export default function MealPlanner() {

    const router = useRouter();
    const session = useRef<any>();

    // type def

    type Data = {
        id: any;
        date: any;
        mealplanner_meals: {
            date_id: any;
            category: any;
            recipe: any;
            meal: any;
        } | {
            date_id: any;
            category: any;
            recipe: any;
            meal: any;
        }[] | null;
    }[] | null

    const [mealData, setMealData] = useState<Data>([]);
    const [savedRecipeData, setSavedRecipeData] = useState<any>([]);
    const [toggleAddMealPopup, setToggleAddMealPopup] = useState(false);
    const [toggleEditMealPopup, setToggleEditMealPopup] = useState(false);
    const curMealId = useRef<Number>(0);

    // get current date
    let todayDate: any = new Date()
    todayDate = todayDate.toISOString().split('T')[0];

    // checks to see is user has a session
    useEffect(() => {
        const getSession = async () => {
            session.current = await GetSessionAuth()
            session.current = session.current.data.session;
            
            // if session is null, redirect user to signin
            if (session.current == null) return router.replace('/signin');  
            // else, get meal data
            else { getMealData() }          
        };
        getSession();
    }, []);

    const getMealData = async () => {
        const resultPlanner = await GetUserMealPlanner(session.current.user.id);

        if(resultPlanner.type !== 'success') return;

        setMealData(resultPlanner.data);

        const resultSaved = await GetSavedRecipes(session.current.user.id);

        if(resultSaved.type !== 'success') return;

        setSavedRecipeData(resultSaved.data);
        
    }

    // add meal function
    const addMealFunction = (mealId: number) => {
        // set current meal id to pass to popup
        curMealId.current = mealId;
        setToggleAddMealPopup(true);
    }
    // callback add meal function
    const addMealCallbackFunction = async (formVal: any, mealId: number) => {
        setToggleAddMealPopup(false);
        // add meal
        const result = await AddMealItem(formVal, mealId);

        if (result.type !== 'success') return;

        // if success, get new data
        getMealData();
    }

    // edit meal function
    const editMealFunction = () => {
        setToggleEditMealPopup(true);
    }
    
    return (
        <div className={styles.PlannerParent}>

            {toggleAddMealPopup
            ?
            <AddMealPopup
                popupToggle={setToggleAddMealPopup}
                callback={addMealCallbackFunction}
                mealId={curMealId.current}
                savedRecipes={savedRecipeData}
            />
            : <></>
            }
            {toggleEditMealPopup
            ?
            <EditMealPopup
                popupToggle={setToggleEditMealPopup}
                callback={addMealCallbackFunction}
                savedRecipes={savedRecipeData}
            />
            : <></>
            }
            
            <Navbar />
            <div className={styles.PlannerContentParent}>
                <div className={styles.CreateButtonContainer}>
                    <button>Create New Meal Plan</button>
                </div>

                {mealData!.length < 1
                ?
                <div className={styles.EmptyDateContainer}>
                    <h1>No Meal Plan Set!</h1>
                </div>
                :
                <div className={styles.MealParent}>
                    {mealData?.map((e: any, index: number) => {

                        return (

                        <div className={styles.MealParent} key={index + 'a'}>
                            {e.date == todayDate
                            ?
                            <div className={styles.MealItemDate}
                            onClick={() => addMealFunction(e.id)}
                            >
                                <div className={styles.DateItem}>
                                    <h2>{e.date}</h2>
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
                            :
                            <div className={styles.MealItemDate}
                            onClick={() => addMealFunction(e.id)}
                            >
                                <div className={styles.DateItem}>
                                    <h1>{e.date}</h1>
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
                            }
                            {e.mealplanner_meals.length > 0
                            ? e.mealplanner_meals.map((e: any, index: number) => (
                                <>
                                {e.meal != null
                                ?
                                <div className={styles.MealItemContainer} key={index + 'b'}
                                onClick={() => editMealFunction()}
                                >
                                    <h1>{e.category}</h1>
                                    <h2>{e.meal}</h2>
                                    <Image 
                                    alt=''
                                    src='/icons/actions/icon-edit-outline.svg'
                                    height={30}
                                    width={30}
                                    />
                                </div>
                                :
                                <div className={styles.MealItemContainer} key={index + 'c'}
                                onClick={() => editMealFunction()}
                                >
                                    <h1>{e.category}</h1>
                                    <h2>{e.recipe}</h2>
                                    <Link href={'http://localhost:3000/recipe/' + e.recipe}>Go to Recipe &gt;</Link>
                                    <Image 
                                    alt=''
                                    src='/icons/actions/icon-edit-outline.svg'
                                    height={30}
                                    width={30}
                                    />
                                </div>  
                                }
                                </>
                            ))
                            : 
                            <div className={styles.MealItemContainer}>
                                <h2>No Meals Set!</h2>
                            </div>
                            }
                        </div>
                        )
                    })} 
                </div>
                }
            </div>
        </div>
    )
}