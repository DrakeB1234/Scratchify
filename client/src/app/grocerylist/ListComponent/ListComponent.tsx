'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

// import styles / components
import ListPopup from './listPopup/listPopup';
import styles from './ListComponent.module.css';

// auth
import { AddListItem, DeleteListItem, EditListItem, GetGroceryList } from '@/supabasehelpers/database';

export default function ListComponent(props: any) {

    // type def
    type ListData = {
        id: any,
        category: string,
        recipe: string,
        item: string,
    }[] | null

    type Inputs = {
        category: string,
        item: string
    };

    const [toggleListPopup, setToggleListPopup] = useState(false);
    const [listData, setListData] = useState<ListData>([]);
    const curCat = useRef<any>('');
    const curEditId = useRef(0);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<Inputs>();

    const GetGroceryListFunction = async () => {
        const result = await GetGroceryList(props.userId);
        setListData(result.data);
    }

    useEffect(() => {
        // if there is no data, load in data
        if (listData?.length == 0 && props.userId != null) GetGroceryListFunction();
    }, [props.userId]);

    // form function to add item to list
    const handleSave = async (formVal: any,) => {
        
        const result = await AddListItem(props.userId, formVal);

        // if result was success
        if (result.type == 'success'){
            // reset inputs
            reset({
                category: 'none',
                item: ''
            });
            // refresh list data by calling get list data fuction
            const result = await GetGroceryListFunction();
        }
    }

    const EditItemFunction = (itemId: number) => {
        // set cur edit id
        curEditId.current = itemId;
        // toggle popup
        setToggleListPopup(true);
    }

    // call back function from popup edit component
    const EditItemCallback = async (formVal: any, itemId: number) => {
        // close popup
        setToggleListPopup(false);
        
        const result = await EditListItem(props.userId, itemId, formVal);

        // if result was success
        if (result.type == 'success'){
            // refresh list data by calling get list data fuction
            const result = await GetGroceryListFunction();
        }
        // else, database error
        else {
            console.error(result)
        }
    }

    // call back function from popup edit component for deleting item
    const DeleteItemCallback = async (itemId: number) => {
        // close popup
        setToggleListPopup(false);
        
        const result = await DeleteListItem(props.userId, itemId);

        // if result was success
        if (result.type == 'success'){
            // refresh list data by calling get list data fuction
            const result = await GetGroceryListFunction();
        }
        // else, database error
        else {
            console.error(result)
        }
    }

    return (
        <div className={styles.ListParent}>

            {toggleListPopup
            ?
            <ListPopup 
            popupToggle={setToggleListPopup}
            editId={curEditId.current}
            listData={listData}
            callbackEdit={EditItemCallback}
            callbackDelete={DeleteItemCallback}
            />
            : <></>   
            }

            <div className={styles.ListContentParent}>
                <form className={styles.FormParent}
                onSubmit={(handleSubmit(handleSave))}
                >
                    <div className={styles.InputCategory}>

                        <select {...register('category', {
                            required: {
                                value: true,
                                message: 'Required'
                            },
                            pattern: {
                                value: /^none|Produce|Frozen|Dairy|Meat|Canned & Packed Goods|Condiments|Beverages|House Goods|Others$/,
                                message: 'Must select item in list only'
                            }
                        })}>
                            <option value='none'>Uncategorized</option>
                            <option value='Produce'>Produce</option>
                            <option value='Frozen'>Frozen</option>
                            <option value='Dairy'>Dairy</option>
                            <option value='Meat'>Meat</option>
                            <option value='Canned & Packed Goods'>Canned & Packed Goods</option>
                            <option value='Condiments'>Condiments</option>
                            <option value='Beverages'>Beverages</option>
                            <option value='House Goods'>House Goods</option>
                            <option value='Others'>Others</option>
                        </select>
                    </div>
                    {errors?.category ? <h1 className={styles.FormInputError}>{errors?.category?.message}</h1> : <></>}

                    <div className={styles.InputItem}>
                        <input {...register('item', {
                            required: {
                                value: true,
                                message: 'Required'
                            },
                            maxLength: {
                                value: 40,
                                message: 'Must be less than 40 characters'
                            },
                            pattern: {
                                value: /^[^\s][\w\s!@#$%^&*()-~`'_+{}|/:;"<>?\[\]\',.\/\\]{0,}$/,
                                message: 'No emojis or Starting with spaces'
                            }
                        })}
                        autoComplete='off' 
                        />

                        <button type='submit'>
                            <Image 
                            alt='+'
                            src='/icons/actions/icon-plusgreen-outline.svg'
                            height={20}
                            width={20}
                            />
                        </button>
                    </div>
                    {errors?.item ? <h1 className={styles.FormInputError}>{errors?.item?.message}</h1> : <></>}

                </form>
            </div>
            {listData!.length < 1
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
            : 
                <div className={styles.ListItemContainer}>
                    {listData?.map((e: any, index: number) => {

                        let newCat: boolean = false;

                        if (e.category !== curCat.current) {
                            curCat.current = e.category;
                            newCat = true;
                        }
                        
                        return (
                            <div key={e.id} className={styles.ListItemParent}>
                                {newCat
                                ? <h1>{e.category !== null ? e.category : 'Uncategorized'}</h1>
                                : <></>
                                }

                                <div className={styles.ListItem}>
                                    <h1>{e.item}</h1>
                                    <Image 
                                    alt='edit'
                                    src='/icons/actions/icon-edit-outline.svg'
                                    height={30}
                                    width={30}
                                    onClick={() => EditItemFunction(e.id)}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}