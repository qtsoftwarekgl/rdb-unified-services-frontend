import { useState } from 'react';
import login_vector from '/auth/login-vector.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { languages } from '../../constants/Authentication';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import { setLocale } from '../../states/features/localeSlice';

const InfoPanel = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { locale } = useSelector((state: RootState) => state.locale);
  const [showCarousel, setShowCarousel] = useState({
    visibility: false,
    index: 0,
  });

  const carouselContent = [
    {
      title: 'Business Registration',
      image: login_vector,
      description:
        'Register your business with ease and get your business up and running in no time',
    },
    {
      title: 'Mortgange Registration',
      image: login_vector,
      description:
        'Register your mortgage with ease and get your business up and running in no time',
    },
    {
      title: 'Debt Registration',
      image: login_vector,
      description:
        'Register your debt with ease and get your business up and running in no time',
    },
  ];

  return (
    <section className="info-panel bg-primary w-full flex flex-col items-center justify-center h-full relative min-h-fit p-6">
      <select
        className="absolute top-8 right-6 accent-primary w-[15%] bg-transparent text-white"
        onChange={(e) => {
          dispatch(setLocale(e.target.value));
        }}
        defaultValue={locale || 'en'}
      >
        {languages.map((language, index) => {
          return (
            <option
              className="w-full text-primary"
              key={index}
              value={language.value}
            >
              {language.label}
            </option>
          );
        })}
      </select>
      <menu className="h-[50%] flex w-full items-center text-white gap-4">
        <FontAwesomeIcon
          className="text-white ease-in-out duration-200 hover:scale-[1.02] cursor-pointer w-full"
          icon={faChevronLeft}
          onClick={(e) => {
            e.preventDefault();
            setShowCarousel({
              visibility: true,
              index:
                showCarousel?.index > 0
                  ? showCarousel?.index - 1
                  : carouselContent.length - 1,
            });
          }}
        />
        {carouselContent.map((content, index) => {
          return (
            <section
              key={index}
              className={`${
                index === showCarousel?.index
                  ? 'flex flex-col items-center gap-6 p-4 w-full min-w-[85%]'
                  : 'hidden'
              }`}
            >
              <figure className="w-full flex items-center justify-center">
                <img
                  src={content.image}
                  alt={content.title}
                  className="h-[40%] max-h-[250px] w-auto"
                />
              </figure>
              <p className="text-white font-light text-center max-[800px]:text-[14px]">
                {content.description}
              </p>
            </section>
          );
        })}
        <FontAwesomeIcon
          className="text-white ease-in-out duration-200 hover:scale-[1.02] cursor-pointer w-full"
          icon={faChevronRight}
          onClick={(e) => {
            e.preventDefault();
            setShowCarousel({
              visibility: true,
              index:
                showCarousel?.index < carouselContent.length - 1
                  ? showCarousel?.index + 1
                  : 0,
            });
          }}
        />
      </menu>
      <menu className="navigation-dots flex items-center gap-4 absolute bottom-12">
        {Array(carouselContent.length)
          .fill(0)
          .map((_, index) => {
            return (
              <button
                key={index}
                onClick={() => setShowCarousel({ visibility: true, index })}
                className={`w-3 h-3 rounded-full bg-white ${
                  index === showCarousel?.index
                    ? 'bg-opacity-80'
                    : 'bg-opacity-45'
                }`}
              />
            );
          })}
      </menu>
    </section>
  );
};

export default InfoPanel;
