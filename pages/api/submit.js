// pages/api/submit.js
// Backend endpoint: receives answers + timing data, returns scored results

import { LISTENING_TEST, READING_TEST } from "../../lib/questions";
import {
  gradeAnswers,
  getListeningBand,
  getReadingBand,
  calculateWritingBand,
  getOverallBand,
  formatTime,
  getBandDescriptor,
  generateFeedback,
} from "../../lib/scoring";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      sessionId,
      testStartTime,
      testEndTime,
      sectionTimes,       // { listening: {start, end}, reading: {start, end}, writing: {start, end} }
      listeningAnswers,   // { [questionId]: answer }
      readingAnswers,
      writingData,        // { task1: { text, wordCount, selfScores }, task2: { text, wordCount, selfScores } }
      writingSelfScores,  // { task1: { taskAchievement, coherence, lexical, grammar }, task2: {...} }
    } = req.body;

    if (!testStartTime || !testEndTime) {
      return res.status(400).json({ error: "Missing timing data" });
    }

    const totalTimeMs = testEndTime - testStartTime;
    const totalTimeSec = Math.floor(totalTimeMs / 1000);

    // === LISTENING SCORING ===
    const allListeningQuestions = LISTENING_TEST.parts.flatMap(p => p.questions);
    const listeningResult = gradeAnswers(listeningAnswers || {}, allListeningQuestions);
    const listeningBand = getListeningBand(listeningResult.correct);

    // Section timing
    const listeningTime = sectionTimes?.listening
      ? Math.floor((sectionTimes.listening.end - sectionTimes.listening.start) / 1000)
      : null;

    // === READING SCORING ===
    const allReadingQuestions = READING_TEST.passages.flatMap(p => p.questions);
    const readingResult = gradeAnswers(readingAnswers || {}, allReadingQuestions);
    const readingBand = getReadingBand(readingResult.correct);

    const readingTime = sectionTimes?.reading
      ? Math.floor((sectionTimes.reading.end - sectionTimes.reading.start) / 1000)
      : null;

    // === WRITING SCORING ===
    const writingTime = sectionTimes?.writing
      ? Math.floor((sectionTimes.writing.end - sectionTimes.writing.start) / 1000)
      : null;

    let writingBand = 5.0; // default if not self-assessed
    let writingDetails = null;

    if (writingSelfScores?.task1 && writingSelfScores?.task2) {
      writingBand = calculateWritingBand(writingSelfScores.task1, writingSelfScores.task2);
      writingDetails = {
        task1: {
          wordCount: writingData?.task1?.wordCount || 0,
          scores: writingSelfScores.task1,
          band: Object.values(writingSelfScores.task1).reduce((a, b) => a + b, 0) / 4
        },
        task2: {
          wordCount: writingData?.task2?.wordCount || 0,
          scores: writingSelfScores.task2,
          band: Object.values(writingSelfScores.task2).reduce((a, b) => a + b, 0) / 4
        }
      };
    }

    // === OVERALL BAND ===
    // Speaking not tested online, use average of other three × ~estimated
    // We'll note speaking is not included and show 3-section result
    const overallBand = getOverallBand(listeningBand, readingBand, writingBand, writingBand); // proxy speaking with writing

    // === BUILD RESPONSE ===
    const result = {
      sessionId,
      submittedAt: new Date().toISOString(),

      timing: {
        totalTime: totalTimeSec,
        totalTimeFormatted: formatTime(totalTimeSec),
        sections: {
          listening: listeningTime ? { seconds: listeningTime, formatted: formatTime(listeningTime) } : null,
          reading: readingTime ? { seconds: readingTime, formatted: formatTime(readingTime) } : null,
          writing: writingTime ? { seconds: writingTime, formatted: formatTime(writingTime) } : null,
        }
      },

      scores: {
        listening: {
          raw: listeningResult.correct,
          total: listeningResult.total,
          percentage: Math.round((listeningResult.correct / listeningResult.total) * 100),
          band: listeningBand,
          descriptor: getBandDescriptor(listeningBand),
          feedback: generateFeedback("listening", listeningBand),
          details: listeningResult.details,
        },
        reading: {
          raw: readingResult.correct,
          total: readingResult.total,
          percentage: Math.round((readingResult.correct / readingResult.total) * 100),
          band: readingBand,
          descriptor: getBandDescriptor(readingBand),
          feedback: generateFeedback("reading", readingBand),
          details: readingResult.details,
        },
        writing: {
          band: writingBand,
          descriptor: getBandDescriptor(writingBand),
          feedback: generateFeedback("writing", writingBand),
          details: writingDetails,
          wordCounts: {
            task1: writingData?.task1?.wordCount || 0,
            task2: writingData?.task2?.wordCount || 0,
          }
        },
        overall: {
          band: overallBand,
          descriptor: getBandDescriptor(overallBand),
          note: "Speaking band not assessed in this online format. Overall is estimated from Listening, Reading, and Writing."
        }
      },

      // Part-by-part listening breakdown
      listeningByPart: LISTENING_TEST.parts.map(part => {
        const partDetails = listeningResult.details.filter(d =>
          part.questions.some(q => q.id === d.id)
        );
        const correct = partDetails.filter(d => d.isCorrect).length;
        return {
          part: part.id,
          title: part.title,
          correct,
          total: part.questions.length,
        };
      }),

      // Passage-by-passage reading breakdown
      readingByPassage: READING_TEST.passages.map(passage => {
        const passageDetails = readingResult.details.filter(d =>
          passage.questions.some(q => q.id === d.id)
        );
        const correct = passageDetails.filter(d => d.isCorrect).length;
        return {
          passage: passage.id,
          title: passage.title,
          correct,
          total: passage.questions.length,
        };
      }),
    };

    // Log for debugging (remove in production or replace with DB storage)
    console.log(`[SUBMIT] Session: ${sessionId} | Total time: ${formatTime(totalTimeSec)} | Overall band: ${overallBand}`);

    return res.status(200).json(result);
  } catch (error) {
    console.error("[SUBMIT ERROR]", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
