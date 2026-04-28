(() => {
  const SESSION_KEY = "ielts_session";
  const RESULTS_KEY = "ielts_results";
  const RESULTS_VERSION = "writing-auto-v2";
  const SELECTED_SET_KEY = "ielts_selected_set";
  const RECOMMENDED_SECONDS = {
    listening: 30 * 60,
    reading: 60 * 60,
    writing: 60 * 60,
  };
  const EXAM_SETS = [
    {
      id: "set-01",
      title: "Exam Set 1",
      focus: "Academic Foundations",
      level: "Balanced",
      accent: "#003580",
      task1Title: "Internet Access by Country (2005-2020)",
      task1Prompt: "The graph below shows the percentage of households with internet access in four countries between 2005 and 2020.",
      chartRows: [
        ["Country A", "45%", "92%", "#003580"],
        ["Country B", "30%", "88%", "#c8a84b"],
        ["Country C", "15%", "71%", "#e63946"],
        ["Country D", "8%", "55%", "#2d6a4f"],
      ],
      task2Prompt: "Some people believe that universities should focus solely on academic subjects and theoretical knowledge. Others argue that practical skills and vocational training should also be included in university education.",
    },
    {
      id: "set-02",
      title: "Exam Set 2",
      focus: "Technology and Learning",
      level: "Balanced",
      accent: "#2d6a4f",
      task1Title: "Online Course Enrolment (2018-2023)",
      task1Prompt: "The chart below shows the number of students enrolled in online courses in four subject areas between 2018 and 2023.",
      chartRows: [
        ["Business", "18k", "51k", "#003580"],
        ["Health", "12k", "44k", "#2d6a4f"],
        ["Design", "9k", "28k", "#c8a84b"],
        ["Science", "15k", "39k", "#e63946"],
      ],
      task2Prompt: "Online learning is becoming more common in schools and universities. Discuss the advantages and disadvantages of this trend and give your own opinion.",
    },
    {
      id: "set-03",
      title: "Exam Set 3",
      focus: "Cities and Transport",
      level: "Timed Practice",
      accent: "#b45309",
      task1Title: "Daily Commute Methods (2010-2025)",
      task1Prompt: "The table below compares the percentage of commuters using four forms of transport in a large city in 2010 and 2025.",
      chartRows: [
        ["Bus", "36%", "28%", "#003580"],
        ["Metro", "22%", "37%", "#2d6a4f"],
        ["Car", "34%", "24%", "#e63946"],
        ["Bike", "8%", "11%", "#c8a84b"],
      ],
      task2Prompt: "Many cities are investing in public transport instead of building more roads. To what extent do you agree or disagree with this policy?",
    },
    {
      id: "set-04",
      title: "Exam Set 4",
      focus: "Health and Society",
      level: "Balanced",
      accent: "#b91c1c",
      task1Title: "Weekly Exercise by Age Group",
      task1Prompt: "The bar chart below shows the average weekly hours of exercise for four age groups in one country.",
      chartRows: [
        ["16-24", "6.2h", "7.1h", "#003580"],
        ["25-39", "4.8h", "5.4h", "#2d6a4f"],
        ["40-59", "3.5h", "4.0h", "#c8a84b"],
        ["60+", "2.2h", "3.6h", "#e63946"],
      ],
      task2Prompt: "Some people think governments should be responsible for public health, while others believe individuals should take more responsibility. Discuss both views and give your opinion.",
    },
    {
      id: "set-05",
      title: "Exam Set 5",
      focus: "Work and Careers",
      level: "Challenge",
      accent: "#7c3aed",
      task1Title: "Remote Work by Industry",
      task1Prompt: "The chart below shows the proportion of employees working remotely in four industries in 2019 and 2024.",
      chartRows: [
        ["Finance", "14%", "46%", "#003580"],
        ["Education", "9%", "38%", "#2d6a4f"],
        ["Retail", "4%", "12%", "#c8a84b"],
        ["Technology", "28%", "68%", "#e63946"],
      ],
      task2Prompt: "Remote work has become normal for many employees. Do the benefits of working from home outweigh the drawbacks?",
    },
    {
      id: "set-06",
      title: "Exam Set 6",
      focus: "Environment",
      level: "Balanced",
      accent: "#0f766e",
      task1Title: "Household Energy Sources",
      task1Prompt: "The pie charts below compare household energy sources in one country in 2000 and 2025.",
      chartRows: [
        ["Coal", "42%", "18%", "#b91c1c"],
        ["Gas", "31%", "29%", "#003580"],
        ["Solar", "3%", "24%", "#c8a84b"],
        ["Wind", "6%", "19%", "#2d6a4f"],
      ],
      task2Prompt: "Some people say environmental problems should be solved globally, while others think local action is more effective. Discuss both views and give your opinion.",
    },
    {
      id: "set-07",
      title: "Exam Set 7",
      focus: "Media and Culture",
      level: "Timed Practice",
      accent: "#be123c",
      task1Title: "News Consumption Platforms",
      task1Prompt: "The table below shows how adults in one country accessed news in 2012 and 2024.",
      chartRows: [
        ["Television", "58%", "34%", "#003580"],
        ["Newspapers", "31%", "9%", "#b91c1c"],
        ["Websites", "22%", "49%", "#2d6a4f"],
        ["Social media", "11%", "57%", "#c8a84b"],
      ],
      task2Prompt: "Social media is now a major source of news for many people. Is this a positive or negative development?",
    },
    {
      id: "set-08",
      title: "Exam Set 8",
      focus: "Science and Research",
      level: "Challenge",
      accent: "#1d4ed8",
      task1Title: "Research Funding Allocation",
      task1Prompt: "The chart below shows how research funding was distributed across four fields in 2015 and 2025.",
      chartRows: [
        ["Medicine", "$22m", "$41m", "#003580"],
        ["Energy", "$14m", "$36m", "#2d6a4f"],
        ["Agriculture", "$12m", "$18m", "#c8a84b"],
        ["Space", "$8m", "$27m", "#e63946"],
      ],
      task2Prompt: "Scientific research should be funded by governments rather than private companies. To what extent do you agree or disagree?",
    },
    {
      id: "set-09",
      title: "Exam Set 9",
      focus: "Education Policy",
      level: "Balanced",
      accent: "#a16207",
      task1Title: "School Spending Per Student",
      task1Prompt: "The table below shows annual spending per student in four types of schools in 2010 and 2022.",
      chartRows: [
        ["Primary", "$4.2k", "$6.1k", "#003580"],
        ["Secondary", "$5.8k", "$8.4k", "#2d6a4f"],
        ["Vocational", "$6.4k", "$9.2k", "#c8a84b"],
        ["Specialist", "$8.9k", "$12.7k", "#e63946"],
      ],
      task2Prompt: "Some people believe students should choose their subjects freely, while others think schools should require a broad curriculum. Discuss both views and give your opinion.",
    },
    {
      id: "set-10",
      title: "Exam Set 10",
      focus: "Business and Consumption",
      level: "Final Practice",
      accent: "#c2410c",
      task1Title: "Consumer Spending Categories",
      task1Prompt: "The chart below compares average monthly household spending on four categories in 2016 and 2026.",
      chartRows: [
        ["Food", "$420", "$510", "#003580"],
        ["Housing", "$960", "$1280", "#b91c1c"],
        ["Transport", "$310", "$360", "#2d6a4f"],
        ["Entertainment", "$180", "$290", "#c8a84b"],
      ],
      task2Prompt: "Advertising encourages people to buy things they do not need. To what extent do you agree or disagree?",
    },
  ];

  let tests = null;
  let timerId = null;

  const runtime = {
    listening: {
      part: 0,
      current: 1,
      audioState: "idle",
      audioProgress: 0,
      showTranscript: false,
    },
    reading: {
      passage: 0,
      current: 1,
    },
    writing: {
      task: 0,
      phase: "writing",
    },
  };

  const app = document.getElementById("app");

  document.addEventListener("DOMContentLoaded", init);
  window.addEventListener("beforeunload", () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  });

  async function init() {
    try {
      tests = await fetchJson("/api/questions");
      route();
    } catch (error) {
      renderError("Could not load the question bank.", error.message);
    }
  }

  function route() {
    const path = cleanPath(window.location.pathname);
    if (path === "/") return renderHome();
    if (path === "/instructions") return renderInstructions();
    if (path === "/test/listening") return enterListening();
    if (path === "/test/reading") return enterReading();
    if (path === "/test/writing") return enterWriting();
    if (path === "/results") return enterResults();
    renderError("Page not found", "That route is not part of this mock test.");
  }

  function cleanPath(path) {
    const cleaned = path.replace(/\/+$/, "");
    return cleaned || "/";
  }

  function renderPage(content, options = {}) {
    clearTimer();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    app.innerHTML = `${renderNavbar(options)}${content}`;

    if (options.timer) {
      startTimer(options.timer);
    }
  }

  function renderNavbar(options = {}) {
    const timer = options.timer
      ? `<div class="exam-timer" id="exam-timer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12,6 12,12 16,14"></polyline>
          </svg>
          <div>
            <div class="timer-label">${escapeHtml(options.timer.label || "Time Remaining")}</div>
            <div class="timer-value" id="timer-value">--:--</div>
          </div>
        </div>`
      : "";

    const action = options.startButton
      ? `<button class="btn btn-gold btn-sm" id="nav-start-test">Start Full Test</button>`
      : "";

    return `<nav class="navbar">
      <a class="navbar-brand" href="/" style="text-decoration: none;">
        <div class="logo-icon">I</div>
        <div>
          <h1>IELTS MockTest</h1>
          <span>Python Assessment App</span>
        </div>
      </a>
      ${timer || action}
    </nav>`;
  }

  function renderHome() {
    const selectedSet = getSelectedExamSet();
    const currentSession = loadSession();
    const modules = [
      {
        title: "Listening",
        desc: "4 parts, 40 questions. Browser speech synthesis reads each transcript aloud.",
        time: "30 min",
        questions: "40 Qs",
        path: "/test/listening",
      },
      {
        title: "Reading",
        desc: "3 academic passages with True/False/Not Given, multiple choice, and completion items.",
        time: "60 min",
        questions: "40 Qs",
        path: "/test/reading",
      },
      {
        title: "Writing",
        desc: "Task 1 graph description and Task 2 essay with word counts and automatic completion estimate.",
        time: "60 min",
        questions: "2 Tasks",
        path: "/test/writing",
      },
      {
        title: "Results",
        desc: "Band scores, timing analytics, answer review, and targeted improvement feedback.",
        time: "Instant",
        questions: "All sections",
        path: "/results",
      },
    ];

    renderPage(
      `<section class="hero">
        <div class="badge">10 Academic Exam Sets - Full Length</div>
        <h1>Prepare for IELTS with<br>Authentic Exam Conditions</h1>
        <p>
          Listening, Reading, and Writing practice with real timers, Python backend scoring,
          detailed band score results, and 10 selectable mock exam sets.
        </p>
        <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
          <button class="btn btn-gold btn-lg" data-start-test>Begin ${escapeHtml(selectedSet.title)} &rarr;</button>
          ${
            currentSession
              ? `<button class="btn btn-outline btn-lg" id="resume-test" style="background: rgba(255,255,255,0.08); color: white; border-color: rgba(255,255,255,0.5);">Resume Current Test</button>`
              : ""
          }
        </div>
      </section>

      <section style="max-width: 1100px; margin: 28px auto 0; padding: 0 24px;">
        <div style="background: white; border: 1px solid var(--border); border-left: 5px solid var(--gold); border-radius: 12px; padding: 18px 22px; box-shadow: var(--shadow-sm);">
          <p style="font-size: 0.82rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Creator Note</p>
          <h2 style="font-family: DM Sans, sans-serif; font-size: 1.15rem; color: var(--navy); margin-bottom: 4px;">
            Sania: MAINE BANAYA HAI YE, MAI ENGINEER HOON
          </h2>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0;">Python backend, browser test UI, scoring, timers, and IELTS practice workflow.</p>
        </div>
      </section>

      <section style="max-width: 1100px; margin: 28px auto 0; padding: 0 24px;">
        <div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;">
          <div>
            <h2 style="font-family: DM Sans, sans-serif; font-size: 1.3rem; color: var(--navy); margin-bottom: 4px;">Choose an Exam Set</h2>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">Pick one of 10 full practice sets. Writing prompts and result labels follow your selected set.</p>
          </div>
          <span class="meta-tag" style="background: var(--navy-light); color: var(--navy);">${escapeHtml(selectedSet.title)} selected</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 12px;">
          ${EXAM_SETS.map((examSet) => renderExamSetCard(examSet, selectedSet.id)).join("")}
        </div>
      </section>

      <div class="test-modules">
        ${modules
          .map(
            (module) => `<button class="module-card" data-route="${module.path}" type="button">
              <div class="module-icon">${module.title.slice(0, 1)}</div>
              <h3>${escapeHtml(module.title)}</h3>
              <p>${escapeHtml(module.desc)}</p>
              <div class="module-meta">
                <span class="meta-tag">${escapeHtml(module.time)}</span>
                <span class="meta-tag">${escapeHtml(module.questions)}</span>
              </div>
            </button>`
          )
          .join("")}
      </div>

      <footer style="background: var(--navy); color: rgba(255,255,255,0.7); text-align: center; padding: 24px; font-size: 0.85rem; margin-top: 60px;">
        IELTS MockTest - For practice only. Not affiliated with IDP, British Council, or Cambridge Assessment English.
      </footer>`,
      { startButton: true }
    );

    document.querySelectorAll("[data-start-test], #nav-start-test").forEach((button) => {
      button.addEventListener("click", () => startFullTest("/instructions", getSelectedExamSet().id));
    });

    document.querySelectorAll("[data-exam-set]").forEach((button) => {
      button.addEventListener("click", () => {
        selectExamSet(button.dataset.examSet);
        renderHome();
      });
    });

    const resumeButton = document.getElementById("resume-test");
    if (resumeButton) {
      resumeButton.addEventListener("click", () => {
        window.location.href = getResumePath(loadSession());
      });
    }

    document.querySelectorAll("[data-route]").forEach((button) => {
      button.addEventListener("click", () => {
        const next = button.dataset.route;
        if (next.startsWith("/test/") && !loadSession()) {
          startFullTest(next, getSelectedExamSet().id);
        } else {
          window.location.href = next;
        }
      });
    });
  }

  function renderInstructions() {
    const examSet = getSessionExamSet();
    renderPage(
      `<div style="max-width: 760px; margin: 40px auto; padding: 0 24px 80px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <div class="badge" style="background: var(--navy-light); border: 1px solid var(--navy); color: var(--navy);">
            Important Information
          </div>
          <h1 style="font-size: 2rem; color: var(--navy); margin-top: 16px; margin-bottom: 12px;">Before You Begin</h1>
          <p style="color: var(--text-secondary); font-size: 1rem;">
            Read these instructions carefully. This test simulates IELTS exam conditions.
          </p>
        </div>

        <div style="background: white; border: 1px solid var(--border); border-left: 5px solid ${examSet.accent}; border-radius: 12px; padding: 18px 22px; margin-bottom: 24px; box-shadow: var(--shadow-sm);">
          <p style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Selected Exam</p>
          <h2 style="font-family: DM Sans, sans-serif; font-size: 1.1rem; color: var(--navy); margin-bottom: 4px;">${escapeHtml(examSet.title)} - ${escapeHtml(examSet.focus)}</h2>
          <p style="font-size: 0.875rem; color: var(--text-secondary); margin: 0;">Level: ${escapeHtml(examSet.level)}. You can choose a different set from the start page before beginning.</p>
        </div>

        <div class="card" style="margin-bottom: 24px;">
          <div class="card-header">
            <h2 style="font-family: DM Sans, sans-serif; font-weight: 600; font-size: 1rem;">Test Structure</h2>
          </div>
          <div class="card-body" style="padding: 0; overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
              <thead>
                <tr style="background: var(--off-white);">
                  <th style="padding: 12px 20px; text-align: left; border-bottom: 1px solid var(--border);">Section</th>
                  <th style="padding: 12px 20px; text-align: left; border-bottom: 1px solid var(--border);">Time</th>
                  <th style="padding: 12px 20px; text-align: left; border-bottom: 1px solid var(--border);">Questions</th>
                  <th style="padding: 12px 20px; text-align: left; border-bottom: 1px solid var(--border);">Format</th>
                </tr>
              </thead>
              <tbody>
                ${[
                  ["Listening", "30 min", "40", "4 parts, multiple formats"],
                  ["Reading", "60 min", "40", "3 passages, mixed types"],
                  ["Writing", "60 min", "2 tasks", "Graph + essay"],
                ]
                  .map(
                    (row, index) => `<tr style="border-bottom: ${index < 2 ? "1px solid var(--border)" : "none"};">
                      <td style="padding: 14px 20px; font-weight: 500;">${row[0]}</td>
                      <td style="padding: 14px 20px;">${row[1]}</td>
                      <td style="padding: 14px 20px;">${row[2]}</td>
                      <td style="padding: 14px 20px; color: var(--text-secondary);">${row[3]}</td>
                    </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>

        <h2 style="font-size: 1.3rem; color: var(--navy); margin-bottom: 20px;">Exam Rules</h2>
        <div class="instruction-steps" style="margin-bottom: 24px;">
          ${[
            ["Timer is strictly enforced", "Each section has its own countdown timer. When time expires, you will be moved forward."],
            ["Listening uses browser speech", "Turn your volume up. The listening test uses your browser text-to-speech engine."],
            ["Do not refresh mid-section", "Answers are saved in your browser, but one sitting gives the cleanest timing data."],
            ["Answer all questions", "There is no penalty for incorrect answers, so do not leave blanks if you can make a guess."],
            ["Writing is estimated automatically", "The app checks whether you completed both tasks and met the minimum word counts before calculating results."],
            ["Results are calculated in Python", "The backend grades answers, computes bands, and returns your detailed report."],
          ]
            .map(
              ([title, body], index) => `<div class="instruction-step">
                <div class="step-number">${index + 1}</div>
                <div>
                  <p style="font-weight: 600; margin-bottom: 4px;">${title}</p>
                  <p style="font-size: 0.875rem; color: var(--text-secondary);">${body}</p>
                </div>
              </div>`
            )
            .join("")}
        </div>

        <div style="background: var(--gold-light); border: 1px solid var(--gold); border-radius: 12px; padding: 24px; margin-bottom: 32px;">
          <h3 style="font-size: 1rem; font-family: DM Sans, sans-serif; font-weight: 600; margin-bottom: 12px; color: var(--navy);">
            System Requirements
          </h3>
          <ul style="padding-left: 20px; font-size: 0.875rem; color: var(--text-secondary); line-height: 2;">
            <li>Modern browser with JavaScript enabled</li>
            <li>Speech synthesis enabled for the Listening section</li>
            <li>Recommended: laptop or desktop screen</li>
          </ul>
        </div>

        <div style="text-align: center;">
          <button class="btn btn-primary btn-lg" id="begin-listening">I Understand - Begin Listening Test &rarr;</button>
          <p style="margin-top: 12px; font-size: 0.8rem; color: var(--text-muted);">
            The timer starts when you enter the first section.
          </p>
        </div>
      </div>`
    );

    document.getElementById("begin-listening").addEventListener("click", () => {
      if (!loadSession()) {
        startFullTest("/test/listening", getSelectedExamSet().id);
      } else {
        window.location.href = "/test/listening";
      }
    });
  }

  function enterListening() {
    const session = ensureSession();
    if (!session) return;
    markSectionStart(session, "listening");
    runtime.listening = {
      part: 0,
      current: 1,
      audioState: "idle",
      audioProgress: 0,
      showTranscript: false,
    };
    renderListening();
  }

  function renderListening() {
    const session = ensureSession();
    if (!session) return;

    const answers = session.listeningAnswers || {};
    const examSet = getSessionExamSet(session);
    const part = tests.listening.parts[runtime.listening.part];
    const answered = answerCount(answers);

    renderPage(
      `<div class="exam-layout">
        <div class="exam-main">
          <div class="exam-section-header">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px;">
              <div>
                <h2>Listening Test</h2>
                <p>IELTS Academic | 4 Parts | 40 Questions | 30 Minutes | ${escapeHtml(examSet.title)}</p>
              </div>
              <div style="text-align: right; font-size: 0.85rem;">
                <div id="answered-count" style="color: var(--gold); font-weight: 600;">${answered}/40</div>
                <div style="opacity: 0.7;">Answered</div>
              </div>
            </div>
            <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
              ${tests.listening.parts
                .map(
                  (item, index) => `<button class="section-tab-button" data-listening-part="${index}" style="${sectionTabStyle(index === runtime.listening.part)}">
                    Part ${item.id}
                  </button>`
                )
                .join("")}
            </div>
          </div>

          <div style="padding: 20px 28px; border-bottom: 1px solid var(--border);">
            <div class="audio-panel">
              <div style="margin-bottom: 12px; font-size: 0.85rem; opacity: 0.9;">
                <strong style="color: var(--gold);">${escapeHtml(part.title)}</strong>
                <span style="margin-left: 8px; opacity: 0.75;">- ${escapeHtml(part.description)}</span>
              </div>
              <div class="audio-controls">
                <button class="play-btn" id="audio-toggle" type="button">${runtime.listening.audioState === "playing" ? "Stop" : "Play"}</button>
                <div style="flex: 1;">
                  <div class="audio-progress">
                    <div class="audio-progress-fill" id="audio-progress-fill" style="width: ${runtime.listening.audioProgress}%;"></div>
                  </div>
                </div>
                <div class="speaking-indicator" id="audio-status">${audioStatusLabel()}</div>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
                <p style="font-size: 0.78rem; opacity: 0.7;">Uses browser speech synthesis. Turn up your volume.</p>
                <button id="transcript-toggle" type="button" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.9); border-radius: 6px; padding: 4px 12px; font-size: 0.78rem;">
                  ${runtime.listening.showTranscript ? "Hide" : "Show"} Transcript
                </button>
              </div>
            </div>
            <div id="transcript-box" style="display: ${runtime.listening.showTranscript ? "block" : "none"}; margin-top: 12px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid var(--border); font-size: 0.875rem; line-height: 1.8; max-height: 220px; overflow-y: auto; color: var(--text-secondary); font-style: italic;">
              ${part.transcript
                .split("\n")
                .map((line) => `<p style="margin-bottom: 6px;">${escapeHtml(line)}</p>`)
                .join("")}
            </div>
          </div>

          <div class="questions-container">
            <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 24px; color: var(--navy); padding-bottom: 12px; border-bottom: 1px solid var(--border);">
              Questions ${part.questions[0].id}-${part.questions[part.questions.length - 1].id}
            </h3>
            ${part.questions.map((question) => renderListeningQuestion(question, answers)).join("")}
          </div>
        </div>

        <div class="exam-sidebar">
          ${renderQuestionNav(40, answers, runtime.listening.current)}
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline btn-sm" id="prev-part" style="flex: 1;" ${runtime.listening.part === 0 ? "disabled" : ""}>Prev Part</button>
            <button class="btn btn-primary btn-sm" id="next-listening" style="flex: 1;">
              ${runtime.listening.part < tests.listening.parts.length - 1 ? "Next Part" : "Submit"}
            </button>
          </div>
          <div style="background: white; border-radius: 12px; padding: 16px; border: 1px solid var(--border); font-size: 0.82rem; color: var(--text-secondary);">
            <p style="font-weight: 600; color: var(--navy); margin-bottom: 8px;">Tips</p>
            <ul style="padding-left: 16px; line-height: 2;">
              <li>Read the questions before listening.</li>
              <li>Listen for exact words and numbers.</li>
              <li>Spelling matters in completion items.</li>
              <li>Guess if you are unsure.</li>
            </ul>
          </div>
        </div>
      </div>`,
      {
        timer: {
          duration: tests.listening.duration,
          startedAt: session.sectionTimes.listening?.start,
          label: "Listening",
          onTimeUp: () => finishListening(true),
        },
      }
    );

    bindListening(answers);
  }

  function renderListeningQuestion(question, answers) {
    const value = answers[question.id] || "";
    const body =
      question.type === "multiple_choice"
        ? `<div class="options-grid">
            ${question.options
              .map((option) => {
                const optionValue = option.slice(0, 1);
                return `<label class="option-label ${value === optionValue ? "selected" : ""}">
                  <input type="radio" name="q${question.id}" value="${optionValue}" data-listening-answer="${question.id}" ${value === optionValue ? "checked" : ""}>
                  ${escapeHtml(option)}
                </label>`;
              })
              .join("")}
          </div>`
        : `<input class="fill-input" type="text" placeholder="Type your answer..." value="${escapeAttr(value)}" data-listening-answer="${question.id}">`;

    return `<div class="question-item" id="q-${question.id}">
      <div class="question-text">
        <span class="question-number">${question.id}</span>
        <span>${escapeHtml(question.text)}</span>
      </div>
      ${body}
    </div>`;
  }

  function bindListening(answers) {
    document.querySelectorAll("[data-listening-part]").forEach((button) => {
      button.addEventListener("click", () => {
        runtime.listening.part = Number(button.dataset.listeningPart);
        runtime.listening.current = tests.listening.parts[runtime.listening.part].questions[0].id;
        runtime.listening.audioState = "idle";
        runtime.listening.audioProgress = 0;
        runtime.listening.showTranscript = false;
        renderListening();
      });
    });

    document.getElementById("audio-toggle").addEventListener("click", () => {
      if (runtime.listening.audioState === "playing") {
        stopListeningAudio();
      } else {
        playListeningAudio();
      }
    });

    document.getElementById("transcript-toggle").addEventListener("click", () => {
      runtime.listening.showTranscript = !runtime.listening.showTranscript;
      updateAudioUi();
    });

    document.querySelectorAll("[data-listening-answer]").forEach((input) => {
      const eventName = input.type === "radio" ? "change" : "input";
      input.addEventListener(eventName, () => {
        const questionId = input.dataset.listeningAnswer;
        answers[questionId] = input.value;
        saveAnswers("listeningAnswers", answers);
        updateQuestionProgress(answers, 40);
        updateOptionSelection(questionId, input.value);
      });
    });

    document.getElementById("prev-part").addEventListener("click", () => {
      runtime.listening.part = Math.max(0, runtime.listening.part - 1);
      runtime.listening.current = tests.listening.parts[runtime.listening.part].questions[0].id;
      renderListening();
    });

    document.getElementById("next-listening").addEventListener("click", () => {
      if (runtime.listening.part < tests.listening.parts.length - 1) {
        runtime.listening.part += 1;
        runtime.listening.current = tests.listening.parts[runtime.listening.part].questions[0].id;
        renderListening();
      } else {
        finishListening(false);
      }
    });

    bindQuestionNav((questionNumber) => {
      runtime.listening.current = questionNumber;
      runtime.listening.part = tests.listening.parts.findIndex((part) =>
        part.questions.some((question) => question.id === questionNumber)
      );
      renderListening();
      scrollToQuestion(questionNumber);
    });
  }

  function playListeningAudio() {
    if (!("speechSynthesis" in window)) {
      runtime.listening.showTranscript = true;
      updateAudioUi();
      alert("Speech synthesis is not available in this browser. The transcript is shown instead.");
      return;
    }

    const part = tests.listening.parts[runtime.listening.part];
    window.speechSynthesis.cancel();
    runtime.listening.audioState = "playing";
    runtime.listening.audioProgress = 0;
    updateAudioUi();

    const words = part.transcript.split(/\s+/).filter(Boolean);
    let wordIndex = 0;
    const utterance = new SpeechSynthesisUtterance(part.transcript);
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.lang = "en-GB";

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((item) => item.lang === "en-GB") || voices[0];
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        wordIndex += 1;
        runtime.listening.audioProgress = Math.min(100, Math.round((wordIndex / words.length) * 100));
        updateAudioUi();
      }
    };

    utterance.onend = () => {
      runtime.listening.audioState = "done";
      runtime.listening.audioProgress = 100;
      runtime.listening.showTranscript = true;
      updateAudioUi();
    };

    window.speechSynthesis.speak(utterance);
  }

  function stopListeningAudio() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    runtime.listening.audioState = "done";
    runtime.listening.audioProgress = 100;
    runtime.listening.showTranscript = true;
    updateAudioUi();
  }

  function updateAudioUi() {
    const button = document.getElementById("audio-toggle");
    const fill = document.getElementById("audio-progress-fill");
    const status = document.getElementById("audio-status");
    const transcript = document.getElementById("transcript-box");
    const toggle = document.getElementById("transcript-toggle");

    if (button) button.textContent = runtime.listening.audioState === "playing" ? "Stop" : "Play";
    if (fill) fill.style.width = `${runtime.listening.audioProgress}%`;
    if (status) status.innerHTML = audioStatusLabel();
    if (transcript) transcript.style.display = runtime.listening.showTranscript ? "block" : "none";
    if (toggle) toggle.textContent = `${runtime.listening.showTranscript ? "Hide" : "Show"} Transcript`;
  }

  function audioStatusLabel() {
    if (runtime.listening.audioState === "playing") {
      return `<span class="dot pulse"></span><span>Playing...</span>`;
    }
    if (runtime.listening.audioState === "done") {
      return `<span style="color: #4ade80;">Complete</span>`;
    }
    return `<span style="opacity: 0.7;">Press Play to listen</span>`;
  }

  function finishListening(auto) {
    const session = ensureSession();
    if (!session) return;
    const answers = session.listeningAnswers || {};
    const answered = answerCount(answers);

    if (!auto && !window.confirm(`Submit Listening? You answered ${answered} of 40 questions.`)) {
      return;
    }

    markSectionEnd(session, "listening");
    session.listeningAnswers = answers;
    addCompletedSection(session, "listening");
    saveSession(session);
    window.location.href = "/test/reading";
  }

  function enterReading() {
    const session = ensureSession();
    if (!session) return;
    markSectionStart(session, "reading");
    runtime.reading = { passage: 0, current: 1 };
    renderReading();
  }

  function renderReading() {
    const session = ensureSession();
    if (!session) return;

    const answers = session.readingAnswers || {};
    const examSet = getSessionExamSet(session);
    const passage = tests.reading.passages[runtime.reading.passage];
    const answered = answerCount(answers);

    renderPage(
      `<div class="exam-layout">
        <div class="exam-main">
          <div class="exam-section-header">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px;">
              <div>
                <h2>Reading Test</h2>
                <p>IELTS Academic | 3 Passages | 40 Questions | 60 Minutes | ${escapeHtml(examSet.title)}</p>
              </div>
              <div style="text-align: right; font-size: 0.85rem;">
                <div id="answered-count" style="color: var(--gold); font-weight: 600;">${answered}/40</div>
                <div style="opacity: 0.7;">Answered</div>
              </div>
            </div>
            <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
              ${tests.reading.passages
                .map(
                  (item, index) => `<button data-reading-passage="${index}" style="${sectionTabStyle(index === runtime.reading.passage)}">
                    Passage ${item.id}
                  </button>`
                )
                .join("")}
            </div>
          </div>

          <div class="passage-container">
            <h3 style="font-family: Playfair Display, serif; font-size: 1.1rem; margin-bottom: 16px; color: var(--navy);">
              ${escapeHtml(passage.title)}
            </h3>
            ${passage.text
              .split("\n\n")
              .map((paragraph) => `<p style="margin-bottom: 14px;">${escapeHtml(paragraph)}</p>`)
              .join("")}
          </div>

          <div class="questions-container">
            <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 20px; color: var(--navy); padding-bottom: 12px; border-bottom: 1px solid var(--border);">
              Questions ${passage.questions[0].id}-${passage.questions[passage.questions.length - 1].id}
            </h3>
            ${
              passage.questions.some((question) => question.type === "tfng")
                ? `<div style="background: var(--navy-light); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; margin-bottom: 20px; font-size: 0.8rem; color: var(--text-secondary);">
                    <strong>TRUE/FALSE/NOT GIVEN:</strong> TRUE agrees with the passage. FALSE contradicts it. NOT GIVEN is not stated.
                  </div>`
                : ""
            }
            ${passage.questions.map((question) => renderReadingQuestion(question, answers)).join("")}
          </div>
        </div>

        <div class="exam-sidebar">
          ${renderQuestionNav(40, answers, runtime.reading.current)}
          <button class="btn btn-primary" id="next-reading" style="width: 100%;">
            ${runtime.reading.passage < tests.reading.passages.length - 1 ? "Next Passage" : "Submit Reading"}
          </button>
          <div style="background: white; border-radius: 12px; padding: 16px; border: 1px solid var(--border); font-size: 0.82rem; color: var(--text-secondary);">
            <p style="font-weight: 600; color: var(--navy); margin-bottom: 8px;">Tips</p>
            <ul style="padding-left: 16px; line-height: 2;">
              <li>Skim the passage first.</li>
              <li>Base T/F/NG only on the text.</li>
              <li>Scan for keywords from questions.</li>
              <li>Watch for qualifiers like always and some.</li>
            </ul>
          </div>
          <div style="background: white; border-radius: 12px; padding: 16px; border: 1px solid var(--border); font-size: 0.82rem;">
            <p style="font-weight: 600; color: var(--navy); margin-bottom: 12px;">Progress by Passage</p>
            ${tests.reading.passages
              .map((item) => {
                const done = item.questions.filter((question) => hasAnswer(answers, question.id)).length;
                return `<div style="margin-bottom: 10px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: var(--text-secondary);">
                    <span>Passage ${item.id}</span><span style="font-weight: 600;">${done}/${item.questions.length}</span>
                  </div>
                  <div style="height: 4px; background: var(--border); border-radius: 2px; overflow: hidden;">
                    <div style="height: 100%; background: ${done === item.questions.length ? "var(--success)" : "var(--navy)"}; width: ${(done / item.questions.length) * 100}%;"></div>
                  </div>
                </div>`;
              })
              .join("")}
          </div>
        </div>
      </div>`,
      {
        timer: {
          duration: tests.reading.duration,
          startedAt: session.sectionTimes.reading?.start,
          label: "Reading",
          onTimeUp: () => finishReading(true),
        },
      }
    );

    bindReading(answers);
  }

  function renderReadingQuestion(question, answers) {
    const value = answers[question.id] || "";
    let body = "";

    if (question.type === "tfng") {
      body = `<div class="tfng-options">
        ${["TRUE", "FALSE", "NOT GIVEN"]
          .map((option) => {
            const selectedClass =
              option === "TRUE" ? "selected-true" : option === "FALSE" ? "selected-false" : "selected-ng";
            return `<button class="tfng-btn ${value === option ? selectedClass : ""}" data-reading-tfng="${question.id}" data-value="${option}" type="button">${option}</button>`;
          })
          .join("")}
      </div>`;
    } else if (question.type === "multiple_choice") {
      body = `<div class="options-grid">
        ${question.options
          .map((option) => {
            const optionValue = option.slice(0, 1);
            return `<label class="option-label ${value === optionValue ? "selected" : ""}">
              <input type="radio" name="q${question.id}" value="${optionValue}" data-reading-answer="${question.id}" ${value === optionValue ? "checked" : ""}>
              ${escapeHtml(option)}
            </label>`;
          })
          .join("")}
      </div>`;
    } else {
      body = `<input class="fill-input" type="text" placeholder="Complete the sentence..." value="${escapeAttr(value)}" data-reading-answer="${question.id}">`;
    }

    return `<div class="question-item" id="q-${question.id}">
      <div class="question-text">
        <span class="question-number">${question.id}</span>
        <span>${escapeHtml(question.text)}</span>
      </div>
      ${body}
    </div>`;
  }

  function bindReading(answers) {
    document.querySelectorAll("[data-reading-passage]").forEach((button) => {
      button.addEventListener("click", () => {
        runtime.reading.passage = Number(button.dataset.readingPassage);
        runtime.reading.current = tests.reading.passages[runtime.reading.passage].questions[0].id;
        renderReading();
      });
    });

    document.querySelectorAll("[data-reading-tfng]").forEach((button) => {
      button.addEventListener("click", () => {
        answers[button.dataset.readingTfng] = button.dataset.value;
        saveAnswers("readingAnswers", answers);
        runtime.reading.current = Number(button.dataset.readingTfng);
        renderReading();
      });
    });

    document.querySelectorAll("[data-reading-answer]").forEach((input) => {
      const eventName = input.type === "radio" ? "change" : "input";
      input.addEventListener(eventName, () => {
        const questionId = input.dataset.readingAnswer;
        answers[questionId] = input.value;
        saveAnswers("readingAnswers", answers);
        updateQuestionProgress(answers, 40);
        updateOptionSelection(questionId, input.value);
      });
    });

    document.getElementById("next-reading").addEventListener("click", () => {
      if (runtime.reading.passage < tests.reading.passages.length - 1) {
        runtime.reading.passage += 1;
        runtime.reading.current = tests.reading.passages[runtime.reading.passage].questions[0].id;
        renderReading();
      } else {
        finishReading(false);
      }
    });

    bindQuestionNav((questionNumber) => {
      runtime.reading.current = questionNumber;
      runtime.reading.passage = passageIndexForQuestion(questionNumber);
      renderReading();
      scrollToQuestion(questionNumber);
    });
  }

  function passageIndexForQuestion(questionNumber) {
    return tests.reading.passages.findIndex((passage) =>
      passage.questions.some((question) => question.id === questionNumber)
    );
  }

  function finishReading(auto) {
    const session = ensureSession();
    if (!session) return;
    const answers = session.readingAnswers || {};
    const answered = answerCount(answers);

    if (!auto && !window.confirm(`Submit Reading? You answered ${answered} of 40 questions.`)) {
      return;
    }

    markSectionEnd(session, "reading");
    session.readingAnswers = answers;
    addCompletedSection(session, "reading");
    saveSession(session);
    window.location.href = "/test/writing";
  }

  function enterWriting() {
    const session = ensureSession();
    if (!session) return;
    markSectionStart(session, "writing");
    ensureWritingDefaults(session);
    saveSession(session);
    runtime.writing = { task: 0, phase: "writing" };
    renderWriting();
  }

  function renderWriting() {
    const session = ensureSession();
    if (!session) return;
    ensureWritingDefaults(session);

    const examSet = getSessionExamSet(session);
    const tasks = getWritingTasks(examSet);
    const task = tasks[runtime.writing.task];
    const data = session.writingData;
    const taskKey = runtime.writing.task === 0 ? "task1" : "task2";
    const activeText = data[taskKey].text || "";
    const activeWordCount = countWords(activeText);

    renderPage(
      `<div style="max-width: 900px; margin: 0 auto; padding: 24px 24px 80px;">
        <div style="background: linear-gradient(135deg, var(--navy-dark), var(--navy)); border-radius: 16px; color: white; padding: 20px 28px; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
            <div>
              <h2 style="font-family: Playfair Display, serif; font-size: 1.4rem;">Writing Test</h2>
              <p style="opacity: 0.8; font-size: 0.875rem; margin-top: 4px;">IELTS Academic | 2 Tasks | 60 Minutes | ${escapeHtml(examSet.title)}</p>
            </div>
            <div style="background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.24); border-radius: 8px; padding: 8px 14px; font-size: 0.82rem;">
              Auto-estimated from completion
            </div>
          </div>
          <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
            ${tasks
              .map(
                (item, index) => `<button data-writing-task="${index}" style="${sectionTabStyle(runtime.writing.task === index, true)}">
                  ${escapeHtml(item.title)}
                </button>`
              )
              .join("")}
          </div>
        </div>

        ${renderWritingPhase(task, activeText, activeWordCount, examSet)}
      </div>`,
      {
        timer: {
          duration: tests.writing.duration,
          startedAt: session.sectionTimes.writing?.start,
          label: "Writing",
          onTimeUp: () => submitWriting(true),
        },
      }
    );

    bindWriting();
  }

  function renderWritingPhase(task, activeText, activeWordCount, examSet) {
    return `<div style="background: white; border-radius: 16px; box-shadow: var(--shadow-md); border: 1px solid var(--border); overflow: hidden;">
      <div style="padding: 24px 28px; border-bottom: 1px solid var(--border); background: #fafbfc;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;">
          <span style="background: var(--navy); color: white; padding: 4px 12px; border-radius: 100px; font-size: 0.78rem; font-weight: 600;">
            ${task.type === "task1" ? "TASK 1" : "TASK 2"}
          </span>
          <span style="background: var(--gold-light); border: 1px solid var(--gold); color: var(--warning); padding: 4px 12px; border-radius: 100px; font-size: 0.78rem;">
            Recommended: ${task.timeRecommended} minutes
          </span>
          <span style="background: var(--navy-light); color: var(--navy); padding: 4px 12px; border-radius: 100px; font-size: 0.78rem; border: 1px solid var(--border);">
            Min. ${task.wordLimit} words
          </span>
        </div>

        ${
          task.type === "task1"
            ? `<div class="chart-display">
                <div style="margin-bottom: 10px; font-weight: 600; color: var(--navy);">${escapeHtml(examSet.task1Title)}</div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; max-width: 600px; margin: 0 auto;">
                  ${examSet.chartRows
                    .map(
                      ([label, start, end, color]) => `<div style="padding: 12px; background: white; border-radius: 8px; border: 2px solid ${color}; text-align: center;">
                        <div style="font-weight: 700; color: ${color}; font-size: 0.85rem; margin-bottom: 4px;">${escapeHtml(label)}</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary);">Start: <strong>${escapeHtml(start)}</strong></div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary);">End: <strong>${escapeHtml(end)}</strong></div>
                      </div>`
                    )
                    .join("")}
                </div>
              </div>`
            : ""
        }

        <div class="writing-prompt">${escapeHtml(task.prompt)}</div>
        <div class="writing-instruction"><strong>Instructions:</strong> ${escapeHtml(task.instruction)}</div>
      </div>

      <div style="padding: 28px;">
        <textarea id="writing-text" placeholder="${task.type === "task1" ? "Begin your response here..." : "Begin your essay here..."}" style="width: 100%; min-height: ${task.type === "task1" ? "300px" : "450px"}; padding: 16px; border-radius: 8px; border: 1.5px solid var(--border); font-size: 0.95rem; line-height: 1.8; resize: vertical; font-family: DM Sans, sans-serif; outline: none;">${escapeHtml(activeText)}</textarea>
        ${renderWordCountBadge(activeWordCount, task.wordLimit)}
      </div>

      <div style="padding: 0 28px 28px; display: flex; justify-content: flex-end; gap: 12px;">
        ${
          runtime.writing.task === 0
            ? `<button class="btn btn-primary" id="continue-task-2">Continue to Task 2</button>`
            : `<button class="btn btn-gold" id="submit-writing">Submit Complete Test &amp; View Results</button>`
        }
      </div>
    </div>`;
  }

  function renderWordCountBadge(count, minimum) {
    const status = count >= minimum ? `Minimum met (${minimum}+)` : `${minimum - count} more words needed`;
    const className = count >= minimum ? "met" : count >= minimum * 0.8 ? "warning" : "";
    return `<div class="word-count-bar">
      <span>Word count: <span id="word-count-current" class="count ${className}">${count}</span></span>
      <span id="word-count-message" style="color: var(--text-muted); font-size: 0.8rem;">${status}</span>
    </div>`;
  }

  function bindWriting() {
    document.querySelectorAll("[data-writing-task]").forEach((button) => {
      button.addEventListener("click", () => {
        runtime.writing.task = Number(button.dataset.writingTask);
        renderWriting();
      });
    });

    const textarea = document.getElementById("writing-text");
    if (textarea) {
      textarea.addEventListener("input", () => {
        const session = loadSession();
        const key = runtime.writing.task === 0 ? "task1" : "task2";
        const wordCount = countWords(textarea.value);
        session.writingData[key] = { text: textarea.value, wordCount };
        saveSession(session);
        updateWordCount(wordCount, getWritingTasks(getSessionExamSet(session))[runtime.writing.task].wordLimit);
      });
    }

    const continueTask = document.getElementById("continue-task-2");
    if (continueTask) {
      continueTask.addEventListener("click", () => {
        runtime.writing.task = 1;
        renderWriting();
      });
    }

    const submit = document.getElementById("submit-writing");
    if (submit) {
      submit.addEventListener("click", () => submitWriting(false));
    }
  }

  function updateWordCount(count, minimum) {
    const countElement = document.getElementById("word-count-current");
    const message = document.getElementById("word-count-message");
    if (!countElement || !message) return;

    countElement.textContent = count;
    countElement.className = `count ${count >= minimum ? "met" : count >= minimum * 0.8 ? "warning" : ""}`;
    message.textContent = count >= minimum ? `Minimum met (${minimum}+)` : `${minimum - count} more words needed`;
  }

  async function submitWriting(auto) {
    const session = ensureSession();
    if (!session) return;

    ensureWritingDefaults(session);
    refreshWritingCounts(session);

    if (!auto) {
      const task1Words = session.writingData.task1.wordCount;
      const task2Words = session.writingData.task2.wordCount;
      if (!window.confirm(`Submit complete test?\n\nTask 1 words: ${task1Words}\nTask 2 words: ${task2Words}`)) {
        return;
      }
    }

    markSectionEnd(session, "writing");
    session.testEndTime = Date.now();
    addCompletedSection(session, "writing");
    saveSession(session);

    renderPage(
      `<div style="text-align: center; padding: 120px 24px;">
        <h2 style="color: var(--navy); margin-bottom: 8px;">Calculating Your Results</h2>
        <p style="color: var(--text-secondary);">Submitting answers to the Python scoring API...</p>
      </div>`
    );

    try {
      const results = await submitSession(session);
      results.schemaVersion = RESULTS_VERSION;
      localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
      window.location.href = "/results";
    } catch (error) {
      renderError("Could not submit the test.", error.message);
    }
  }

  async function enterResults() {
    renderPage(
      `<div style="text-align: center; padding: 120px 24px;">
        <h2 style="color: var(--navy); margin-bottom: 8px;">Calculating Your Results</h2>
        <p style="color: var(--text-secondary);">Preparing your band scores and answer review...</p>
      </div>`
    );

    const stored = localStorage.getItem(RESULTS_KEY);
    if (stored) {
      try {
        const cachedResults = JSON.parse(stored);
        if (cachedResults.schemaVersion === RESULTS_VERSION) {
          return renderResults(cachedResults);
        }
        localStorage.removeItem(RESULTS_KEY);
      } catch (error) {
        localStorage.removeItem(RESULTS_KEY);
      }
    }

    const session = loadSession();
    if (!session) {
      window.location.replace("/");
      return;
    }

    session.testEndTime = session.testEndTime || Date.now();
    refreshWritingCounts(session);
    saveSession(session);

    try {
      const results = await submitSession(session);
      results.schemaVersion = RESULTS_VERSION;
      localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
      renderResults(results);
    } catch (error) {
      renderError("Could not retrieve results.", error.message);
    }
  }

  function renderResults(results) {
    const scores = results.scores;
    const timing = results.timing;
    const examSet = getExamSetById(results.examSet?.id || loadSession()?.examSetId);

    renderPage(
      `<div class="results-hero">
        <div class="badge" style="background: rgba(200,168,75,0.2); border: 1px solid var(--gold); color: var(--gold);">
          Test Complete - ${escapeHtml(examSet.title)}
        </div>
        <h1 style="font-size: clamp(1.8rem, 4vw, 2.8rem); margin-top: 16px;">Your IELTS Results</h1>
        <p style="opacity: 0.85; margin-top: 8px; margin-bottom: 0;">
          ${escapeHtml(examSet.focus)} | ${escapeHtml(examSet.level)} | Submitted ${escapeHtml(formatDate(results.submittedAt))}
        </p>
        <div class="band-score-display">
          <div class="band-score-number">${scores.overall.band}</div>
          <div class="band-score-label">Overall Band Score</div>
          <div style="margin-top: 8px; padding: 4px 14px; border-radius: 100px; font-size: 0.85rem; font-weight: 600; background: rgba(200,168,75,0.2); border: 1px solid rgba(200,168,75,0.4); color: var(--gold);">
            ${escapeHtml(scores.overall.descriptor.label)}
          </div>
        </div>
        <p style="font-size: 0.8rem; opacity: 0.7; max-width: 500px; margin: 0 auto;">${escapeHtml(scores.overall.note)}</p>
      </div>

      <div style="max-width: 1100px; margin: -30px auto 24px; padding: 0 24px; position: relative; z-index: 1;">
        <div class="timing-card">
          <h3 style="font-size: 1.1rem; color: var(--navy); margin-bottom: 4px;">Time Analytics</h3>
          <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0;">
            How long you spent on each section versus the recommended time
          </p>
          <div class="timing-grid">
            <div class="timing-item">
              <div class="timing-value">${escapeHtml(timing.totalTimeFormatted)}</div>
              <div class="timing-label">Total Test Duration</div>
            </div>
            ${["listening", "reading", "writing"].map((key) => renderTimingItem(key, timing.sections[key])).join("")}
          </div>
        </div>
      </div>

      <div class="results-grid">
        ${renderSectionResult("Listening", scores.listening, results.listeningByPart, "part")}
        ${renderSectionResult("Reading", scores.reading, results.readingByPassage, "passage")}
        ${renderWritingResult(scores.writing)}
      </div>

      <div style="max-width: 1100px; margin: 0 auto 40px; padding: 0 24px;">
        <div style="background: white; border-radius: 16px; border: 1px solid var(--border); padding: 28px; box-shadow: var(--shadow-sm);">
          <h3 style="font-size: 1.1rem; color: var(--navy); margin-bottom: 20px;">IELTS Band Score Reference</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px;">
            ${[
              ["9", "Expert User", 9],
              ["8-8.5", "Very Good User", 8],
              ["7-7.5", "Good User", 7],
              ["6-6.5", "Competent User", 6],
              ["5-5.5", "Modest User", 5],
              ["4-4.5", "Limited User", 4],
            ]
              .map(([band, label, value]) => {
                const desc = descriptorForBand(value);
                return `<div style="padding: 10px 14px; border-radius: 8px; background: ${desc.bg}; border: 1px solid ${desc.color}20;">
                  <div style="font-weight: 700; color: ${desc.color}; font-size: 1.1rem;">${band}</div>
                  <div style="font-size: 0.78rem; color: ${desc.color};">${label}</div>
                </div>`;
              })
              .join("")}
          </div>
        </div>
      </div>

      <div style="text-align: center; padding: 0 24px 80px; display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
        <button class="btn btn-outline btn-lg" id="print-results">Print Results</button>
        <button class="btn btn-primary btn-lg" id="restart-test">Take Another Test</button>
      </div>`
    );

    document.getElementById("print-results").addEventListener("click", () => {
      window.print();
    });

    document.getElementById("restart-test").addEventListener("click", () => {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(RESULTS_KEY);
      window.location.href = "/";
    });
  }

  function renderTimingItem(key, section) {
    const label = titleCase(key);
    const recommended = RECOMMENDED_SECONDS[key];
    if (!section) {
      return `<div class="timing-item">
        <div class="timing-value">N/A</div>
        <div class="timing-label">${label}</div>
      </div>`;
    }

    const diff = section.seconds - recommended;
    const recLabel = `${Math.round(recommended / 60)} min`;
    let status = "On time";
    let color = "var(--success)";

    if (diff > 300) {
      status = `+${Math.floor(diff / 60)}m over`;
      color = "var(--error)";
    } else if (diff < -300) {
      status = `${Math.floor(Math.abs(diff) / 60)}m under`;
      color = "var(--warning)";
    }

    return `<div class="timing-item">
      <div class="timing-value" style="color: var(--navy);">${escapeHtml(section.formatted)}</div>
      <div class="timing-label">${label}</div>
      <div style="font-size: 0.75rem; margin-top: 4px; color: ${color};">
        ${status}<span style="color: var(--text-muted); margin-left: 4px;">(rec. ${recLabel})</span>
      </div>
    </div>`;
  }

  function renderSectionResult(title, score, breakdown, breakdownKey) {
    return `<div class="result-card">
      <div class="result-card-header">
        <h3>${title}</h3>
        <span class="section-band">${score.band}</span>
      </div>
      <div class="result-card-body">
        <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 8px;">
          <span style="color: var(--text-secondary);">Raw Score</span>
          <strong>${score.raw} / ${score.total}</strong>
        </div>
        <div class="score-bar"><div class="score-bar-fill" style="width: ${score.percentage}%;"></div></div>
        <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 14px; gap: 10px;">
          <span>${score.percentage}% correct</span>
          ${descriptorPill(score.descriptor)}
        </div>
        <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 14px;">${escapeHtml(score.feedback)}</p>
        <div style="border-top: 1px solid var(--border); padding-top: 12px;">
          <p style="font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 8px;">By ${title === "Listening" ? "Part" : "Passage"}</p>
          ${breakdown
            .map((item) => {
              const width = item.total ? (item.correct / item.total) * 100 : 0;
              return `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="font-size: 0.78rem; width: 64px; color: var(--text-muted);">${title === "Listening" ? "Part" : "Passage"} ${item[breakdownKey]}</span>
                <div style="flex: 1; height: 4px; background: var(--border); border-radius: 2px; overflow: hidden;">
                  <div style="height: 100%; background: ${item.correct === item.total ? "var(--success)" : "var(--navy)"}; width: ${width}%;"></div>
                </div>
                <span style="font-size: 0.78rem; color: var(--text-secondary); width: 36px; text-align: right;">${item.correct}/${item.total}</span>
              </div>`;
            })
            .join("")}
        </div>
        <details style="margin-top: 12px;">
          <summary class="detail-toggle" style="list-style: none;">View Answer Review</summary>
          <div style="margin-top: 12px; overflow-x: auto;">${renderDetailsTable(score.details)}</div>
        </details>
      </div>
    </div>`;
  }

  function renderWritingResult(score) {
    const details = score.details || {};
    return `<div class="result-card">
      <div class="result-card-header">
        <h3>Writing</h3>
        <span class="section-band">${score.band}</span>
      </div>
      <div class="result-card-body">
        <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 14px;">
          <span style="color: var(--text-secondary);">Estimated Band</span>
          ${descriptorPill(score.descriptor)}
        </div>
        <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 14px;">${escapeHtml(score.feedback)}</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
          ${renderWordCountResult("Task 1 Words", score.wordCounts.task1, 150)}
          ${renderWordCountResult("Task 2 Words", score.wordCounts.task2, 250)}
        </div>
        ${
          details.task1 && details.task2
            ? ["task1", "task2"]
                .map((key, index) => `<div style="margin-bottom: 12px;">
                  <p style="font-size: 0.8rem; font-weight: 600; color: var(--navy); margin-bottom: 8px;">Task ${index + 1} Completion</p>
                  <div style="display: flex; justify-content: space-between; font-size: 0.78rem; padding: 4px 0; border-bottom: 1px solid var(--border);">
                    <span style="color: var(--text-secondary);">Words / minimum</span>
                    <strong>${details[key].wordCount} / ${details[key].minimum}</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.78rem; padding: 4px 0; border-bottom: 1px solid var(--border);">
                    <span style="color: var(--text-secondary);">Status</span>
                    <strong>${escapeHtml(details[key].status)}</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.78rem; padding: 4px 0; border-bottom: 1px solid var(--border);">
                    <span style="color: var(--text-secondary);">Completion estimate</span>
                    <strong>Band ${details[key].band}</strong>
                  </div>
                </div>`)
                .join("")
            : ""
        }
        ${details.method ? `<p style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.5; margin-top: 8px;">${escapeHtml(details.method)}</p>` : ""}
      </div>
    </div>`;
  }

  function renderWordCountResult(label, count, minimum) {
    const met = count >= minimum;
    return `<div style="padding: 10px 14px; background: var(--off-white); border-radius: 8px; border: 1px solid var(--border); text-align: center;">
      <div style="font-size: 0.75rem; color: var(--text-muted);">${label}</div>
      <div style="font-weight: 700; color: ${met ? "var(--success)" : "var(--error)"}; font-size: 1.1rem;">${count}</div>
      <div style="font-size: 0.7rem; color: var(--text-muted);">${met ? "Met" : `Under ${minimum}`}</div>
    </div>`;
  }

  function renderDetailsTable(details) {
    return `<table class="answer-detail-table">
      <thead>
        <tr>
          <th>Q#</th>
          <th>Your Answer</th>
          <th>Correct</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        ${details
          .map(
            (detail) => `<tr class="${detail.isCorrect ? "correct" : "incorrect"}">
              <td>${detail.id}</td>
              <td>${escapeHtml(detail.userAnswer)}</td>
              <td>${escapeHtml(detail.correctAnswer)}</td>
              <td>${detail.isCorrect ? "Correct" : "Incorrect"}</td>
            </tr>`
          )
          .join("")}
      </tbody>
    </table>`;
  }

  function renderQuestionNav(total, answers, current, startFrom = 1) {
    const answered = answerCount(answers);
    return `<div>
      <div style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 8px;">
          <span>Questions</span>
          <span id="question-nav-count" style="font-weight: 600;">${answered}/${total} answered</span>
        </div>
        <div style="height: 4px; background: var(--border); border-radius: 2px; overflow: hidden;">
          <div id="question-nav-progress" style="height: 100%; background: var(--navy); border-radius: 2px; width: ${(answered / total) * 100}%; transition: width 0.3s;"></div>
        </div>
      </div>
      <div class="question-nav">
        ${Array.from({ length: total }, (_, index) => {
          const questionNumber = startFrom + index;
          const isAnswered = hasAnswer(answers, questionNumber);
          const isCurrent = current === questionNumber;
          return `<button type="button" data-qnav="${questionNumber}" class="qnav-btn ${isAnswered ? "answered" : ""} ${isCurrent ? "current" : ""}">
            ${questionNumber}
          </button>`;
        }).join("")}
      </div>
      <div style="margin-top: 12px; font-size: 0.75rem; color: var(--text-muted);">
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; background: var(--navy); border-radius: 2px; display: inline-block;"></span>Answered</span>
          <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; background: var(--gold); border-radius: 2px; display: inline-block;"></span>Current</span>
          <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; background: var(--border); border-radius: 2px; display: inline-block;"></span>Unanswered</span>
        </div>
      </div>
    </div>`;
  }

  function bindQuestionNav(handler) {
    document.querySelectorAll("[data-qnav]").forEach((button) => {
      button.addEventListener("click", () => handler(Number(button.dataset.qnav)));
    });
  }

  function updateQuestionProgress(answers, total) {
    const answered = answerCount(answers);
    const answeredCount = document.getElementById("answered-count");
    const navCount = document.getElementById("question-nav-count");
    const progress = document.getElementById("question-nav-progress");

    if (answeredCount) answeredCount.textContent = `${answered}/${total}`;
    if (navCount) navCount.textContent = `${answered}/${total} answered`;
    if (progress) progress.style.width = `${(answered / total) * 100}%`;

    document.querySelectorAll("[data-qnav]").forEach((button) => {
      const questionNumber = button.dataset.qnav;
      button.classList.toggle("answered", hasAnswer(answers, questionNumber));
    });
  }

  function updateOptionSelection(questionId, value) {
    document.querySelectorAll(`input[name="q${questionId}"]`).forEach((input) => {
      input.closest(".option-label")?.classList.toggle("selected", input.value === value && input.checked);
    });
  }

  function scrollToQuestion(questionNumber) {
    window.setTimeout(() => {
      document.getElementById(`q-${questionNumber}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }

  function startTimer({ duration, startedAt, label, onTimeUp }) {
    const timer = document.getElementById("exam-timer");
    const value = document.getElementById("timer-value");
    if (!timer || !value) return;

    const timerStartedAt = startedAt || Date.now();

    const tick = () => {
      const elapsed = Math.floor((Date.now() - timerStartedAt) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      value.textContent = formatClock(remaining);
      timer.classList.toggle("warning", remaining <= 300 && remaining > 60);
      timer.classList.toggle("critical", remaining <= 60);
      timer.querySelector(".timer-label").textContent = label || "Time Remaining";

      if (remaining <= 0) {
        clearTimer();
        onTimeUp?.();
      }
    };

    timerId = window.setInterval(tick, 500);
    tick();
  }

  function clearTimer() {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function renderExamSetCard(examSet, selectedId) {
    const isSelected = examSet.id === selectedId;
    return `<button type="button" data-exam-set="${examSet.id}" style="text-align: left; background: white; border: 2px solid ${isSelected ? examSet.accent : "var(--border)"}; border-radius: 12px; padding: 16px; box-shadow: ${isSelected ? "var(--shadow-md)" : "var(--shadow-sm)"}; cursor: pointer;">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 10px;">
        <span style="font-weight: 700; color: var(--navy);">${escapeHtml(examSet.title)}</span>
        <span style="width: 12px; height: 12px; border-radius: 50%; background: ${examSet.accent}; display: inline-block;"></span>
      </div>
      <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 10px; min-height: 38px;">${escapeHtml(examSet.focus)}</p>
      <div style="display: flex; gap: 6px; flex-wrap: wrap;">
        <span class="meta-tag">${escapeHtml(examSet.level)}</span>
        <span class="meta-tag">L/R/W</span>
      </div>
    </button>`;
  }

  function selectExamSet(examSetId) {
    localStorage.setItem(SELECTED_SET_KEY, getExamSetById(examSetId).id);
  }

  function getSelectedExamSet() {
    return getExamSetById(localStorage.getItem(SELECTED_SET_KEY));
  }

  function getSessionExamSet(session = loadSession()) {
    return getExamSetById(session?.examSetId || localStorage.getItem(SELECTED_SET_KEY));
  }

  function getExamSetById(examSetId) {
    return EXAM_SETS.find((examSet) => examSet.id === examSetId) || EXAM_SETS[0];
  }

  function getWritingTasks(examSet) {
    return tests.writing.tasks.map((task, index) => ({
      ...task,
      prompt: index === 0 ? examSet.task1Prompt : examSet.task2Prompt,
      chartDescription: index === 0 ? examSet.task1Title : task.chartDescription,
    }));
  }

  function getResumePath(session) {
    if (!session) return "/";
    const completed = session.completedSections || [];
    if (!completed.includes("listening")) return "/test/listening";
    if (!completed.includes("reading")) return "/test/reading";
    if (!completed.includes("writing")) return "/test/writing";
    return "/results";
  }

  function startFullTest(nextPath, examSetId) {
    const examSet = getExamSetById(examSetId);
    selectExamSet(examSet.id);
    const session = {
      sessionId: getUuid(),
      examSetId: examSet.id,
      examSetTitle: examSet.title,
      testStartTime: Date.now(),
      sectionTimes: {},
      listeningAnswers: {},
      readingAnswers: {},
      writingData: {},
      completedSections: [],
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.removeItem(RESULTS_KEY);
    window.location.href = nextPath || "/instructions";
  }

  function loadSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (error) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  function saveSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function ensureSession() {
    const session = loadSession();
    if (!session) {
      window.location.replace("/");
      return null;
    }
    session.sectionTimes = session.sectionTimes || {};
    session.completedSections = session.completedSections || [];
    session.examSetId = session.examSetId || getSelectedExamSet().id;
    session.examSetTitle = session.examSetTitle || getExamSetById(session.examSetId).title;
    return session;
  }

  function markSectionStart(session, key) {
    session.sectionTimes = session.sectionTimes || {};
    if (!session.sectionTimes[key] || session.sectionTimes[key].end) {
      session.sectionTimes[key] = { start: Date.now() };
    } else if (!session.sectionTimes[key].start) {
      session.sectionTimes[key].start = Date.now();
    }
    saveSession(session);
  }

  function markSectionEnd(session, key) {
    session.sectionTimes = session.sectionTimes || {};
    session.sectionTimes[key] = session.sectionTimes[key] || { start: Date.now() };
    session.sectionTimes[key].end = Date.now();
  }

  function addCompletedSection(session, key) {
    session.completedSections = session.completedSections || [];
    if (!session.completedSections.includes(key)) {
      session.completedSections.push(key);
    }
  }

  function saveAnswers(key, answers) {
    const session = loadSession();
    if (!session) return;
    session[key] = answers;
    saveSession(session);
  }

  function ensureWritingDefaults(session) {
    session.writingData = session.writingData || {};
    session.writingData.task1 = session.writingData.task1 || { text: "", wordCount: 0 };
    session.writingData.task2 = session.writingData.task2 || { text: "", wordCount: 0 };

    refreshWritingCounts(session);
  }

  function refreshWritingCounts(session) {
    if (!session.writingData) return;
    ["task1", "task2"].forEach((key) => {
      session.writingData[key] = session.writingData[key] || { text: "", wordCount: 0 };
      session.writingData[key].wordCount = countWords(session.writingData[key].text || "");
    });
  }

  async function submitSession(session) {
    return fetchJson("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: session.sessionId,
        testStartTime: session.testStartTime,
        testEndTime: session.testEndTime || Date.now(),
        sectionTimes: session.sectionTimes || {},
        listeningAnswers: session.listeningAnswers || {},
        readingAnswers: session.readingAnswers || {},
        writingData: session.writingData || {},
        examSet: {
          id: getSessionExamSet(session).id,
          title: getSessionExamSet(session).title,
          focus: getSessionExamSet(session).focus,
          level: getSessionExamSet(session).level,
        },
      }),
    });
  }

  async function fetchJson(url, options) {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }
    return data;
  }

  function renderError(title, detail) {
    renderPage(
      `<div style="text-align: center; padding: 120px 24px;">
        <h2 style="color: var(--navy); margin-bottom: 8px;">${escapeHtml(title)}</h2>
        <p style="color: var(--text-secondary); margin-bottom: 24px;">${escapeHtml(detail || "")}</p>
        <a class="btn btn-primary" href="/">Back to Home</a>
      </div>`
    );
  }

  function answerCount(answers) {
    return Object.values(answers || {}).filter((value) => value !== undefined && value !== null && String(value).trim() !== "").length;
  }

  function hasAnswer(answers, questionId) {
    const value = (answers || {})[questionId];
    return value !== undefined && value !== null && String(value).trim() !== "";
  }

  function countWords(text) {
    const trimmed = String(text || "").trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }

  function formatClock(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value || "";
    return date.toLocaleString();
  }

  function descriptorPill(descriptor) {
    return `<span style="padding: 2px 8px; border-radius: 4px; background: ${descriptor.bg}; color: ${descriptor.color}; font-weight: 600;">
      ${escapeHtml(descriptor.label)}
    </span>`;
  }

  function descriptorForBand(band) {
    if (band >= 9) return { label: "Expert User", color: "#1a7f37", bg: "#d1fae5" };
    if (band >= 8) return { label: "Very Good User", color: "#1d6f42", bg: "#dcfce7" };
    if (band >= 7) return { label: "Good User", color: "#2d6a4f", bg: "#d8f3dc" };
    if (band >= 6) return { label: "Competent User", color: "#b45309", bg: "#fef3c7" };
    if (band >= 5) return { label: "Modest User", color: "#c2410c", bg: "#ffedd5" };
    if (band >= 4) return { label: "Limited User", color: "#b91c1c", bg: "#fee2e2" };
    return { label: "Intermittent User", color: "#7f1d1d", bg: "#fee2e2" };
  }

  function sectionTabStyle(active, subtle = false) {
    if (active) {
      return "padding: 8px 16px; border-radius: 8px; border: none; font-size: 0.85rem; cursor: pointer; font-weight: 600; background: var(--gold); color: var(--navy-dark);";
    }
    return `padding: 8px 16px; border-radius: 8px; border: none; font-size: 0.85rem; cursor: pointer; font-weight: 500; background: ${
      subtle ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.15)"
    }; color: rgba(255,255,255,0.85);`;
  }

  function titleCase(value) {
    return String(value || "").slice(0, 1).toUpperCase() + String(value || "").slice(1);
  }

  function getUuid() {
    if (window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }
    return "session-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }
})();
