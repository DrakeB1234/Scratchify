import React, {useState} from 'react';
import {useForm} from 'react-hook-form';

import styles from './input.module.css';

export default function SubmitInput(props: any) {

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
            <div className={styles.InputReviewParent}>
                <div className={styles.InputReviewContainerCol}>
                    <h1>Title:</h1>
                    <h2>{props.data.title}</h2>
                </div>
                <div className={styles.InputReviewContainerCol}>
                    <h1>Course:</h1>
                    <h2>{props.data.course}</h2>
                </div>
                <div className={styles.InputReviewContainerCol}>
                    <h1>Description:</h1>
                    <h2>{props.data.description}</h2>
                </div>
                <div className={styles.InputReviewContainerCol}>
                    <h1>Photo:</h1>
                    <h2>{props.data.pictureurl}</h2>
                </div>
                <div className={styles.InputReviewContainerCol}>
                    <h1>Tags:</h1>
                    {props.data.tags.map((e: any) => (
                        <h2>{e.name}</h2>
                    ))}
                </div>
                <div className={styles.InputReviewContainerCol}>
                    <h1>Ingredients:</h1>
                    {props.data.ingredients.map((e: any) => (
                        <h2>{e.amount} of {e.name}</h2>
                    ))}
                </div>
                <div className={styles.InputReviewContainerCol}>
                    <h1>Instructions:</h1>
                    {props.data.instructions.map((e: any, index: number) => (
                        <h2>Step {index + 1}: {e.name}</h2>
                    ))}
                </div>
            </div>

            {errors.title || errors.course || errors.description
            ?
                <button className={styles.SaveErrorButton} type='submit'>Error</button>
            : successInput
            ?
                <button className={styles.SaveSuccessButton} type='submit'>Save Successful</button>
            :
                <button className={styles.SaveSuccessButton} type='submit'>Create Recipe</button>
            }

        </form>

    )
  }