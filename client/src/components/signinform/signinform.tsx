'use client'

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';

// import styles / components
import LoadingSvg from '/public/graphics/icon-loading.svg';
import styles from './form.module.css';

// signin server function
import {SigninAuth} from '../../supabasehelpers/auth';

export default function SigninForm(props: any) {
    
    const router = useRouter();

    // typedefs
    type Inputs = {
        email: string,
        password: string,
    };
    type AuthState = {
        type: string,
        message: string,
    };

    const [loadingState, setLoadingState] = useState(false);
    const [authState, setAuthState] = useState<AuthState>({
        type: '',
        message: ''
    });

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    // handle save
    const handleSave = async (formVal: Inputs) => {
        // set loading state and reset any form errors generated
        setLoadingState(true);
        setAuthState(prev => ({...prev,
            type: '',
            message: ''
        }));

        const val = await SigninAuth(formVal);
        // remove loading state, set auth state with value passed from auth server component
        setLoadingState(false);

        // check if val passed from auth is error, if so set auth
        // state
        if (val.type == 'error') return setAuthState(prev => ({...prev, 
            type: val.type,
            message: val.message
        }));

        // redirect user to home page
        return router.replace('/');
    }
    
    return (
        <form className={styles.FormParent}
        onSubmit={(handleSubmit(handleSave))}
        >

            {authState.type == 'error'
            ?
                <h1 
                className={styles.FormError}
                onClick={() => {setAuthState(prev => ({...prev, type: '', message: ''}))}}
                >{authState.message}<span>X</span></h1>
            :   <></>
            }


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
            autoComplete='off' type='password'
            />

            <h1 className={styles.FormInputError}>{errors?.password?.message}</h1>
            <Link 
            href='/signin/resetpassword'
            className={styles.LinkForgotPassword}
            >forgot password?</Link>

            <button type='submit'>{!loadingState
                ? 'Sign in'
                :  <LoadingSvg />
            }</button>

            <h1 className={styles.FormText}>Or sign up using</h1>

            <Link
            href='/signup'
            className={styles.LinkMakeAccount}
            >Sign up</Link>

        </form>
    )
}