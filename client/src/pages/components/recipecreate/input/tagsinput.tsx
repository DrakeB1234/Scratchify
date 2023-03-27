import Image from 'next/image';
import React, {useState, useEffect} from 'react';
import {useFieldArray, useForm} from 'react-hook-form';

import styles from './input.module.css';

export default function TagsInput(props: any) {

    const [successInput, setSuccessInput] = useState(false)

    const { register, control, handleSubmit, formState: {errors} } = useForm({
        defaultValues: {
            tag: [{
                name: ''
            }]
        }
    });

    // checks to see if data is set from props, if so then add them to array,
    // else add one empty value
    useEffect(() => {
        // drop first index in array
        remove(0);
        if(props.data.tags[0] != ''){
            props.data.tags.map((e: any) => {
                append({
                    name: e.name
                })
            })
        // else, add empty value to array
        } else {
            append({
                name: ''
            })
        }
    }, [])

    // set the type for the array
    type formValues = {
        tag: [{
            name: string
        }]
    }

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

    const handleSave = (formVal: any) => {
        // set success state to display success message
        setSuccessInput(!successInput);

        // create local array
        let data: any = []
        formVal.tag.map((e: any) => {
            data.push(e)
        })
        // set local data array into props state
        props.setData((prev: any) => ({...prev, tags: data}));

        // set success state to display success message
        setSuccessInput(true);
    }
    
    return ( 
        <form className={styles.InputParent} onSubmit={handleSubmit(handleSave)}>
            <h1>Tags</h1>
            {fields.map((field, index) => (
                <div className={styles.InputParentDynamic}
                key={field.id}
                >
                    <label htmlFor='tag'>
                        <h1>Tag {index + 1}</h1>
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
                    <input {...register(`tag.${index}.name`, {
                        required: 'Required', 
                        minLength: {
                            value: 3,
                            message: 'Must have at least 3 Characters'
                        }, 
                        maxLength: {
                            value: 20,
                            message: 'Must have less than 20 Characters'
                        }, 
                        pattern: {
                            value: /^[^\s][a-zA-Z\s]{0,}$/,
                            message: 'Must only use letters and spaces'
                        }
                        })}
                        autoComplete='off' 
                    />
                    {errors.tag?.[index]?.name && <h2>{errors.tag?.[index]?.name?.message}</h2>}
                </div>
            ))}
            <button className={styles.AddInputButton} type='button'
            onClick={() => {
                if (fields.length < 4){
                    append({
                        name: ''
                    })
                }
            }}
            >Add Tag</button>

            {errors.tag            
            ?
                <button className={styles.SaveErrorButton} type='submit'>Error</button>
            : successInput
            ?
                <button className={styles.SaveSuccessButton} type='submit'>Save Successful</button>
            :
                <button className={styles.SaveButton} type='submit'>Save Changes</button>
            }
            <h2 className={styles.ErrorText}>{errors.tag?.root?.message}</h2>


        </form>
    )
  }