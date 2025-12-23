
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, Flag, Save, LogOut, Loader2 } from 'lucide-react';
import { useAssessmentStore } from '../../store/assessmentStore';
import { useSubmitAssessment } from '../../hooks/api/useAssessmentsApi';
import { QuestionRenderer } from '../../components/assessment/QuestionRenderer';
import { ProgressBar } from '../../components/assessment/ProgressBar';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { getApiError } from '../../lib/api/client';
import { cn } from '../../lib/utils';

export const AssessmentPlayerPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showExitModal, setShowExitModal] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitAssessmentMutation = useSubmitAssessment();

  const {
    activeAssessment,
    sessionId,
    currentQuestionIndex,
    responses,
    flaggedQuestions,
    isFinished,
    timeRemaining,
    nextQuestion,
    prevQuestion,
    submitAnswer,
    finishAssessment,
    toggleFlag,
    isFlagged,
    updateTimer,
    resetAssessment
  } = useAssessmentStore();
  
  // Timer effect
  useEffect(() => {
    if (!activeAssessment || isFinished || timeRemaining <= 0 || isSubmitting) return;

    const interval = setInterval(() => {
      updateTimer(timeRemaining - 1);
      if (timeRemaining <= 1) {
        // Auto-submit when time runs out
        handleSubmit();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeAssessment, isFinished, timeRemaining, updateTimer, isSubmitting]);
  
  // Auto-save every 30 seconds
  useEffect(() => {
    if (!activeAssessment || isFinished) return;
    
    const autoSaveInterval = setInterval(() => {
      setLastSaved(new Date());
    }, 30000);
    
    return () => clearInterval(autoSaveInterval);
  }, [activeAssessment, isFinished]);
  
  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleExit = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    setShowExitModal(false);
    resetAssessment();
    navigate('/dashboard/assessments');
  };

  // Submit assessment to API
  const handleSubmit = async () => {
    if (!activeAssessment || !sessionId || isSubmitting) return;

    // Validate all required questions are answered
    const hasUnansweredRequired = activeAssessment.questions.some(q => {
      const ans = responses[q.id];
      const isEmpty = ans === undefined || ans === '' || ans === null ||
        (Array.isArray(ans) && ans.length === 0);
      return q.required && isEmpty;
    });

    if (hasUnansweredRequired) {
      showToast({
        title: 'Cannot submit',
        description: 'Please answer all required questions before submitting.',
        variant: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert responses to the format expected by the API
      const responsesArray = Object.entries(responses).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));

      const result = await submitAssessmentMutation.mutateAsync({
        sessionId,
        data: {
          responses: responsesArray,
          flaggedQuestions,
        },
      });

      // Mark as finished in local store
      finishAssessment();

      // Navigate to results page with sessionId
      navigate(`/dashboard/assessments/results/${sessionId}`);
    } catch (error) {
      const apiError = getApiError(error);
      showToast({
        title: 'Submission failed',
        description: apiError.message,
        variant: 'error',
      });
      setIsSubmitting(false);
    }
  };

  if (!activeAssessment) {
    return <Navigate to="/dashboard/assessments" replace />;
  }

  if (isFinished && sessionId) {
    return <Navigate to={`/dashboard/assessments/results/${sessionId}`} replace />;
  }

  const currentQuestion = activeAssessment.questions[currentQuestionIndex];
  const currentAnswer = responses[currentQuestion.id];
  const isLastQuestion = currentQuestionIndex === activeAssessment.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isQuestionFlagged = isFlagged(currentQuestion.id);

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      nextQuestion();
    }
  };

  // Improved check for array types or strings
  const isAnswered = currentAnswer !== undefined && currentAnswer !== '' && currentAnswer !== null && (!Array.isArray(currentAnswer) || currentAnswer.length > 0);

  return (
    <>
    <Modal isOpen={showExitModal} onClose={() => setShowExitModal(false)} title="Exit Assessment?">
      <div className="p-6">
        <p className="text-slate-600 mb-6">Your progress has been saved. You can resume this assessment later.</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowExitModal(false)} className="flex-1">
            Continue Assessment
          </Button>
          <Button variant="destructive" onClick={confirmExit} className="flex-1">
            <LogOut className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </div>
      </div>
    </Modal>
    
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Header with Progress */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={handleExit} 
            className="pl-0 hover:bg-transparent hover:text-brand-purple"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Exit Assessment
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className={cn(
              "flex items-center text-sm font-bold px-4 py-1.5 rounded-full shadow-sm border",
              timeRemaining < 60 
                ? "text-red-600 bg-red-50 border-red-200 animate-pulse" 
                : "text-brand-purple bg-brand-lavender border-brand-purple/10"
            )}>
                <Clock className="h-4 w-4 mr-2" />
                {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
        
        <ProgressBar 
          current={currentQuestionIndex + 1} 
          total={activeAssessment.questions.length} 
        />
      </div>

      {/* Main Question Card */}
      <Card className="min-h-[500px] flex flex-col rounded-[24px] shadow-xl border-slate-100 overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-white pt-8 pb-6 px-8 relative">
          <div className="absolute top-8 right-8 flex gap-2">
             <button 
                onClick={() => toggleFlag(currentQuestion.id)}
                className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full transition-colors shadow-md",
                    isQuestionFlagged ? "bg-brand-yellow text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                )}
                title="Mark for Review"
             >
                 <Flag className={cn("h-4 w-4", isQuestionFlagged && "fill-current")} />
             </button>
             <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-pink text-white font-bold text-sm shadow-md">
                {currentQuestionIndex + 1}
             </span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
               Question {currentQuestionIndex + 1} of {activeAssessment.questions.length}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight pr-20">
              {currentQuestion.text}
            </h2>
            {currentQuestion.required && (
                <span className="text-xs text-red-500 font-medium mt-1 inline-block">* Required</span>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 py-8 px-8 bg-white">
          <QuestionRenderer 
            question={currentQuestion}
            value={currentAnswer}
            onChange={(val) => submitAnswer(currentQuestion.id, val)}
          />
        </CardContent>

        <CardFooter className="flex justify-between items-center py-6 px-8 bg-slate-50 border-t border-slate-100">
          <Button 
            variant="secondary" 
            onClick={prevQuestion} 
            disabled={isFirstQuestion}
            className="border-slate-300 text-slate-600 hover:bg-white hover:text-brand-purple hover:border-brand-purple/30"
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={(currentQuestion.required && !isAnswered) || isSubmitting}
            className={isLastQuestion
                ? "bg-gradient-to-r from-brand-turquoise to-teal-400 hover:from-brand-turquoise hover:to-teal-500 text-white shadow-lg shadow-brand-turquoise/25 hover:shadow-brand-turquoise/40 px-8"
                : "bg-gradient-to-r from-brand-purple to-brand-darkPurple hover:from-brand-purple hover:to-indigo-600 text-white shadow-lg shadow-brand-purple/25 hover:shadow-brand-purple/40 px-8"
            }
          >
            {isLastQuestion ? (
              isSubmitting ? (
                <>
                  Submitting...
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                </>
              ) : (
                <>
                  Submit Assessment
                  <CheckCircle2 className="ml-2 h-5 w-5" />
                </>
              )
            ) : (
              <>
                Next Question
                <ChevronRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="flex items-center justify-center space-x-4 text-xs font-medium text-slate-400">
        <div className="flex items-center space-x-2">
            <Save className="w-3 h-3" />
            <span>
              {lastSaved 
                ? `Auto-saved at ${lastSaved.toLocaleTimeString()}` 
                : 'Progress auto-saved'}
            </span>
        </div>
        {flaggedQuestions.length > 0 && (
            <div className="flex items-center space-x-2 text-brand-yellow">
                <Flag className="w-3 h-3 fill-current" />
                <span>{flaggedQuestions.length} flagged for review</span>
            </div>
        )}
      </div>
    </div>
    </>
  );
};
