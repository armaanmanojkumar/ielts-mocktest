from datetime import datetime, timezone


def get_listening_band(raw_score):
    if raw_score >= 39:
        return 9.0
    if raw_score >= 37:
        return 8.5
    if raw_score >= 35:
        return 8.0
    if raw_score >= 32:
        return 7.5
    if raw_score >= 30:
        return 7.0
    if raw_score >= 26:
        return 6.5
    if raw_score >= 23:
        return 6.0
    if raw_score >= 18:
        return 5.5
    if raw_score >= 16:
        return 5.0
    if raw_score >= 13:
        return 4.5
    if raw_score >= 11:
        return 4.0
    if raw_score >= 9:
        return 3.5
    if raw_score >= 7:
        return 3.0
    if raw_score >= 5:
        return 2.5
    return 2.0


def get_reading_band(raw_score):
    if raw_score >= 39:
        return 9.0
    if raw_score >= 37:
        return 8.5
    if raw_score >= 35:
        return 8.0
    if raw_score >= 33:
        return 7.5
    if raw_score >= 30:
        return 7.0
    if raw_score >= 27:
        return 6.5
    if raw_score >= 23:
        return 6.0
    if raw_score >= 19:
        return 5.5
    if raw_score >= 15:
        return 5.0
    if raw_score >= 13:
        return 4.5
    if raw_score >= 10:
        return 4.0
    if raw_score >= 8:
        return 3.5
    if raw_score >= 6:
        return 3.0
    if raw_score >= 4:
        return 2.5
    return 2.0


def get_overall_band(listening, reading, writing, speaking):
    average = (listening + reading + writing + speaking) / 4
    return round(average * 2) / 2


def calculate_writing_band(task1_scores, task2_scores):
    task1_average = _average_scores(task1_scores)
    task2_average = _average_scores(task2_scores)
    combined = (task1_average + (task2_average * 2)) / 3
    return round(combined * 2) / 2


def grade_answers(user_answers, questions):
    correct = 0
    details = []

    for question in questions:
        question_id = question["id"]
        user_answer = user_answers.get(str(question_id), user_answers.get(question_id, ""))
        normalized_user = str(user_answer).strip().lower()
        accepted = question.get("acceptedAnswers") or [question.get("answer", "")]
        is_correct = any(normalized_user == str(answer).lower() for answer in accepted)

        if is_correct:
            correct += 1

        details.append(
            {
                "id": question_id,
                "question": question.get("text", ""),
                "userAnswer": user_answer if str(user_answer) else "(no answer)",
                "correctAnswer": question.get("answer", ""),
                "isCorrect": is_correct,
                "type": question.get("type", ""),
            }
        )

    return {"correct": correct, "total": len(questions), "details": details}


def format_time(seconds):
    seconds = int(seconds or 0)
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60

    if hours > 0:
        return f"{hours}h {minutes}m {secs}s"
    return f"{minutes}m {secs}s"


def get_band_descriptor(band):
    if band <= 0:
        return {"label": "No Attempt", "color": "#4a5568", "bg": "#e2e8f0"}
    if band >= 9.0:
        return {"label": "Expert User", "color": "#1a7f37", "bg": "#d1fae5"}
    if band >= 8.0:
        return {"label": "Very Good User", "color": "#1d6f42", "bg": "#dcfce7"}
    if band >= 7.0:
        return {"label": "Good User", "color": "#2d6a4f", "bg": "#d8f3dc"}
    if band >= 6.0:
        return {"label": "Competent User", "color": "#b45309", "bg": "#fef3c7"}
    if band >= 5.0:
        return {"label": "Modest User", "color": "#c2410c", "bg": "#ffedd5"}
    if band >= 4.0:
        return {"label": "Limited User", "color": "#b91c1c", "bg": "#fee2e2"}
    return {"label": "Intermittent User", "color": "#7f1d1d", "bg": "#fee2e2"}


def generate_feedback(section, band):
    feedbacks = {
        "listening": {
            "high": "Excellent listening skills. You accurately identified key information across all four parts, including complex academic content.",
            "mid": "Good listening ability. Focus on Parts 3 and 4 where academic vocabulary and complex discourse require closer attention.",
            "low": "Develop your ability to follow extended speech. Practice note-taking and identifying signpost language in lectures and conversations.",
        },
        "reading": {
            "high": "Strong reading performance. You successfully handled all question types including True/False/Not Given and sentence completion.",
            "mid": "Solid reading skills. Pay careful attention to True/False/Not Given questions - ensure your answer is based strictly on the text.",
            "low": "Work on reading speed and skimming/scanning techniques. Time management is crucial in the IELTS Reading section.",
        },
        "writing": {
            "high": "Excellent writing. Your responses demonstrate sophisticated vocabulary, complex structures, and clear task achievement.",
            "mid": "Writing response completed. This automatic estimate checks completion and word count only; real IELTS writing still needs detailed examiner judgement.",
            "low": "Focus on completing both writing tasks and meeting the minimum word counts: 150 words for Task 1 and 250 words for Task 2.",
        },
    }

    feedback = feedbacks.get(section)
    if not feedback:
        return ""
    if band <= 0:
        return "No writing response was submitted, so this section is marked as no attempt."
    if band >= 7.0:
        return feedback["high"]
    if band >= 5.5:
        return feedback["mid"]
    return feedback["low"]


def build_results(payload, tests):
    test_start = payload.get("testStartTime")
    test_end = payload.get("testEndTime")
    if not test_start or not test_end:
        raise ValueError("Missing timing data")

    total_time_sec = max(0, int((int(test_end) - int(test_start)) / 1000))
    section_times = payload.get("sectionTimes") or {}

    listening_questions = [
        question
        for part in tests["listening"]["parts"]
        for question in part["questions"]
    ]
    listening_result = grade_answers(payload.get("listeningAnswers") or {}, listening_questions)
    listening_band = get_listening_band(listening_result["correct"])

    reading_questions = [
        question
        for passage in tests["reading"]["passages"]
        for question in passage["questions"]
    ]
    reading_result = grade_answers(payload.get("readingAnswers") or {}, reading_questions)
    reading_band = get_reading_band(reading_result["correct"])

    writing_data = payload.get("writingData") or {}
    writing_result = calculate_writing_completion_band(writing_data)
    writing_band = writing_result["band"]
    writing_details = writing_result["details"]

    overall_band = get_overall_band(
        listening_band,
        reading_band,
        writing_band,
        writing_band,
    )

    result = {
        "sessionId": payload.get("sessionId"),
        "examSet": payload.get("examSet") or {},
        "submittedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "timing": {
            "totalTime": total_time_sec,
            "totalTimeFormatted": format_time(total_time_sec),
            "sections": {
                "listening": _format_section_time(section_times, "listening"),
                "reading": _format_section_time(section_times, "reading"),
                "writing": _format_section_time(section_times, "writing"),
            },
        },
        "scores": {
            "listening": {
                "raw": listening_result["correct"],
                "total": listening_result["total"],
                "percentage": _percentage(listening_result),
                "band": listening_band,
                "descriptor": get_band_descriptor(listening_band),
                "feedback": generate_feedback("listening", listening_band),
                "details": listening_result["details"],
            },
            "reading": {
                "raw": reading_result["correct"],
                "total": reading_result["total"],
                "percentage": _percentage(reading_result),
                "band": reading_band,
                "descriptor": get_band_descriptor(reading_band),
                "feedback": generate_feedback("reading", reading_band),
                "details": reading_result["details"],
            },
            "writing": {
                "band": writing_band,
                "descriptor": get_band_descriptor(writing_band),
                "feedback": generate_feedback("writing", writing_band),
                "details": writing_details,
                "wordCounts": {
                    "task1": (writing_data.get("task1") or {}).get("wordCount", 0),
                    "task2": (writing_data.get("task2") or {}).get("wordCount", 0),
                },
            },
            "overall": {
                "band": overall_band,
                "descriptor": get_band_descriptor(overall_band),
                "note": "Speaking band is not assessed online. Writing is automatically estimated from response completion and word counts.",
            },
        },
        "listeningByPart": _section_breakdown(
            tests["listening"]["parts"],
            "part",
            listening_result["details"],
        ),
        "readingByPassage": _section_breakdown(
            tests["reading"]["passages"],
            "passage",
            reading_result["details"],
        ),
    }

    return result


def _average_scores(scores):
    values = [float(value) for value in scores.values()]
    return sum(values) / len(values) if values else 0


def calculate_writing_completion_band(writing_data):
    task1 = writing_data.get("task1") or {}
    task2 = writing_data.get("task2") or {}

    task1_words = int(task1.get("wordCount") or _count_words(task1.get("text", "")))
    task2_words = int(task2.get("wordCount") or _count_words(task2.get("text", "")))
    task1_band = _completion_task_band(task1_words, 150)
    task2_band = _completion_task_band(task2_words, 250)

    if task1_words == 0 and task2_words == 0:
        combined = 0.0
    else:
        combined = round(((task1_band + (task2_band * 2)) / 3) * 2) / 2

    details = {
        "method": "Automatic completion estimate based on word counts. It does not judge grammar, vocabulary, coherence, or task achievement like a real IELTS examiner.",
        "task1": _writing_task_detail(task1_words, 150, task1_band),
        "task2": _writing_task_detail(task2_words, 250, task2_band),
    }

    return {"band": combined, "details": details}


def _completion_task_band(word_count, minimum):
    if word_count <= 0:
        return 0.0
    ratio = word_count / minimum
    if ratio < 0.2:
        return 2.0
    if ratio < 0.5:
        return 3.0
    if ratio < 0.8:
        return 4.0
    if ratio < 1.0:
        return 5.0
    return 6.0


def _writing_task_detail(word_count, minimum, band):
    if word_count <= 0:
        status = "No response"
    elif word_count < minimum:
        status = f"Under minimum by {minimum - word_count} words"
    else:
        status = "Minimum met"

    return {
        "wordCount": word_count,
        "minimum": minimum,
        "band": band,
        "status": status,
    }


def _count_words(text):
    return len(str(text or "").strip().split()) if str(text or "").strip() else 0


def _format_section_time(section_times, key):
    section = section_times.get(key)
    if not section or not section.get("start") or not section.get("end"):
        return None

    seconds = max(0, int((int(section["end"]) - int(section["start"])) / 1000))
    return {"seconds": seconds, "formatted": format_time(seconds)}


def _percentage(result):
    if not result["total"]:
        return 0
    return round((result["correct"] / result["total"]) * 100)


def _section_breakdown(sections, label, details):
    breakdown = []
    for section in sections:
        ids = {question["id"] for question in section["questions"]}
        section_details = [detail for detail in details if detail["id"] in ids]
        correct = len([detail for detail in section_details if detail["isCorrect"]])
        breakdown.append(
            {
                label: section["id"],
                "title": section["title"],
                "correct": correct,
                "total": len(section["questions"]),
            }
        )
    return breakdown
