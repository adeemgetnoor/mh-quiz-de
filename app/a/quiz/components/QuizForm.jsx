"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quizQuestions } from "@/lib/quiz-data";
import styles from "./QuizForm.module.css";
import Image from "next/image";

const QuizForm = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    month: "",
    day: "",
    year: "",
  });
  const [scores, setScores] = useState({
    vata: 0,
    pitta: 0,
    kapha: 0,
  });
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState(1);

  const allQuestions = [
    ...quizQuestions.vata,
    ...quizQuestions.pitta,
    ...quizQuestions.kapha,
  ];

  const isFormStep = currentStep === 0;
  const currentQuestion = allQuestions[currentStep - 1];

  const slideVariants = {
    enter: (direction) => ({
      y: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      y: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setDirection(1);
      setCurrentStep(1);
    }
  };

  const validateForm = () => {
    return (
      formData.name &&
      formData.email &&
      formData.phone &&
      formData.month &&
      formData.day &&
      formData.year
    );
  };

  const handleAnswer = (questionId, value, category) => {
    const numValue = parseInt(value);
    const prevAnswer = answers[questionId] || 0;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: numValue,
    }));

    setScores((prev) => ({
      ...prev,
      [category]: prev[category] - prevAnswer + numValue,
    }));

    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentStep < allQuestions.length) {
        setDirection(1);
        setCurrentStep((prev) => prev + 1);
      } else {
        // Quiz completed
        submitQuiz();
      }
    }, 800);
  };
  const submitQuiz = async () => {
    const quizData = {
      ...formData,
      scores,
      answers,
      completedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("/a/quiz/api/submit-quiz/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });

      if (response.ok) {
        const result = await response.json();
        onComplete(result);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentStep < allQuestions.length) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className={styles["quiz-container"]}>
      {!isFormStep && (
        <div className={styles["quiz-header"]}>
          <div className={styles["score-display"]}>
            {currentQuestion && currentQuestion.category === "vata" ? (
              <div className={styles["score-item"]}>
                <span>Jouw vata: {scores.vata}</span>
              </div>
            ) : currentQuestion.category === "pitta" ? (
              <div className={styles["score-item"]}>
                <span>Jouw pitta: {scores.pitta}</span>
              </div>
            ) : (
              <div className={styles["score-item"]}>
                <span>Jouw kapha: {scores.kapha}</span>
              </div>
            )}
          </div>
        </div>
      )}
      <AnimatePresence mode="wait" custom={direction}>
        {isFormStep ? (
          <motion.div
            key="form"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className={styles["form-step"]}
          >
            <div className={styles["form-container"]}>
              <a href="https://maharishiayurveda.nl/">
                <div className={styles["form-image"]}>
                  <div className={styles["background-image"]}>
                    <img
                      src="https://cdn.shopify.com/s/files/1/0706/9771/3942/files/Group_216587_2x_538d73b5-f5f6-4e28-8c75-2999cfe868f1_100x.png?v=1673676406"
                      alt="Maharishi Ayurveda Logo"
                    />
                  </div>
                </div>
              </a>
              <div className={styles["form-content"]}>
                <form
                  onSubmit={handleFormSubmit}
                  className={styles["quiz-form"]}
                >
                  <div className={styles["form-group"]}>
                    <label>Voornaam(name)</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Voer uw naam in"
                      required
                    />
                  </div>

                  <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                      <label>E-mailadres</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="e-mailadres"
                        required
                      />
                    </div>
                    <div className={styles["form-group"]}>
                      <label>Telefoonnummer</label>
                      <input
                        type="number"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="Telefoonnummer"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles["form-group"]}>
                    <label>Geboortedatum</label>
                    <div className={styles["date-inputs"]}>
                      <select
                        value={formData.month}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            month: e.target.value,
                          }))
                        }
                        required
                      >
                        <option value="">Maand</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {new Date(0, i).toLocaleString("nl", {
                              month: "long",
                            })}
                          </option>
                        ))}
                      </select>
                      <select
                        value={formData.day}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            day: e.target.value,
                          }))
                        }
                        required
                      >
                        <option value="">Dag</option>
                        {Array.from({ length: 31 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      <select
                        value={formData.year}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            year: e.target.value,
                          }))
                        }
                        required
                      >
                        <option value="">Jaar</option>
                        {Array.from({ length: 80 }, (_, i) => {
                          const year = new Date().getFullYear() - 18 - i;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <button type="submit" className={styles["submit-btn"]}>
                    Verder
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`question-${currentStep}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className={styles["question-step"]}
          >
            {currentQuestion && (
              <div className={styles["question-container"]}>
                <div className={styles["question-header"]}>
                  <h3>
                    {currentQuestion.category === "vata" &&
                      "Bepaal je Vata dosha"}
                    {currentQuestion.category === "pitta" &&
                      "Bepaal je Pitta dosha"}
                    {currentQuestion.category === "kapha" &&
                      "Bepaal je Kapha dosha"}
                  </h3>
                  <p>Gelieve te kiezen wat het meest van toepassing is.</p>
                </div>

                <div className={styles["question-content"]}>
                  <div className={styles["dosha-icon"]}>
                    <img
                      src="https://mhvaexwo7u.ufs.sh/f/Fe55eoVXdVWt2SR1RGqOxMJULj7pzRThwudclGZNs5oraXqF"
                      alt="Dosha Icon"
                    />
                  </div>
                  <label className={styles["question-text"]}>
                    {currentQuestion.text}
                  </label>

                  <div className={styles["rating-scale"]}>
                    {[6, 5, 4, 3, 2, 1, 0].map((value) => (
                      <button
                        key={value}
                        className={`${styles["rating-button"]} ${
                          answers[currentQuestion.id] === value
                            ? styles["selected"]
                            : ""
                        }`}
                        onClick={() =>
                          handleAnswer(
                            currentQuestion.id,
                            value,
                            currentQuestion.category
                          )
                        }
                      >
                        <div className={styles["rating-circle"]}></div>
                      </button>
                    ))}
                  </div>

                  <div className={styles["rating-labels"]}>
                    <span>Van toepassing</span>
                    <span>Neutral</span>
                    <span>Niet van toepassing</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {!isFormStep && (
        <div className={styles["navigation-buttons"]}>
          <button onClick={goToPrevious} className={styles["nav-btn"]}>
            ←
          </button>
          <button onClick={goToNext} className={styles["nav-btn"]}>
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizForm;
