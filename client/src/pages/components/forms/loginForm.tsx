import Head from 'next/head'
import Link from 'next/link';
import {useState} from 'react';
import {useForm} from 'react-hook-form';

// styles / components
import LoadingSvg from '/public/graphics/icon-loading.svg';
import styles from './form.module.css';

export default function LoginForm(props: any) {

    const [loadingInput, setLoadingInput] = useState(false);
    
    const { register, handleSubmit, formState: {errors} } = useForm({});

    // check register input (no checks neccessary, send data)
    const handleSave = async (formVal: any) => {
        setLoadingInput(true);
        await props.callback(formVal);
        setLoadingInput(false);
    }
    
    return (  
        <div className={styles.FormParent}>
            <form className={styles.FormStyle} onSubmit={handleSubmit(handleSave)}>
                <h1>Sign in</h1>

                <input {...register('email', {
                    required: 'Required!',
                    pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: 'Invalid Email Address'
                    }
                    })}
                    autoComplete='off' 
                />
                <label htmlFor='email'>Email</label>
                <h2>{errors.email?.message?.toString()}</h2>

                <input {...register('password', {
                    required: 'Required!'
                    })}
                    autoComplete='off' type='password'
                />
                <label htmlFor='password'>Password</label>
                <h2>{errors.password?.message?.toString()}</h2>
                
                <h3 className={props.supabaseMsg.type == 'Error' ? styles.Error : styles.Success}>{props.supabaseMsg.message}</h3>

                {loadingInput
                ?
                    <button type='button' className={styles.LoadingButton}><LoadingSvg /></button>
                : 
                    <button type='submit'>Sign in</button>
                }

                <Link href='/register'><button type='button'>Register Account</button></Link>
            </form>
        </div>
    )
  }