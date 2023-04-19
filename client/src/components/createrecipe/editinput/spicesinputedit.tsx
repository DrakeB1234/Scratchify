'use client'

import Image from 'next/image';
import React, {useEffect, useState, useRef} from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

// import styles / components
import styles from './inputedit.module.css';

export default function SpicesInputEdit(props: any) {

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
            maxLength: {
                value: 10,
                message: 'Must have less than 10 spices'
            }
        }
    });

    const [saveInput, setSaveInput] = useState(false);

    const handleSave = (formVal: any) => {
        // check to see if size of each array has changed
        if (formVal.spice.length == props.data.spices.length){
            // if array size hasn't changed, check for difference in text
            for (let i = 0; i < props.data.spices.length; i++){
                if (formVal.spice[i].name != props.data.spices[i].spice){
                    // call function to set edit data
                    return setEditSpice(formVal);
                }
            }
        }
        else {
            // call function to set edit data
            return setEditSpice(formVal);
        }

        // else, if no changes made null tags data
        setSaveInput(true);
        return props.setData((prev: any) => ({...prev, spices: null}))
    }

    const setEditSpice = (formVal: any) => {        
        // local array
        let data: any = [];

        formVal.spice.map((e: any) => {
            data.push({spice: e.name});
        });

        // set edit data state to local data
        setSaveInput(true);
        return props.setData((prev: any) => ({...prev, spices: data}))
    }

    // populate array with data if in state
    const setArrayData = () => {
        // if edit values provided, append them in inputs
        if(props.editData.spices != null && Array.isArray(props.editData.spices) && props.editData.spices[0].spice != null){
            // drop empty value in array
            remove(0);
            props.editData.spices.map((e: any) => {
                append({
                    name: e.spice
                })
            })
        } 
        // else, append values from recipe tags data
        else if (Array.isArray(props.data.spices) && props.data.spices.length > 0){
            // drop empty value in array
            remove(0);
            props.data.spices.map((e: any) => {
                append({
                    name: e.spice
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
                <h2>OPTIONAL</h2>
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