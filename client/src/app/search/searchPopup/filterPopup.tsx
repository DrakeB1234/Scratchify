'use client'

import Link from 'next/link';
import Image from 'next/image';
import {useRouter, useSearchParams} from 'next/navigation';
import React, {useState} from 'react';
import { useForm } from 'react-hook-form';

// import styles / components
import styles from './popup.module.css';

// typedef
type Props = {
    popupToggle?: any,
    callback?: any
}

// typedefs
type Inputs = {
    course: string,
    tagInput: string
};

export default function Popup(props: Props) {

    const router = useRouter();
    const params = useSearchParams();

    // get current search params and 
    const searchParam = params.get('q');

    const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm<Inputs>();
    const [input, setInput] = useState<any>({
        course: '',
        tag: ''
    });
    
    const handleSave = (formVal: any) => {
        // set input based on form vals
        if (formVal.course){
            setInput((prev: any) => ({...prev,
                course: formVal.course
            }))
        } else {
            setInput((prev: any) => ({...prev,
                course: ''
            }))
        }

        if (formVal.tagInput){
            setInput((prev: any) => ({...prev,
                tag: formVal.tagInput
            }))
        } else {
            setInput((prev: any) => ({...prev,
                tag: ''
            }))
        }
    }

    const applyFilterFunction = () => {
        let url = '/search';
        // if search param provided, include in url
        if (searchParam) {
            // if url only includes /search, add ?
            // else add &
            if (url == '/search'){
                url += `?q=${searchParam}`
            } else {
                url += `/${searchParam}`
            }
        }
        
        // if course param provided, include in url
        if (getValues('course')) {
            // if url only includes /search, add ?
            // else add &
            if (url == '/search'){
                url += `?filterCourse=${getValues('course')}`
            } else {
                url += `&filterCourse=${getValues('course')}`
            }
        }
        // if tag param provided, include in url
        if (getValues('tagInput')) {
            // if url only includes /search, add ?
            // else add &
            if (url == '/search'){
                url += `?filterTag=${getValues('tagInput')}`
            } else {
                url += `&filterTag=${getValues('tagInput')}`
            }
        }

        // redirect user with url for recipe search if base url is not used
        props.popupToggle(false)
        if (url !== '/search') return router.replace(url);
    }

  return (
    <div className={styles.PopupParent}>
        <div className={styles.PopupChildContainer}>
            <div className={styles.PopupExitContainer}
            onClick={() => props.popupToggle(false)}
            >
                <h1>Filter Options</h1>
                <Image 
                  alt='o'
                  src='/icons/actions/icon-plusred-outline.svg'
                  height={50}
                  width={50}
                />
            </div>
            <form className={styles.FormParent}
            onSubmit={(handleSubmit(handleSave))}
            >

                <label htmlFor='course'>Course Filter</label>
                <div className={styles.FormInputRow}>
                    <select {...register('course', {
                        pattern: {
                            value: /^Breakfast|Lunch|Dinner|Dessert|Snack$/,
                            message: 'Must select Breakfast, Lunch, Dinner, Snack, or Dessert'
                        }
                    })}>
                        <option value=''>None</option>
                        <option value='Breakfast'>Breakfast</option>
                        <option value='Lunch'>Lunch</option>
                        <option value='Dinner'>Dinner</option>
                        <option value='Snack'>Snack</option>
                        <option value='Dessert'>Dessert</option>
                    </select>
                    <button>
                        <Image 
                        alt='o'
                        src='/icons/actions/icon-plusgreen-outline.svg'
                        height={50}
                        width={50}
                        />
                    </button>
                </div>
                <h1 className={styles.FormInputError}>{errors?.course?.message}</h1>

                <label htmlFor=''>Tag Filters</label>
                <div className={styles.FormTagInputContainer}>
                    <input {...register('tagInput', {
                        minLength: {
                            value: 1,
                            message: 'Must be at least 1 character'
                        },
                        maxLength: {
                            value: 40,
                            message: 'Must be less than 40 characters'
                        },
                        pattern: {
                            value: /^[^\s][\w\s-()]{0,}$/,
                            message: 'Must not start with space, only letters, numbers, spaces, and - ( )'
                        }
                    })}
                    autoComplete='off'
                    />

                    <button>
                        <Image 
                        alt='o'
                        src='/icons/actions/icon-plusgreen-outline.svg'
                        height={50}
                        width={50}
                        />
                    </button>

                </div>
                <h1 className={styles.FormInputError}>{errors?.tagInput?.message}</h1>

                {input.course
                ? <h1 className={styles.FormChosenTag}
                ><span>Course</span>{input.course}</h1>
                : <></>
                }

                {input.tag
                ? <h1 className={styles.FormChosenTag}
                ><span>Tag</span>{input.tag}</h1>
                : <></>
                }

                <button type='button' className={styles.SaveButton}
                onClick={() => applyFilterFunction()}
                >Apply Filters</button>

            </form>
        </div>
    </div>
  )
}
