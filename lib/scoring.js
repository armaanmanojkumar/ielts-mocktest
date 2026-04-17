// ============================================================
// IELTS BAND SCORE CALCULATION
// Based on official IDP/British Council band descriptors
// ============================================================

// Listening: raw score → band score
export function getListeningBand(rawScore) {
  if (rawScore >= 39) return 9.0;
  if (rawScore >= 37) return 8.5;
  if (rawScore >= 35) return 8.0;
  if (rawScore >= 32) return 7.5;
  if (rawScore >= 30) return 7.0;
  if (rawScore >= 26) return 6.5;
  if (rawScore >= 23) return 6.0;
  if (rawScore >= 18) return 5.5;
  if (rawScore >= 16) return 5.0;
  if (rawScore >= 13) return 4.5;
  if (rawScore >= 11) return 4.0;
  if (rawScore >= 9)  return 3.5;
  if (rawScore >= 7)  return 3.0;
  if (rawScore >= 5)  return 2.5;
  return 2.0;
}

// Reading Academic: raw score → band score
export function getReadingBand(rawScore) {
  if (rawScore >= 39) return 9.0;
  if (rawScore >= 37) return 8.5;
  if (rawScore >= 35) return 8.0;
  if (rawScore >= 33) return 7.5;
  if (rawScore >= 30) return 7.0;
  if (rawScore >= 27) return 6.5;
  if (rawScore >= 23) return 6.0;
  if (rawScore >= 19) return 5.5;
  if (rawScore >= 15) return 5.0;
  if (rawScore >= 13) return 4.5;
  if (rawScore >= 10) return 4.0;
  if (rawScore >= 8)  return 3.5;
  if (rawScore >= 6)  return 3.0;
  if (rawScore >= 4)  return 2.5;
  return 2.0;
}

// Round overall band to nearest 0.5
export function getOverallBand(listening, reading, writing, speaking) {
  const avg = (listening + reading + writing + speaking) / 4;
  return Math.round(avg * 2) / 2;
}

// Self-assessment writing band (from 4 criteria, each 1-9)
export function calculateWritingBand(task1Scores, task2Scores) {
  const task1Avg = Object.values(task1Scores).reduce((a, b) => a + b, 0) / 4;
  const task2Avg = Object.values(task2Scores).reduce((a, b) => a + b, 0) / 4;
  // Task 2 carries more weight (2/3 vs 1/3)
  const combined = (task1Avg * 1 + task2Avg * 2) / 3;
  return Math.round(combined * 2) / 2;
}

// Grade answers for listening/reading
export function gradeAnswers(userAnswers, questions) {
  let correct = 0;
  const details = [];

  questions.forEach(q => {
    const userAns = (userAnswers[q.id] || "").toString().trim().toLowerCase();
    const correctAns = q.answer.toLowerCase();
    const accepted = (q.acceptedAnswers || [q.answer]).map(a => a.toLowerCase());
    
    const isCorrect = accepted.some(a => userAns === a.toLowerCase());
    if (isCorrect) correct++;
    
    details.push({
      id: q.id,
      question: q.text,
      userAnswer: userAnswers[q.id] || "(no answer)",
      correctAnswer: q.answer,
      isCorrect,
      type: q.type,
    });
  });

  return { correct, total: questions.length, details };
}

// Format seconds to readable time
export function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  }
  return `${mins}m ${secs}s`;
}

// Band score descriptor
export function getBandDescriptor(band) {
  if (band >= 9.0) return { label: "Expert User", color: "#1a7f37", bg: "#d1fae5" };
  if (band >= 8.0) return { label: "Very Good User", color: "#1d6f42", bg: "#dcfce7" };
  if (band >= 7.0) return { label: "Good User", color: "#2d6a4f", bg: "#d8f3dc" };
  if (band >= 6.0) return { label: "Competent User", color: "#b45309", bg: "#fef3c7" };
  if (band >= 5.0) return { label: "Modest User", color: "#c2410c", bg: "#ffedd5" };
  if (band >= 4.0) return { label: "Limited User", color: "#b91c1c", bg: "#fee2e2" };
  return { label: "Intermittent User", color: "#7f1d1d", bg: "#fee2e2" };
}

// Feedback based on score in a section
export function generateFeedback(section, band) {
  const feedbacks = {
    listening: {
      high: "Excellent listening skills. You accurately identified key information across all four parts, including complex academic content.",
      mid: "Good listening ability. Focus on Parts 3 and 4 where academic vocabulary and complex discourse require closer attention.",
      low: "Develop your ability to follow extended speech. Practice note-taking and identifying signpost language in lectures and conversations."
    },
    reading: {
      high: "Strong reading performance. You successfully handled all question types including True/False/Not Given and sentence completion.",
      mid: "Solid reading skills. Pay careful attention to True/False/Not Given questions — ensure your answer is based strictly on the text.",
      low: "Work on reading speed and skimming/scanning techniques. Time management is crucial in the IELTS Reading section."
    },
    writing: {
      high: "Excellent writing. Your responses demonstrate sophisticated vocabulary, complex structures, and clear task achievement.",
      mid: "Good writing ability. Focus on developing more complex sentence structures and broadening your academic vocabulary range.",
      low: "Focus on task achievement and coherence. Ensure Task 1 describes the data clearly and Task 2 addresses all parts of the question."
    }
  };

  const fb = feedbacks[section];
  if (!fb) return "";
  if (band >= 7.0) return fb.high;
  if (band >= 5.5) return fb.mid;
  return fb.low;
}
