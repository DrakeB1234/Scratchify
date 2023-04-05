// auth
import { v4 as uuidv4 } from 'uuid';
import { createClient } from 'utils/supabase-browser';
import { GetSessionAuth } from '@/supabasehelpers/auth';
const supabase = createClient();

export async function GetUserRecipes(userid: any) {
    const { data, error } = await supabase
    .from('recipe')
    .select('*')
    
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

export async function SearchRecipes(data: any) {
    const { data: recipeData, error } = await supabase
        .from('recipe')
        .select('*')
    
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

export async function CreateRecipe(data: RecipeInputs) {

    // validating user inpuit
    if (data.title == null || !/^[^\s][\w\s-]{2,40}$/.test(data.title)) return {
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
            userId: session?.user.id, 
            title: data.title,
            course: data.course,
            description: data.description,
            source: data.source,
            public: data.public,
            photoUrl: url
        })
        .select('recipeId');
        // after insert, select returns recipe id for referencing other tables data
        recipeId = recipeData?.[0].recipeId;
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
                recipeId: recipeId,
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
                recipeId: recipeId,
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
                    recipeId: recipeId,
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
                recipeId: recipeId,
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
