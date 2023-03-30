'use client'

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import React from 'react';
import {useForm} from 'react-hook-form';

// import styles / components
import LoadingSvg from '/public/graphics/icon-loading.svg';
import styles from './form.module.css';

export default function SigninForm(props: any) {

    const router = useRouter();

    type Inputs = {
        email: string,
        password: string,
      };

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    // handle save
    const handleSave = (formVal: Inputs) => {
        // if pass validation, pass form values to callback function
        router.replace('/');
    }
    
    return (
        <form className={styles.FormParent}
        onSubmit={(handleSubmit(handleSave))}
        >
            <label htmlFor='email'>Email</label>
            <input {...register('email', {
                required: {
                    value: true,
                    message: 'Required'
                },
                pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Invalid Email Address'
                }
            })}
            autoComplete='off'
            />
            <h1 className={styles.FormInputError}>{errors?.email?.message}</h1>

            <label htmlFor='password'>Password</label>
            <input {...register('password', {
                required: {
                    value: true,
                    message: 'Required'
                }
            })}
            autoComplete='off'
            />

            <h1 className={styles.FormInputError}>{errors?.password?.message}</h1>
            <Link 
            href='/signin'
            className={styles.LinkForgotPassword}
            >forgot password?</Link>

            <button type='submit'>Sign in</button>
            <LoadingSvg />

            <h1 className={styles.FormText}>Or sign up using</h1>

            <Link
            href='/signup'
            className={styles.LinkMakeAccount}
            >Sign up</Link>

        </form>
    )
}