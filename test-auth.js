const { createClient } = require('@supabase/supabase-js');
// const { validateEnv } = require('./apps/mobile/src/lib/env.js'); // Not easily importable from node script.

// I will hardcode the credentials from the output of `npx supabase status` for this test script.
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
  const email = `test_${Date.now()}@example.com`;
  const password = 'Password123';
  
  console.log(`[1] Signing up user: ${email}...`);
  const signUpRes = await supabase.auth.signUp({ email, password });
  console.log('SignUp Result:', signUpRes.error ? signUpRes.error.message : 'Success. Session exists: ' + !!signUpRes.data.session);
  
  console.log(`[2] Signing out...`);
  // await supabase.auth.signOut();
  
  console.log(`[3] Signing in...`);
  const signInRes = await supabase.auth.signInWithPassword({ email, password });
  console.log('SignIn Result:', signInRes.error ? signInRes.error.message : 'Success. Session exists: ' + !!signInRes.data.session);
}

testAuth().catch(console.error);
