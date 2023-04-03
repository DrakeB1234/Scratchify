// auth
import { createClient } from 'utils/supabase-browser';
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
