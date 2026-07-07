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
        <li><button type="button" className="dropdown-item" onClick={() => changeLanguage('en')}>English</button></li>
        <li><button type="button" className="dropdown-item" onClick={() => changeLanguage('es')}>Español</button></li>
        <li><button type="button" className="dropdown-item" onClick={() => changeLanguage('fr')}>Français</button></li>
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
