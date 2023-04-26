// auth
import { v4 as uuidv4 } from 'uuid';
import { createClient } from 'utils/supabase-browser';
import { GetSessionAuth } from '@/supabasehelpers/auth';
const supabase = createClient();

export async function GetGroceryList(userId: string) {
    const { data, error } = await supabase
    .from('grocery_list')
    .select('id, category, recipe, item')
    .eq('user_id', userId)
    .order('category', {
        ascending: true
    })
    .order('item', {
        ascending: true
    })
    ;
    
    if (error) return {
        type: 'error',
        message: `${error.message}`,
        data: null
    }; else return {
        type: 'success',
        message: '',
        data: data
    };
}

export async function EditListItem(userId: string, itemId: any, formVal: any) {

    // check if formval category is set to 'none', if so null value
    if (formVal.category === 'none') formVal.category = null;
    
    const { data, error } = await supabase
    .from('grocery_list')
    .update({category: formVal.category, item: formVal.item})
    .eq('user_id', userId)
    .eq('id', itemId)
    ;
    
    if (error) return {
        type: 'error',
        message: `${error.message}`,
        data: null
    }; else return {
        type: 'success',
        message: '',
        data: data
    };
}

export async function DeleteListItem(userId: string, itemId: any) {
    
    const { data, error } = await supabase
    .from('grocery_list')
    .delete()
    .eq('user_id', userId)
    .eq('id', itemId)
    ;
    
    if (error) return {
        type: 'error',
        message: `${error.message}`,
        data: null
    }; else return {
        type: 'success',
        message: '',
        data: data
    };
}

export async function GetUserRecipes(userid: any) {
    const { data, error } = await supabase
    .from('recipe')
    .select('recipe_id, title, photoUrl')
    .eq('user_id', userid);
    
    if (error) return {
        type: 'error',
        message: `${error.message}`,
        data: null
    }; else return {
        type: 'success',
        message: '',
        data: data
    };
}

// typedef
type recipeEditData = {
    type: string | null,
    message: string | null,
    data: any
}

export async function GetRecipeById(userid: any, recipeId: any) {
    let payload: recipeEditData = {
        type: null,
        message: null,
        data: null,
    }
    
    try {
        // grab recipe data if recipe id was able to be retrieved
        const { data: recipeData, error: recipeError } = await supabase
            .from('recipe')
            .select(`title, course, description, photoUrl, source, public,
            profiles(username),
            recipe_tags(tag),
            recipe_ingredients(amount, ingredient),
            recipe_spices(spice),
            recipe_instructions(instruction)`)
            .eq('recipe_id', recipeId)
            .eq('recipe_tags.recipe_id', recipeId)
            .eq('recipe_ingredients.recipe_id', recipeId)
            .eq('recipe_spices.recipe_id', recipeId)
            .eq('recipe_instructions.recipe_id', recipeId)
            ;
        
        // error handler
        if (recipeError) throw recipeError;

        // return payload if no errors
        payload.type = "success";
        payload.data = recipeData;
        return payload;

    } catch(e: any) {
        payload.type = "error";
        payload.message = e;
        payload.data = null;
        return payload;
    }

}

export async function SearchRecipes(searchParam: string | null) {
    // performs search if params are provided
    if (searchParam != null) {

        let query = supabase
            .from('recipe')
            .select('title, photoUrl, profiles(username), recipe_saved(id)');
  
        // searches with provided search query
        if (searchParam) { query = query.like('title', `%${searchParam}%`) }
        
        const { data, error } = await query;
    
        if (error) return {
            type: 'error',
            message: `${error.message}`,
            data: null
        }; else return {
            type: 'success',
            message: '',
            data: data
        };
    }
    // else if no params provided return error
    else return {
        type: 'error',
        message: `input error`,
        data: null
    }
}

// typedef
type RecipeInputs = {
    title: string | null,
    course: string | null,
    description: string | null,
    source: string | null,
    public: boolean,
    photoFile: any | null,
    tags: string[],
    ingredients: {
        amount: string,
        name: string
    }[],
    spices: string[],
    instructions: string[]
}

export async function SaveRecipe(userId: any, recipeId: number) {
    try {
        // try and get row if recipe has already been saved by user
        const { data: recipeData, error: recipeError } = await supabase
            .from('recipe_saved')
            .select('user_id, recipe_id')
            .eq('user_id', userId)
            .eq('recipe_id', recipeId)
        ;

        // error handler
        if (recipeError) throw recipeError;
        
        // if data is empty, user has not saved recipe yet
        if (recipeData.length <= 0){
            // if recipe not saved
            const { error: saveError } = await supabase
                .from('recipe_saved')
                .insert({ 
                    user_id: userId, 
                    recipe_id: recipeId,
                })
            ;

            // error handler
            if (saveError) throw saveError;

            // if success, return success msg
            return {
                response: 'success',
                type: 'Saved Recipe',
                message: null
            }
        } else {
            // if recipe already saved, delete row from database
            const { error: removeError } = await supabase
                .from('recipe_saved')
                .delete()
                .eq('user_id', userId)
                .eq('recipe_id', recipeId)
            ;

            // error handler
            if (removeError) throw removeError;

            // if success, return success msg
            return {
                response: 'success',
                type: 'Removed Saved Recipe',
                message: null
            }
        }
    }
    catch(error: any) {
        return {
            response: 'error',
            type: 'Database Error',
            message: error.message
        }
    }
}

export async function CreateRecipe(data: RecipeInputs) {

    // validating user inpuit
    if (data.title == null || !/^[^\s][()\w\s-]{2,40}$/.test(data.title)) return {
        response: 'error',
        type: 'Invalid input',
        message: 'Title'
    };
    if (data.course == null || !/^Breakfast|Lunch|Dinner|Dessert|Snack$/.test(data.course)) return {
        response: 'error',
        type: 'Invalid input',
        message: 'Course'
    };
    if (data.description == null || !/^[^\s][\w\s!@#$%^&*()-~`_+{}|/°:;"<>?\[\]\',.\/\\]{2,500}$/.test(data.description)) return {
        response: 'error',
        type: 'Invalid input',
        message: 'Description'
    };
    if (data.source != null && !/^[^\s][\w\s!@#$%^&*()-~`_+{}|/°:;"<>?\[\]\',.\/\\]{2,200}$/.test(data.source)) return {
        response: 'error',
        type: 'Invalid input',
        message: 'Source'
    };

    let failure = false;
    // tags input validation
    if(data.tags[0] != ''){
        data.tags.map((e: any) => {
            if(!/^[^\s][a-zA-Z\s]{2,30}$/.test(e.name)) return failure = true;
        });
    } else return {
        response: 'error',
        type: 'Invalid input',
        message: 'Need at least one Tag'
    };
    // check if map of tags failed
    if (failure) return {
        response: 'error',
        type: 'Invalid input',
        message: 'Tags Format'
    };

    // ingredients input validation
    if(data.ingredients[0].name != ''){
        data.tags.map((e: any) => {
            if(!/^[^\s][\w\s!@#$%^&*()-~`'_+{}|/:;"<>?\[\]\',.\/\\]{2,30}$/.test(e.amount) || !/^[^\s][\w\s!@#$%^&*()-~`'_+{}|/:;"<>?\[\]\',.\/\\]{2,50}$/.test(e.name)) return failure = true;
        });
    } else return {
        response: 'error',
        type: 'Invalid input',
        message: 'Need at least one ingredient'
    };
    // check if map of tags failed
    if (failure) return {
        response: 'error',
        type: 'Invalid input',
        message: 'Ingredients Format'
    };

    // spices input validation (optional)
    if(data.spices[0] != ''){
        data.tags.map((e: any) => {
            if(!/^[^\s][\w\s!@#$%^&*()-~`'_+{}|/:;"<>?\[\]\',.\/\\]{2,30}$/.test(e.name)) return failure = true;
        });
    }
    // check if map of tags failed
    if (failure) return {
        response: 'error',
        type: 'Invalid input',
        message: 'Spices Format'
    };

    // instructions input validation
    if(data.instructions[0] != ''){
        data.instructions.map((e: any) => {
            if(!/^[^\s][\w\s!@#$%^&*()-~`'_+{}|/:;"<>?\[\]\,.\/\\]{2,500}$/.test(e)) return failure = true;
        });
    } else return {
        response: 'error',
        type: 'Invalid input',
        message: 'Need at least one instruction'
    };
    // check if map of tags fail`ed
    if (failure) return {
        response: 'error',
        type: 'Invalid input',
        message: 'Instructions Format'
    };

    // if photo is provided, make sure it matches validation (30MB max and JPG, JPEG, PNG)
    if (data.photoFile != null && (data.photoFile.size > 30000000 || !data.photoFile.name.match(/\.(jpg|jpeg|png)$/i)))return {
        response: 'error',
        type: 'Invalid input',
        message: 'Photo'
    };

    // if all input validation passes, then start uploading data to supabase
    let recipeId: any;
    let url: string | null = null;
    // get user session
    let session: any = await GetSessionAuth();
    session = session.data.session

    // upload image to bucket if photo provided through input
    if (data.photoFile != null){
        // make url
        url = 'public/' + data.title + '-' + uuidv4();

        const { data: photoFileData, error: photoError } = await supabase
        .storage
        .from('recipe-images')
        // uploaded files will be recipe-images/TheBestLasagna-randomid123123
        .upload(url, data.photoFile, {
            cacheControl: '3600',
            upsert: false
        });
        // error handle
        if (photoError) throw photoError;

        // if no errors, set url to public url for getting image
        url = encodeURI('https://wsgtwhbvwnftxaqiogud.supabase.co/storage/v1/object/public/recipe-images/' + url);
    };

    // query database to create recipe and return its recipe ID
    try {
        const { data: recipeData, error: recipeError } = await supabase
        .from('recipe')
        .insert({ 
            user_id: session?.user.id, 
            title: data.title,
            course: data.course,
            description: data.description,
            source: data.source,
            public: data.public,
            photoUrl: url
        })
        .select('recipe_id');

        // after insert, select returns recipe id for referencing other tables data
        recipeId = recipeData?.[0].recipe_id;
        
        // error handle
        if (recipeError) throw recipeError;
    } catch(error: any) {
        // check if failure is due to unique title names
        if (error.message.includes('duplicate key value violates unique constraint')) return {
            response: 'error',
            type: 'Database error',
            message: 'Title name is taken, try another!'
        }

        // if no other error is specfied, return generic error message to user
        return {
        response: 'error',
        type: 'Database error',
        message: 'Try again later!'
        }
    };

    // query database to add tags
    try {
        const tagsArray: any = [];
        data.tags.map((e: any) => {
            tagsArray.push({
                recipe_id: recipeId,
                tag: e.name
            })
        });
        const { error: tagsError } = await supabase
            .from('recipe_tags')
            .insert(tagsArray);

        // error handle
        if (tagsError) throw tagsError;
    } catch(error) {
        return {
        response: 'error',
        type: 'Database error',
        message: 'Try again later!'
        }
    };

    // query database to add ingredients
    try {
        const ingredientsArray: any = [];
        data.ingredients.map((e: any) => {
            ingredientsArray.push({
                recipe_id: recipeId,
                amount: e.amount,
                ingredient: e.name
            })
        });
        const { error: ingredientsError } = await supabase
            .from('recipe_ingredients')
            .insert(ingredientsArray);

        // error handle
        if (ingredientsError) throw ingredientsError;
    } catch(error) {
        return {
        response: 'error',
        type: 'Database error',
        message: 'Try again later!'
        }
    };

    // query database to add spices if added by user
    try {
        if (data.spices[0] !== ''){
            const spicesArray: any = [];
            data.spices.map((e: any) => {
                spicesArray.push({
                    recipe_id: recipeId,
                    spice: e.name
                })
            });
            const { error: spicesError } = await supabase
                .from('recipe_spices')
                .insert(spicesArray);
    
            // error handle
            if (spicesError) throw spicesError;
        }
    } catch(error: any) {
        console.error(error)
        return {
        response: 'error',
        type: 'Database error',
        message: 'Try again later!'
        }
    };

    // query database to add instructions
    try {
        const instructionsArray: any = [];
        data.instructions.map((e: any) => {
            instructionsArray.push({
                recipe_id: recipeId,
                instruction: e.name,
            })
        });
        const { error: instructionsError } = await supabase
            .from('recipe_instructions')
            .insert(instructionsArray);

        // error handle
        if (instructionsError) throw instructionsError;
    } catch(error) {
        return {
            response: 'error',
            type: 'Database error',
            message: 'Try again later!'
        }
    };

    // if all is successful, return success message
    return {
        response: 'success',
        type: '',
        message: 'Recipe Created'
    }
}

// typedef
type RecipeEditInputs = {
    title: string | null,
    course: string | null,
    description: string | null,
    source: string | null,
    public: boolean,
    photoFile: any | null,
    tags: {
        tag: string,
    }[],
    ingredients: {
        amount: string,
        name: string
    }[],
    spices: {
        spice: string,
    }[],
    instructions: {
        instruction: string,
    }[],
}

// function checks to see if any edits were made (determines this by seeing if data passed is not null)
// this is done to save API calls by only updating the database with data that is actually changed from the
// original
export async function EditRecipe(data: RecipeEditInputs, userId: any, recipeId: number, photoUrl: any, recipeTitle: any) {
    // check if any changes made in main recipe table
    try {
        if (data.title != null) {
            const { error: titleError } = await supabase
                .from('recipe')
                .update( { title: data.title } )
                .eq('recipe_id', recipeId)
                .eq('user_id', userId);

            // error handle
            if (titleError) throw titleError;
        }

        if (data.course != null) {
            const { error: courseError } = await supabase
                .from('recipe')
                .update( { course: data.course } )
                .eq('recipe_id', recipeId)
                .eq('user_id', userId);

            // error handle
            if (courseError) throw courseError;
        }

        if (data.description != null) {
            const { error: descriptionError } = await supabase
                .from('recipe')
                .update( { description: data.description } )
                .eq('recipe_id', recipeId)
                .eq('user_id', userId);

            // error handle
            if (descriptionError) throw descriptionError;
        }

        if (data.source != null) {
            const { error: sourceError } = await supabase
                .from('recipe')
                .update( { source: data.source } )
                .eq('recipe_id', recipeId)
                .eq('user_id', userId);

            // error handle
            if (sourceError) throw sourceError;
        }

        if (data.public != null) {
            const { error: publicError } = await supabase
                .from('recipe')
                .update( { public: data.public } )
                .eq('recipe_id', recipeId)
                .eq('user_id', userId);

            // error handle
            if (publicError) throw publicError;
        }

        // check if photo file was provided
        let url: any;
        if (data.photoFile != null){
            // delete old image from bucket
            // get pure path to item in bucket
            url = photoUrl!.replace('https://wsgtwhbvwnftxaqiogud.supabase.co/storage/v1/object/public/recipe-images/', '');

            // removing space placeholders from url with actual spaces
            url = url!.replaceAll('%20', ' ');

            const { error } = await supabase
                .storage
                .from('recipe-images')
                .remove([url])

            if (error) throw error;

            // prepare to upload new image
            // make url
            url = 'public/' + recipeTitle + '-' + uuidv4();

            const { data: photoFileData, error: photoError } = await supabase
            .storage
            .from('recipe-images')
            // uploaded files will be recipe-images/TheBestLasagna-randomid123123
            .upload(url, data.photoFile, {
                cacheControl: '3600',
                upsert: false
            });
            // error handle
            if (photoError) throw photoError;

            // if no errors, set url to public url for getting image
            url = encodeURI('https://wsgtwhbvwnftxaqiogud.supabase.co/storage/v1/object/public/recipe-images/' + url);

            const { data: recipeData, error: recipeError } = await supabase
            .from('recipe')
            .update({ photoUrl: url})
            .eq('recipe_id', recipeId);

            if (recipeError) throw recipeError;
        }

        // check if any changes made in tags
        if (data.tags != null ){
            let query: any[] = []
            data.tags.map((e: any) => {
                query.push({recipe_id: recipeId, tag: e.tag});
            });

            // remove old tags
            const { error: removeError } = await supabase
                .from('recipe_tags')
                .delete()
                .eq('recipe_id', recipeId);

            // error handle
            if (removeError) throw removeError;

            // add new tags
            const { error: addError } = await supabase
                .from('recipe_tags')
                .insert(query);

            // error handle
            if (addError) throw addError;
        }

        // check if any changes made in ingredients
        if (data.ingredients != null ){
            let query: any[] = []
            data.ingredients.map((e: any) => {
                query.push({recipe_id: recipeId, amount: e.amount, ingredient: e.ingredient});
            });
                        
            // remove old ingredients
            const { error: removeError } = await supabase
                .from('recipe_ingredients')
                .delete()
                .eq('recipe_id', recipeId);

            // error handle
            if (removeError) throw removeError;

            // add new ingredients
            const { error: addError } = await supabase
                .from('recipe_ingredients')
                .insert(query);

            // error handle
            if (addError) throw addError;
        }

        // check if any changes made in spices
        if (data.spices != null){
            let query: any[] | null = []

            // check if first item in array isn't blank (user wants all spices deleted) 
            if (data.spices[0].spice == ""){
                query = null;
            } else {
                data.spices.map((e: any) => {
                    if (e.spice != null) {
                        query?.push({recipe_id: recipeId, spice: e.spice});
                    }
                });
            }
                        
            // remove old spices
            const { error: removeError } = await supabase
                .from('recipe_spices')
                .delete()
                .eq('recipe_id', recipeId);

            // error handle
            if (removeError) throw removeError;

            // add new spices if spices array is not nulled
            if (query != null) {
                const { error: addError } = await supabase
                .from('recipe_spices')
                .insert(query);

                // error handle
                if (addError) throw addError;
            }
        }

        // check if any changes made in instructions
        if (data.instructions != null ){
            let query: any[] = []
            data.instructions.map((e: any) => {
                query.push({recipe_id: recipeId, instruction: e.instruction});
            });
                        
            // remove old instructions
            const { error: removeError } = await supabase
                .from('recipe_instructions')
                .delete()
                .eq('recipe_id', recipeId);

            // error handle
            if (removeError) throw removeError;

            // add new instructions
            const { error: addError } = await supabase
                .from('recipe_instructions')
                .insert(query);

            // error handle
            if (addError) throw addError;
        }

    } catch(error) {
        return {
            response: 'error',
            type: 'Database error',
            message: 'Try again later!'
        }
    };
    

    return {
        response: 'success',
        type: '',
        message: 'Recipe Edited'
    }
}

// function checks to see if any edits were made (determines this by seeing if data passed is not null)
// this is done to save API calls by only updating the database with data that is actually changed from the
// original
export async function DeleteRecipe(userId: any, recipeId: number) {
    try {
        // get photo url
        const { data: photoGet, error: photoGetError } = await supabase
            .from('recipe')
            .select('photoUrl')
            .eq('recipe_id', recipeId)
            .eq('user_id', userId)
        ;

        // error handle
        if (photoGetError) throw photoGetError;

        // if a photo url is not null then delete with url, otherwise move on
        if (photoGet?.[0].photoUrl != null){
            let url = photoGet?.[0].photoUrl;

            // get pure path to item in bucket
            url = url!.replace('https://wsgtwhbvwnftxaqiogud.supabase.co/storage/v1/object/public/recipe-images/', '');

            // removing space placeholders from url with actual spaces
            url = url!.replaceAll('%20', ' ');
            const { error } = await supabase
                .storage
                .from('recipe-images')
                .remove([url])

            // error handle
            if (error) throw error;
        }

        // delete tags
        const { error: tagRemoveError } = await supabase
        .from('recipe_tags')
        .delete()
        .eq('recipe_id', recipeId)
        ;

        // error handle
        if (tagRemoveError) throw tagRemoveError;

        // delete ingredients
        const { error: ingredientsRemoveError } = await supabase
        .from('recipe_ingredients')
        .delete()
        .eq('recipe_id', recipeId)
        ;

        // error handle
        if (ingredientsRemoveError) throw ingredientsRemoveError;

        // delete spices
        const { error: spicesRemoveError } = await supabase
        .from('recipe_spices')
        .delete()
        .eq('recipe_id', recipeId)
        ;

        // error handle
        if (spicesRemoveError) throw spicesRemoveError;

        // delete instructions
        const { error: instructionsRemoveError } = await supabase
        .from('recipe_instructions')
        .delete()
        .eq('recipe_id', recipeId)
        ;

        // error handle
        if (instructionsRemoveError) throw instructionsRemoveError;

        // delete recipe
        const { error: recipeRemoveError } = await supabase
        .from('recipe')
        .delete()
        .eq('recipe_id', recipeId)
        .eq('user_id', userId)
        ;

        // error handle
        if (recipeRemoveError) throw recipeRemoveError;

    } catch(error) {
        return {
            response: 'error',
            type: 'Database error',
            message: 'Try again later!'
        }
    };
    
    return {
        response: 'success',
        type: '',
        message: 'Recipe Deleted'
    }
}