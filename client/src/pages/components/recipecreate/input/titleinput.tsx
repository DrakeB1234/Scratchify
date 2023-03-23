import React, {useState} from 'react';
import {useForm} from 'react-hook-form';

import styles from './input.module.css';

export default function TitleInput(props: any) {

    const [successInput, setSuccessInput] = useState(false)

    const { register, handleSubmit, formState: {errors} } = useForm({
        defaultValues: {
            title: props.data.title,
            course: props.data.course,
            description: props.data.description
        }
    }
    );

    const handleSave = (formVal: any) => {
        // reset success state to false
        setSuccessInput(!successInput);
        // save values into state passed by props
        props.setData((prev: any) => ({...prev, 
            title: formVal.title, 
            course: formVal.course,
            description: formVal.description
        }));

        // set success state to display success message
        setSuccessInput(true);
    }
    
    return ( 
        <form className={styles.InputParent} onSubmit={handleSubmit(handleSave)}>
            <label htmlFor='title'>
                <h1>Title</h1>
            </label>
            <input {...register('title', {
                required: 'Required!', 
                minLength: {
                    value: 3,
                    message: 'Must have at least 3 Characters!'
                }, 
                maxLength: {
                    value: 30,
                    message: 'Must have less than 30 Characters!'
                }, 
                pattern: {
                    value: /^[^\s][a-zA-Z\s]{0,}$/,
                    message: 'Must only use letters and spaces!'
                }
                })}
                autoComplete='off' 
            />
            <h2>{errors.title?.message?.toString()}</h2>


            <label htmlFor='course'>
                <h1>Course</h1>
            </label>
            <select {...register('course', {
                required: 'Required', 
                pattern: {
                    value: /^Breakfast|Lunch|Dinner|Dessert|Snack$/,
                    message: 'Must select Breakfast, Lunch, Dinner, Dessert, or Snack!'
                }
            })}
            >
                <option value='' hidden></option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Dessert">Dessert</option>
                <option value="Snack">Snack</option>
            </select>
            <h2>{errors.course?.message?.toString()}</h2>

            <label htmlFor='description'>
                <h1>Description</h1>
            </label>
            <textarea {...register('description', {
                required: 'Required!', 
                minLength: {
                    value: 3,
                    message: 'Must have at least 3 Characters!'
                }, 
                maxLength: {
                    value: 300,
                    message: 'Must have less than 300 Characters!'
                }, 
                pattern: {
                    value: /^[^\s][\w\s!@#$%^&*()-~`_+{}|:"<>?\[\]\;',.\/\\]{0,}$/,
                    message: 'No emojis!'
                }
                })} 
                autoComplete='off'
            />
            <h2>{errors.description?.message?.toString()}</h2>

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