// auth
import { createClient } from 'utils/supabase-browser';
const supabase = createClient();

// typedef
type Inputs = {
    email: string,
    password: string,
};
type SignupInputs = {
    email: string,
    password: string,
    username: string
};
type ResetSendInputs = {
    email: string,
};
type ResetUpdateInputs = {
    password: string
};

export async function SignupAuth(params: SignupInputs) {
    const { data, error } = await supabase.auth.signUp(
        {
            email: params.email,
            password: params.password,
            options: {
                data: {
                    username: params.username,
                }
            }
        }
    );
    
    if (error) return {
        type: 'error',
        message: `${error.message}`
    }; else return {
        type: 'success',
        message: `${data}`
    };

}

export async function SigninAuth(params: Inputs) {
    const {data, error} = await supabase.auth.signInWithPassword({
        email: params.email,
        password: params.password
    });
    if (error) return {
        type: 'error',
        message: `${error.message}`
    }; else return {
        type: 'success',
        message: `${data}`
    };

}

export async function SignoutAuth() {
    const { error} = await supabase.auth.signOut();
    if (error) return {
        type: 'error',
        message: `${error.message}`
    }; else return {
        type: 'success',
        message: ``
    };

}

export async function GetSessionAuth() {
    return supabase.auth.getSession();
}

export async function ResetPasswordSend(params: ResetSendInputs) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(params.email, {
        redirectTo: 'http://localhost:3000/signin/updatepassword',
    });
    if (error) return {
        type: 'error',
        message: `There was an error processing your request!`
    }; else return {
        type: 'success',
        message: `${data}`
    };

}

export async function UpdatePasswordSend(params: ResetUpdateInputs) {
    const { data, error } = await supabase.auth.updateUser({
        password: params.password
    });
    if (error) return {
        type: 'error',
        message: `There was an error processing your request!`
    }; else return {
        type: 'success',
        message: `${data}`
    };

}