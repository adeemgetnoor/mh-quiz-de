"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import QuizForm from "./components/QuizForm";

export default function Home() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  const handleQuizComplete = (results) => {
    setQuizResults(results);
    setQuizCompleted(true);

    // Redirect to Shopify page with results
    const redirectUrl = `https://maharishiayurveda.nl/pages/dosha-result?first_name=${results.first_name}&vata_score=${results.vata_score}&pitta_score=${results.pitta_score}&kapha_score=${results.kapha_score}`;
    window.location.href = redirectUrl;
  };

  return (
    <div>
      <main>
        {!quizCompleted && <QuizForm onComplete={handleQuizComplete} />}

        {quizCompleted && (
          <div className="completion-message">
            <h2>Quiz Completed!</h2>
            <p>Redirecting to your results...</p>
          </div>
        )}
      </main>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "Poppins", sans-serif;
          background: #fff7ed;
        }

        .completion-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
        }

        .completion-message h2 {
          font-family: "Playfair Display", serif;
          color: #a37c32;
          margin-bottom: 20px;
        }
        
        .completion-message p{
          color:black;
        }
      `}</style>
    </div>
  );
}
