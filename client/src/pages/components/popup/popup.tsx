import {useState, useEffect} from 'react';

import styles from './popup.module.css';

export default function PopUp(props: any) {

    const [togglePopup, setTogglePopup] = useState(false);

    // check if active in props is set
    useEffect(() => {
        if (props.active === 'false'){
            setTogglePopup(false);
        } else {
            setTogglePopup(true);
        }
    }, [])

    const callbackFunction = () => {
        props.toggle(false);
        // run callback function
        props.callback();
    };
    
    return (  
        <>
        {togglePopup
        ?
            <div className={styles.PopupParent}>
                <div className={styles.PopupChild}>
                    <h1>{props.title}</h1>
                    <h2>{props.message}</h2>
                    <div className={styles.PopupButtons}>
                        <button onClick={() => props.toggle(false)}>Cancel</button>
                        <button onClick={callbackFunction}>Yes</button>
                    </div>
                </div>
            </div>
        :<></>
        }
        </>
    )
  }