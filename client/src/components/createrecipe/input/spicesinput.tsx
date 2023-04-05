'use client'

import Image from 'next/image';
import React, {useEffect, useState, useRef} from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

// import styles / components
import styles from './input.module.css';

export default function SpicesInput(props: any) {

    // typedefs
    type Inputs = {
        spice: [{
            name: string
        }]
    };

    const { control, handleSubmit, register, formState: {errors} } = useForm({
        defaultValues: {
            spice: [{
                name: ''
            }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        name: 'spice',
        control,
        rules: {
            required: 'Must have at least 1 instruction',
            maxLength: {
                value: 10,
                message: 'Must have less than 10 instructions'
            }
        }
    });

    const [saveInput, setSaveInput] = useState(false);

    const handleSave = (formVal: any) => {

        // create local array
        let data: any = []
        formVal.spice.map((e: any) => {
            data.push({
                name: e.name
            })
        });
        // set local data array into props state
        props.setData((prev: any) => ({...prev, spices: data}));
        
        return setSaveInput(true);
    }

    // populate array with data if in state
    const setArrayData = () => {
        // if value in state, append values
        if(props.data.spices[0] != ''){
            // drop empty value in array
            remove(0);
            props.data.spices.map((e: any) => {
                append({
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
                            <label htmlFor='spice'>Spice {index + 1}</label>
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

                        <input {...register(`spice.${index}.name`, {
                            required: {
                                value: true,
                                message: 'Required'
                            },
                            minLength: {
                                value: 3,
                                message: 'Must have at least 3 Characters'
                            }, 
                            maxLength: {
                                value: 30,
                                message: 'Must have less than 30 Characters'
                            }, 
                            pattern: {
                                value: /^[^\s][\w\s!@#$%^&*()-~`'_+{}|/:;"<>?\[\]\',.\/\\]{0,}$/,
                                message: 'No emojis or starting with spaces'
                            }
                        })}
                        autoComplete='off'
                        />
                        <h1 className={styles.FormInputError}>{errors.spice?.[index]?.name?.message}</h1>

                    </div>
                ))}

                <button type='button' className={styles.AddButton}
                onClick={() => {
                    if (fields.length < 10){
                        append({
                            name: ''
                        })
                    }
                }}
                >Add Spice</button>

                {!saveInput 
                ? <button type='submit' className={styles.SaveButton}>Save Changes</button>
                : <button type='submit' className={styles.SavedButton}>Changes Saved!</button>
                }

            </form>
        </div>
    )
}