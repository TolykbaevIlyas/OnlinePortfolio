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

  const [isPopupOpen, setIsPopupOpen] = useState(false); // Открытие попапа
  const [formData, setFormData] = useState<any>({
    name: '',
    speciality: '',
    experienceName: '',
    experienceEmployer: '',
    experienceResponsibilities: '',
    experienceDescription: '',
    experienceStartDate: '',
    experienceEndDate: '',
    location: '',
    socialMedia: { linkedin: '', github: '' },
  }); // Данные формы

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

    fetchUserData();
    fetchUserResumes();
  }, [finalUserId]);

  const handleAddResume = async () => {
    if (!finalUserId) {
      alert('Не найден ID пользователя');
      return;
    }

    const newResume = {
      ...formData,
      userId: finalUserId,
      socialMedia: { ...formData.socialMedia },
    };

    try {
      const response = await axios.post(
        `https://4a51-37-99-64-195.ngrok-free.app/api/Resumes/add`,
        newResume,
        { headers: { 'ngrok-skip-browser-warning': true } }
      );
      alert('Резюме успешно добавлено!');
      setResumeList((prev) => [...prev, response.data]);
      setIsPopupOpen(false);
    } catch (err: any) {
      alert(`Ошибка при добавлении резюме: ${err.message}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: value,
      },
    }));
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
          <img src="/assets/Images/Profile/profileImg.png" alt="Profile Image" />
          <div className="Profile_info_block">
            <div>
              <h2 className="profile_name">
                {userData.firstName} {userData.lastName}
              </h2>
              <h4 className="profile_role">@{userData.role}</h4>
              <h4 className="profile_role">@{userData.speciality}</h4>
            </div>
            {/* <p className="about_me">Обо мне</p>
            <p className="profile_desc">
              Добро пожаловать на страницу профиля! Здесь вы можете увидеть личную информацию и другие данные.
            </p> */}
          </div>
        </div>
      )}

<div className="ProfilePortfolio">
  <div>
    <h4 className="Profile_info_main">Мои комментарии</h4>
    <div className="CommentsSection">
      {/* Here you can add functionality to fetch and display comments */}
      <p>У вас пока нет комментариев</p>
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
  <button onClick={() => setIsPopupOpen(true)} className="add-resume-button">
    Добавить резюме
  </button> 
  </div>
</div>


      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h3>Добавить резюме</h3>
            <div style={{display:'flex', gap:"10px"}}>
              <input type="text" name="name" placeholder="Название резюме" value={formData.name} onChange={handleInputChange} />
              <input type="text" name="speciality" placeholder="Специальность" value={formData.speciality} onChange={handleInputChange} />
            </div>
            <div style={{display:"flex", gap:"10px"}}> 
              <input type="text" name="experienceName" placeholder="Должность" value={formData.experienceName} onChange={handleInputChange} />
              <input type="text" name="experienceEmployer" placeholder="Работодатель" value={formData.experienceEmployer} onChange={handleInputChange} />
           
            </div>
            <textarea name="experienceResponsibilities" placeholder="Обязанности" value={formData.experienceResponsibilities} onChange={handleInputChange}></textarea>
            <textarea name="experienceDescription" placeholder="Описание" value={formData.experienceDescription} onChange={handleInputChange}></textarea>
            <div style={{display:"flex", gap:"10px"}}>
              <input type="date" name="experienceStartDate" placeholder="Дата начала" value={formData.experienceStartDate} onChange={handleInputChange} />
              <input type="date" name="experienceEndDate" placeholder="Дата окончания" value={formData.experienceEndDate} onChange={handleInputChange} />
            
            </div>
            <div style={{display:"flex", gap:"10px"}}>
              <input type="text" name="location" placeholder="Локация" value={formData.location} onChange={handleInputChange} />
              <input type="text" name="linkedin" placeholder="LinkedIn" value={formData.socialMedia.linkedin} onChange={handleSocialMediaChange} />
              <input type="text" name="github" placeholder="GitHub" value={formData.socialMedia.github} onChange={handleSocialMediaChange} />
            
            </div>
            <button onClick={handleAddResume}>Сохранить</button>
            <button onClick={() => setIsPopupOpen(false)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
