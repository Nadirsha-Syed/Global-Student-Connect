import { useState } from 'react';

const reflectionQuestions = [
  'What was something new you learned about their culture?',
  'What did you find similar or different from your own country?',
  'What was the most interesting part of the conversation?',
];

export default function ReflectionPage({ onNavigate }) {
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (index, value) => {
    setAnswers((current) => ({
      ...current,
      [`q${index + 1}`]: value,
    }));

    setErrors((current) => ({
      ...current,
      [`q${index + 1}`]: '',
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    reflectionQuestions.forEach((_, index) => {
      const key = `q${index + 1}`;
      if (!answers[key]?.trim()) {
        nextErrors[key] = 'Please add a response before submitting.';
      }
    });

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onNavigate('reflection-success');
  };

  return (
    <section className="reflection-page">
      <div className="section-heading">
        <p className="eyebrow">Session complete</p>
        <h1>Post-call reflection</h1>
      </div>

      <form className="reflection-card" onSubmit={handleSubmit}>
        {reflectionQuestions.map((question, index) => (
          <div key={question} className="reflection-question">
            <label htmlFor={`q${index + 1}`}>{index + 1}. {question}</label>
            <textarea
              id={`q${index + 1}`}
              value={answers[`q${index + 1}`]}
              placeholder="Share your thoughts..."
              rows="4"
              onChange={(event) => handleChange(index, event.target.value)}
            />
            {errors[`q${index + 1}`] && <span className="field-error">{errors[`q${index + 1}`]}</span>}
          </div>
        ))}

        <button type="submit" className="primary-button large">
          Submit Reflection
        </button>
      </form>
    </section>
  );
}
