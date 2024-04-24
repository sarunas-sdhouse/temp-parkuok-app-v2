import { TFunction } from 'i18next';

import lang from '../locales/en.json';

export interface Resources {
  lang: typeof lang;
}

export type TKeyofTranslation<T extends keyof Resources> = keyof TFunction<T, undefined>;
