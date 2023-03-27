import Image from 'next/image';
import React, {useState, useEffect} from 'react';
import {useFieldArray, useForm} from 'react-hook-form';

import styles from './input.module.css';

export default function InstructionsInput(props: any) {

    const [successInput, setSuccessInput] = useState(false)

    const { register, control, handleSubmit, formState: {errors} } = useForm({
        defaultValues: {
            instruction: [{
                name: ''
            }]
        }
    });

    // checks to see if data is set from props, if so then add them to array,
    // else add one empty value
    useEffect(() => {
        // drop first index in array
        remove(0);
        if(props.data.instructions[0] != ''){
            props.data.instructions.map((e: any) => {
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
        instruction: [{
            name: string
        }]
    }

    const { fields, append, remove } = useFieldArray({
        name: 'instruction',
        control,
        rules: {
            required: 'Must have at least 1 step',
            maxLength: {
                value: 10,
                message: 'Must have less than 11 steps'
            }
        }
    });

    const handleSave = (formVal: any) => {
        // set success state to display success message
        setSuccessInput(!successInput);

        // create local array
        let data: any = []
        formVal.instruction.map((e: any) => {
            data.push(e);
        })
        // set local data array into props state
        props.setData((prev: any) => ({...prev, instructions: data}));

        // set success state to display success message
        setSuccessInput(true);
    }
    
    return ( 
        <form className={styles.InputParent} onSubmit={handleSubmit(handleSave)}>
            <h1>Instructions</h1>
            {fields.map((field, index) => (
                <div className={styles.InputParentDynamic}
                key={field.id}
                >
                    <label htmlFor='instruction'>
                        <h1>Step {index + 1}</h1>
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
                    <textarea {...register(`instruction.${index}.name`, {
                        required: 'Required', 
                        minLength: {
                            value: 3,
                            message: 'Must have at least 3 Characters'
                        }, 
                        maxLength: {
                            value: 500,
                            message: 'Must have less than 500 Characters'
                        }, 
                        pattern: {
                            value: /^[^\s][\w\s!@#$%^&*()-~`_+{}|/°:;"<>?\[\]\',.\/\\]{0,}$/,
                            message: 'No emojis or Starting with spaces'
                        }
                        })}
                        autoComplete='off' 
                    />
                    {errors.instruction?.[index]?.name && <h2>{errors.instruction?.[index]?.name?.message}</h2>}
                </div>
            ))}
            <button className={styles.AddInputButton} type='button'
            onClick={() => {
                if (fields.length < 10){
                    append({
                        name: ''
                    })
                }
            }}
            >Add Step</button>

            {errors.instruction            
            ?
                <button className={styles.SaveErrorButton} type='submit'>Error</button>
            : successInput
            ?
                <button className={styles.SaveSuccessButton} type='submit'>Save Successful</button>
            :
                <button className={styles.SaveButton} type='submit'>Save Changes</button>
            }
            <h2 className={styles.ErrorText}>{errors.instruction?.root?.message}</h2>


        </form>
    )
  }