import {useState} from 'react';

import styles from './input.module.css';

export default function TagsInput(props: any) {

    const [input, setInput] = useState<string[]>(['']);
    const [inputError, setInputError] = useState<number[]>([]);

    // adds additional tag by pushing new array value
    const addInput = () => {
        if (input.length < 4){
            return setInput(prev => [...prev, '']);
        } ;
    }

    // handle onchange for input
    const handleInput = (value: string, index: number) => {
        // create copy of array
        let data = input;
        data[index] = value;
        return setInput(data);
    }
    
    const checkInput = () => {
        // reset error messages
        setInputError([]);

        let valid = true;
        input.map((e, index) => {
            // if failed validation test
            if(!e || !/^[\w]{3,20}$/.test(e)){
                valid = false;
                return setInputError(prev => [...prev, index + 1]);
            };
        });
        if (valid) return console.log('Good job!');
        else return console.log('Bad job!')
    }
    
    return (  
        <div className={styles.InputParent}>
            <h1>Tags</h1>
            {inputError[0] > 0 ? <h2 className={styles.ErrorText}>{inputError.map(e => `Tag ${e},`)}<br></br><br></br>Must be (3 - 30) characters, no special characters!</h2> : <></>}
            {input.map((e, index) => (
                <div key={index}>
                    <label htmlFor='tag'>Tag {index + 1}</label>
                    <input type='text' name='tag' 
                    onChange={(e) => handleInput(e.target.value, index)}
                    />
                </div>
            ))}
            <button className={styles.AddInputButton}
            onClick={addInput}>Add Tag</button>
            <button className={styles.SaveButton}
            onClick={checkInput}>Save Changes</button>

        </div>
    )
  }