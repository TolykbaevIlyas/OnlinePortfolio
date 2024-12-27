'use client'
import React from 'react';
import { useForm } from 'react-hook-form';
import "./FeedbackForm.scss"
import { Button } from '@/shared/ui/Button';

const FeedbackForm = () => {
  const {
    register,  // Для регистрации полей формы
    handleSubmit,  // Для обработки отправки формы
    formState: { errors },  // Для отображения ошибок
  } = useForm();
  const onSubmit = (data) => {
    console.log('Form Data:', data);
    // Здесь можно отправить данные на сервер
  };

  return (
    <form className='FeedbackForm' onSubmit={handleSubmit(onSubmit)}>
      {/* Поле Имя */}
      <label>
        Имя:
        <input
          type="text"
          {...register('name', { required: 'Имя обязательно' })} // Регистрируем поле
        />
        {errors.name && <p>{errors.name.message}</p>} {/* Показ ошибок */}
      </label>

      {/* Поле Номер телефона */}
      <label>
        Номер телефона:
        <input
          type="text"
          {...register('phone', {
            required: 'Номер телефона обязателен',
            pattern: {
              value: /^[0-9]+$/,
              message: 'Только цифры',
            },
          })}
        />
        {errors.phone && <p>{errors.phone.message}</p>}
      </label>

      {/* Поле Почта */}
      <label>
        Почта:
        <input
          type="email"
          {...register('email', {
            required: 'Почта обязательна',
            pattern: {
              value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
              message: 'Неверный формат почты',
            },
          })}
        />
        {errors.email && <p>{errors.email.message}</p>}
      </label>

      {/* Поле Сообщение */}
      <Button text="Отправить" types="submit"/>
    </form>
  );
};

export default FeedbackForm;
