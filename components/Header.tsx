import React from 'react'
import { Button } from './ui/button';
import Image from 'next/image';
import { signOutUser } from '@/lib/appwrite/actions/user.actions';
import Search from './Search';
// import Search from './Search';
// import FileUploader from './FileUploader';

const Header = ({userId, accountId} : {userId : string; accountId : string;}) => {
  return <header className='header'>
    <Search />
    <div className='header-wrapper'>
        {/* <FileUploader ownerId={userId} accountId={accountId}  /> */}

        <form action={async () => {
            "use server";
            await signOutUser();
            }}>
            <Button type='submit' className='p-5 text-[18px] shadow-md hover:transition-transform hover:transform hover:scale-105 duration-300'>
                {/* <Image src='/assets/icons/logout.svg' alt='Logout' width={24} height={24} className='w-6'  /> */}Sign Out
            </Button>
        </form>
    </div>
  </header>
};

export default Header