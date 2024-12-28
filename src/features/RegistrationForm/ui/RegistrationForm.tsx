'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/Button';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Импортируем useRouter
import "./RegistrationForm.scss";

const RegistrationForm = () => {
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
      const { firstName, lastName, email, password } = data;

      // Формируем URL с параметрами
      const url = `ttps://4a51-37-99-64-195.ngrok-free.app/api/Auth/signup`;

      // Отправляем POST запрос с параметрами в URL
      const response = await axios.post(url, null, {
        params: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        },
      });

      console.log('Response:', response.data);

      // Перенаправляем на страницу профиля, если регистрация прошла успешно
      router.push('/profile'); // Перенаправление на страницу профиля
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  if (!isClient) {
    return null; // Или можно показать загрузочный индикатор
  }

  return (
    <div className="RegisterContainer">
      <form className="RegisterForm" onSubmit={handleSubmit(onSubmit)}>
        {/* Поле Имя */}
        <label>
          Имя:
          <input
            type="text"
            {...register('firstName', { required: 'Имя обязательно' })}
          />
          {errors.firstName && <p>{errors.firstName.message}</p>}
        </label>

        {/* Поле Фамилия */}
        <label>
          Фамилия:
          <input
            type="text"
            {...register('lastName', { required: 'Фамилия обязательна' })}
          />
          {errors.lastName && <p>{errors.lastName.message}</p>}
        </label>

        {/* Поле Почта */}
        <label>
          Почта:
          <input
            type="email"
            {...register('email', {
              required: 'Email обязателен',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Неверный формат email',
              },
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
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
          {errors.password && <p>{errors.password.message}</p>}
        </label>

        {/* Кнопка отправки */}
        <Button text="Зарегистрироваться" types="submit" />
      </form>
    </div>
  );
};

export default RegistrationForm;
