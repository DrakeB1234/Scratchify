'use client'

import Image from 'next/image';
import React, {useEffect, useState, useRef} from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';

// import styles / components
import Popup from '@/components/popup/popup';
import styles from './listPopup.module.css';

// typedefs
type Props = {
    popupToggle: any,
    data: any,
    callback: any
}

// typedefs
type Inputs = {
    ingredient: [{
        name: string,
        category: string
    }]
};

export default function ListPopup(props: Props) {

    const { control, handleSubmit, register, formState: {errors} } = useForm({
        defaultValues: {
            ingredient: [{
                name: '',
                category: 'none'
            }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        name: 'ingredient',
        control,
        rules: {
            required: 'Must have at least 1 ingredient',
        }
    });

    const handleSave = (formVal: any) => {
        props.callback(formVal);
    }

    // populate array with data if in state
    const setArrayData = () => {
        // if value in state, append values
        if(props.data.recipe_ingredients[0] != ''){
            // drop empty value in array
            remove(0);
            props.data.recipe_ingredients.map((e: any) => {
                append({
                    name: `${e.amount} ${e.ingredient}`,
                    category: 'none'
                })
            })
            // check to see if spices are in data
            if(props.data.recipe_spices[0] != ''){
                props.data.recipe_spices.map((e: any) => {
                    append({
                        name: `${e.spice}`,
                        category: 'none'
                    })
                })
            } 
        } 
    }

    useEffect(() => {
        setArrayData();
    }, [])

    return (         
        <div className={styles.PopupParent}>
        <div className={styles.PopupChildContainer}>
            <div className={styles.PopupExitContainer}
            onClick={() => props.popupToggle(false)}
            >
                <h1>Add to List</h1>
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
                {fields.map((field: any, index:  number) => (
                    <div key={field.id} className={styles.InputDynamicItem}>

                        <div className={styles.InputDynamicLabel}>
                            <label htmlFor='tag'>Ingredient {index + 1}</label>
                            <Image 
                            alt='x'
                            src='/icons/actions/icon-plusred-outline.svg'
                            height={50}
                            width={50}
                            onClick={() => {
                                if (fields.length > 1){
                                    remove(index);
                                }
                            }}
                            />
                        </div>

                        <select {...register(`ingredient.${index}.category`, {
                            required: {
                                value: true,
                                message: 'Required'
                            },
                            pattern: {
                                value: /^none|Produce|Frozen|Dairy|Meat|Canned & Packed Goods|Condiments|Beverages|House Goods|Others$/,
                                message: 'Must select item in list only'
                            }
                        })}>
                            <option value='none'>Uncategorized</option>
                            <option value='Produce'>Produce</option>
                            <option value='Frozen'>Frozen</option>
                            <option value='Dairy'>Dairy</option>
                            <option value='Meat'>Meat</option>
                            <option value='Canned & Packed Goods'>Canned & Packed Goods</option>
                            <option value='Condiments'>Condiments</option>
                            <option value='Beverages'>Beverages</option>
                            <option value='House Goods'>House Goods</option>
                            <option value='Others'>Others</option>
                        </select>
                        <h1 className={styles.FormInputError}>{errors.ingredient?.[index]?.category?.message}</h1>

                        <input {...register(`ingredient.${index}.name`, {
                            required: {
                                value: true,
                                message: 'Required'
                            },
                            minLength: {
                                value: 3,
                                message: 'Tag must be at least 3 characters'
                            },
                            maxLength: {
                                value: 30,
                                message: 'Tag must be at less than 30 characters'
                            },
                            pattern: {
                                value: /^[^\s][\w\s!@#$%^&*()-~`'_+{}|/:;"<>?\[\]\',.\/\\]{0,}$/,
                                message: 'No emojis or Starting with spaces'
                            }
                        })}
                        autoComplete='off' type='text'
                        />
                        <h1 className={styles.FormInputError}>{errors.ingredient?.[index]?.name?.message}</h1>

                    </div>
                ))}

                <button type='submit' className={styles.SaveButton}>Add Items</button>

            </form>
        </div>
    </div>
    )
}