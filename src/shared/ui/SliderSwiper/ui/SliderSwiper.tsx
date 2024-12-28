import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import { TCarousel } from "../types/types";

import "swiper/swiper-bundle.css"; // Swiper стили
import "swiper/css";
import "swiper/css/pagination";
import "./slider.scss";

const SliderSwiper: React.FC<TCarousel> = ({ images = [], className }) => {
  return (
    <Swiper
      spaceBetween={10} // Отступы между слайдами
      slidesPerView={3} // Количество слайдов, которые показываются одновременно
      loop={true} // Зацикливаем слайдер
      autoplay={{ delay: 3000 }}
      pagination={{
        clickable: true, // Позволяет кликать по буллетам
        el: ".swiper-pagination",
      }}
      modules={[Pagination, Autoplay]} // Подключаем модули
      className={`${className} `}
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <img
            src={image.src}
            alt={image.alt}
            className="slider-image mx-2" // Класс для изображения
          />
        </SwiperSlide>
      ))}
      <div className="swiper-pagination"></div>
    </Swiper>
  );
};

export default SliderSwiper;
