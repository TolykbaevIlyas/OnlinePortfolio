'use client';
import React, { useEffect, useState } from 'react';
import './Candidate.scss'; 
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import CandidateFeedbackForm from './CandidateFeedbackForm';

interface Project {
  id: string;
  name: string;
  description: string;
  clientName: string;
  completedDate: string;
  resumeId: string;
  attachedFileIds: string[];
  attachedFileUrls: string[];   // в API это ссылки вида "/api/files/<id>"
}

// Если вам нужно отдельно хранить base64 картинки, то можно завести такой интерфейс.
// Но если вы используете прямую ссылку (attachedFileUrls[0]) — это не обязательно.
interface ProjectWithImage extends Project {
  imageDataUrl?: string; // base64 или blob-URL
}

const CandidateInfo = () => {
  const [candidateData, setCandidateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Для управления popup сообщениями
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // ------------------------
  //  Проекты
  // ------------------------
  const [projects, setProjects] = useState<ProjectWithImage[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  // Popup для деталей проекта
  const [selectedProject, setSelectedProject] = useState<ProjectWithImage | null>(null);
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false);

  // Popup для добавления/редактирования проекта
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithImage | null>(null);

  // Поля формы добавления/редактирования проекта
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectClientName, setProjectClientName] = useState('');
  const [projectCompletedDate, setProjectCompletedDate] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const searchParams = useSearchParams();
  const candidateId = searchParams.get('id');
  const fallbackId =
    typeof window !== 'undefined' ? localStorage.getItem('candidateId') : null;
  const finalCandidateId = candidateId || fallbackId;

  // Узнаём userId текущего пользователя из localStorage
  const currentUserId =
    typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  // ========================
  //   Загрузка данных
  // ========================

  // Загрузка информации о кандидате
  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        if (!finalCandidateId) {
          throw new Error('Candidate ID не найден');
        }
        
        // Запрос на резюме кандидата
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

  // Загрузка проектов по резюме
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!finalCandidateId) return;
        setProjectsLoading(true);

        const response = await axios.get<Project[]>(
          `https://4a51-37-99-64-195.ngrok-free.app/api/Projects/fetch-by-resume/${finalCandidateId}`,
          {
            headers: {
              'ngrok-skip-browser-warning': true,
            },
          }
        );
        const fetchedProjects = response.data;

        // Если вам нужно явно загрузить каждую картинку через /api/Files/{fileId},
        // то для каждого attachedFileId нужно сделать запрос и получить blob/base64.
        // Примерно так (закомментировано, т.к. иногда достаточно просто <img src={attachedFileUrls[0]} />):
        /*
        const projectsWithImages = await Promise.all(
          fetchedProjects.map(async (proj) => {
            if (proj.attachedFileIds?.length) {
              try {
                // Допустим, берём только первый файл
                const fileId = proj.attachedFileIds[0];
                const fileResp = await axios.get(`/api/files/${fileId}`, {
                  responseType: 'arraybuffer',
                });
                // Конвертируем массив байтов в base64
                const base64 = Buffer.from(fileResp.data, 'binary').toString('base64');
                const mimeType = fileResp.headers['content-type'] || 'image/jpeg';
                const imageDataUrl = `data:${mimeType};base64,${base64}`;
                return { ...proj, imageDataUrl };
              } catch {
                return { ...proj };
              }
            } else {
              return { ...proj };
            }
          })
        );
        setProjects(projectsWithImages);
        */
        
        // Если не нужно вручную забирать картинки, а достаточно использовать attachedFileUrls:
        setProjects(fetchedProjects);
      } catch (err: any) {
        setProjectsError(err.message);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, [finalCandidateId]);

  // ========================
  //   Хэндлеры для проектов
  // ========================

  // Открыть детали проекта (и сразу запросить детальную информацию по id)
  const handleOpenProjectDetails = async (project: ProjectWithImage) => {
    try {
      const resp = await axios.get<ProjectWithImage>(
        `https://4a51-37-99-64-195.ngrok-free.app/api/Projects/${project.id}`,
        { headers: { 'ngrok-skip-browser-warning': true } }
      );
      setSelectedProject(resp.data);
      setIsProjectDetailsOpen(true);
    } catch (err: any) {
      alert('Ошибка при загрузке деталей проекта: ' + err.message);
    }
  };

  // Закрыть детали проекта
  const handleCloseProjectDetails = () => {
    setSelectedProject(null);
    setIsProjectDetailsOpen(false);
  };

  // Открыть форму добавления проекта
  const handleAddProject = () => {

    setEditingProject(null);
    // Очищаем поля
    setProjectName('');
    setProjectDescription('');
    setProjectClientName('');
    setProjectCompletedDate('');
    setAttachedFiles([]);
    setIsProjectFormOpen(true);

    setIsButtonDisabled(true);
  };

  // Открыть форму редактирования проекта (по кнопке в детальном окне)
  const handleEditProject = (project: ProjectWithImage) => {
    setEditingProject(project);
    setProjectName(project.name);
    setProjectDescription(project.description);
    setProjectClientName(project.clientName);
    // completedDate может быть "2024-12-28T00:00:00",
    // для input type="date" обрезаем время
    setProjectCompletedDate(project.completedDate.slice(0, 10));
    setAttachedFiles([]); // Здесь можно загрузить существующие, если нужно
    setIsProjectFormOpen(true);
    // Закроем детальное окно, чтобы не было двух попапов наложения
    handleCloseProjectDetails();
  };

  // Закрыть форму проекта
  const handleCloseProjectForm = () => {
    setIsProjectFormOpen(false);
    setEditingProject(null);
  };

  // Сабмит формы добавления/редактирования
  const handleSubmitProjectForm = async (e: React.FormEvent) => {
    e.preventDefault();

    // Собираем formData для загрузки файлов
    const formData = new FormData();
    formData.append('resumeId', finalCandidateId || '');
    formData.append('projectName', projectName);
    formData.append('description', projectDescription);
    formData.append('clientName', projectClientName);
    formData.append('completedDate', projectCompletedDate);

    // Если в API требуется массив attachedFileIds для PUT, это отдельная логика.
    // Но чаще всего при PUT мы либо тоже используем FormData с файлами,
    // либо отправляем JSON. Зависит от бэкенда.  
    // Для примера — используем тот же метод, что и при создании.

    attachedFiles.forEach((file) => {
      formData.append('projectCover', file);
    });

    try {
      if (editingProject) {
        // Редактирование (PUT)
        await axios.put(
          `https://4a51-37-99-64-195.ngrok-free.app/api/Projects/${editingProject.id}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        // После успешного обновления, перезагрузим список
        refreshProjectsList();
      } else {
        // Создание (POST)
        const response = await axios.post(
          `https://4a51-37-99-64-195.ngrok-free.app/api/Projects/create`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        // Обновим состояние, добавив новый проект
        setProjects((prev) => [...prev, response.data]);
      }

      handleCloseProjectForm();
    } catch (err: any) {
      alert('Ошибка при сохранении проекта: ' + err.message);
    }
  };

  // Удаление проекта
  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот проект?')) {
      return;
    }
    try {
      await axios.delete(
        `https://4a51-37-99-64-195.ngrok-free.app/api/Projects/${projectId}`,
        { headers: { 'ngrok-skip-browser-warning': true } }
      );
      // Уберём проект из списка
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      // Закроем детальное окно, если оно открыто
      handleCloseProjectDetails();
    } catch (err: any) {
      alert('Ошибка при удалении проекта: ' + err.message);
    }
  };

  // Хэлпер перезагрузки проектов
  const refreshProjectsList = async () => {
    try {
      const response = await axios.get<ProjectWithImage[]>(
        `https://4a51-37-99-64-195.ngrok-free.app/api/Projects/fetch-by-resume/${finalCandidateId}`,
        {
          headers: {
            'ngrok-skip-browser-warning': true,
          },
        }
      );
      setProjects(response.data);
    } catch (err) {
      // Можно вывести ошибку в консоль или в UI
      console.error(err);
    }
  };

  // ========================
  //   Рендер
  // ========================

  if (loading) {
    return <p>Загрузка данных...</p>;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  if (!candidateData) {
    return <p>Данные о кандидате не найдены</p>;
  }

  const canManage = candidateData.userId === currentUserId;

  // console.log(candidateData)

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
          {/* <p className="about_me">ID пользователя: {candidateData.userId}</p> */}
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
  Период: {candidateData.experienceStartDate.split('T')[0]} —{' '}
  {candidateData.experienceEndDate.split('T')[0]}
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

      {/* Блок проектов */}
      <div className="CandidateProjects">
        <h4 className="Candidate_info_main" style={{ marginTop: '40px' }}>Проекты</h4>
        {/* Кнопка добавить проект, если мы можем управлять */}
        {canManage && (
          <button 
            className="btn"
            style={{ marginBottom: '20px' }}
            onClick={handleAddProject}
            disabled={isButtonDisabled}
          >
            Добавить проект
          </button>
        )}
        {projectsLoading ? (
          <p>Загрузка проектов...</p>
        ) : projectsError ? (
          <p>Ошибка при загрузке проектов: {projectsError}</p>
        ) : projects.length === 0 ? (
          <p>Проектов не найдено</p>
        ) : (
          <div className="ProjectsGrid">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="ProjectCard"
                onClick={() => handleOpenProjectDetails(project)}
              >
                {/* 
                  Если вручную не загружаете blob/base64, а используете
                  прямую ссылку (attachedFileUrls[0]), то можно так:
                */}
                {project.attachedFileUrls && project.attachedFileUrls.length > 0 ? (
                  <img
                    src={`https://4a51-37-99-64-195.ngrok-free.app${project.attachedFileUrls[0]}`}
                    alt={project.name}
                    className="ProjectCardImage"
                  />
                ) : (
                  <div className="ProjectCardImagePlaceholder">Нет обложки</div>
                )}
                <h5 className="ProjectCardTitle">{project.name}</h5>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popup формы (добавление/редактирование) */}
      {isProjectFormOpen && (
        <div className="popup" onClick={handleCloseProjectForm}>
          <div 
            className="popup-content"
            onClick={(e) => e.stopPropagation()} 
          >
            <h3>
              {editingProject ? 'Редактировать проект' : 'Добавить проект'}
            </h3>
            <form onSubmit={handleSubmitProjectForm}>
              <label>
                Название проекта:
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </label>
              <label>
                Описание:
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  required
                />
              </label>
              <label>
                Клиент:
                <input
                  type="text"
                  value={projectClientName}
                  onChange={(e) => setProjectClientName(e.target.value)}
                />
              </label>
              <label>
                Дата завершения:
                <input
                  type="date"
                  value={projectCompletedDate}
                  onChange={(e) => setProjectCompletedDate(e.target.value)}
                />
              </label>
              {editingProject ? <></> : <label>
                Загрузить файлы:
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setAttachedFiles(Array.from(e.target.files));
                    }
                  }}
                />
              </label>}
              

              <div style={{ marginTop: '10px' }}>
                <button type="submit">
                  Сохранить
                </button>
                <button 
                  type="button"
                  onClick={handleCloseProjectForm}
                  style={{ marginLeft: '10px' }}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popup детальной информации о проекте */}
      {isProjectDetailsOpen && selectedProject && (
        <div className="popup" onClick={handleCloseProjectDetails}>
          <div 
            className="popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Детальная информация о проекте</h3>
            <p><strong>Название:</strong> {selectedProject.name}</p>
            <p><strong>Описание:</strong> {selectedProject.description}</p>
            <p><strong>Клиент:</strong> {selectedProject.clientName}</p>
            <p><strong>Дата завершения:</strong> {selectedProject.completedDate}</p>
            {/* <p><strong>ResumeId:</strong> {selectedProject.resumeId}</p>
            <p><strong>attachedFileIds:</strong> {selectedProject.attachedFileIds.join(', ')}</p> */}

            {/* Блок обложки (если есть) */}
            {selectedProject.attachedFileUrls && selectedProject.attachedFileUrls.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <img
                  src={`https://4a51-37-99-64-195.ngrok-free.app${selectedProject.attachedFileUrls[0]}`}
                  alt="Project cover"
                  style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
                />
              </div>
            )}

            {/* Если пользователь владелец резюме, показываем доп. кнопки */}
            {canManage && (
              <div style={{ marginTop: '20px' }}>
                <button
                  onClick={() => handleEditProject(selectedProject)}
                  style={{ marginRight: '10px' }}
                >
                  Редактировать
                </button>
                <button onClick={() => handleDeleteProject(selectedProject.id)}>
                  Удалить
                </button>
              </div>
            )}

            <div style={{ marginTop: '20px' }}>
              <button onClick={handleCloseProjectDetails}>Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateInfo;
