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
    sort: string,
};

export default function sortPopup(props: Props) {

    const router = useRouter();
    const params = useSearchParams();

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    
    const handleSave = (formVal: any) => {
        const searchParam = params.get('q');
        const filterCourse = params.get('filterCourse');
        const filterTag = params.get('filterTag');

        // if at least one search is made, continue with search
        if (searchParam || filterCourse || filterTag) {
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
            if (filterCourse) {
                // if url only includes /search, add ?
                // else add &
                if (url == '/search'){
                    url += `?filterCourse=${filterCourse}`
                } else {
                    url += `&filterCourse=${filterCourse}`
                }
            }
            // if tag param provided, include in url
            if (filterTag) {
                // if url only includes /search, add ?
                // else add &
                if (url == '/search'){
                    url += `?filterTag=${filterTag}`
                } else {
                    url += `&filterTag=${filterTag}`
                }
            }
            // if sort provided, include in url
            if (formVal.sort && formVal.sort !== 'None') {
                url += `&sort=${formVal.sort}`
            }

            // redirect user with url for recipe search if base url is not used
            props.popupToggle(false)
            if (url !== '/search') return router.replace(url);
        }
    }

  return (
    <div className={styles.PopupParent}>
        <div className={styles.PopupChildContainer}>
            <div className={styles.PopupExitContainer}
            onClick={() => props.popupToggle(false)}
            >
                <h1>Sort Options</h1>
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

                <label htmlFor='course'>Sort by</label>
                <select {...register('sort', {
                    pattern: {
                        value: /^None|Most Popular|Newest$/,
                        message: 'Must select item in list'
                    }
                })}>
                    <option value='None'>None</option>
                    <option value='Most Popular'>Most Popular</option>
                    <option value='Newest'>Newest</option>
                </select>
                <h1 className={styles.FormInputError}>{errors?.sort?.message}</h1>

                <button type='submit' className={styles.SaveButton}>Sort</button>

            </form>
        </div>
    </div>
  )
}
