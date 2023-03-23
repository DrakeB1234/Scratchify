import React, {useState} from 'react';
import {useForm} from 'react-hook-form';

import styles from './input.module.css';

export default function PhotoInput(props: any) {

    const [successInput, setSuccessInput] = useState(false)

    const { register, handleSubmit, formState: {errors} } = useForm({});

    const handleSave = (formVal: any) => {
        // reset success state to false
        setSuccessInput(!successInput);

        // set success state to display success message
        setSuccessInput(true);
    }
    
    return ( 
        <form className={styles.InputParent} onSubmit={handleSubmit(handleSave)}>
            <label htmlFor='title'>
                <h1>Upload Photo</h1>
            </label>
            <input type='file' {...register('photo', {
                required: 'Required!', 
                })}
            />
            <h2>{errors.title?.message?.toString()}</h2>

            {errors.title || errors.course || errors.description
            ?
                <button className={styles.SaveErrorButton} type='submit'>Error</button>
            : successInput
            ?
                <button className={styles.SaveSuccessButton} type='submit'>Save Successful</button>
            :
                <button className={styles.SaveButton} type='submit'>Save Changes</button>
            }


        </form>
    )
  }