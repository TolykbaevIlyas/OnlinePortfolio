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
  attachedFileUrls: string[];
}

const CandidateInfo = () => {
  const [candidateData, setCandidateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Для управления popup сообщениями
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // ------------------------
  //  Проекты
  // ------------------------
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  // Popup для деталей проекта
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false);

  // Popup для добавления/редактирования проекта
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

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

        const response = await axios.get(
          `https://4a51-37-99-64-195.ngrok-free.app/api/Projects/fetch-by-resume/${finalCandidateId}`,
          {
            headers: {
              'ngrok-skip-browser-warning': true,
            },
          }
        );
        setProjects(response.data);
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

  // Открыть детали проекта
  const handleOpenProjectDetails = (project: Project) => {
    setSelectedProject(project);
    setIsProjectDetailsOpen(true);
  };

  // Закрыть детали проекта
  const handleCloseProjectDetails = () => {
    setIsProjectDetailsOpen(false);
    setSelectedProject(null);
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
  };

  // Открыть форму редактирования проекта
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setProjectDescription(project.description);
    setProjectClientName(project.clientName);
    setProjectCompletedDate(project.completedDate.slice(0, 10)); // Чтоб удобнее было в input[type=date]
    setAttachedFiles([]); // TODO: Загрузить файлы, если нужно
    setIsProjectFormOpen(true);
  };

  // Закрыть форму проекта
  const handleCloseProjectForm = () => {
    setIsProjectFormOpen(false);
    setEditingProject(null);
  };

  // Сабмит формы добавления/редактирования
  const handleSubmitProjectForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('resumeId', finalCandidateId || '');
    formData.append('projectName', projectName);
    formData.append('description', projectDescription);
    formData.append('clientName', projectClientName);
    formData.append('completedDate', projectCompletedDate);

    attachedFiles.forEach((file) => {
      formData.append('projectCover', file);
    });

    try {
      if (editingProject) {
        await axios.put(
          `https://4a51-37-99-64-195.ngrok-free.app/api/Projects/${editingProject.id}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
      } else {
        const response = await axios.post(
          `https://4a51-37-99-64-195.ngrok-free.app/api/Projects/create`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );

        setProjects((prev) => [...prev, response.data]);
      }

      handleCloseProjectForm();
    } catch (err: any) {
      alert('Ошибка при сохранении проекта: ' + err.message);
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

      {/* Блок проектов */}
      <div className="CandidateProjects">
        <h4 className="Candidate_info_main" style={{ marginTop: '40px' }}>Проекты</h4>
        {/* Кнопка добавить проект, если мы можем управлять */}
        {canManage && (
          <button 
            className="btn"
            style={{ marginBottom: '20px' }}
            onClick={handleAddProject}
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
                {/* Картинка проекта (если есть хотя бы одна ссылка) */}
                {project.attachedFileUrls && project.attachedFileUrls.length > 0 ? (
                  <img
                    src={project.attachedFileUrls[0]}
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
              <label>
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
              </label>

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
    </div>
  );
};

export default CandidateInfo;
