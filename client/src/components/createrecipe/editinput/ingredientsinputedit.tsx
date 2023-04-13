'use client'

import Image from 'next/image';
import React, {useEffect, useState, useRef} from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

// import styles / components
import styles from './inputedit.module.css';

export default function IngredientsInputEdit(props: any) {

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

        // check to see if size of each array has changed
        if (formVal.ingredient.length == props.data.ingredients.length){
            // if array size hasn't changed, check for difference in text
            for (let i = 0; i < props.data.ingredients.length; i++){
                if (formVal.ingredient[i].name != props.data.ingredients[i].ingredient || formVal.ingredient[i].amount != props.data.ingredients[i].amount){
                    // call function to set edit data
                    return setEditIngredient(formVal);
                }
            }
        }
        else {
            // call function to set edit data
            return setEditIngredient(formVal);
        }

        // else, if no changes made null tags data
        setSaveInput(true);
        return props.setData((prev: any) => ({...prev, ingredients: [{amount: '', ingredient: ''}]}))
    }

    const setEditIngredient = (formVal: any) => {
        // local array
        let data: any = [];

        formVal.ingredient.map((e: any) => {
            data.push({
                amount: e.amount,
                ingredient: e.name
            })
        });

        // set edit data state to local data
        setSaveInput(true);
        return props.setData((prev: any) => ({...prev, ingredients: data}))
    }

    // populate array with data if in state
    const setArrayData = () => {
        // if edit values provided, append them in inputs
        if(props.editData.ingredients[0].amount != ''){
            // drop empty value in array
            remove(0);
            props.editData.ingredients.map((e: any) => {
                append({
                    amount: e.amount,
                    name: e.ingredient
                })
            })
        } 
        // else, append values from recipe tags data
        else if (props.data.ingredients[0].amount != ''){
            // drop empty value in array
            remove(0);
            props.data.ingredients.map((e: any) => {
                append({
                    amount: e.amount,
                    name: e.ingredient
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