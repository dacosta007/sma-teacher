/* 
  ----------
    Help grade score performace by percentage on score 
  ----------
*/

export function gradeScore(scPercent) {
  let grade, gradeClr;
  if (scPercent >= 75) {
    grade = 'A1';
    gradeClr = 'var(--accent-success)';
  }
  if (scPercent <= 74) {
    grade = 'B2';
    gradeClr = 'var(--accent-success)'
  }
  if (scPercent <= 69) {
    grade = 'B3';
    gradeClr = 'var(--accent-info)'
  }
  if (scPercent <= 64) {
    grade = 'C4';
    gradeClr = 'var(--accent-info)'
  }
  if (scPercent <= 59) {
    grade = 'C5';
    gradeClr = 'var(--accent-warning)'
  }
  if (scPercent <= 54) {
    grade = 'C6';
    gradeClr = 'var(--accent-warning)'
  }
  if (scPercent <= 49) {
    grade = 'D7';
    gradeClr = 'var(--accent-danger)'
  }
  if (scPercent <= 44) {
    grade = 'E8';
    gradeClr = 'var(--accent-danger)'
  }
  if (scPercent <= 39) {
    grade = 'F9';
    gradeClr = 'var(--accent-danger)'
  }

  return {grade, gradeClr};
}