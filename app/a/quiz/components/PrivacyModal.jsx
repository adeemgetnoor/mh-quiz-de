import React from 'react';
import styles from './QuizForm.module.css';

const TermsModal = ({ isOpen, onClose, onContinue }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* Header with Close Button */}
        <div className={styles.modalHeader}>
          <h2>Terms & Conditions</h2>
          <button className={styles.modalClose} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="#423430" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="#423430" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className={styles.modalBody}>
          <h3>Important Information – Dosha Quiz</h3>
          
          <p>
            This Dosha Quiz offers general Ayurvedic information based on the details you choose to provide. It is intended solely for educational and self-reflection purposes.
          </p>
          
          <p>
            The information shared does not constitute medical advice and is not intended to diagnose, treat, or prevent any disease or health condition. It does not replace professional medical advice, diagnosis, or treatment. Please continue to follow the guidance of your physician or other qualified healthcare professionals.
          </p>
          
          <p>
            This quiz is not a substitute for personalised, prescription-based Ayurvedic consultation. For individual assessment and tailored guidance, we recommend consulting a qualified Ayurvedic practitioner.
          </p>
          
          <p>
            Your responses are processed confidentially and used only to generate your personalised Ayurvedic profile, in accordance with our Privacy Policy and applicable data protection regulations.
          </p>

          {/* Continue Button */}
          <button className={styles.continueBtn} onClick={onContinue}>
            <span>Continue</span>
            <div className={styles.iconWrapper}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 11L11 1M11 1H3.5M11 1V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};

export default TermsModal;