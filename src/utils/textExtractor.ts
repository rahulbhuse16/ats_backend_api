import {PDFParse} from 'pdf-parse'
export const extractTextFromFile = async (filePath: string) => {

  const data= new  PDFParse({url:filePath})

  const textRes=await data.getText()



  return textRes

  
};

// ----------------------------
// 1. Skills Dictionary
// ----------------------------
export const SKILLS_DICTIONARY: string[] = [
  "javascript", "typescript", "react", "react native", "node", "node.js", "express",
  "java", "python", "c++", "c#", "php", "golang", "html", "css", "tailwind",
  "mongodb", "mysql", "postgresql", "oracle", "firebase",
  "aws", "azure", "gcp", "docker", "kubernetes", "git", "github", "jira",
  "machine learning", "deep learning", "data science",
  "agile", "scrum", "communication", "leadership", "problem solving"
];


// ----------------------------
// 2. Extract ONLY Skills
// ----------------------------
export function extractKeywords(text: string): string[] {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9+ ]/g, " ");

  const found = new Set<string>();

  // match multi-word + single-word skills
  for (const skill of SKILLS_DICTIONARY) {
    const formattedSkill = skill.toLowerCase().replace(/\+/g, "\\+");
    const regex = new RegExp(`\\b${formattedSkill}\\b`, "i");

    if (regex.test(cleaned)) {
      found.add(skill);
    }
  }

  return Array.from(found);
}


// ----------------------------
// 3. Compare Only Skills
// ----------------------------
export function compareResumeAndJD(resumeText: string, jdText: string) {
  const resumeSkills = extractKeywords(resumeText);
  const jdSkills = extractKeywords(jdText);

  const resumeSet = new Set(resumeSkills);
  const jdSet = new Set(jdSkills);

  const strengths: string[] = [];
  const gaps: string[] = [];

  jdSet.forEach((skill) => {
    if (resumeSet.has(skill)) strengths.push(skill);
    else gaps.push(skill);
  });

  const matchScore = jdSet.size
    ? Math.round((strengths.length / jdSet.size) * 100)
    : 0;

  return { matchScore, strengths, gaps };
}



