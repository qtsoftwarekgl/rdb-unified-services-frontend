import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';
import { useSelector } from 'react-redux';
import { RootState } from './states/store';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function App() {

  // STATE VARIABLES
  const { locale } = useSelector((state: RootState) => state.locale);
  const {
    i18n: { changeLanguage },
  } = useTranslation();

  // HANDLE LANGUAGE CHANGE
  useEffect(() => {
    changeLanguage(locale);
  }, [changeLanguage, locale]);

  return (
    <>
      <Router>
        <Routes />
      </Router>
    </>
  );
}

export default App;
