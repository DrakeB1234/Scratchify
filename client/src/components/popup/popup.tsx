'use client'

import Link from 'next/link';
import React, {useState} from 'react';

// import styles / components
import styles from './popup.module.css';

// typedef
type Props = {
    title: string,
    message: string[],
    link?: string,
    linkMessage?: string,
    confirm?: boolean,
    popupToggle?: any,
    callback?: any
}

export default function Popup(props: Props) {

  return (
    <div className={styles.PopupParent}>
        <div className={styles.PopupContent}>

            <h1>{props.title}</h1>

            {props.message.map((e: string, index: number) => (
                <h2 key={index + 'a'}>{e}</h2>
            ))}

            {props.link != null
            ? <Link href='/signin'>{props.linkMessage}</Link>
            : <></>
            }

            {props.confirm
            ? 
            <div className={styles.ConfirmButtonsParent}>
              <button
              onClick={() => props.popupToggle(false)}
              >Cancel</button>

              <button
              onClick={props.callback}
              >Confirm</button>

            </div>
            : <></>
            }

        </div>
    </div>
  )
}
