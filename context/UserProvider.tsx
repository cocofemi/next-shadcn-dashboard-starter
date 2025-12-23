import React, { createContext, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';

import { CurrentUserContextType, IUser } from '../@types/user';
import { getUser } from '@/utils/user';

export const UserContext = createContext<CurrentUserContextType | null>(null);

function UserProvider({ children }: { children: React.ReactNode }) {
  const cookies = new Cookies();
  const [user, setUser] = useState<IUser>({
    firstName: '',
    lastName: '',
    email: '',
    userId: '',
    token: '',
    role: '',
    storeId: '',
    storeName: '',
    stripeAccountId: '',
    stripePayoutsEnabled: false,
    stripeOnboardingComplete: false,

    storeAddress: [],
    description: '',
    storeEmail: ''
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load user from cookies on mount
    const data = cookies.get('mechchant_admin_user');
    if (data) {
      try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        setUser(parsed);
        //Fetch fresh user data from backend
        getUser(parsed.userId, parsed.token)
          .then((res) => {
            if (res?.data) {
              const userData: IUser = {
                firstName: res.data.firstName,
                lastName: res.data.lastName,
                email: res.data.email,
                userId: res.data.userId,
                token: res.data.token,
                role: res.data.role,
                storeId: res.data.storeId,
                storeName: res.data.storeName,
                stripeAccountId: res.data.stripeAccountId,
                stripePayoutsEnabled: res.data.stripePayoutsEnabled,
                stripeOnboardingComplete: res?.data?.stripeOnboardingComplete,
                storeAddress: res.data.storeAddress,
                description: res.data.description,
                storeEmail: res.data.storeEmail
              };

              // update cookie and state
              cookies.set('mechchant_admin_user', JSON.stringify(userData), {
                path: '/'
              });
              setUser(userData);
            }
          })
          .finally(() => setLoading(false));
      } catch (e) {
        setLoading(false);
        console.error('Invalid cookie data', e);
        cookies.remove('mechchant_admin_user');
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
