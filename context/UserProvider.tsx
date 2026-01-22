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
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    // Load user from cookies on mount
    const data = cookies.get('mechchant_admin_user');
    if (data) {
      try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        setUser(parsed);
        //Fetch fresh user data from backend
        getUser(parsed.userId)
          .then((res) => {
            if (res?.data) {
              const userData: IUser = {
                firstName: res.data.firstName,
                lastName: res.data.lastName,
                email: res.data.email,
                userId: res.data.userId,
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
  }, [refresh]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, setRefresh }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
