import React from 'react';
import { HeaderContainer } from '@/styles/header';
import { useDisconnect, useNetwork } from "wagmi"
import { signOut, useSession } from "next-auth/react"
import Siwe from './siwe';

const Header: React.FC = () => {

  const { data: session, status } = useSession()
  const { chain } = useNetwork()
  const loading = status === "loading"
  const { disconnect } = useDisconnect()
  
  return (
    <div className='flex justify-between items-center p-4 bg-white'>
      <div className="font-bold text-2xl">zkMoku</div>
      <div>
        <p
        >
          {!session && (
            <>
              <Siwe />
            </>
          )}
          {session?.user && (
            <>
              <a
                href={`/api/auth/signout`}
                onClick={(e) => {
                  e.preventDefault()
                  disconnect()
                  signOut()
                }}
              >
                <strong>{session.user.name?.slice(0, 8)}</strong>
              </a>/ { chain?.name }
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Header;