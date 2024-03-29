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
    deleteCallback: any,
    savedRecipes?: any,
    editData?: any
}

// typedefs
type Inputs = {
    category: string,
    item: string
};

export default function EditMealPopup(props: Props) {

    const [curInputType, setCurInputType] = useState('text'); 

    // typedefs
    type Inputs = {
        meal: string,
        category: string,
        recipe: string
    };

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<Inputs>({defaultValues: {
        category: props.editData.category,
        recipe: props.editData.recipe,
        meal: props.editData.meal
    }});

    const [saveInput, setSaveInput] = useState(false);

    const handleSave = (formVal: Inputs) => {
        // check if any changes were made, if so close popup without API call
        if (formVal.category == props.editData.category && formVal.meal == props.editData.meal && formVal.recipe == props.editData.recipe) {
            return props.popupToggle(false);
        }
        // send formVal to callback function
        props.callback(formVal, props.editData.mealId);
        return setSaveInput(true);
    }

    // function to delete meal
    const deleteMealFunction = () => {
        props.deleteCallback(props.editData.mealId)
    }

    // function to change input types
    const changeInputType = (input: string) => {
        if (input == 'text'){
            // reset meal value on change
            setValue('recipe', '')
            setValue('meal', props.editData.meal)
            return setCurInputType('text');
        } else {
            setValue('meal', '')
            setValue('recipe', props.editData.recipe)
            return setCurInputType('recipe');
        }
    }

  return (
    <div className={styles.PopupParent}>
        <div className={styles.PopupChildContainer}>
            <div className={styles.PopupExitContainer}
            onClick={() => props.popupToggle(false)}
            >
                <h1>Edit Meal</h1>
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

                <div className={styles.FormButtonContainer}>
                    <button type='button'
                    onClick={() => deleteMealFunction()}
                    >Delete</button>
                    <button type='submit'>Save</button>
                </div>

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

                <div className={styles.FormButtonContainer}>
                    <button type='button'
                    onClick={() => deleteMealFunction()}
                    >Delete</button>
                    <button type='submit'>Save</button>
                </div>

            </form>
            }
        </div>
    </div>
  )
}
