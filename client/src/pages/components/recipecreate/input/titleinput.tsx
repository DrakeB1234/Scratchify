import React, {useState} from 'react';

import styles from './input.module.css';

export default function TitleInput(props: any) {

    const [input, setInput] = useState({
        title: '',
        course: '',
        description: ''
    });
    const [inputError, setInputError] = useState({
        title: {
            error: false,
            msg: ''
        },
        course: {
            error: false,
            msg: ''
        },
        description: {
            error: false,
            msg: ''
        }
    });
    const [successInput, setSuccessInput] = useState(false);

    const checkInput = () => {
        // reset all error input
        setInputError({
            title: {
                error: false,
                msg: ''
            },
            course: {
                error: false,
                msg: ''
            },
            description: {
                error: false,
                msg: ''
            }
        })
        // check title for correct input
        if (!input.title || !/^[\s\w]{3,30}$/.test(input.title)) return setInputError(prev => ({...prev, title: prev.title = {error: true, msg: 'Must be (3 - 30) characters, no special characters'}}));

        // check course for correct input (exact match for breakfast, lunch, dinner, dessert, or snack)
        if (!input.course || !/^Breakfast|Lunch|Dinner|Dessert|Snack$/.test(input.course)) return setInputError(prev => ({...prev, course: prev.course = {error: true, msg: 'Must be Breakfast, Lunch, Dinner, Dessert, or Snack'}}));

        // check course for correct input (exact match for breakfast, lunch, dinner, dessert, or snack)
        if (!input.description || !/^[\w\s!@#$%^&*()-~`_+{}|:"<>?\[\]\;',.\/\\]{3,300}$/.test(input.description)) return setInputError(prev => ({...prev, description: prev.description = {error: true, msg: 'Must be (3 - 300) characters, no emojis'}}));

        // check to see if any input errored
        setSuccessInput(true);
        
    }
    
    return (  
        <div className={styles.InputParent}>
            <h1>Title, Course, Description</h1>

            <label htmlFor='title'>Title</label>
            <input type='text' name='title'
            onChange={(e) => setInput(prev => ({...prev, title: e.target.value}))}
            maxLength={30}
            />
            {inputError.title.error ? <h2 className={styles.ErrorText}>{inputError.title.msg}</h2> : <></>}

            <label htmlFor='course'>Course</label>
            <select name='course'
            onChange={(e: any) => setInput(prev => ({...prev, course: e.target.value}))}
            >
                <option value='' hidden></option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Dessert">Dessert</option>
                <option value="Snack">Snack</option>
            </select>
            {inputError.course.error ? <h2 className={styles.ErrorText}>{inputError.course.msg}</h2> : <></>}

            <label htmlFor='description'>Description</label>
            <textarea name='description'
            onChange={(e) => setInput(prev => ({...prev, description: e.target.value}))}
            maxLength={300}
            />
            {inputError.description.error ? <h2 className={styles.ErrorText}>{inputError.description.msg}</h2> : <></>}

            <button className={styles.SaveButton}
            onClick={checkInput}>{successInput ? 'Succesfully Saved!' : 'Save Changes'}</button>

        </div>
    )
  }