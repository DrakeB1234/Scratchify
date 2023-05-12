'use client'

import Link from 'next/link';
import Image from 'next/image';
import React, {useState, useRef} from 'react';
import { useForm } from 'react-hook-form';

// import styles / components
import styles from '../addMealPopup/popup.module.css';

// typedef
type Props = {
    popupToggle: any,
    callback?: any,
    todayDate: any,
}

// typedefs
type Inputs = {
    category: string,
    item: string
};

export default function AddMealPlanPopup(props: Props) {

    // typedefs
    type Inputs = {
        date: string,
    };

    const { register, handleSubmit, formState: { errors }, getValues } = useForm<Inputs>({defaultValues: {
        date: props.todayDate
    }});

    const handleSave = (formVal: Inputs) => {
        props.callback(formVal);        
        return;
    }

  return (
    <div className={styles.PopupParent}>
        <div className={styles.PopupChildContainer}>
            <div className={styles.PopupExitContainer}
            onClick={() => props.popupToggle(false)}
            >
                <h1>Add Meal Plan</h1>
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

                <label htmlFor='date'>Start Date</label>
                <input {...register('date', {
                    required: {
                        value: true,
                        message: 'Required'
                    }
                })}
                type='date'
                />

                <label htmlFor='date'>End Date</label>
                <input type='text' value={getValues().date} disabled/>
                    
                <h1 className={styles.FormInputError}>{errors?.date?.message}</h1>

                <h1 className={styles.FormInputHeader}>Meal plans will be 1 week long</h1>

                <button type='submit' className={styles.SaveButton}>Add Plan</button>

            </form>
        </div>
    </div>
  )
}
