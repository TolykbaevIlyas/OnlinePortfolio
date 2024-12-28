'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const SearchPage = () => {
  const router = useRouter();

  // --- Состояния для поиска и фильтрации ---
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isFilterPopupVisible, setFilterPopupVisible] = useState(false);
  const [filters, setFilters] = useState({
    WorkExperience: '',
    Age: '',
    Tags: '',
  });

  // --- Состояния для списка специальностей ---
  const [specialities, setSpecialities] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState('');

  // --- Состояния для пагинации ---
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Количество записей на страницу (может браться из настроек)

  // Загружаем список специальностей при монтировании компонента
  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const response = await axios.get(
          'https://4a51-37-99-64-195.ngrok-free.app/api/Specialities/fetch',
          {
            headers: {
              'ngrok-skip-browser-warning': true,
            },
          }
        );
        // Предполагается, что response.data — это массив объектов формата { "id": 0, "name": "string" }
        setSpecialities(response.data || []);
      } catch (error) {
        console.error('Ошибка при загрузке специальностей:', error);
      }
    };

    fetchSpecialities();
  }, []);

  // Функция для получения резюме
  const handleSearch = async (newPageNumber = 1) => {
    try {
      // Собираем query-параметры для запроса
      const queryParams = new URLSearchParams();

      // Если указано WorkExperience
      if (filters.WorkExperience) {
        queryParams.append('WorkExperience', filters.WorkExperience);
      }

      // Если указаны теги
      if (filters.Tags) {
        queryParams.append('Tags', filters.Tags);
      }

      // Если выбрана специальность
      if (selectedSpeciality) {
        queryParams.append('Speciality', selectedSpeciality);
      }

      // Используем строку поиска, если она нужна
      // (В зависимости от вашего API, возможно, нужно передавать другой параметр)
      queryParams.append('SearchQuery', searchQuery || '');

      // Параметры пагинации
      queryParams.append('pageNumber', newPageNumber);
      queryParams.append('itemsPerPage', itemsPerPage);

      const response = await axios.get(
        `https://4a51-37-99-64-195.ngrok-free.app/api/Resumes/fetch?${queryParams.toString()}`,
        {
          headers: {
            'ngrok-skip-browser-warning': true,
          },
        }
      );

      const { resumes, totalPages } = response.data;

      // Обновляем результаты
      const formattedResults = resumes.map((resume) => ({
        id: resume.id,
        name: resume.name,
        position: resume.speciality,
        about: `${resume.experienceName} at ${resume.experienceEmployer}`,
        image: '/assets/Images/Search/PepleImg.png', // Здесь можно подставить url, если он приходит с API
      }));

      setResults(formattedResults);

      // Обновляем общее количество страниц
      setTotalPages(totalPages || 1);
      // Ставим текущую страницу на ту, которую мы запрашивали
      setPageNumber(newPageNumber);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  // Открыть/закрыть попап фильтров
  const toggleFilterPopup = () => {
    setFilterPopupVisible(!isFilterPopupVisible);
  };

  // Изменение значений в блоке фильтров
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Изменение выбранной специальности
  const handleSpecialityChange = (e) => {
    setSelectedSpeciality(e.target.value);
  };

  // Переход к странице профиля
  const navigateToProfile = (id) => {
    router.push(`/resume?id=${id}`);
  };

  // Изменение страницы через пагинацию
  const handlePageChange = (page) => {
    handleSearch(page);
  };

  // Генерируем список кнопок для пагинации
  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-button ${i === pageNumber ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="container">
      <div className="search-bar">
        {/* Поле ввода поиска */}
        <input
          type="text"
          placeholder="ПОИСК"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        {/* Кнопка поиска */}
        <button onClick={() => handleSearch(1)} className="search-button">
          🔍
        </button>

        {/* Выпадающее меню со специальностями */}
        <select
          className="speciality-dropdown"
          value={selectedSpeciality}
          onChange={handleSpecialityChange}
        >
          <option value="">Все специальности</option>
          {specialities.map((spec) => (
            <option key={spec.id} value={spec.name}>
              {spec.name}
            </option>
          ))}
        </select>

        {/* Кнопка "Фильтры" */}
        <button onClick={toggleFilterPopup} className="filter-button">
          Фильтры
        </button>
      </div>

      {/* Попап с фильтрами */}
      {isFilterPopupVisible && (
        <div className="filter-popup">
          <h3>Фильтры</h3>
          <label>
            Стаж:
            <input
              type="text"
              name="WorkExperience"
              value={filters.WorkExperience}
              onChange={handleFilterChange}
            />
          </label>
          {/* <label>
            Возраст:
            <input
              type="text"
              name="Age"
              value={filters.Age}
              onChange={handleFilterChange}
            />
          </label> */}
          {/* <label>
            Теги:
            <input
              type="text"
              name="Tags"
              value={filters.Tags}
              onChange={handleFilterChange}
            />
          </label> */}
          <div style={{display:"flex",gap: "10px",flexDirection: "column"}}>
            <button onClick={() => handleSearch(1)} className="apply-filters-button">
                Применить
            </button>
            <button onClick={toggleFilterPopup} className="close-popup-button">
                Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Отрисовка результатов поиска */}
      <div className="results-grid">
        {results.map((result, index) => (
          <div key={index} className="card">
            <img src={result.image} alt="profile" className="profile-image" />
            <div>
              <h3>{result.name}</h3>
              <p className="position">@{result.position}</p>
              <p className="about">{result.about}</p>
              <button
                className="details-button"
                onClick={() => navigateToProfile(result.id)}
              >
                Подробнее
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="pagination">
          {renderPaginationButtons()}
        </div>
      )}

      <style jsx>{`
        .container {
          font-family: Arial, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          padding-top: 150px;
          position: relative;
        }
        .search-bar {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
        }
        .search-input {
          flex: 1 1 200px;
          min-width: 200px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
          margin-right: 10px;
        }
        .search-button,
        .filter-button {
          background-color: #6c63ff;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          margin-left: 10px;
        }
        .search-button:hover,
        .filter-button:hover {
          background-color: #5846d6;
        }
        .speciality-dropdown {
          margin-left: 10px;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 16px;
          background-color: #fff;
          cursor: pointer;
        }
        .filter-popup {
          position: absolute;
          top: 100px;
          right: 50px;
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          width: 250px;
        }
        .filter-popup h3 {
          margin-bottom: 10px;
          font-size: 18px;
        }
        .filter-popup label {
          display: block;
          margin-bottom: 10px;
        }
        .filter-popup input {
          width: 100%;
          padding: 5px;
          margin-top: 5px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .apply-filters-button,
        .close-popup-button {
          background: #6c63ff;
          color: #fff;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-right: 10px;
        }
        .apply-filters-button:hover,
        .close-popup-button:hover {
          background: #5846d6;
        }
        .results-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(300px, 1fr));
          gap: 20px;
        }
        .card {
          display: flex;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 20px;
          text-align: center;
        }
        .profile-image {
          width: 261px;
          height: 235px;
          margin-right: 20px;
        }
        .position {
          color: #6c63ff;
          margin: 5px 0;
        }
        .about {
          margin: 10px 0;
          font-size: 14px;
          color: #555;
        }
        .details-button {
          background: #6c63ff;
          color: #fff;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
        }
        .details-button:hover {
          background: #5846d6;
        }
        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 30px;
        }
        .pagination-button {
          background-color: #fff;
          color: #6c63ff;
          border: 2px solid #6c63ff;
          margin: 0 5px;
          padding: 8px 16px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }
        .pagination-button.active {
          background-color: #6c63ff;
          color: #fff;
        }
        .pagination-button:hover {
          background-color: #6c63ff;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default SearchPage;
