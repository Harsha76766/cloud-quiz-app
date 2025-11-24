import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestions, submitResult } from '../services/api';
import { supabase } from '../services/supabase';

export default function Quiz() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per quiz

    useEffect(() => {
        getQuestions(id).then(data => {
            setQuestions(data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [id]);

    useEffect(() => {
        if (loading || submitting) return;

        if (timeLeft === 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, loading, submitting]);

    const handleOptionSelect = (option) => {
        setAnswers({ ...answers, [currentQuestion]: option });
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(curr => curr + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        let score = 0;
        questions.forEach((q, index) => {
            if (answers[index] === q.correct_answer) {
                score += 10; // 10 points per question
            }
        });

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await submitResult(user.id, id, score);
            alert(`Quiz Completed! Your score: ${score}`);
            navigate('/dashboard');
        } else {
            alert('Please login to save your score.');
            navigate('/login');
        }
        setSubmitting(false);
    };

    if (loading) return <div className="text-center mt-20">Loading questions...</div>;
    if (questions.length === 0) return <div className="text-center mt-20">No questions found for this quiz.</div>;

    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-400">
                        Question {currentQuestion + 1} of {questions.length}
                    </div>
                    <div className={`text-xl font-bold px-4 py-2 rounded-lg ${timeLeft < 10 ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-white'}`}>
                        Time Left: {timeLeft}s
                    </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                        className="bg-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700">
                <h2 className="text-2xl font-bold mb-6">{question.question_text}</h2>
                <div className="space-y-4">
                    {question.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(option)}
                            className={`w-full text-left p-4 rounded-lg border transition-all ${answers[currentQuestion] === option
                                ? 'bg-accent text-slate-900 border-accent'
                                : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleNext}
                        disabled={!answers[currentQuestion] || submitting}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {currentQuestion === questions.length - 1 ? (submitting ? 'Submitting...' : 'Finish Quiz') : 'Next Question'}
                    </button>
                </div>
            </div>
        </div>
    );
}
