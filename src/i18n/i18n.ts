

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import English from './languages/en.json'
import German from './languages/de.json'

i18n.use(LanguageDetector).use(initReactI18next).init({
	fallbackLng: 'de', 
	resources: {
		en : { translation: English },
		de : { translation: German }
	}
})

export default i18n
