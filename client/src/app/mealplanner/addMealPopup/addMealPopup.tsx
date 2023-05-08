'use client'

import Link from 'next/link';
import Image from 'next/image';
import React, {useState, useRef} from 'react';
import { useForm } from 'react-hook-form';

// import styles / components
import styles from './popup.module.css';

// typedef
type Props = {
    popupToggle: any,
    callback: any,
    mealId?: any,
    savedRecipes?: any
}

// typedefs
type Inputs = {
    category: string,
    item: string
};

export default function addMealPopup(props: Props) {

    const [curInputType, setCurInputType] = useState('text'); 

    // typedefs
    type Inputs = {
        meal: string,
        category: string,
        recipe: string
    };

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({defaultValues: {
        recipe: '',
        meal: ''
    }});

    const [saveInput, setSaveInput] = useState(false);

    const handleSave = (formVal: Inputs) => {
        // send formVal to callback function
        props.callback(formVal, props.mealId);
        return setSaveInput(true);
    }

    // function to change input types
    const changeInputType = (input: string) => {
        if (input == 'text'){
            return setCurInputType('text');
        } else {
            return setCurInputType('recipe');
        }
    }

  return (
    <div className={styles.PopupParent}>
        <div className={styles.PopupChildContainer}>
            <div className={styles.PopupExitContainer}
            onClick={() => props.popupToggle(false)}
            >
                <h1>Add Meal</h1>
                <Image 
                  alt='o'
                  src='/icons/actions/icon-plusred-outline.svg'
                  height={50}
                  width={50}
                />
            </div>
            <div className={styles.PopupInputButtonContainer}>
                <button className={curInputType == 'text' ? styles.PopupInputButtonActive : ''}
                onClick={() => changeInputType('text')}
                >Text</button>
                <button className={curInputType == 'recipe' ? styles.PopupInputButtonActive : ''}
                onClick={() => changeInputType('recipe')}
                >Recipe</button>
            </div>
            {curInputType == 'text'
            ?
            <form className={styles.FormParent}
            onSubmit={(handleSubmit(handleSave))}
            >

                <label htmlFor='category'>Category</label>
                <select {...register('category', {
                    required: {
                        value: true,
                        message: 'Required'
                    },
                    pattern: {
                        value: /^Breakfast|Lunch|Dinner|Dessert|Snack$/,
                        message: 'Must select Breakfast, Lunch, Dinner, Snack, or Dessert'
                    }
                })}>
                    <option value='Breakfast'>Breakfast</option>
                    <option value='Lunch'>Lunch</option>
                    <option value='Dinner'>Dinner</option>
                    <option value='Snack'>Snack</option>
                    <option value='Dessert'>Dessert</option>
                </select>
                <h1 className={styles.FormInputError}>{errors?.category?.message}</h1>

                <label htmlFor='meal'>Meal</label>
                <input {...register('meal', {
                    required: {
                        value: true,
                        message: 'Required'
                    },
                    minLength: {
                        value: 3,
                        message: 'Must be at least 3 characters'
                    },
                    maxLength: {
                        value: 40,
                        message: 'Must be less than 40 characters'
                    },
                    pattern: {
                        value: /^[^\s][\w\s-()]{0,}$/,
                        message: 'Must not start with space, only letters, numbers, spaces, and - ( )'
                    }
                })}
                autoComplete='off'
                />
                <h1 className={styles.FormInputError}>{errors?.meal?.message}</h1>

                {!saveInput 
                ? <button type='submit' className={styles.SaveButton}>Add</button>
                : <button type='submit' className={styles.SavedButton}>Changes Saved!</button>
                }

            </form>
            :
            <form className={styles.FormParent}
            onSubmit={(handleSubmit(handleSave))}
            >

                <label htmlFor='category'>Category</label>
                <select {...register('category', {
                    required: {
                        value: true,
                        message: 'Required'
                    },
                    pattern: {
                        value: /^Breakfast|Lunch|Dinner|Dessert|Snack$/,
                        message: 'Must select Breakfast, Lunch, Dinner, Snack, or Dessert'
                    }
                })}>
                    <option value='Breakfast'>Breakfast</option>
                    <option value='Lunch'>Lunch</option>
                    <option value='Dinner'>Dinner</option>
                    <option value='Snack'>Snack</option>
                    <option value='Dessert'>Dessert</option>
                </select>
                <h1 className={styles.FormInputError}>{errors?.category?.message}</h1>

                <label htmlFor='recipe'>Recipe</label>
                <select {...register('recipe', {
                    required: {
                        value: true,
                        message: 'Required'
                    }
                })}>
                    {props.savedRecipes.map((e: any, index: number) => (
                        <option key={index} value={e.recipe.title}>{e.recipe.title}</option>
                    ))}
                </select>
                <h1 className={styles.FormInputError}>{errors?.recipe?.message}</h1>

                {!saveInput 
                ? <button type='submit' className={styles.SaveButton}>Save Changes</button>
                : <button type='submit' className={styles.SavedButton}>Changes Saved!</button>
                }

            </form>
            }
        </div>
    </div>
  )
}
