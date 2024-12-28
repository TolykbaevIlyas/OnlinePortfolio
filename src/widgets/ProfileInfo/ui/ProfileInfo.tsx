'use client';
import React, { useEffect, useState } from 'react';
import './Profile.scss';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const ProfileInfo = () => {
  const [userData, setUserData] = useState<any>(null);
  const [resumeList, setResumeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  // ID пользователя, чьё резюме нужно отобразить
  const userId = searchParams.get('id');
  // Если userId не передан в URL, пытаемся взять из localStorage (можно убрать при необходимости)
  const fallbackId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const finalUserId = userId || fallbackId; 

  useEffect(() => {
    // Запрос на данные пользователя
    const fetchUserData = async () => {
      try {
        if (!finalUserId) {
          throw new Error('User ID не найден');
        }
        const response = await axios.get(
          `https://4a51-37-99-64-195.ngrok-free.app/api/Auth/get-user-info`,
          {
            params: { id: finalUserId },
            headers: {
              'ngrok-skip-browser-warning': true,
            },
          }
        );
        setUserData(response.data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    // Запрос на резюме пользователя
    const fetchUserResumes = async () => {
      try {
        if (!finalUserId) {
          throw new Error('User ID не найден');
        }

        const response = await axios.get(
          `https://4a51-37-99-64-195.ngrok-free.app/api/Resumes/fetch-by-user/${finalUserId}`,
          {
            headers: {
              'ngrok-skip-browser-warning': true,
            },
          }
        );
        setResumeList(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchUserResumes();
  }, [finalUserId]);

  if (loading) {
    return <p>Загрузка данных...</p>;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  return (
    <div className="ProfileBlock">
      {/* Блок с данными пользователя */}
      {userData && (
        <div className="ProfileInfo">
          <img src="/assets/Images/Profile/profileImg.png" alt="Profile Image" />
          <div className="Profile_info_block">
            <div>
              <h2 className="profile_name">
                {userData.firstName} {userData.lastName}
              </h2>
              <h4 className="profile_role">@{userData.speciality}</h4>
            </div>
            <p className="about_me">Обо мне</p>
            <p className="profile_desc">
              Добро пожаловать на страницу профиля! Здесь вы можете увидеть личную информацию и другие данные.
            </p>
          </div>
        </div>
      )}

      {/* Блок со списком резюме */}
      <div className="ProfilePortfolio"> 
        <h4 className="Profile_info_main">Мои резюме</h4>
        <div className="ResumeList">
          {resumeList.length === 0 ? (
            <p>У вас пока нет резюме</p>
          ) : (
            resumeList.map((resume) => (
              <div className="ResumeCard" key={resume.id}>
                <div className="resume-header">
                  <div className="resume-info">
                    <h3>{resume.name}</h3>
                    <p className="resume-speciality">@{resume.speciality}</p>
                    <p className="resume-speciality">{resume.location}</p>
                  </div>
                </div>


  <Link href={`/resume/${resume.id}`} className="resume-link">
    Перейти
  </Link>
</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
