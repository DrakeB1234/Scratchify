'use client'

import React, {useEffect, useState, useRef} from 'react';
import { useForm } from 'react-hook-form';

// import styles / components
import styles from './inputedit.module.css';

export default function TitleInputEdit(props: any) {

    // typedefs
    type Inputs = {
        title: string,
        course: string,
        description: string,
        source: string,
        public: boolean,
    };

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({defaultValues:{
        // set data to edit data if set, otherwise set value to recipe data
        title: props.editData.title ?? props.data.title!,
        course: props.editData.course ?? props.data.course!,
        description: props.editData.description ?? props.data.description!,
        source: props.editData.source ?? props.data.source!,
        public: props.editData.public ?? props.data.public!
    }});

    const [saveInput, setSaveInput] = useState(false);

    const handleSave = (formVal: Inputs) => {

        // if there is a change made, set it to local input obj, otherwise null data to reduce API calls
        if (formVal.title != props.data.title) props.setData((prev: Inputs) => ({...prev, title: formVal.title}));
        else props.setData((prev: Inputs) => ({...prev, title: null}));

        if (formVal.course != props.data.course) props.setData((prev: Inputs) => ({...prev, course: formVal.course}));
        else props.setData((prev: Inputs) => ({...prev, course: null}));

        if (formVal.description != props.data.description) props.setData((prev: Inputs) => ({...prev, description: formVal.description}));
        else props.setData((prev: Inputs) => ({...prev, description: null}));

        if (formVal.source != props.data.source) props.setData((prev: Inputs) => ({...prev, source: formVal.source}));
        else props.setData((prev: Inputs) => ({...prev, source: null}));

        if (formVal.public.toString() != props.data.public.toString()) props.setData((prev: Inputs) => ({...prev, public: formVal.public}));
        else props.setData((prev: Inputs) => ({...prev, public: null}));

        return setSaveInput(true);
    }

    return (
        <div className={styles.InputParent}>
            <form className={styles.FormParent}
            onSubmit={(handleSubmit(handleSave))}
            onClick={() => {console.log(props.data); console.log(props.editData)}}
            >

                <label htmlFor='title'>Title</label>
                <input {...register('title', {
                    required: {
                        value: true,
                        message: 'Required'
                    },
                    minLength: {
                        value: 3,
                        message: 'Must be at least 3 characters'
                    },
                    maxLength: {
                        value: 40,
                        message: 'Must be less than 40 characters'
                    },
                    pattern: {
                        value: /^[^\s][\w\s-]{0,}$/,
                        message: 'Must not start with space, only letters, numbers, spaces, and -'
                    }
                })}
                autoComplete='off'
                />
                <h1 className={styles.FormInputError}>{errors?.title?.message}</h1>

                <label htmlFor='course'>Course</label>
                <select {...register('course', {
                    required: {
                        value: true,
                        message: 'Required'
                    },
                    pattern: {
                        value: /^Breakfast|Lunch|Dinner|Dessert|Snack$/,
                        message: 'Must select Breakfast, Lunch, Dinner, Snack, or Dessert'
                    }
                })}>
                    <option value='Breakfast'>Breakfast</option>
                    <option value='Lunch'>Lunch</option>
                    <option value='Dinner'>Dinner</option>
                    <option value='Snack'>Snack</option>
                    <option value='Dessert'>Dessert</option>
                </select>
                <h1 className={styles.FormInputError}>{errors?.course?.message}</h1>

                <label htmlFor='description'>Description</label>
                <textarea {...register('description', {
                required: 'Required!', 
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
                    message: 'No emojis or Starting with spaces'
                }
                })} 
                autoComplete='off'
                />
                <h1 className={styles.FormInputError}>{errors?.description?.message}</h1>

                <label htmlFor='source'>Source (optional)</label>
                <input {...register('source', {
                    minLength: {
                        value: 3,
                        message: 'Must be at least 3 characters'
                    },
                    maxLength: {
                        value: 200,
                        message: 'Must be less than 200 characters'
                    },
                    pattern: {
                        value: /^[^\s][\w\s!@#$%^&*()-~`'_+{}|/:;"<>?\[\]\,.\/\\]{0,}$/,
                        message: 'No emojis or Starting with spaces'
                    }
                })}
                />
                <h1 className={styles.FormInputError}>{errors?.source?.message}</h1>

                <label htmlFor='public'>Make Recipe Public?</label>
                <input {...register('public')} 
                autoComplete='off' type='checkbox'
                />
                <h1 className={styles.FormInputError}>{errors?.public?.message}</h1>

                {!saveInput 
                ? <button type='submit' className={styles.SaveButton}>Save Changes</button>
                : <button type='submit' className={styles.SavedButton}>Changes Saved!</button>
                }

            </form>
        </div>
    )
}