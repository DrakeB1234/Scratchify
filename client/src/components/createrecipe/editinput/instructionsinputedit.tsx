'use client'

import Image from 'next/image';
import React, {useEffect, useState, useRef} from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

// import styles / components
import styles from './inputedit.module.css';

export default function InstructionsInput(props: any) {

    // typedefs
    type Inputs = {
        instruction: [{
            name: string
        }]
    };

    const { control, handleSubmit, register, formState: {errors} } = useForm({
        defaultValues: {
            instruction: [{
                name: ''
            }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        name: 'instruction',
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
        // check to see if size of each array has changed
        if (formVal.instruction.length == props.data.instructions.length){
            // if array size hasn't changed, check for difference in text
            for (let i = 0; i < props.data.instructions.length; i++){
                if (formVal.instruction[i].instruction != props.data.instructions[i].instruction){
                    // call function to set edit data
                    return setEditInstruction(formVal);
                }
            }
        }
        else {
            // call function to set edit data
            return setEditInstruction(formVal);
        }

        // else, if no changes made null tags data
        setSaveInput(true);
        return props.setData((prev: any) => ({...prev, instructions: null}))
    }

    const setEditInstruction = (formVal: any) => {
        // local array
        let data: any = [];

        formVal.instruction.map((e: any) => {
            data.push({instruction: e.name});
        });

        // set edit data state to local data
        setSaveInput(true);
        return props.setData((prev: any) => ({...prev, instructions: data}))
    }

    // populate array with data if in state
    const setArrayData = () => {
        // if edit values provided, append them in inputs
        if(props.editData.instructions != null && props.editData.instructions[0].instruction != ''){
            // drop empty value in array
            remove(0);
            props.editData.instructions.map((e: any) => {
                append({
                    name: e.instruction
                })
            })
        } 
        // else, append values from recipe tags data
        else if (props.data.instructions[0].instruction != ''){
            // drop empty value in array
            remove(0);
            props.data.instructions.map((e: any) => {
                append({
                    name: e.instruction
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
                            <label htmlFor='tag'>Step {index + 1}</label>
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

                        <textarea {...register(`instruction.${index}.name`, {
                            required: {
                                value: true,
                                message: 'Required'
                            },
                            minLength: {
                                value: 3,
                                message: 'Must have at least 3 Characters'
                            }, 
                            maxLength: {
                                value: 500,
                                message: 'Must have less than 500 Characters'
                            }, 
                            pattern: {
                                value: /^[^\s][\w\s!@#$%^&*()-~`'_+{}|/:;"<>?\[\]\',.\/\\]{0,}$/,
                                message: 'No emojis or starting with spaces'
                            }
                        })}
                        autoComplete='off'
                        />
                        <h1 className={styles.FormInputError}>{errors.instruction?.[index]?.name?.message}</h1>

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
                >Add Step</button>

                {!saveInput 
                ? <button type='submit' className={styles.SaveButton}>Save Changes</button>
                : <button type='submit' className={styles.SavedButton}>Changes Saved!</button>
                }

            </form>
        </div>
    )
}