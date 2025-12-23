import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mic, CheckCircle2, AlertTriangle, ArrowLeft, Play, Headphones, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useVoiceInterviewStore } from '../../../store/voiceInterviewStore';
import { AudioRecorder } from '../../../components/voice/AudioRecorder';
import { useStartVoiceInterview } from '../../../hooks/api/useInterviewsApi';
import { useToast } from '../../../components/ui/Toast';
import { getApiError } from '../../../lib/api/client';
import { mockTextQuestions } from '../../../data/mockInterviewData';
import { generateId } from '../../../lib/utils';
import { TextQuestion } from '../../../types';

export const VoiceSetupPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const setActiveInterview = useVoiceInterviewStore(state => state.setActiveInterview);
  const startInterviewMutation = useStartVoiceInterview();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [step, setStep] = useState<1 | 2>(1); // 1: Permission, 2: Test
  const [isStarting, setIsStarting] = useState(false);

  const checkPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      // Clean up stream immediately
      stream.getTracks().forEach(track => track.stop());
      setStep(2);
    } catch (err) {
      console.error(err);
      setHasPermission(false);
    }
  };

  const handleStart = async () => {
    setIsStarting(true);
    const questionCount = 3;

    try {
      const response = await startInterviewMutation.mutateAsync({
        questionCount,
        types: ['Behavioral', 'Situational'],
      } as any);

      // Set the active interview with API data
      setActiveInterview({
        sessionId: response.sessionId,
        questions: response.questions.map(q => ({
          id: q.id,
          text: q.text,
          type: (q.type as TextQuestion['type']) || 'Behavioral',
        })),
        config: { questionCount },
      });

      navigate('/dashboard/interview/voice/active');
    } catch (error) {
      // Fall back to mock data when API fails
      console.warn('API failed, using mock data:', error);

      // Filter Behavioral and Situational questions for voice
      let filtered = mockTextQuestions.filter(q =>
        ['Behavioral', 'Situational'].includes(q.type)
      );
      filtered = filtered.sort(() => 0.5 - Math.random());
      const selectedQuestions = filtered.slice(0, questionCount);

      if (selectedQuestions.length === 0) {
        addToast('No questions available', 'error');
        setIsStarting(false);
        return;
      }

      // Use mock data with a generated session ID
      setActiveInterview({
        sessionId: generateId(),
        questions: selectedQuestions,
        config: { questionCount },
      });

      addToast('Using practice questions (offline mode)', 'info');
      navigate('/dashboard/interview/voice/active');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-brand-turquoise/10 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        
        <div className="flex items-center justify-between mb-2">
           <Link to="/dashboard/interview">
             <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 hover:bg-white/50">
               <ArrowLeft className="h-4 w-4 mr-2" />
               Exit Setup
             </Button>
           </Link>
           <div className="flex gap-2">
              <div className={`h-2 w-8 rounded-full ${step === 1 ? 'bg-brand-turquoise' : 'bg-brand-turquoise/30'}`} />
              <div className={`h-2 w-8 rounded-full ${step === 2 ? 'bg-brand-turquoise' : 'bg-brand-turquoise/30'}`} />
           </div>
        </div>

        <Card className="shadow-xl border-none overflow-hidden">
          {step === 1 && (
            <div className="animate-in slide-in-from-right duration-300">
               <div className="bg-white p-8 text-center space-y-6">
                  <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                     <div className="absolute inset-0 bg-brand-turquoise/20 rounded-full animate-ping opacity-50"></div>
                     <Mic className="h-10 w-10 text-brand-turquoise" />
                  </div>
                  
                  <div>
                     <h2 className="text-2xl font-bold text-slate-900">Microphone Access</h2>
                     <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                        We need access to your microphone to record your answers. Your audio is processed locally and securely.
                     </p>
                  </div>

                  {hasPermission === false && (
                     <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-sm mx-auto flex items-start text-left gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                           <p className="text-sm font-semibold text-red-800">Permission Denied</p>
                           <p className="text-xs text-red-600 mt-1">Please enable microphone access in your browser settings and try again.</p>
                        </div>
                     </div>
                  )}

                  <div className="pt-4">
                     <Button 
                        size="lg" 
                        onClick={checkPermission}
                        className="bg-brand-turquoise hover:bg-teal-500 text-white shadow-lg shadow-brand-turquoise/30 min-w-[200px]"
                     >
                        Allow Microphone
                     </Button>
                  </div>
               </div>
            </div>
          )}

          {step === 2 && (
             <div className="animate-in slide-in-from-right duration-300">
                <CardHeader className="bg-white border-b border-slate-100 pb-6">
                   <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Test Your Audio</CardTitle>
                      <div className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                         <CheckCircle2 className="h-3 w-3 mr-1.5" />
                         Microphone Connected
                      </div>
                   </div>
                   <CardDescription>Record a short clip to ensure you sound clear.</CardDescription>
                </CardHeader>
                
                <CardContent className="bg-brand-lavender/10 p-8">
                   <div className="max-w-sm mx-auto">
                      <AudioRecorder 
                         onRecordingComplete={() => {}} 
                         className="mb-6"
                      />
                   </div>
                   
                   <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-start gap-4">
                      <div className="p-2 bg-brand-sky/10 rounded-lg">
                         <Headphones className="h-5 w-5 text-brand-sky" />
                      </div>
                      <div>
                         <h4 className="font-semibold text-slate-900 text-sm">Quick Check</h4>
                         <ul className="text-xs text-slate-500 mt-1 space-y-1">
                            <li>• Can you hear yourself clearly?</li>
                            <li>• Is there any background noise?</li>
                            <li>• Are you speaking at a comfortable volume?</li>
                         </ul>
                      </div>
                   </div>
                </CardContent>

                <CardFooter className="bg-white p-6 border-t border-slate-100 flex justify-between">
                   <Button variant="ghost" onClick={() => setStep(1)} className="text-slate-400" disabled={isStarting}>
                      <Settings className="h-4 w-4 mr-2" />
                      Check Settings
                   </Button>
                   <Button
                      size="lg"
                      onClick={handleStart}
                      disabled={isStarting}
                      isLoading={isStarting}
                      className="bg-brand-turquoise hover:bg-teal-500 shadow-lg shadow-brand-turquoise/20"
                   >
                      Start Interview
                      <Play className="ml-2 h-4 w-4 fill-current" />
                   </Button>
                </CardFooter>
             </div>
          )}
        </Card>
      </div>
    </div>
  );
};