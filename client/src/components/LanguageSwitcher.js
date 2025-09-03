import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        {i18n.language.toUpperCase()}
      </button>
      <ul className="dropdown-menu">
        <li><a className="dropdown-item" href="#" onClick={() => changeLanguage('en')}>English</a></li>
        <li><a className="dropdown-item" href="#" onClick={() => changeLanguage('es')}>Español</a></li>
        <li><a className="dropdown-item" href="#" onClick={() => changeLanguage('fr')}>Français</a></li>
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
