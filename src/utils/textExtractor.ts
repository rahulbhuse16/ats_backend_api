import {PDFParse} from 'pdf-parse'
export const extractTextFromFile = async (filePath: string) => {

  const data= new  PDFParse({url:filePath})

  const textRes=await data.getText()



  return textRes

  
};

export function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+ ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

export function compareResumeAndJD(resumeText: string, jdText: string) {
  const resumeWords = extractKeywords(resumeText);
  const jdWords = extractKeywords(jdText);

  const resumeSet = new Set(resumeWords);
  const jdSet = new Set(jdWords);

  const strengths: string[] = [];
  const gaps: string[] = [];

  jdSet.forEach((word) => {
    if (resumeSet.has(word)) strengths.push(word);
    else gaps.push(word);
  });

  const matchScore =
    Math.round((strengths.length / (strengths.length + gaps.length)) * 100);

  return { matchScore, strengths, gaps };
}


