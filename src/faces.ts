import { fontsType, langsType, themesType } from './types';

export interface CarbonOptions {
  lang: langsType;
  background: string;
  theme: themesType;
  font: fontsType;
  windowControls: boolean;
  widthAdjustment: boolean;
  line: boolean;
  firstLine: number;
  watermark: boolean;
}
