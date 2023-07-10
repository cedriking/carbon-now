import { ExportSizeType, fontsType, langsType, themesType } from './types';

export interface CarbonOptions {
  lang?: langsType;
  background?: string;
  theme?: themesType;
  font?: fontsType;
  windowControls?: boolean;
  widthAdjustment?: boolean;
  lineNumbers?: boolean;
  firstLineNumber?: number;
  watermark?: boolean;
  fontSize?: number;
  lineHeight?: number;
  exportSize?: ExportSizeType;
}
