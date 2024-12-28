'use client';
import React, { useEffect, useState } from 'react';
import './Profile.scss';
import { Button } from '@/shared/ui/Button';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

const ProfileInfo = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // Управление отображением попапа
  const [projectData, setProjectData] = useState({
    ProjectName: '',
    Description: '',
    ClientName: '',
    CompletedDate: '',
    AttachedFileIds: [],
    projectCover: null, // Для хранения загруженного изображения
  });
  const [projectList, setProjectList] = useState([]); // Список проектов

  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  const id = localStorage.getItem('userId');
  const resumeId = localStorage.getItem('userId') || '';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) {
          throw new Error('User ID не найден');
        }

        const response = await axios.get(
          `https://4a51-37-99-64-195.ngrok-free.app/api/Auth/get-user-info`,
          {
            params: { id: userId ?? id },
            headers: {
              'ngrok-skip-browser-warning': true,
            },
          }
        );

        setUserData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `https://4a51-37-99-64-195.ngrok-free.app/api/Projects/fetch-by-resume/${resumeId}`,
          {
            headers: {
              'ngrok-skip-browser-warning': true,
            },
          }
        );
        setProjectList(response.data);
      } catch (err) {
        console.error('Ошибка при загрузке проектов:', err.message);
      }
    };

    fetchUserData();
    fetchProjects();
  }, [userId, resumeId]);

  const handleCreateProject = async () => {
    try {
      const formData = new FormData();
      formData.append('ResumeId', userId);
      formData.append('ProjectName', projectData.ProjectName);
      formData.append('Description', projectData.Description);
      formData.append('ClientName', projectData.ClientName);
      formData.append('CompletedDate', projectData.CompletedDate);
      projectData.AttachedFileIds.forEach((file, index) =>
        formData.append(`AttachedFileIds[${index}]`, file)
      );
      if (projectData.projectCover) {
        formData.append('projectCover', projectData.projectCover);
      }

      const response = await axios.post(
        `https://4a51-37-99-64-195.ngrok-free.app/api/Projects/create`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'ngrok-skip-browser-warning': true,
          },
        }
      );

      console.log('Проект успешно создан:', response.data);
      alert('Проект успешно создан!');
      setShowPopup(false);
      setProjectList((prev) => [...prev, response.data]); // Добавляем новый проект в список
    } catch (err) {
      console.error('Ошибка при создании проекта:', err.message);
      alert('Ошибка при создании проекта!');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProjectData((prev) => ({ ...prev, projectCover: file }));
  };

  if (loading) {
    return <p>Загрузка данных...</p>;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  return (
    <div className="ProfileBlock">
      <div className="ProfileInfo">
        <img src="/assets/Images/Profile/profileImg.png" alt="" />
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
      <div className="ProfilePortfolio">
        <div className="Profile_info">
          <h4 className="Profile_info_main">Информация</h4>
          <ul className="Profile_info_list">
            <li>Локация: Алматы</li>
            <li>Возраст: {userData.age || 'Не указан'}</li>
            <li>Email: {userData.email}</li>
          </ul>
        </div>
        <div className="Portfolio">
  <h4 className="Profile_info_main">Портфолио</h4>
  <div>
    {projectList.length === 0 ? (
      <p>Ваше портфолио пока пустое</p>
    ) : (
      <ul>
        {projectList.map((project) => (
          <li key={project.id} className="project-item">
            <h5>{project.name}</h5>
            <p><strong>Описание:</strong> {project.description}</p>
            <p><strong>Клиент:</strong> {project.clientName}</p>
            <p><strong>Дата завершения:</strong> {new Date(project.completedDate).toLocaleDateString()}</p>
            {project.attachedFileUrls && project.attachedFileUrls.length > 0 && (
              <div>
                <strong>Файлы:</strong>
                <ul>
                  {project.attachedFileUrls.map((fileUrl, index) => (
                    <li key={index}>
                      <a
                        href={`https://4a51-37-99-64-195.ngrok-free.app${fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Файл {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button style={{color:"white"}}>Удалить</button>
          </li>
        ))}
      </ul>
    )}
    <button onClick={() => setShowPopup(true)} className='btn'>Создать проект</button>
  </div>
</div>
      </div>

      {/* Попап для создания проекта */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Создание проекта</h3>
            <label>
              Название проекта:
              <input
                type="text"
                name="ProjectName"
                value={projectData.ProjectName}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Описание:
              <textarea
                name="Description"
                value={projectData.Description}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Имя клиента:
              <input
                type="text"
                name="ClientName"
                value={projectData.ClientName}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Дата завершения:
              <input
                type="date"
                name="CompletedDate"
                value={projectData.CompletedDate}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Обложка проекта:
              <input type="file" onChange={handleFileChange} />
            </label>
            <button onClick={handleCreateProject}>Сохранить</button>
            <button onClick={() => setShowPopup(false)}>Отмена</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
