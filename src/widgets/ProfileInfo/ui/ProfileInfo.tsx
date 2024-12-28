import React, { useEffect, useState } from 'react';
import './Profile.scss';
import { Button } from '@/shared/ui/Button';
import axios from 'axios';

const ProfileInfo = () => {
  const [userData, setUserData] = useState(null); // Состояние для хранения данных пользователя
  const [loading, setLoading] = useState(true); // Для отслеживания загрузки данных
  const [error, setError] = useState(null); // Для отслеживания ошибок

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Получаем ID пользователя из localStorage
        if (!userId) {
          throw new Error('User ID не найден');
        }

        const response = await axios.get(
          `https://4a51-37-99-64-195.ngrok-free.app/api/Auth/get-user-info`,
          { params: { id: userId } } // Передаем ID в параметры запроса
        );

        setUserData(response.data); // Сохраняем данные пользователя
        console.log(response)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <p>Загрузка данных...</p>;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  return (
    <div className='ProfileBlock'>
      <div className='ProfileInfo'>
        <img src='/assets/Images/Profile/profileImg.png' alt='' />
        <div className='Profile_info_block'>
          <div>
            <h2 className='profile_name'>
              {userData.firstName} {userData.lastName}
            </h2>
            <h4 className='profile_role'>@{userData.userName}</h4>
          </div>
          <p className='about_me'>Обо мне</p>
          <p className='profile_desc'>
            Добро пожаловать на страницу профиля! Здесь вы можете увидеть личную информацию и другие данные.
          </p>
        </div>
        <div>
          <Button text='Редактировать' />
        </div>
      </div>
      <div className='ProfilePortfolio'>
        <div className='Profile_info'>
          <h4 className='Profile_info_main'>Информация</h4>
          <ul className='Profile_info_list'>
            <li>Локация: Алматы</li>
            <li>Возраст: {userData.age || 'Не указан'}</li>
            <li>Email: {userData.email}</li>
          </ul>
        </div>
        <div className='Portfolio'>
          <h4 className='Profile_info_main'>Портфолио</h4>
          <div>
            <p>Ваше портфолио пока пустое</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
