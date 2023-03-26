import Image from 'next/image'
import Link from 'next/link';
import {useState} from 'react';
import {useForm} from 'react-hook-form';

// styles / components
import LoadingSvg from '/public/graphics/icon-loading.svg';
import Popup from '../../components/popup/popup';
import styles from './form.module.css';

export default function RegisterForm(props: any) {
    
    const [loadingInput, setLoadingInput] = useState(false);
    const [togglePopupRegister, setTogglePopupRegister] = useState(false);
    const [formData, setFormData] = useState<Object>({});
    
    const { register, handleSubmit, setError, formState: {errors} } = useForm({});

    // function to confirm user with account creation
    const handleSave = (formVal: any) => {
        // if confirm password equals password fields
        if (formVal.password !== formVal.cpassword){
           return setError("cpassword", { type: "focus", message: 'Passwords must match' }, { shouldFocus: true });        
        } else {
            // set form data to form values passed in
            setFormData(formVal);
            // toggle popup
            setTogglePopupRegister(true);
        }
    };

    // function to confirm user with account creation
    const SignupFunction = async () => {
        setLoadingInput(true);
        await props.callback(formData);
        setLoadingInput(false);
    }
    
    return (  
        <div className={styles.FormParent}>
            {togglePopupRegister
            ?
                <Popup 
                title='Confirm Account Creation'
                message='Are you sure you want to create this account?'
                active='true'
                toggle={setTogglePopupRegister}
                callback={SignupFunction}
                />
            : <></>
            }
            <form className={styles.FormStyle} onSubmit={handleSubmit(handleSave)}>
                <h1>Register</h1>

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

                <input {...register('username', {
                    required: 'Required!',
                    minLength: {
                        value: 3,
                        message: 'Must be greater than 3 characters!'
                    },
                    maxLength: {
                        value: 30,
                        message: 'Must be less than 30 characters!'
                    },
                    pattern: {
                        value: /^[^\s][\w\s-]{0,}$/,
                        message: 'Only letters, numbers, and - Must not start with a space'
                    }
                    })}
                    autoComplete='off' 
                />
                <label htmlFor='username'>Username</label>
                <h2>{errors.username?.message?.toString()}</h2>

                <input {...register('password', {
                    required: 'Required!',
                    minLength: {
                        value: 6,
                        message: 'Must be greater than 6 characters!'
                    },
                    maxLength: {
                        value: 100,
                        message: 'Must be less than 100 characters!'
                    },
                    pattern: {
                        value: /^[^\s][\w\s!@#$%^&*()-~`_+{}|:;"<>?\[\]\',.\/\\]{0,}$/,
                        message: 'No emojis, Must not start with a space'
                    }
                    })}
                    autoComplete='off' type='password'
                />
                <label htmlFor='password'>Password</label>
                <h2>{errors.password?.message?.toString()}</h2>

                <input {...register('cpassword', {
                    required: 'Required!'
                    })}
                    autoComplete='off' type='password'
                />
                <label htmlFor='cpassword'>Confirm Password</label>
                <h2>{errors.cpassword?.message?.toString()}</h2>

                <h3 className={props.supabaseMsg.type == 'Error' ? styles.Error : styles.Success}>{props.supabaseMsg.message}</h3>

                {loadingInput
                ?
                    <button type='button' className={styles.LoadingButton}><LoadingSvg /></button>
                : 
                    <button type='submit'>Register Account</button>
                }

                <Link href='/signin'><button type='button'>Back to Sign in</button></Link>
            </form>
        </div>
    )
  }