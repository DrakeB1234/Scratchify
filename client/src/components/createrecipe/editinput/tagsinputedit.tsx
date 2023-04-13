'use client'

import Image from 'next/image';
import React, {useEffect, useState, useRef} from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

// import styles / components
import styles from './inputedit.module.css';

export default function TagsInputEdit(props: any) {

    // typedefs
    type Inputs = {
        tag: [{
            name: string
        }]
    };

    const { control, handleSubmit, register, formState: {errors} } = useForm({
        defaultValues: {
            tag: [{
                name: ''
            }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        name: 'tag',
        control,
        rules: {
            required: 'Must have at least 1 tag',
            maxLength: {
                value: 4,
                message: 'Must have less than 5 tags'
            }
        }
    });

    const [saveInput, setSaveInput] = useState(false);

    const handleSave = (formVal: any) => {

        // check to see if size of each array has changed
        if (formVal.tag.length == props.data.tags.length){
            // if array size hasn't changed, check for difference in text
            for (let i = 0; i < props.data.tags.length; i++){
                if (formVal.tag[i].name != props.data.tags[i].tag){
                    // call function to set edit data
                    return setEditTag(formVal);
                }
            }
        }
        else {
            // call function to set edit data
            return setEditTag(formVal);
        }

        // else, if no changes made null tags data
        setSaveInput(true);
        return props.setData((prev: any) => ({...prev, tags: [{tag: ''}]}))
    }

    const setEditTag = (formVal: any) => {
        // local array
        let data: any = [];

        formVal.tag.map((e: any) => {
            data.push({tag: e.name});
        });

        // set edit data state to local data
        setSaveInput(true);
        return props.setData((prev: any) => ({...prev, tags: data}))
    }

    // populate array with data if in state
    const setArrayData = () => {
        // if edit values provided, append them in inputs
        if(props.editData.tags[0].tag != ''){
            // drop empty value in array
            remove(0);
            props.editData.tags.map((e: any) => {
                append({
                    name: e.tag
                })
            })
        } 
        // else, append values from recipe tags data
        else if (props.data.tags[0].tag != ''){
            // drop empty value in array
            remove(0);
            props.data.tags.map((e: any) => {
                append({
                    name: e.tag
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
                            <label htmlFor='tag'>Tag {index + 1}</label>
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

                        <input {...register(`tag.${index}.name`, {
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
                                value: /^[^\s][a-zA-Z\s]{0,}$/,
                                message: 'Must only use letters and spaces'
                            }
                        })}
                        autoComplete='off' type='text'
                        />
                        <h1 className={styles.FormInputError}>{errors.tag?.[index]?.name?.message}</h1>

                    </div>
                ))}

                <button type='button' className={styles.AddButton}
                onClick={() => {
                    if (fields.length < 4){
                        append({
                            name: ''
                        })
                    }
                }}
                >Add Tag</button>

                {!saveInput 
                ? <button type='submit' className={styles.SaveButton}>Save Changes</button>
                : <button type='submit' className={styles.SavedButton}>Changes Saved!</button>
                }

            </form>
        </div>
    )
}