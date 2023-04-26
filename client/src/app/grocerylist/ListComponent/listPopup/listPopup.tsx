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
    editId?: any,
    callbackEdit?: any,
    callbackDelete?: any,
    listData?: any
}

// typedefs
type Inputs = {
    category: string,
    item: string
};

export default function Popup(props: Props) {

    const idData = useRef(0);
    const categoryData = useRef('');
    const itemData = useRef('');

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const handleSave = (formVal: any) => {
        return EditItemFunction(formVal);
    }

    // find data by id
    props.listData.map((e: any) => {
        if(e.id === props.editId){
            // set values to found data
            if (e.category === null) categoryData.current = 'none';
            else categoryData.current = e.category;
            itemData.current = e.item;
            idData.current = e.id;
        }
    });

    // delete item function
    const DeleteItemFunction = () => {
        props.callbackDelete(idData.current)
    }

    // edit item function
    const EditItemFunction = (formVal: any) => {
        // check to see if any changes made
        if (formVal.item == itemData.current && formVal.category == categoryData.current) return;
        // else, use callback function to send form data to parent component
        else props.callbackEdit(formVal, idData.current)
    }

  return (
    <div className={styles.PopupParent}>
        <div className={styles.PopupChildContainer}>
            <div className={styles.PopupExitContainer}
            onClick={() => props.popupToggle(false)}
            >
                <h1>Edit Item</h1>
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

                <label htmlFor='course'>Category</label>
                <select {...register('category', {
                    required: {
                        value: true,
                        message: 'Required'
                    },
                    pattern: {
                        value: /^none|Produce$/,
                        message: 'Must select item in list only'
                    }
                })} defaultValue={categoryData.current}>
                    <option value='none'>Uncategorized</option>
                    <option value='Produce'>Produce</option>
                </select>
                <h1 className={styles.FormInputError}>{errors?.category?.message}</h1>

                <label htmlFor=''>Item</label>
                <input {...register('item', {
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
                autoComplete='off' defaultValue={itemData.current}
                />
                <h1 className={styles.FormInputError}>{errors?.item?.message}</h1>

                <div className={styles.FormButtonContainer}>
                    <button type='button'
                    onClick={() => DeleteItemFunction()}
                    >Delete</button>
                    <button type='submit'>Save</button>
                </div>

            </form>
        </div>
    </div>
  )
}
