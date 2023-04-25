'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// import styles / components
import styles from './ListComponent.module.css';

// auth
import { GetGroceryList } from '@/supabasehelpers/database';

export default function ListComponent(props: any) {

    // type def
    type ListData = {
        category: string,
        recipe: string,
        item: string,
    }[]

    const [listData, setListData] = useState<ListData>([
        // {
        //     category: '',
        //     recipe: '',
        //     item: ''
        // }
    ]);

    const GetGroceryListFunction = async () => {
        const result = await GetGroceryList(props.userId);
        console.log(result.data)
    }

    useEffect(() => {
        // if there is no data, load in data
        if (listData.length == 0 && props.userId != null) GetGroceryListFunction();
    }, [props.userId])

    return (
        <div className={styles.ListParent}>
            <div className={styles.ListContentParent}>
                <div className={styles.ListInputParent}>
                    <div className={styles.InputCategory}>
                    <select>
                        <option defaultValue='none' hidden>Category</option>
                        <option value='none'>Uncategorized</option>
                    </select>
                    </div>
                    <div className={styles.InputItem}>
                    <input type='text' />
                    <Image 
                        alt='+'
                        src='/icons/actions/icon-plusgreen-outline.svg'
                        height={20}
                        width={20}
                    />
                    </div>
                </div>
            </div>
            {listData.length == 0
            ? 
                <div className={styles.ListNoItems}>
                    <Image 
                        alt=''
                        src='/graphics/graphic-recipe.png'
                        height={200}
                        width={200}
                        quality={100}
                    />
                    <h1>Empty List!</h1>
                </div>
            : <h1>Goody</h1>}
        </div>
    )
}