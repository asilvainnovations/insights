import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://phurqaubfdehwrpfaetn.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjljNGE3MTQwLTFkNWEtNGNmZC1hNjA3LWZjOTQwZmI3N2RiMCJ9.eyJwcm9qZWN0SWQiOiJwaHVycWF1YmZkZWh3cnBmYWV0biIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY5OTUwOTMxLCJleHAiOjIwODUzMTA5MzEsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.efL3-eK8AmySahEJWNUVZFEi8aOfsODuRKqwI90NBXQ';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };
