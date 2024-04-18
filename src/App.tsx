import { useLocation } from "react-router-dom";
import Routes from "./Routes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./states/store";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  setCurrentPage,
  setPage,
  setSize,
} from "./states/features/paginationSlice";

function App() {
  // STATE VARIABLES
  const dispatch = useDispatch();
  const { locale } = useSelector((state: RootState) => state.locale);
  const {
    i18n: { changeLanguage },
  } = useTranslation();

  // PATHNAME
  const { pathname } = useLocation();

  // HANDLE LANGUAGE CHANGE
  useEffect(() => {
    changeLanguage(locale);
  }, [changeLanguage, locale]);

  // HANDLE PAGINATION CHANGE
  useEffect(() => {
    dispatch(setCurrentPage(1));
    dispatch(setPage(0));
    dispatch(setSize(10));
  }, [dispatch, pathname]);

  return (
    <>
      <Routes />
    </>
  );
}

export default App;
