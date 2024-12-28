'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/Button';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Импортируем useRouter
import { toast, ToastContainer } from 'react-toastify'; // Импортируем toast
import 'react-toastify/dist/ReactToastify.css'; // Импортируем стили для Toast
import './LoginForm.scss';

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isClient, setIsClient] = useState(false); // Для проверки клиентской стороны
  const router = useRouter(); // Инициализируем useRouter

  // Проверяем, на клиенте ли мы
  useEffect(() => {
    setIsClient(true);
  }, []);

  const onSubmit = async (data) => {
    try {
      const { login, password } = data;
      const url = `https://4a51-37-99-64-195.ngrok-free.app/api/Auth/signin`;
  
      // Отправка данных через POST
      const response = await axios.post(url, null, {
        params: {
          email: login,
          password: password,
        },
        headers: {
          'ngrok-skip-browser-warning': true, // Добавляем заголовок
        },
      });
  
      console.log('Response:', response.data);
  
      // Сохраняем ID в localStorage
      const userId = response.data; // Предполагаем, что ID приходит в response.data.id
      localStorage.setItem('userId', userId);
  
      toast.success('Авторизация успешна!'); // Уведомление об успехе
  
      // Перенаправляем на страницу профиля
      if (isClient) {
        router.push(`/profile?id=${userId}`);
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      toast.error('Ошибка при авторизации. Проверьте логин и пароль.'); // Уведомление об ошибке
    }
  };

  if (!isClient) {
    return null; // или можно показать загрузочный индикатор
  }

  return (
    <div className="LoginContainer">
      <ToastContainer /> {/* Контейнер для уведомлений */}
      <form className="LoginForm" onSubmit={handleSubmit(onSubmit)}>
        {/* Поле Логин */}
        <label>
          Почта:
          <input
            type="text"
            {...register('login', { required: 'Логин обязателен' })}
          />
          {errors.login && <p>{errors.login.message}</p>}
        </label>

        {/* Поле Пароль */}
        <label>
          Пароль:
          <input
            type="password"
            {...register('password', {
              required: 'Пароль обязателен',
              minLength: {
                value: 6,
                message: 'Пароль должен содержать минимум 6 символов',
              },
            })}
          />
          {errors.password && <p style={{color:"red"}}>{errors.password.message}</p>}
        </label>

        {/* Кнопка отправки */}
        <a href="/register">Регистрация</a>
        <Button text="Войти" types="submit" />
      </form>
    </div>
  );
};

export default LoginForm;
