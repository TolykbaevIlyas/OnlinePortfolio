'use client';

import React, { useState } from 'react';
import axios from 'axios';
import './Candidate.scss'; // Стили можно подключить там же, где и для CandidateInfo

interface CandidateFeedbackFormProps {
  resumeId: string;          // ID резюме
  isOpen: boolean;           // Открыто ли popup-окно
  onClose: () => void;       // Функция для закрытия окна
}

const CandidateFeedbackForm: React.FC<CandidateFeedbackFormProps> = ({
  resumeId,
  isOpen,
  onClose,
}) => {
  // Состояния полей формы
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  // Состояние загрузки и ошибок/успеха
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Предположим, что SenderId хранится у нас в localStorage:
  const senderId =
    typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Если нет senderId, можно либо выбросить ошибку, 
    // либо требовать авторизации/логина
    if (!senderId) {
      setError('Вы не авторизованы или не указан senderId');
      return;
    }

    try {
      setLoading(true);

      // Формируем DTO
      const payload = {
        senderId: senderId,
        receiverResumeId: resumeId, // Важно, чтобы это был GUID
        title: title,
        message: message,
      };

      await axios.post('https://4a51-37-99-64-195.ngrok-free.app/api/Resumes/send-message', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      setSuccessMessage('Сообщение успешно отправлено!');
      // Очистим поля формы
      setTitle('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Ошибка при отправке сообщения');
    } finally {
      setLoading(false);
    }
  };

  // Если окно закрыто, ничего не рендерим
  if (!isOpen) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Написать автору резюме</h3>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

        <form onSubmit={handleSendMessage}>
          <label>
            Заголовок:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label>
            Сообщение:
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>

          <div>
            <button type="submit" disabled={loading}>
              {loading ? 'Отправка...' : 'Отправить'}
            </button>
            <button type="button" onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateFeedbackForm;
