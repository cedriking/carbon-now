import { Carbon } from '../index';
import { existsSync, readFileSync, unlinkSync } from 'fs';

test('Download image', async () => {
  const carbon = new Carbon({
    lang: 'javascript',
    theme: 'blackboard',
    background: 'rgba(124,23,25,100)',
  });

  const result = await carbon.generate(
    `
const regexGen = async () => {
  try {
    const url = 'https://regexgenie.p.rapidapi.com/generate';
    
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'regexgenie.p.rapidapi.com'
      },
      body: JSON.stringify({
        query: 'a single character that is a digit'
      })
    };

    const response = await fetch(url, options);
    const data = await response.json();
    
    return data;
  } catch (error) {
    throw new Error(error);
  }
};


(async () => {
  try {
    const data = await regexGen();
    console.log(data); // { "error": false, "data": "/^\\d$/" }
  } catch (error) {
    console.error(error);
  }
})();
`,
    './test.png',
  );

  expect(result.endsWith('test.png')).toBe(true);
  expect(existsSync(result)).toBe(true);
  // compare result.png with test.png
  const resultPng = readFileSync('./result.png');
  const testPng = readFileSync('./test.png');

  expect(resultPng.equals(testPng)).toBe(true);

  unlinkSync('./test.png');
}, 10000);
