'use client'
import { useState } from "react";
import axios from "axios";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isFilterPopupVisible, setFilterPopupVisible] = useState(false);
  const [filters, setFilters] = useState({
    WorkExperience: "",
    Age: "",
    Tags: "",
  });

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.WorkExperience) queryParams.append("WorkExperience", filters.WorkExperience);
      if (filters.Tags) queryParams.append("Tags", filters.Tags);
      queryParams.append("Speciality", searchQuery || ""); // Специализация из строки поиска

      const response = await axios.get(
        `https://4e06-37-99-64-195.ngrok-free.app/api/Resumes/fetch?${queryParams.toString()}`
      );
      const { resumes } = response.data;

      const formattedResults = resumes.map(resume => ({
        name: resume.name,
        position: resume.speciality,
        about: `${resume.experienceName} at ${resume.experienceEmployer}`,
        image: "/assets/Images/Search/PepleImg.png", // Заменить, если фото приходит из API
      }));

      setResults(formattedResults);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  };

  const toggleFilterPopup = () => {
    setFilterPopupVisible(!isFilterPopupVisible);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="ПОИСК"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          🔍
        </button>
        <button onClick={toggleFilterPopup} className="filter-button">
          Фильтры
        </button>
      </div>

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
          <label>
            Возраст:
            <input
              type="text"
              name="Age"
              value={filters.Age}
              onChange={handleFilterChange}
            />
          </label>
          <label>
            Теги:
            <input
              type="text"
              name="Tags"
              value={filters.Tags}
              onChange={handleFilterChange}
            />
          </label>
          <button onClick={handleSearch} className="apply-filters-button">
            Применить
          </button>
          <button onClick={toggleFilterPopup} className="close-popup-button">
            Закрыть
          </button>
        </div>
      )}

      <div className="results-grid">
        {results.map((result, index) => (
          <div key={index} className="card">
            <img src={result.image} alt="profile" className="profile-image" />
            <div>
              <h3>{result.name}</h3>
              <p className="position">@{result.position}</p>
              <p className="about">{result.about}</p>
              <button className="details-button">Подробнее</button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .container {
          font-family: Arial, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          padding-top: 150px;
        }
        .search-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
        }
        .search-input {
          width: 70%;
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
        .filter-popup {
          position: absolute;
          top: 100px;
          right: 50px;
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
        .filter-popup h3 {
          margin-bottom: 10px;
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
          margin-bottom: 10px;
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
        }
        .details-button:hover {
          background: #5846d6;
        }
      `}</style>
    </div>
  );
};

export default SearchPage;
