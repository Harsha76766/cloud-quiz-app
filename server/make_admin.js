
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function makeAdmin(email) {
    console.log(`Attempting to promote ${email} to admin...`);

    let userToPromote = null;

    // Try to find by email
    const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);

    if (users && users.length > 0) {
        userToPromote = users[0];
        console.log('Found user by email:', userToPromote.email);
    } else {
        console.log('User not found by email. Fetching latest user...');
        const { data: latestUsers, error: latestError } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);

        if (latestUsers && latestUsers.length > 0) {
            userToPromote = latestUsers[0];
            console.log('Found latest user:', userToPromote.email);
        }
    }

    if (!userToPromote) {
        console.error('No users found to promote.');
        return;
    }

    const { data, error: updateError } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', userToPromote.id)
        .select();

    if (updateError) {
        console.error('Error updating user:', updateError);
    } else {
        console.log('User promoted to admin:', data[0]);
    }
}

const email = process.argv[2] || 'admin_report@test.com';
makeAdmin(email);

