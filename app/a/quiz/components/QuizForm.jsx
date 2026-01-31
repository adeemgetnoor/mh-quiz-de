"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PrivacyModal from './PrivacyModal';
import { quizQuestions as originalQuizQuestions } from "@/lib/quiz-data";
import styles from "./QuizForm.module.css";

// --- PLACEHOLDER DATA FOR NEW SECTIONS ---
// Move these into your @/lib/quiz-data.js file so they are imported with the rest
const extraQuizData = {
  ama: [
    { id: 'a1', text: 'It takes me a while to feel awake & clear after I get up in the morning.', category: 'ama' },
    { id: 'a2', text: 'I often feel heavy or lethargic after meals.', category: 'ama' },
    { id: 'a3', text: 'My tongue tends to have a thick white coating.', category: 'ama' },
  ],
  // Priority is a single step containing multiple options
  priority: {
    id: 'final_priority',
    text: 'What is your topmost health and wellness priority, currently?',
    category: 'priority',
    options: [
        { id: 'p_digest', title: 'Digestive Balance & Gut Harmony', desc: 'Supports digestion and natural appetite for lightness, energy, and overall vitality.' },
        { id: 'p_detox', title: 'Natural Detox & Cleanse', desc: 'Aids natural cleansing and toxin release for a light, clear, and vibrant feeling.' },
        { id: 'p_joint', title: 'Joint & Muscle Ease', desc: 'Enhances flexibility and eases stiffness for smooth, strain-free movement.' },
        { id: 'p_rest', title: 'Blissful Rest & Holistic Relaxation', desc: 'Helps body and mind unwind for deep, restorative rest and morning clarity.' },
        { id: 'p_respiratory', title: 'Respiratory Strength & Seasonal Resilience', desc: 'Boosts natural resistance to seasonal changes, coughs, and allergies.' },
        { id: 'p_skin', title: 'Skin, Hair & Natural Radiance', desc: 'Nourishes and balances skin and hair for radiant, holistic beauty.' },
        { id: 'p_stress', title: 'Daily Stress Support & Mental Clarity', desc: 'Calms restlessness, grounds the mind, and improves focus and resilience.' },
        { id: 'p_energy', title: 'Energy & Vitality', desc: 'Sustains steady physical, mental, and emotional energy through natural balance.' },
        { id: 'p_other', title: 'Other:', desc: 'Please specify', isOther: true }
    ]
  }
};

// Merge existing data with new data
const quizQuestions = { ...originalQuizQuestions, ...extraQuizData };

// --- Icons ---
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A3B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const NavArrowLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const NavArrowRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

// --- Donut Chart Component ---
const DonutChart = () => {
  // SVG Path logic for 4 segments
  // Center: 100,100 | Radius: 80 | Stroke: 40
  // Circumference ~ 502
  
  // Segment approximations to match image visual weight
  // Part 1 A (Dark): ~35%
  // Part 1 B (Med): ~22%
  // Part 1 C (Light): ~23%
  // Part 2 (Gray): ~20%
  
  return (
    <div className={styles.chartWrapper}>
      <svg viewBox="0 0 400 400" className={styles.donutSvg}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3E3025" />
          </marker>
        </defs>

        {/* Part 1 A - Vata (Left/Dark) */}
        <path 
          d="M 200 200 L 100 200 A 100 100 0 0 1 234 106 L 200 200" 
          fill="#8D7B6F" 
          transform="rotate(-25 200 200)" /* Adjust rotation to match image position */
          stroke="#FFF9F0" strokeWidth="2"
        />
        
        {/* Part 1 B - Pitta (Top/Medium) */}
        <path 
          d="M 200 200 L 234 106 A 100 100 0 0 1 300 200 L 200 200" 
          fill="#B09685" 
          transform="rotate(-40 200 200)"
          stroke="#FFF9F0" strokeWidth="2"
        />

        {/* Part 1 C - Kapha (Right/Light) */}
        <path 
          d="M 200 200 L 300 200 A 100 100 0 0 1 200 300 L 200 200" 
          fill="#D1BFB0" 
          transform="rotate(-20 200 200)"
          stroke="#FFF9F0" strokeWidth="2"
        />

         {/* Part 2 - Ama (Bottom/Gray) */}
         <path 
          d="M 200 200 L 200 300 A 100 100 0 0 1 100 200 L 200 200" 
          fill="#E0D8D0" 
          transform="rotate(-5 200 200)"
          stroke="#FFF9F0" strokeWidth="2"
        />

        {/* Inner Circle to make it a Donut */}
        <circle cx="200" cy="200" r="55" fill="#FFF9F0" />
      </svg>
      
      {/* Labels Inside the Donut */}
      <div className={styles.chartLabelInner} style={{ top: '42%', left: '22%' }}>Part 1 • A</div>
      <div className={styles.chartLabelInner} style={{ top: '22%', left: '55%' }}>Part 1 • B</div>
      <div className={styles.chartLabelInner} style={{ top: '45%', left: '72%' }}>Part 1 • C</div>
      <div className={styles.chartLabelInner} style={{ top: '70%', left: '45%' }}>Part 2</div>

      {/* External Labels & Pointers */}
      {/* Vata */}
      <div className={styles.pointerGroup} style={{ top: '35%', left: '-10%' }}>
         <span className={styles.pointerText}>Vata Dosha</span>
         <div className={styles.pointerLine} style={{ width: '60px', transform: 'rotate(30deg)', transformOrigin: 'right bottom' }}></div>
      </div>
      
       {/* Pitta */}
       <div className={styles.pointerGroup} style={{ top: '10%', right: '0%' }}>
         <span className={styles.pointerText} style={{marginBottom: '5px'}}>Pitta Dosha</span>
         <div className={styles.pointerLine} style={{ width: '40px', transform: 'rotate(120deg)', transformOrigin: 'left bottom', marginLeft: '10px' }}></div>
      </div>

       {/* Kapha */}
       <div className={styles.pointerGroup} style={{ top: '55%', right: '-10%' }}>
         <div className={styles.pointerLine} style={{ width: '50px', transform: 'rotate(300deg)', transformOrigin: 'left top', marginBottom: '5px' }}></div>
         <span className={styles.pointerText}>Kapha Dosha</span>
      </div>

       {/* Ama */}
       <div className={styles.pointerGroup} style={{ bottom: '5%', left: '40%' }}>
         <div className={styles.pointerLine} style={{ width: '50px', transform: 'rotate(240deg)', transformOrigin: 'left top', marginLeft:'40px' }}></div>
         <span className={styles.pointerText}>Ama (Toxin) Level</span>
      </div>
    </div>
  );
};


const QuizForm = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    title: "Mr.", firstName: "", lastName: "", email: "", phone: "", dob: "", agreeMarketing: false, agreeTerms: false,
  });

  // Scores & Answers State
  const [scores, setScores] = useState({ vata: 0, pitta: 0, kapha: 0, ama: 0 });
  const [answers, setAnswers] = useState({});
  
  // Priority State (New)
  const [prioritySelections, setPrioritySelections] = useState({});
  const [otherPriorityText, setOtherPriorityText] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);

  // --- CALCULATE FLOW BOUNDARIES ---
  // We use useMemo so this doesn't recalculate on every render
  const flow = useMemo(() => {
      const doshaQs = [...quizQuestions.vata, ...quizQuestions.pitta, ...quizQuestions.kapha];
      const amaQs = quizQuestions.ama;
      
      const doshaCount = doshaQs.length;
      const amaCount = amaQs.length;

      // Define specific step numbers for interstitials
      const step_Form = 0;
      const step_DoshaIntro = 1;
      // Steps 2 to (1 + doshaCount) are Dosha Qs
      const step_AmaIntro = 2 + doshaCount;
      // Steps (step_AmaIntro + 1) to (step_AmaIntro + amaCount) are Ama Qs
      const step_PriorityIntro = step_AmaIntro + amaCount + 1;
      const step_PrioritySelection = step_PriorityIntro + 1;
      const totalStepsCount = step_PrioritySelection + 1; // Used for progress bar calculation

      // Milestones for progress bar dots (Indices relative to the total question count)
      // Vata starts at Q index 0
      const milestone_Pitta = quizQuestions.vata.length;
      const milestone_Kapha = milestone_Pitta + quizQuestions.pitta.length;
      const milestone_Ama = milestone_Kapha + quizQuestions.kapha.length;
      const milestone_Priority = milestone_Ama + amaCount; // The final checkbox section acts as one "big question"

      return {
          doshaQuestions: doshaQs,
          amaQuestions: amaQs,
          priorityQuestion: quizQuestions.priority,
          steps: {
            form: step_Form,
            doshaIntro: step_DoshaIntro,
            amaIntro: step_AmaIntro,
            priorityIntro: step_PriorityIntro,
            prioritySelection: step_PrioritySelection,
            last: step_PrioritySelection
          },
          milestones: [0, milestone_Pitta, milestone_Kapha, milestone_Ama, milestone_Priority],
          totalScorableItems: milestone_Priority + 1 // Total questions + 1 for priority page
      };
  }, []);

  // --- HELPER BOOLEANS FOR CURRENT STATE ---
  const isFormStep = currentStep === flow.steps.form;
  const isDoshaIntroStep = currentStep === flow.steps.doshaIntro;
  const isDoshaQuestionStep = currentStep > flow.steps.doshaIntro && currentStep < flow.steps.amaIntro;
  const isAmaIntroStep = currentStep === flow.steps.amaIntro;
  const isAmaQuestionStep = currentStep > flow.steps.amaIntro && currentStep < flow.steps.priorityIntro;
  const isPriorityIntroStep = currentStep === flow.steps.priorityIntro;
  const isPrioritySelectionStep = currentStep === flow.steps.prioritySelection;

  // Any step that shows questions and progress bar
  const isScorableStep = isDoshaQuestionStep || isAmaQuestionStep || isPrioritySelectionStep;

  // --- DETERMINE CURRENT QUESTION DATA ---
  let currentQuestionStr = null;
  let currentQuestionIndexStr = 0; // Index relative to all questions (for progress bar)

  if (isDoshaQuestionStep) {
      // Offset by form(1) + intro(1) = 2
      const index = currentStep - 2;
      currentQuestionStr = flow.doshaQuestions[index];
      currentQuestionIndexStr = index;
  } else if (isAmaQuestionStep) {
       // Offset by form(1) + intro(1) + doshaQs + amaIntro(1)
      const indexStr = currentStep - (3 + flow.doshaQuestions.length);
      currentQuestionStr = flow.amaQuestions[indexStr];
      currentQuestionIndexStr = flow.doshaQuestions.length + indexStr;
  } else if (isPrioritySelectionStep) {
      currentQuestionStr = flow.priorityQuestion;
      currentQuestionIndexStr = flow.doshaQuestions.length + flow.amaQuestions.length;
  }

  const currentQuestion = currentQuestionStr;
  const currentOverallIndex = currentQuestionIndexStr;

  // --- PROGRESS CALCULATION ---
  const progressPercentage = isScorableStep 
    ? Math.round(((currentOverallIndex) / flow.totalScorableItems) * 100) 
    : 0;


  // --- HANDLERS ---

  // Handle standard rating questions (1-7 for Dosha, 1-5 for Ama)
  const handleRatingAnswer = (value) => {
    if (!currentQuestion) return;
    const questionId = currentQuestion.id;
    const category = currentQuestion.category;
    const numValue = parseInt(value);
    const prevAnswer = answers[questionId] || 0;

    setAnswers((prev) => ({ ...prev, [questionId]: numValue }));
    // Update score for the specific category
    setScores((prev) => ({ ...prev, [category]: prev[category] - prevAnswer + numValue }));

    // Auto-advance
    setTimeout(() => {
        goNext();
    }, 400);
  };

  // Handle Priority Checkbox Toggles
  const handlePriorityToggle = (optionId) => {
      setPrioritySelections(prev => ({
          ...prev,
          [optionId]: !prev[optionId] // Toggle true/false
      }));
  };

  const submitQuiz = async () => {
    // Compile final priority data
    const finalPriorities = Object.entries(prioritySelections)
        .filter(([_, isSelected]) => isSelected)
        .map(([id, _]) => {
            if(id === 'p_other') return { id, text: otherPriorityText };
            const option = flow.priorityQuestion.options.find(opt => opt.id === id);
            return { id, text: option?.title };
        });

    const finalData = { 
        ...formData, 
        scores, 
        answers, 
        priorities: finalPriorities,
        completedAt: new Date().toISOString() 
    };
    
    console.log("Submitting Final Data:", finalData);
    if(onComplete) onComplete(finalData);
  };


  // Navigation Helpers
  const goNext = () => {
    if (currentStep < flow.steps.last) {
        setDirection(1);
        setCurrentStep(prev => prev + 1);
    } else if (isPrioritySelectionStep) {
        submitQuiz();
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
        setDirection(-1);
        setCurrentStep(prev => prev - 1);
    }
  };


  // --- UI HELPERS ---

  // Get Badge details based on category
  const getCategoryDetails = (cat) => {
    switch(cat) {
        case 'vata': return { color: "#5B7C2F", label: `Your Vata • ${scores.vata}` };
        case 'pitta': return { color: "#8B3A26", label: `Your Pitta • ${scores.pitta}` };
        case 'kapha': return { color: "#A88647", label: `Your Kapha • ${scores.kapha}` };
        case 'ama': return { color: "#8C7D6A", label: `Your Ama • ${scores.ama}` }; // Grey/Taupe for Ama
        default: return { color: "#4A3B2A", label: "" };
    }
  };

  // Render Progress Dots
  const renderMilestoneDot = (milestoneIndex) => {
    const position = (milestoneIndex / flow.totalScorableItems) * 100;
    // A milestone is passed if the current overall index is past it
    const isPassed = currentOverallIndex >= milestoneIndex;
    return (
        <div 
            key={milestoneIndex}
            className={`${styles.milestoneDot} ${isPassed ? styles.milestonePassed : ''}`}
            style={{ left: `${position}%` }}
        />
    );
  };

  // Framer Motion Variants
  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 50 : -50, opacity: 0 }),
  };

  // Form handlers
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setDirection(1);
    setCurrentStep(flow.steps.doshaIntro);
  };

  return (
    <div className={styles.quizWrapper}>
      <div className={styles.backgroundPattern}></div>

      {/* Header only on Questions */}
      {isScorableStep && (
        <div className={styles.quizHeader}>
           {/* Add score tracking UI here if needed */}
        </div>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        
        {/* STEP 0: FORM */}
        {isFormStep && (
          <motion.div
            key="step-form"
            className={styles.introContainer}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
             {/* ... (Previous Form Layout) ... */}
            <div className={styles.introHeaderMobile}>
                 <h2>Welcome To The Dosha Quiz!</h2>
                 <p>First, a quick introduction to get started.</p>
            </div>
            <div className={styles.introHeaderDesktop}>
              <h2>Welcome To The Dosha Quiz!</h2>
              <p>First, a quick introduction to get started.</p>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.formSection}>
                <form onSubmit={handleFormSubmit} className={styles.mainForm}>
                   {/* Form Inputs (Same as before) */}
                   <div className={styles.inputRow}>
                    <div className={styles.selectGroup}>
                      <select value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}>
                        <option value="Mr.">Mr.</option><option value="Mrs.">Mrs.</option><option value="Ms.">Ms.</option>
                      </select>
                      <span className={styles.selectArrow}>▼</span>
                    </div>
                    <div className={styles.inputGroup}>
                      <input type="text" placeholder="First Name (Required)" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                    </div>
                  </div>
                  <div className={styles.inputGroup}><input type="text" placeholder="Last Name (Required)" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required /></div>
                  <div className={styles.inputGroup}><input type="email" placeholder="Email ID (Required)" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required /></div>
                  <div className={styles.inputGroup}><input type="tel" placeholder="Contact Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
                  <div className={`${styles.inputGroup} ${styles.dateGroup}`}>
                    <input type="text" onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")} placeholder="Date of Birth" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} required />
                    <span className={styles.calendarIcon}><CalendarIcon /></span>
                  </div>
                </form>
              </div>
              <div className={styles.infoSection}>
                <p>This quiz provides general Ayurvedic insights to support self- understanding and wellbeing. We assure you that all your answers are confidential and will only be used to create your personalised Ayurvedic profile.</p>
                <p className={styles.smallText}>For any clarification, please read our <a href="#" onClick={(e) => { e.preventDefault(); setShowModal(true); }}>Privacy Policy</a> and <a href="#" onClick={(e) => { e.preventDefault(); setShowModal(true); }}>Terms & Conditions</a></p>
                <div className={styles.checkboxGroup}>
                  <label><input type="checkbox" checked={formData.agreeMarketing} onChange={(e) => setFormData({...formData, agreeMarketing: e.target.checked})} /><span className={styles.checkmark}></span><span className={styles.labelSafe}>I agree to receive information and resources related to my Ayurvedic profile, including educational content and updates.</span></label>
                </div>
                <div className={styles.checkboxGroup}>
                  <label><input type="checkbox" checked={formData.agreeTerms} onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})} /><span className={styles.checkmark}></span><span className={styles.labelSafe}>I have read and agree to the Privacy Policy and Terms & Conditions of Maharishi Ayurveda.</span></label>
                </div>
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <button type="button" onClick={handleFormSubmit} className={styles.continueBtn}><span>Continue</span><div className={styles.iconWrapper}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 11L11 1M11 1H3.5M11 1V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div></button>
            </div>
          </motion.div>
        )}

        {/* STEP 1: DOSHA INTRO */}
        {isDoshaIntroStep && (
          <motion.div
            key="step-dosha-info"
            className={styles.infoStepContainer}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
          >
             <div className={styles.infoContent}>
                <div className={styles.infoTextSection}>
                    <h2>Inside This Quiz</h2>
                    <p>This quiz comprises of two major sections, one understanding your mind-body constitution known as <i>dosha</i>, and one assessing your toxin build-up known as <i>ama</i>.</p>
                    <p>When answering, think in terms of your overall, lifelong nature, rather than your current situation or reactions to temporary circumstances.</p>
                    <button onClick={goNext} className={styles.continueBtn}><span>Let's Get Started</span><div className={styles.iconWrapper}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 11L11 1M11 1H3.5M11 1V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div></button>
                </div>
                <div className={styles.infoImageSection}>
                    <img src="/pie-chart.svg" alt="Dosha Types" className={styles.doshaIntroImage} />
                </div>
             </div>
          </motion.div>
        )}

        {/* STEP 2: DOSHA QUESTIONS (1-7 Scale) */}
        {isDoshaQuestionStep && currentQuestion && (
          <motion.div key={`dq-${currentQuestion.id}`} className={styles.questionContainer} variants={slideVariants} initial="enter" animate="center" exit="exit" custom={direction}>
             {/* Badge */}
             <div className={styles.categoryBadge} style={{ backgroundColor: getCategoryDetails(currentQuestion.category).color }}>
                {getCategoryDetails(currentQuestion.category).label}
             </div>

             {/* Question */}
             <h3 className={styles.questionText}>{currentQuestion.text}</h3>
                
             {/* 1-7 Scale */}
             <div className={styles.ratingWrapper}>
                <div className={styles.ratingRow}>
                    {[1, 2, 3, 4, 5, 6, 7].map((val) => (
                        <button key={val} onClick={() => handleRatingAnswer(val)}
                            className={`${styles.ratingSquare} ${answers[currentQuestion.id] === val ? styles.selectedSquare : ''}`}>
                            {val}
                        </button>
                    ))}
                </div>
                <div className={styles.ratingLabels}>
                    <span style={{ left: '2%' }}>Does not apply to me</span>
                    <span style={{ left: '50%', transform: 'translateX(-50%)' }}>Neutral</span>
                    <span style={{ right: '2%' }}>Applies to me</span>
                </div>
             </div>
          </motion.div>
        )}

        {/* STEP 3+: AMA INTRO (Image 5) */}
        {isAmaIntroStep && (
            <motion.div key="step-ama-intro" className={styles.interstitialContainer} variants={slideVariants} initial="enter" animate="center" exit="exit" custom={direction}>
                <h2 className={styles.interstitialTitle}>
                    Let's take a closer look at your levels of Ama (toxin) build-up.
                </h2>
                <p className={styles.interstitialText}>
                    From bloating to low energy and slow digestion, this section reflects signs associated with Ama in your body.
                </p>
                <button onClick={goNext} className={styles.continueBtn}>
                    <span>Continue</span><div className={styles.iconWrapper}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 11L11 1M11 1H3.5M11 1V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
                </button>
            </motion.div>
        )}

        {/* STEP 4+: AMA QUESTIONS (1-5 Scale) (Image 6) */}
        {isAmaQuestionStep && currentQuestion && (
            <motion.div key={`aq-${currentQuestion.id}`} className={styles.questionContainer} variants={slideVariants} initial="enter" animate="center" exit="exit" custom={direction}>
             
             {/* Badge (Ama color) */}
             <div className={styles.categoryBadge} style={{ backgroundColor: getCategoryDetails('ama').color }}>
                {getCategoryDetails('ama').label}
             </div>

             <h3>{currentQuestion.text}</h3>
                
             {/* 1-5 Scale (Different layout/labels) */}
             <div className={styles.ratingWrapperAma}>
                <div className={styles.ratingRowAma}>
                    {[1, 2, 3, 4, 5].map((val) => (
                        <button key={val} onClick={() => handleRatingAnswer(val)}
                            className={`${styles.ratingSquareAma} ${answers[currentQuestion.id] === val ? styles.selectedSquareAma : ''}`}>
                            {val}
                        </button>
                    ))}
                </div>
                <div className={styles.ratingLabelsAma}>
                    <span>Not so often</span>
                    <span>Sometimes</span>
                    <span>Almost always</span>
                </div>
             </div>
          </motion.div>
        )}

        {/* STEP 5+: PRIORITY INTRO (Image 7) */}
        {isPriorityIntroStep && (
            <motion.div key="step-priority-intro" className={styles.interstitialContainer} variants={slideVariants} initial="enter" animate="center" exit="exit" custom={direction}>
                <h2 className={styles.interstitialTitle}>
                    Let's identify the priority that shapes your path.
                </h2>
                <p className={styles.interstitialText}>
                    Whether it's digestion, energy, sleep, or mood balance, this section helps us clarify your current focus and direction in your wellness journey.
                </p>
                <button onClick={goNext} className={styles.continueBtnDark}>
                    <span>Continue</span><div className={styles.btnIconDark}><ArrowIcon /></div>
                </button>
            </motion.div>
        )}

        {/* STEP 6+: PRIORITY SELECTION (Checkboxes) (Image 8) */}
        {isPrioritySelectionStep && currentQuestion && (
             <motion.div key="step-priority-select" className={styles.priorityContainer} variants={slideVariants} initial="enter" animate="center" exit="exit" custom={direction}>
                 <h2 className={styles.priorityTitle}>{currentQuestion.text}</h2>
                 
                 <div className={styles.priorityGrid}>
                    {currentQuestion.options.map((option) => (
                        <label key={option.id} className={`${styles.priorityOption} ${prioritySelections[option.id] ? styles.prioritySelected : ''}`}>
                            <input 
                                type="checkbox" 
                                checked={!!prioritySelections[option.id]} 
                                onChange={() => handlePriorityToggle(option.id)}
                                className={styles.hiddenCheckbox}
                            />
                             {/* Custom Checkbox UI */}
                            <div className={styles.customCheckboxBox}>
                                {prioritySelections[option.id] && <span className={styles.checkMarkIcon}>✓</span>}
                            </div>
                            
                            <div className={styles.optionContent}>
                                <h4 className={styles.optionTitle}>{option.title}</h4>
                                {option.isOther ? (
                                     <input 
                                        type="text" 
                                        placeholder="Please specify"
                                        value={otherPriorityText}
                                        onChange={(e) => setOtherPriorityText(e.target.value)}
                                        className={styles.otherInput}
                                        onClick={(e) => e.stopPropagation()} // Prevent toggling checkbox when clicking input
                                        disabled={!prioritySelections[option.id]} // Only enable if checkbox selected
                                     />
                                ) : (
                                     <p className={styles.optionDesc}>{option.desc}</p>
                                )}
                            </div>
                        </label>
                    ))}
                 </div>
             </motion.div>
        )}

      </AnimatePresence>

      {/* SHARED FOOTER (Progress + Nav) */}
      {/* Show on any step that isn't Form or Interstitials */}
      {isScorableStep && (
         <div className={styles.fixedFooterWrapper}>
            <div className={styles.questionFooter}>
                {/* Progress Bar */}
                <div className={styles.progressBarContainer}>
                    <div className={styles.progressTooltip} style={{ left: `${progressPercentage}%`, transform: `translateX(-50%)` }}>
                        {progressPercentage}%<div className={styles.tooltipArrow}></div>
                    </div>
                    <div className={styles.trackLine}>
                        <div className={styles.fillLine} style={{ width: `${progressPercentage}%` }}></div>
                        {/* Render dots for all milestones defined in flow */}
                        {flow.milestones.map(msIndex => renderMilestoneDot(msIndex))}
                    </div>
                </div>

                {/* Nav Buttons */}
                <div className={styles.navButtons}>
                    {/* Hide Back button on priority selection to match image 8 */}
                    {!isPrioritySelectionStep && (
                        <button onClick={goBack} className={styles.navBtnSquare}><NavArrowLeft /></button>
                    )}
                    
                    {/* Next/Submit Button */}
                    {isPrioritySelectionStep ? (
                        <button onClick={submitQuiz} className={styles.submitBtnFinal}>
                            <span>Submit</span><div className={styles.btnIconDark}><ArrowIcon /></div>
                        </button>
                    ) : (
                        <button onClick={goNext} className={styles.navBtnSquare}><NavArrowRight /></button>
                    )}
                </div>
            </div>
         </div>
      )}
      
      {/* Modal */}
      <PrivacyModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default QuizForm;