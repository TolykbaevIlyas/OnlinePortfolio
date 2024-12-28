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

  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для попапа
  const [newResume, setNewResume] = useState({
    name: '',
    speciality: '',
    location: '',
    experienceName: '',
    experienceEmployer: '',
    experienceResponsibilities: '',
    experienceDescription: '',
    experienceStartDate: '',
    experienceEndDate: '',
  });

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

  const handleAddResume = async () => {
    try {
      const response = await axios.post(
        `https://4a51-37-99-64-195.ngrok-free.app/api/Resumes/add`,
        {
          ...newResume,
          userId: finalUserId,
          socialMedia: {},
        },
        {
          headers: { 'ngrok-skip-browser-warning': true },
        }
      );
      setResumeList([...resumeList, response.data]); // Обновляем список резюме
      setIsModalOpen(false); // Закрываем модальное окно
      setNewResume({
        name: '',
        speciality: '',
        location: '',
        experienceName: '',
        experienceEmployer: '',
        experienceResponsibilities: '',
        experienceDescription: '',
        experienceStartDate: '',
        experienceEndDate: '',
      });
    } catch (err: any) {
      console.error('Ошибка при добавлении резюме:', err.message);
    }
  };

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
          <button className="add-resume-button" onClick={() => setIsModalOpen(true)}>
            Добавить резюме
          </button>
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

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Добавить новое резюме</h3>
            <input
              type="text"
              placeholder="Название"
              value={newResume.name}
              onChange={(e) => setNewResume({ ...newResume, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Специальность"
              value={newResume.speciality}
              onChange={(e) => setNewResume({ ...newResume, speciality: e.target.value })}
            />
            <input
              type="text"
              placeholder="Локация"
              value={newResume.location}
              onChange={(e) => setNewResume({ ...newResume, location: e.target.value })}
            />
            <input
              type="text"
              placeholder="Опыт: название"
              value={newResume.experienceName}
              onChange={(e) => setNewResume({ ...newResume, experienceName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Опыт: работодатель"
              value={newResume.experienceEmployer}
              onChange={(e) => setNewResume({ ...newResume, experienceEmployer: e.target.value })}
            />
            <textarea
              placeholder="Опыт: обязанности"
              value={newResume.experienceResponsibilities}
              onChange={(e) =>
                setNewResume({ ...newResume, experienceResponsibilities: e.target.value })
              }
            />
            <textarea
              placeholder="Опыт: описание"
              value={newResume.experienceDescription}
              onChange={(e) =>
                setNewResume({ ...newResume, experienceDescription: e.target.value })
              }
            />
            <input
              type="date"
              placeholder="Начало работы"
              value={newResume.experienceStartDate}
              onChange={(e) =>
                setNewResume({ ...newResume, experienceStartDate: e.target.value })
              }
            />
            <input
              type="date"
              placeholder="Окончание работы"
              value={newResume.experienceEndDate}
              onChange={(e) =>
                setNewResume({ ...newResume, experienceEndDate: e.target.value })
              }
            />
            <button onClick={handleAddResume}>Добавить</button>
            <button onClick={() => setIsModalOpen(false)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
