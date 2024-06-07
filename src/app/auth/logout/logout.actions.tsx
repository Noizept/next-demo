//! server action for logout goes here.
//! means: check if there is the cookie set on /login on the header
//! if there is cookie on the header remove it.
//! for demo purposes, let's add it to the blacklist as well of tokens
//! check the login setex command

// on the Page.tsx on root create a button that calls this actions
// might fail because it might not be server component and onClick will break.
// workaround: create hidden form with the button button, and action would be the logout here

// try keep Page.tsx as server component (ie, dont use "use client")
