import { useAppDispatch, useAppSelector } from '@/store';
import { fetchClientInfo } from '@/store/modules/client';
import { useEffect, useState } from 'react';
import { ProfileDisplay } from './components/ProfileDisplay/ProfileDisplay';
import { ProfileEdit } from './components/ProfileEdit/ProfileEdit';
import './index.scss';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useAppDispatch();
  const { clientInfo } = useAppSelector(state => state.client);

  useEffect(() => {
    if (!clientInfo || !clientInfo.id) {
      dispatch(fetchClientInfo());
    }
  }, [dispatch, clientInfo]);

  return isEditing ? (
    <ProfileEdit onCancel={() => setIsEditing(false)} onSubmit={() => setIsEditing(false)} />
  ) : (
    <ProfileDisplay data={clientInfo} onEdit={() => setIsEditing(true)} />
  );
};

export { Profile };
