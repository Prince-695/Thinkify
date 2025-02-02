import { IdeasGrid } from '@/components/ideas/IdeasGrid';
import Sidebar from '@/components/Sidebar';
import { getCurrentUser } from '@/lib/appwrite/actions/user.actions';
import { redirect } from 'next/dist/server/api-utils';
import React from 'react';

const MyIdeasPage = async () => {

  const currentUser = await getCurrentUser();

  return (
    <div className="p-6">
      <h1 className="mt-5 text-4xl font-bold text-purple-600 mb-[-25px]">My Ideas</h1>
      <IdeasGrid />
      </div>
  );
};

export default MyIdeasPage;

