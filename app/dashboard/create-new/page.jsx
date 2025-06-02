// app/(main)/create-new/page.jsx
import CreateNewClient from './_components/CreateNewClient'; // Import the new client component
import React from 'react'; // React import is good practice

// This is a Server Component. It doesn't use 'use client'.
// It's responsible for fetching initial data (if any) and rendering client components.
const CreateNewPage = () => {
    // No direct database calls or client-side hooks here.
    // If you had any server-side data fetching for initial form values,
    // you would do it here and pass it as props to CreateNewClient.

    return (
        <CreateNewClient />
    );
};

export default CreateNewPage;