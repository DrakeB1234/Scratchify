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
    category: string,
};

export default function SortPopup(props: Props) {

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    
    const handleSave = (formVal: any) => {
        // callback function
        props.callback(formVal);
    }

  return (
    <div className={styles.PopupParent}>
        <div className={styles.PopupChildContainer}>
            <div className={styles.PopupExitContainer}
            onClick={() => props.popupToggle(false)}
            >
                <h1>Sort Options</h1>
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

                <label htmlFor='category'>Sort by</label>
                <select {...register('category', {
                    required: {
                        value: true,
                        message: 'Required'
                    },
                    pattern: {
                        value: /^Category|Recipe$/,
                        message: 'Must select item from list'
                    }
                })}>
                    <option value='Category'>Category</option>
                    <option value='Recipe'>Recipe</option>
                </select>
                <h1 className={styles.FormInputError}>{errors.category?.message}</h1>

                <button type='submit' className={styles.SaveButton}>Sort</button>

            </form>
        </div>
    </div>
  )
}
