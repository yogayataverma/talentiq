import React, { useState } from 'react';
import './Carousel.css';

const images = [
  'https://www.ft.com/__origami/service/image/v2/images/raw/ftcms%3A347ece48-0f69-11e9-a3aa-118c761d2745?source=ig',
  'https://www.jaspersoft.com/content/dam/jaspersoft/images/graphics/infographics/column-chart-example.svg',
  'https://datavizproject.com/wp-content/uploads/types/Bar-Chart-Vertical.png',
];

const paragraphs = [
  {
    heading: 'Welcome to TalentIQ!',
    description: 'Discover the best talent and manage your HR needs efficiently.'
  },
  {
    heading: 'Easy Access',
    description: 'Register or login to access your personalized HR dashboard and tools.'
  },
  {
    heading: 'Join Us',
    description: 'Experience a smarter way to handle recruitment and HR tasks.'
  },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="carousel-container">
      <div className="carousel-image-wrapper">
        <img src={images[current]} alt={`carousel-${current}`} className="carousel-image" />
      </div>
      <div className="carousel-paragraphs">
        <div className="carousel-paragraph-heading">
          {paragraphs[current].heading}
        </div>
        <div className="carousel-paragraph-desc">
          {paragraphs[current].description}
        </div>
      </div>
      <div className="carousel-dots">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`carousel-dot${current === idx ? ' active' : ''}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel; 