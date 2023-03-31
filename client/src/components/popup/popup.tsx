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
    linkMessage?: string
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

        </div>
    </div>
  )
}
