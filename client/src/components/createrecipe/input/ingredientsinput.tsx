'use client'

import Image from 'next/image';
import React, {useEffect, useState, useRef} from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

// import styles / components
import styles from './input.module.css';

export default function IngredientsInput(props: any) {

    // typedefs
    type Inputs = {
        ingredient: [{
            amount: string,
            name: string
        }]
    };

    const { control, handleSubmit, register, formState: {errors} } = useForm({
        defaultValues: {
            ingredient: [{
                amount: '',
                name: ''
            }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        name: 'ingredient',
        control,
        rules: {
            required: 'Must have at least 1 ingredient',
            maxLength: {
                value: 20,
                message: 'Must have less than 20 ingredients'
            }
        }
    });

    const [saveInput, setSaveInput] = useState(false);

    const handleSave = (formVal: any) => {

        // create local array
        let data: any = []
        formVal.ingredient.map((e: any) => {
            data.push({
                amount: e.amount,
                name: e.name
            })
        });
        // set local data array into props state
        props.setData((prev: any) => ({...prev, ingredients: data}));
        
        return setSaveInput(true);
    }

    // populate array with data if in state
    const setArrayData = () => {
        // if value in state, append values
        if(props.data.ingredients[0] != ''){
            // drop empty value in array
            remove(0);
            props.data.ingredients.map((e: any) => {
                append({
                    amount: e.amount,
                    name: e.name
                })
            })
        } 
    }

    useEffect(() => {
        setArrayData();
    }, [])

    return (
        <div className={styles.InputParent}>
            <form className={styles.FormParent}
            onSubmit={(handleSubmit(handleSave))}
            >
                {fields.map((field: any, index:  number) => (
                    <div key={field.id} className={styles.InputDynamicItem}>

                        <div className={styles.InputDynamicLabel}>
                            <label className={styles.LabelBold}>Ingredient {index + 1}</label>
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

                        <label>Amount</label>
                        <input {...register(`ingredient.${index}.amount`, {
                            required: {
                                value: true,
                                message: 'Required'
                            },
                            maxLength: {
                                value: 30,
                                message: 'Must have less than 30 Characters'
                            }, 
                            pattern: {
                                value: /^[^\s][\w\s!@#$%^&*()-~`'_+{}|/:;"<>?\[\]\',.\/\\]{0,}$/,
                                message: 'No emojis or Starting with spaces'
                            }
                        })}
                        autoComplete='off' type='text'
                        />
                        <h1 className={styles.FormInputError}>{errors.ingredient?.[index]?.amount?.message}</h1>

                        <label>Ingredient</label>
                        <input {...register(`ingredient.${index}.name`, {
                            required: {
                                value: true,
                                message: 'Required'
                            },
                            minLength: {
                                value: 3,
                                message: 'Must have at least 3 Characters'
                            }, 
                            maxLength: {
                                value: 50,
                                message: 'Must have less than 50 Characters'
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

                <button type='button' className={styles.AddButton}
                onClick={() => {
                    if (fields.length < 21){
                        append({
                            amount: '',
                            name: ''
                        })
                    }
                }}
                >Add Ingredient</button>

                {!saveInput 
                ? <button type='submit' className={styles.SaveButton}>Save Changes</button>
                : <button type='submit' className={styles.SavedButton}>Changes Saved!</button>
                }

            </form>
        </div>
    )
}