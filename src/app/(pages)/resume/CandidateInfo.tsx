'use client';
import React, { useEffect, useState } from 'react';
import './Candidate.scss'; 
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import CandidateFeedbackForm from './CandidateFeedbackForm';

const CandidateInfo = () => {
  const [candidateData, setCandidateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Для управления popup
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const searchParams = useSearchParams();
  const candidateId = searchParams.get('id');
  const fallbackId =
    typeof window !== 'undefined' ? localStorage.getItem('candidateId') : null;
  const finalCandidateId = candidateId || fallbackId;

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        if (!finalCandidateId) {
          throw new Error('Candidate ID не найден');
        }
        
        // Пример: замените на ваш реальный URL
        const response = await axios.get(
          `https://4a51-37-99-64-195.ngrok-free.app/api/Resumes/${finalCandidateId}`,
          {
            headers: {
              'ngrok-skip-browser-warning': true,
            },
          }
        );
        setCandidateData(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateData();
  }, [finalCandidateId]);

  if (loading) {
    return <p>Загрузка данных...</p>;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  if (!candidateData) {
    return <p>Данные о кандидате не найдены</p>;
  }

  // Рендер
  return (
    <div className="CandidateBlock">
      <div className="CandidateInfo">
        <img 
          src="/assets/Images/Profile/profileImg.png"
          alt="Candidate Image"
        />
        <div className="Candidate_info_block">
          <div>
            <h2 className="candidate_name">{candidateData.name}</h2>
            <h4 className="candidate_role">@{candidateData.speciality}</h4>
          </div>

          <p className="about_me">ID пользователя: {candidateData.userId}</p>
          <p className="candidate_location">
            Местоположение: {candidateData.location}
          </p>
        </div>
      </div>

      <div className="CandidateExperience">
        <h4 className="Candidate_info_main">Опыт работы</h4>
        <div className="ExperienceContent">
          <p className="experience_position">
            {candidateData.experienceName} в {candidateData.experienceEmployer}
          </p>
          <p className="experience_responsibilities">
            Обязанности: {candidateData.experienceResponsibilities}
          </p>
          <p className="experience_description">
            Описание: {candidateData.experienceDescription}
          </p>
          <p className="experience_dates">
            Период: {candidateData.experienceStartDate} —{' '}
            {candidateData.experienceEndDate}
          </p>
        </div>
      </div>

      <div className="CandidateSocialMedia">
        <h4 className="Candidate_info_main">Социальные сети</h4>
        <div className="SocialMediaList">
          {candidateData.socialMedia && candidateData.socialMedia.length > 0 ? (
            candidateData.socialMedia.map(
              (media: { key: string; value: string }, index: number) => (
                <div className="SocialMediaItem" key={index}>
                  <span className="media_key">{media.key}:</span>
                  <a
                    href={media.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="media_value"
                  >
                    {media.value}
                  </a>
                </div>
              )
            )
          ) : (
            <p>Нет добавленных соцсетей</p>
          )}
        </div>
      </div>

      {/* Кнопка для открытия формы обратной связи */}
      <button 
        className="btn" 
        onClick={() => setIsFeedbackOpen(true)}
        style={{ marginTop: '20px' }}
      >
        Написать автору
      </button>

      {/* Popup форма для отправки сообщения */}
      <CandidateFeedbackForm
        resumeId={candidateData.id}  // Это Guid
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
};

export default CandidateInfo;
