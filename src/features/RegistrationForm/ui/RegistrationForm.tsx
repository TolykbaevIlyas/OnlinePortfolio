'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/Button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import './RegistrationForm.scss';

const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm();

  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onSubmit = async (data) => {
    try {
      if (Object.keys(errors).length > 0) {
        const firstErrorField = Object.keys(errors)[0];
        setFocus(firstErrorField);
        return;
      }

      const { firstName, lastName, email, password } = data;
      const url = `https://4a51-37-99-64-195.ngrok-free.app/api/Auth/signup`;

      const response = await axios.post(url, null, {
        params: { firstName, lastName, email, password },
      });

      console.log('Response:', response.data);
      router.replace('/login');
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  if (!isClient) return null;

  return (
    <div className="RegisterContainer">
      <form className="RegisterForm" onSubmit={handleSubmit(onSubmit)}>
        <label>
          Имя:
          <input
            type="text"
            className={errors.firstName ? 'error' : ''}
            {...register('firstName', { required: 'Имя обязательно' })}
          />
          {errors.firstName && <p>{errors.firstName.message}</p>}
        </label>
        <label>
          Фамилия:
          <input
            type="text"
            className={errors.lastName ? 'error' : ''}
            {...register('lastName', { required: 'Фамилия обязательна' })}
          />
          {errors.lastName && <p>{errors.lastName.message}</p>}
        </label>
        <label>
          Почта:
          <input
            type="email"
            className={errors.email ? 'error' : ''}
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
        <label>
          Пароль:
          <input
            type="password"
            className={errors.password ? 'error' : ''}
            {...register('password', {
              required: 'Пароль обязателен',
              minLength: {
                value: 6,
                message: 'Пароль должен содержать минимум 6 символов',
              },
              validate: {
                hasUpperCase: (value) =>
                  /[A-Z]/.test(value) || 'Пароль должен содержать хотя бы одну заглавную букву',
                hasLowerCase: (value) =>
                  /[a-z]/.test(value) || 'Пароль должен содержать хотя бы одну строчную букву',
                hasNumber: (value) =>
                  /\d/.test(value) || 'Пароль должен содержать хотя бы одну цифру',
                hasSpecialChar: (value) =>
                  /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Пароль должен содержать хотя бы один специальный символ',
              },
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </label>
        <Button text="Зарегистрироваться" types="submit" />
      </form>
    </div>
  );
};

export default RegistrationForm;
