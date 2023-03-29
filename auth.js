// const supabase = require('./supabase');

/* eslint-disable import/no-extraneous-dependencies */
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// User Signup API
async function signUp(email, password) {
    try {
        const { user, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) throw error;
        return user;
    } catch (error) {
        console.error(error);
        return error;
    }
}

// User Signin API
async function signIn(email, password) {
    try {
        const { user, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return user;
    } catch (error) {
        console.error(error);
        return error;
    }
}

module.exports = {
    signUp,
    signIn,
};
