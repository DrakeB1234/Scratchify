'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, {useState, useEffect, useRef} from 'react';

// import styles / components
import Navbar from '@/components/navbar/navbar';
import AddMealPopup from './addMealPopup/addMealPopup';
import EditMealPopup from './editMealPopup/editMealPopup';
import AddMealPlanPopup from './addMealPlanPopup/addMealPlanPopup';
import styles from '@/styles/Mealplanner.module.css';

// auth
import { GetSessionAuth } from '@/supabasehelpers/auth';
import { AddMealItem, AddMealPlan, DeleteMealItem, EditMealItem, GetSavedRecipes, GetUserMealPlanner } from '@/supabasehelpers/database';

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
    const [toggleAddMealPlanPopup, setToggleAddMealPlanPopup] = useState(false);
    const curMealId = useRef<Number>(0);
    const curEditData = useRef({
        mealId: 0,
        category: '',
        meal: '',
        recipe: ''
    });

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

    // add meal plan callback function
    const addMealPlanCallbackFunction = async (formVal: any) => {
        const result = await AddMealPlan(formVal, mealData, session.current.user.id);

        if (result!.type !== 'success') return;

        // close popup
        setToggleAddMealPlanPopup(false);
        // if success, get new data
        getMealData();
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
    const editMealFunction = (id: number, category: string, meal: string, recipe: string) => {
        // set current meal data to pass to popup
        curEditData.current = {
            mealId: id,
            category: category,
            meal: meal,
            recipe: recipe
        };
        setToggleEditMealPopup(true);
    }
    // edit meal callback function
    const editMealCallbackFunction = async (formVal: any, mealId: number) => {
        setToggleEditMealPopup(false);
        // edit meal
        const result = await EditMealItem(formVal, mealId);

        if (result.type !== 'success') return;

        // if success, get new data
        getMealData();
    }
    // delete meal callback function
    const deleteMealCallbackFunction = async (mealId: number) => {
        setToggleEditMealPopup(false);
        // edit meal
        const result = await DeleteMealItem(mealId);

        if (result.type !== 'success') return;

        // if success, get new data
        getMealData();
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
                callback={editMealCallbackFunction}
                deleteCallback={deleteMealCallbackFunction}
                savedRecipes={savedRecipeData}
                editData={curEditData.current}
            />
            : <></>
            }
            {toggleAddMealPlanPopup
            ?
            <AddMealPlanPopup
                popupToggle={setToggleAddMealPlanPopup}
                callback={addMealPlanCallbackFunction}
                todayDate={todayDate}
            />
            : <></>
            }
            
            <Navbar />
            <div className={styles.PlannerContentParent}>
                <div className={styles.CreateButtonContainer}>
                    <button
                    onClick={() => setToggleAddMealPlanPopup(true)}
                    >Create New Meal Plan</button>
                </div>

                {mealData!.length < 1
                ?
                <div className={styles.EmptyDateContainer}>
                    <h1>No Meal Plan Set!</h1>
                </div>
                :
                <div className={styles.MealParent}>
                    {mealData?.map((e: any, index: number) => {

                        const weekday = ["SUN","MON","TUES","WED","THUR","FRI","SAT"];

                        let formatDate: any = new Date(e.date);
                        formatDate = `${weekday[formatDate.getDay()]} ${formatDate.getMonth() + 1}/${formatDate.getDate()}`

                        return (

                        <div className={styles.MealParent} key={index + 'a'}>
                            {e.date == todayDate
                            ?
                            <div className={styles.MealItemDate}
                            onClick={() => addMealFunction(e.id)}
                            >
                                <div className={styles.DateItem}>
                                    <h2>{formatDate}</h2>
                                </div>
                                <div>
                                    <Image 
                                    alt=''
                                    src='/icons/actions/icon-plusgreen-outline.svg'
                                    height={20}
                                    width={20}
                                    />
                                </div>
                            </div>  
                            :
                            <div className={styles.MealItemDate}
                            onClick={() => addMealFunction(e.id)}
                            >
                                <div className={styles.DateItem}>
                                    <h1>{formatDate}</h1>
                                </div>
                                <div>
                                    <Image 
                                    alt=''
                                    src='/icons/actions/icon-plusgreen-outline.svg'
                                    height={20}
                                    width={20}
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
                                onClick={() => editMealFunction(e.id, e.category, e.meal, e.recipe)}
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
                                onClick={() => editMealFunction(e.id, e.category, e.meal, e.recipe)}
                                >
                                    <h1>{e.category}</h1>
                                    <h2>{e.recipe}</h2>
                                    <Link href={'/recipe/' + e.recipe}>Go to Recipe &gt;</Link>
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