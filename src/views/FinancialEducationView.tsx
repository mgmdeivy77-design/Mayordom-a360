import React, { useState } from 'react';
import { BookOpen, Award, CheckCircle, ArrowRight, HelpCircle } from 'lucide-react';
import { educationalArticles } from '../data/educationalArticles';

export const FinancialEducationView: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState(educationalArticles[0]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const sampleQuiz = [
    {
      question: '¿Cuál es el porcentaje máximo de ingresos recomendado para comprometer en cuotas de deudas?',
      options: ['50%', '30% - 35%', '70%', '10%'],
      correctIndex: 1,
    },
    {
      question: '¿Cuántos meses de gastos fijos debe cubrir el Fondo de Emergencia recomendado?',
      options: ['1 mes', 'Entre 3 y 6 meses', '24 meses', 'No es necesario tener fondo'],
      correctIndex: 1,
    },
    {
      question: '¿Cómo se evita el cobro de intereses de financiamiento en las tarjetas de crédito?',
      options: [
        'Pagando el Pago Mínimo',
        'Pagando el Saldo al Corte / Total en o antes de la fecha límite',
        'Haciendo avance de efectivo',
        'Pagando con otra tarjeta',
      ],
      correctIndex: 1,
    },
  ];

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    sampleQuiz.forEach((q, i) => {
      if (quizAnswers[i] === q.correctIndex) score++;
    });
    return score;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Módulo de Educación & Sabiduría Financiera</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Educación Financiera RD
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Guías prácticas sobre ahorro en canasta básica, tarjetas de crédito sin intereses y buena administración.
        </p>
      </div>

      {/* Article Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {educationalArticles.map((art) => (
          <button
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedArticle.id === art.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md font-bold'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-800 dark:text-slate-200'
            }`}
          >
            <span className="text-[10px] uppercase font-extrabold opacity-80 block">{art.category}</span>
            <h4 className="font-bold text-xs mt-1 line-clamp-2">{art.title}</h4>
            <span className="text-[10px] opacity-75 mt-2 block">{art.readingTime} de lectura</span>
          </button>
        ))}
      </div>

      {/* Selected Article Viewer */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase">
            {selectedArticle.category}
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
            {selectedArticle.title}
          </h2>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed text-slate-700 dark:text-slate-300 space-y-3 whitespace-pre-line">
          {selectedArticle.content}
        </div>
      </div>

      {/* Interactive Financial Quiz */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Evaluación de Conocimientos</span>
        </div>
        <h3 className="text-lg font-extrabold">Quiz Rápido de Educación Financiera</h3>

        <div className="space-y-4 pt-2">
          {sampleQuiz.map((q, qIdx) => (
            <div key={qIdx} className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-2">
              <p className="font-bold text-xs text-slate-100">
                {qIdx + 1}. {q.question}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt, oIdx) => {
                  const isSelected = quizAnswers[qIdx] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(qIdx, oIdx)}
                      className={`p-2.5 rounded-xl text-xs text-left font-medium transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-700/60 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2">
          {quizSubmitted ? (
            <div className="text-sm font-bold text-amber-400">
              🎉 Tu Puntuación: {calculateQuizScore()} / {sampleQuiz.length} respuestas correctas.
            </div>
          ) : (
            <div />
          )}

          <button
            onClick={() => setQuizSubmitted(true)}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-xs"
          >
            Verificar Respuestas
          </button>
        </div>
      </div>
    </div>
  );
};
