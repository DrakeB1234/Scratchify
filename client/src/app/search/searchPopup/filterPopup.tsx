'use client'

import Link from 'next/link';
import Image from 'next/image';
import React, {useState} from 'react';
import { useForm } from 'react-hook-form';

// import styles / components
import styles from './popup.module.css';

// typedef
type Props = {
    popupToggle?: any,
    callback?: any
}

// typedefs
type Inputs = {
    course: string,
    tagInput: string
};

export default function Popup(props: Props) {

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    
    const handleSave = (formVal: any) => {

    }

  return (
    <div className={styles.PopupParent}>
        <div className={styles.PopupChildContainer}>
            <div className={styles.PopupExitContainer}
            onClick={() => props.popupToggle(false)}
            >
                <h1>Filter Options</h1>
                <Image 
                  alt='o'
                  src='/icons/actions/icon-plusred-outline.svg'
                  height={50}
                  width={50}
                />
            </div>
            <form className={styles.FormParent}
            onSubmit={(handleSubmit(handleSave))}
            >

                <label htmlFor='course'>Course Filter</label>
                <select {...register('course', {
                    required: {
                        value: true,
                        message: 'Required'
                    },
                    pattern: {
                        value: /^Breakfast|Lunch|Dinner|Dessert|Snack$/,
                        message: 'Must select Breakfast, Lunch, Dinner, Snack, or Dessert'
                    }
                })}>
                    <option value=''>None</option>
                    <option value='Breakfast'>Breakfast</option>
                    <option value='Lunch'>Lunch</option>
                    <option value='Dinner'>Dinner</option>
                    <option value='Snack'>Snack</option>
                    <option value='Dessert'>Dessert</option>
                </select>
                <h1 className={styles.FormInputError}>{errors?.course?.message}</h1>

                <label htmlFor=''>Tag Filters</label>
                <div className={styles.FormTagInputContainer}>
                    <input {...register('tagInput', {
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
                    <Image 
                    alt='o'
                    src='/icons/actions/icon-plusgreen-outline.svg'
                    height={50}
                    width={50}
                    />
                </div>
                <h1 className={styles.FormInputError}>{errors?.tagInput?.message}</h1>

            </form>
        </div>
    </div>
  )
}
