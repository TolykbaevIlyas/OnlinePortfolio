'use client';
import React, { useEffect, useState } from 'react';
import './Profile.scss';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const ProfileInfo = () => {
  const [userData, setUserData] = useState<any>(null);
  const [resumeList, setResumeList] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]); // Состояние для сообщений
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = searchParams.get('id');
  const fallbackId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const finalUserId = userId || fallbackId;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!finalUserId) {
          throw new Error('User ID не найден');
        }
        const response = await axios.get(
          `https://4a51-37-99-64-195.ngrok-free.app/api/Auth/get-user-info`,
          {
            params: { id: finalUserId },
            headers: { 'ngrok-skip-browser-warning': true },
          }
        );
        setUserData(response.data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    const fetchUserResumes = async () => {
      try {
        if (!finalUserId) {
          throw new Error('User ID не найден');
        }
        const response = await axios.get(
          `https://4a51-37-99-64-195.ngrok-free.app/api/Resumes/fetch-by-user/${finalUserId}`,
          {
            headers: { 'ngrok-skip-browser-warning': true },
          }
        );
        setResumeList(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `https://4a51-37-99-64-195.ngrok-free.app/api/Resumes/fetch-messages/${finalUserId}`,
          {
            headers: { 'ngrok-skip-browser-warning': true },
          }
        );
        setMessages(response.data);
      } catch (err: any) {
        console.error('Ошибка при загрузке сообщений:', err.message);
      }
    };

    fetchUserData();
    fetchUserResumes();
    fetchMessages();
  }, [finalUserId]);

  if (loading) {
    return <p>Загрузка данных...</p>;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  return (
    <div className="ProfileBlock">
      {userData && (
        <div className="ProfileInfo">
          {/* <img src="/assets/Images/Profile/profileImg.png" alt="Profile Image" /> */}
          <section className="Profile_info_block">
            <div>
              <h2 className="profile_name">
                {userData.firstName} {userData.lastName}
              </h2>
              <h4 className="profile_role">{userData.email}</h4>
            </div>
          </section>
        </div>
      )}

      <div className="ProfilePortfolio">
        <div>
          <h4 className="Profile_info_main">Мои комментарии</h4>
          <div className="CommentsSection">
            {messages.length === 0 ? (
              <p>У вас пока нет сообщений</p>
            ) : (
              messages.map((message) => (
                <div className="CommentCard" key={message.id}>
                  <p>
                    <strong>Отправитель:</strong> {message.sender.firstName} {message.sender.lastName}
                  </p>
                  <p>
                    <strong>Сообщение:</strong> {message.body}
                  </p>
                  {/* Если есть время в ответе API */}
                  {message.createdAt && (
                    <p>
                      <strong>Время:</strong> {new Date(message.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <div>
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
                  <Link href={`/resume?id=${resume.id}`} className="resume-link">
                    Перейти
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
