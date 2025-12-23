
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Play, Check, Briefcase, Code, MessageSquare, X, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useTextInterviewStore } from '../../../store/textInterviewStore';
import { useStartTextInterview } from '../../../hooks/api/useInterviewsApi';
import { useToast } from '../../../components/ui/Toast';
import { getApiError } from '../../../lib/api/client';
import { TextQuestionType, ExperienceLevel } from '../../../types';
import { cn } from '../../../lib/utils';
import { Input } from '../../../components/ui/Input';
import { mockTextQuestions } from '../../../data/mockInterviewData';
import { generateId } from '../../../lib/utils';

const TYPES: { id: TextQuestionType; label: string; icon: React.ElementType; color: string; bg: string; borderColor: string; description: string }[] = [
  { 
    id: 'Behavioral', 
    label: 'Behavioral', 
    icon: MessageSquare, 
    color: 'text-brand-pink', 
    bg: 'bg-pink-50', 
    borderColor: 'border-brand-pink',
    description: 'STAR method questions about past experiences.' 
  },
  { 
    id: 'Technical', 
    label: 'Technical', 
    icon: Code, 
    color: 'text-brand-purple', 
    bg: 'bg-brand-lavender', 
    borderColor: 'border-brand-purple',
    description: 'Deep dive into coding concepts and architecture.'
  },
  { 
    id: 'Situational', 
    label: 'Situational', 
    icon: Briefcase, 
    color: 'text-brand-turquoise', 
    bg: 'bg-teal-50', 
    borderColor: 'border-brand-turquoise',
    description: 'Hypothetical scenarios and problem solving.'
  },
];

const EXPERIENCE_LEVELS: { id: ExperienceLevel; label: string; color: string }[] = [
  { id: 'Entry', label: 'Entry Level', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'Mid', label: 'Mid-Senior', color: 'bg-brand-yellow/30 text-yellow-800 border-yellow-200' },
  { id: 'Senior', label: 'Senior / Lead', color: 'bg-pink-100 text-pink-700 border-pink-200' },
];

export const TextSetupPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const setActiveInterview = useTextInterviewStore(state => state.setActiveInterview);
  const startInterviewMutation = useStartTextInterview();

  const [selectedTypes, setSelectedTypes] = useState<TextQuestionType[]>(['Behavioral']);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Mid');
  const [questionCount, setQuestionCount] = useState(3);
  const [customTopic, setCustomTopic] = useState('');
  const [customTopics, setCustomTopics] = useState<string[]>([]);

  const toggleType = (type: TextQuestionType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const addTopic = () => {
    if (customTopic.trim() && !customTopics.includes(customTopic.trim())) {
      setCustomTopics([...customTopics, customTopic.trim()]);
      setCustomTopic('');
    }
  };

  const removeTopic = (topic: string) => {
    setCustomTopics(customTopics.filter(t => t !== topic));
  };

  const handleStart = async () => {
    if (selectedTypes.length === 0) return;

    try {
      const response = await startInterviewMutation.mutateAsync({
        types: selectedTypes,
        questionCount,
        experienceLevel,
        customTopics: customTopics.length > 0 ? customTopics : undefined,
      } as any);

      // Set the active interview with API data
      setActiveInterview({
        sessionId: response.sessionId,
        questions: response.questions.map(q => ({
          id: q.id,
          text: q.text,
          type: (q.type as TextQuestionType) || 'Behavioral',
        })),
        config: {
          types: selectedTypes,
          questionCount,
          experienceLevel,
          customTopics,
        },
      });

      navigate('/dashboard/interview/text/active');
    } catch (error) {
      // Fall back to mock data when API fails
      console.warn('API failed, using mock data:', error);

      // Filter and select mock questions
      let filtered = mockTextQuestions.filter(q => selectedTypes.includes(q.type));
      filtered = filtered.sort(() => 0.5 - Math.random());
      const selectedQuestions = filtered.slice(0, questionCount);

      if (selectedQuestions.length === 0) {
        addToast('No questions available for the selected types', 'error');
        return;
      }

      // Use mock data with a generated session ID
      setActiveInterview({
        sessionId: generateId(),
        questions: selectedQuestions,
        config: {
          types: selectedTypes,
          questionCount,
          experienceLevel,
          customTopics,
        },
      });

      addToast('Using practice questions (offline mode)', 'info');
      navigate('/dashboard/interview/text/active');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-brand-lavender/30 to-brand-offWhite p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/interview">
            <Button variant="ghost" size="sm" className="bg-white hover:bg-white/80 shadow-sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Text Interview Setup</h1>
            <p className="text-slate-500">Practice written responses for asynchronous interviews.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Config Column */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Interview Types */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Interview Type</label>
              <div className="grid gap-4 sm:grid-cols-3">
                {TYPES.map((type) => {
                  const isSelected = selectedTypes.includes(type.id);
                  return (
                    <div
                      key={type.id}
                      onClick={() => toggleType(type.id)}
                      className={cn(
                        "relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group hover:-translate-y-1 hover:shadow-lg bg-white",
                        isSelected ? type.borderColor : "border-transparent shadow-sm hover:border-slate-200"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors",
                        isSelected ? type.bg : "bg-slate-50 group-hover:bg-slate-100"
                      )}>
                        <type.icon className={cn("h-5 w-5", isSelected ? type.color : "text-slate-400")} />
                      </div>
                      <h3 className={cn("font-bold text-sm mb-1", isSelected ? "text-slate-900" : "text-slate-600")}>{type.label}</h3>
                      <p className="text-xs text-slate-500 leading-snug">{type.description}</p>
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-brand-purple rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Topics */}
            <Card className="border-none shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Custom Topics (Optional)</CardTitle>
                <CardDescription>Add specific skills or frameworks to focus on.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input 
                    placeholder="e.g. Next.js, Redux, Conflict Resolution" 
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTopic()}
                    className="focus:ring-brand-purple"
                  />
                  <Button onClick={addTopic} variant="secondary" className="px-3">
                    <Plus className="h-5 w-5 text-slate-600" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[30px]">
                  {customTopics.map(topic => (
                    <span key={topic} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-brand-lavender text-brand-purple font-medium border border-brand-purple/20">
                      {topic}
                      <button onClick={() => removeTopic(topic)} className="ml-2 hover:text-brand-darkPurple">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {customTopics.length === 0 && <span className="text-sm text-slate-400 italic">No custom topics added</span>}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar Config */}
          <div className="space-y-6">
            
            {/* Experience Level */}
            <Card className="border-none shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Experience Level</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {EXPERIENCE_LEVELS.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setExperienceLevel(level.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm font-semibold flex items-center justify-between",
                      experienceLevel === level.id 
                        ? `${level.color} shadow-sm` 
                        : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {level.label}
                    {experienceLevel === level.id && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Question Count */}
            <Card className="border-none shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Session Length</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-slate-500">Questions</span>
                    <span className="text-xl font-bold text-brand-purple">{questionCount}</span>
                 </div>
                 <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    step="1"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                 />
                 <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>1</span>
                    <span>10</span>
                 </div>
              </CardContent>
            </Card>

            <Button
              size="lg"
              className="w-full h-14 bg-brand-purple hover:bg-brand-darkPurple shadow-lg shadow-brand-purple/20"
              onClick={handleStart}
              disabled={selectedTypes.length === 0 || startInterviewMutation.isPending}
              isLoading={startInterviewMutation.isPending}
            >
              Start Interview
              <Play className="ml-2 h-5 w-5 fill-current" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
