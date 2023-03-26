import Image from 'next/image';
import React, {useState, useEffect} from 'react';
import {useFieldArray, useForm} from 'react-hook-form';

import styles from './input.module.css';

export default function IngredientsInput(props: any) {

    const [successInput, setSuccessInput] = useState(false)

    const { register, control, handleSubmit, formState: {errors} } = useForm({
        defaultValues: {
            ingredient: [{
                amount: '',
                name: ''
            }]
        }
    });

    // checks to see if data is set from props, if so then add them to array,
    // else add one empty value
    useEffect(() => {
        // drop first index in array
        remove(0);
        if(props.data.ingredients[0] != ''){
            props.data.ingredients.map((e: any) => {
                append({
                    amount: e.amount,
                    name: e.name
                })
            })
        // else, add empty value to array
        } else {
            append({
                amount: '',
                name: ''
            })
        }
    }, [])

    // set the type for the array
    type formValues = {
        ingredient: [{
            name: string
        }]
    }

    const { fields, append, remove } = useFieldArray({
        name: 'ingredient',
        control,
        rules: {
            required: 'Must have at least 1 step',
            maxLength: {
                value: 15,
                message: 'Must have less than 16 ingredients'
            }
        }
    });

    const handleSave = (formVal: any) => {
        // set success state to display success message
        setSuccessInput(!successInput);

        // create local array
        let data: any = []
        formVal.ingredient.map((e: any) => {
            data.push(e);
        })
        // set local data array into props state
        props.setData((prev: any) => ({...prev, ingredients: data}));

        // set success state to display success message
        setSuccessInput(true);
    }
    
    return ( 
        <form className={styles.InputParent} onSubmit={handleSubmit(handleSave)}>

            {fields.map((field, index) => (
                <div className={styles.InputParentDynamic}
                key={field.id}
                >
                    <label htmlFor='instruction'>
                        <h1>Ingredient {index + 1}</h1>
                        <Image 
                        alt='x'
                        src='/icons/navigation/icon-x-orange.svg'
                        height={50}
                        width={50}
                        onClick={() => {
                            remove(index);
                        }}
                        />
                    </label>
                    <div className={styles.InputMultipleContainer}>
                        <label htmlFor='amount'>
                            <h1>Amount</h1>
                        </label>
                        <input {...register(`ingredient.${index}.amount`, {
                            required: 'Required!', 
                            minLength: {
                                value: 1,
                                message: 'Must have at least 1 Character!'
                            }, 
                            maxLength: {
                                value: 30,
                                message: 'Must have less than 30 Characters!'
                            }, 
                            pattern: {
                                value: /^[^\s][\w\s!@#$%^&*()-~`_+{}|:;"<>?\[\]\',.\/\\]{0,}$/,
                                message: 'No emojis!'
                            }
                            })}
                            autoComplete='off' placeholder='1 Cup'
                        />
                        {errors.ingredient?.[index]?.amount && <h2>{errors.ingredient?.[index]?.amount?.message}</h2>}

                        <label htmlFor='ingredient'>
                            <h1>Ingredient</h1>
                        </label>
                        <input {...register(`ingredient.${index}.name`, {
                            required: 'Required!', 
                            minLength: {
                                value: 1,
                                message: 'Must have at least 1 Characters!'
                            }, 
                            maxLength: {
                                value: 40,
                                message: 'Must have less than 40 Characters!'
                            }, 
                            pattern: {
                                value: /^[^\s][\w\s!@#$%^&*()-~`_+{}|:;"<>?\[\]\',.\/\\]{0,}$/,
                                message: 'No emojis!'
                            }
                            })}
                            autoComplete='off' placeholder='Zuchini'
                        />
                        {errors.ingredient?.[index]?.name && <h2>{errors.ingredient?.[index]?.name?.message}</h2>}
                    </div>
                </div>
            ))}
            <button className={styles.AddInputButton} type='button'
            onClick={() => {
                if (fields.length < 15){
                    append({
                        amount: '',
                        name: ''
                    })
                }
            }}
            >Add Ingredient</button>

            {errors.ingredient            
            ?
                <button className={styles.SaveErrorButton} type='submit'>Error</button>
            : successInput
            ?
                <button className={styles.SaveSuccessButton} type='submit'>Save Successful</button>
            :
                <button className={styles.SaveButton} type='submit'>Save Changes</button>
            }
            <h2 className={styles.ErrorText}>{errors.ingredient?.root?.message}</h2>


        </form>
    )
  }