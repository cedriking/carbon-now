import puppeteer from 'puppeteer';
import fs from 'fs-extra';
import path from 'path';
import { fontsType, langsType, themesType } from './types';
import { CarbonOptions } from './faces';

export class Carbon {
  private options: CarbonOptions = {
    lang: 'auto',
    background: 'rgba(171, 184, 195, 1)',
    theme: 'dracula',
    font: 'Hack',
    windowControls: true,
    widthAdjustment: true,
    lineNumbers: false,
    firstLineNumber: 1,
    watermark: false,
    fontSize: 18,
    lineHeight: 169,
    exportSize: 2,
  };

  constructor(options: CarbonOptions) {
    // Check if the options are valid
    this.checkOptions(options);

    this.options = { ...this.options, ...options };
  }

  public async generate(code: string, outputFilePath: string): Promise<string> {
    const fontParam = this.options.font?.replace('-', ' ');
    // Parameter Url
    const parameter = {
      code,
      l: this.options.lang,
      bg: this.options.background,
      t: this.options.theme,
      fm: fontParam,
      wc: this.options.windowControls,
      wa: this.options.widthAdjustment,
      ln: this.options.lineNumbers,
      fl: this.options.firstLineNumber,
      wm: this.options.watermark,
      fs: this.options.fontSize + 'px',
      ls: this.options.lineHeight,
      es: this.options.exportSize + 'x',
    };

    const url = 'https://carbon.now.sh?' + this.createParameter(parameter);
    return this.download(url, outputFilePath);
  }

  private async download(url: string, outputFilePath: string): Promise<string> {
    // Parse Output Folder
    const output = path.resolve(outputFilePath);
    let folder = path.dirname(output);
    let filename = path.basename(output);
    if (!path.extname(filename)) {
      folder = output;
      filename = 'Downloaded.png';
    }

    // Start Puppeteer Session
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new',
    });

    // Open Page and Go to Carbon Site
    const page = await browser.newPage();
    await page.goto(url);

    // Make Downloaded file more HD
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    // Download
    let downloaded: string | null = null;

    // Event
    const client = await page.target().createCDPSession();
    await client.send('Browser.setDownloadBehavior', {
      behavior: 'allowAndName',
      downloadPath: folder,
      eventsEnabled: true,
    });

    client.on('Browser.downloadProgress', async (event) => {
      // Identify if File Downloaded
      if (event.state === 'completed') {
        const newfilename: string = path.resolve(folder, filename);
        fs.renameSync(path.resolve(folder, event.guid), newfilename);

        // Close Browser after Success Download
        await browser.close();
        downloaded = newfilename;
      }
    });

    // Click Export in Carbon.now.sh Site
    await page.waitForSelector('.editor');
    await page.waitForSelector('.jsx-2184717013');
    await page.click('.jsx-2184717013');

    return new Promise(async (resolve, reject) => {
      const checkDownloaded = setInterval(() => {
        if (downloaded !== null) {
          clearInterval(checkDownloaded);
          resolve(downloaded);
        }
      }, 100);
    });
  }

  private createParameter(obj: { [key: string]: any }) {
    const parameter = Object.entries(obj).map(([key, value]) => `${key}=${encodeURIComponent(value)}`);

    return parameter.join('&');
  }

  private checkOptions(options: CarbonOptions) {
    // Check if the options are valid
    if (options.lang && !this.checkLang(options.lang)) {
      throw new Error(`Invalid language: ${options.lang}`);
    }
    if (options.theme && !this.checkTheme(options.theme)) {
      throw new Error(`Invalid theme: ${options.theme}`);
    }
    if (options.font && !this.checkFont(options.font)) {
      throw new Error(`Invalid font: ${options.font}`);
    }
  }

  private checkLang(lang: langsType) {
    const langs = [
      'auto',
      'c',
      'css',
      'cpp',
      'go',
      'html',
      'java',
      'javascript',
      'jsx',
      'php',
      'python',
      'rust',
      'typescript',
    ];
    return langs.includes(lang);
  }

  private checkTheme(theme: themesType) {
    const themes = [
      'a11y-dark',
      'atom-dark',
      'base16-ateliersulphurpool.light',
      'blackboard',
      'cb',
      'darcula',
      'default',
      'dracula',
      'duotone-dark',
      'duotone-earth',
      'duotone-forest',
      'duotone-light',
      'duotone-sea',
      'duotone-space',
      'ghcolors',
      'hopscotch',
      'material-dark',
      'material-light',
      'material-oceanic',
      'nord',
      'pojoaque',
      'shades-of-purple',
      'synthwave84',
      'vs',
      'vsc-dark-plus',
      'xonokai',
    ];
    return themes.includes(theme);
  }

  private checkFont(font: fontsType) {
    const fonts = [
      'MonoLisa',
      'Anonymouse-Pro',
      'Cascadia-Code',
      'Droid-Sans-Mono',
      'Fantasque-Sans-Mono',
      'Fira-Code',
      'Hack',
      'IBM-Flex-Mono',
      'Inconsolata',
      'JetBrains-Mono',
      'Monoid',
      'Source-Code-Pro',
      'Space-Mono',
      'Ubuntu-Mono',
    ];
    return fonts.includes(font);
  }
}
