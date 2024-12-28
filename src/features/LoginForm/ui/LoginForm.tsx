'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/Button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginForm.scss';

const LoginForm = () => {
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

      const { login, password } = data;
      const url = `https://4a51-37-99-64-195.ngrok-free.app/api/Auth/signin`;

      const response = await axios.post(url, null, {
        params: {
          email: login,
          password: password,
        },
        headers: {
          'ngrok-skip-browser-warning': true,
        },
      });

      const userId = response.data; // Предполагаем, что ID приходит в response.data
      localStorage.setItem('userId', userId);

      toast.success('Авторизация успешна!');
      router.push(`/profile?id=${userId}`);
    } catch (error) {
      console.error('Error during sign-in:', error);
      toast.error('Ошибка при авторизации. Проверьте логин и пароль.');
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="LoginContainer">
      <ToastContainer />
      <form className="LoginForm" onSubmit={handleSubmit(onSubmit)}>
        {/* Поле Логин */}
        <label>
          Почта:
          <input
            type="text"
            className={errors.login ? 'error' : ''}
            {...register('login', { required: 'Логин обязателен' })}
          />
          {errors.login && <p className="error-message">{errors.login.message}</p>}
        </label>

        {/* Поле Пароль */}
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
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </label>

        {/* Кнопка и ссылка */}
        <a href="/register">Регистрация</a>
        <Button text="Войти" types="submit" />
      </form>
    </div>
  );
};

export default LoginForm;
