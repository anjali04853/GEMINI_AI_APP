import { useInterviewStore } from '../store/interviewStore';
import { useAssessmentStore } from '../store/assessmentStore';
import { useTextInterviewStore } from '../store/textInterviewStore';
import { useVoiceInterviewStore } from '../store/voiceInterviewStore';
import { useVoiceBotStore } from '../store/voiceBotStore';

export const useAnalytics = () => {
  const interviewSessions = useInterviewStore(state => state.sessions);
  const assessmentHistory = useAssessmentStore(state => state.history);
  const textSessions = useTextInterviewStore(state => state.sessions);
  const voiceSessions = useVoiceInterviewStore(state => state.sessions);
  const botSessions = useVoiceBotStore(state => state.sessions);

  // 1. Total Activity Count
  const totalActivities = 
    interviewSessions.length + 
    assessmentHistory.length + 
    textSessions.length + 
    voiceSessions.length + 
    botSessions.length;

  // 2. Average Scores (Normalized to 100)
  // Note: Only Quizzes and Assessments typically have numeric scores in this demo
  const quizScores = interviewSessions.map(s => s.score);
  const assessmentScores = assessmentHistory.map(s => s.score || 0);
  const allScores = [...quizScores, ...assessmentScores];
  const averageScore = allScores.length > 0 
    ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) 
    : 0;

  // 3. Time Spent (Mock estimation for some, actual for others)
  const interviewTime = interviewSessions.reduce((acc, s) => acc + s.durationSeconds, 0);
  const botTime = botSessions.reduce((acc, s) => acc + s.durationSeconds, 0);
  // Estimate 5 mins for text/assessment if not tracked precisely
  const estimatedTextTime = textSessions.length * 300; 
  const estimatedAssessmentTime = assessmentHistory.length * 600;
  
  const totalSeconds = interviewTime + botTime + estimatedTextTime + estimatedAssessmentTime;
  const totalHours = (totalSeconds / 3600).toFixed(1);

  // 4. Activity Over Time (Last 7 days)
  const getLast7DaysActivity = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayName = days[d.getDay()];
      const startOfDay = new Date(d.setHours(0,0,0,0)).getTime();
      const endOfDay = new Date(d.setHours(23,59,59,999)).getTime();

      const count = 
        interviewSessions.filter(s => s.date >= startOfDay && s.date <= endOfDay).length +
        assessmentHistory.filter(s => s.completedAt >= startOfDay && s.completedAt <= endOfDay).length +
        textSessions.filter(s => s.date >= startOfDay && s.date <= endOfDay).length +
        voiceSessions.filter(s => s.date >= startOfDay && s.date <= endOfDay).length +
        botSessions.filter(s => s.date >= startOfDay && s.date <= endOfDay).length;

      data.push({ label: dayName, value: count });
    }
    return data;
  };

  // 5. Skill Radar Data (Mock distribution based on activity types)
  // In a real app, we would tag each question/assessment with skills
  const getSkillRadarData = () => {
    // Base skills
    let coding = 50; // Base
    let communication = 40;
    let systemDesign = 30;
    let problemSolving = 45;
    let behavioral = 35;

    // Add points based on completed sessions
    coding += interviewSessions.filter(s => s.config.topics.includes('React') || s.config.topics.includes('JavaScript')).length * 5;
    systemDesign += interviewSessions.filter(s => s.config.topics.includes('System Design')).length * 8;
    
    communication += voiceSessions.length * 5 + botSessions.length * 6;
    behavioral += textSessions.filter(s => s.config.types.includes('Behavioral')).length * 5;
    
    // Assessments add to specific categories based on title/category
    assessmentHistory.forEach(a => {
        // Mock logic since we don't have full metadata in history
        problemSolving += 5; 
    });

    // Cap at 100
    return [
      { subject: 'Coding', value: Math.min(100, coding) },
      { subject: 'Communication', value: Math.min(100, communication) },
      { subject: 'System Design', value: Math.min(100, systemDesign) },
      { subject: 'Problem Solving', value: Math.min(100, problemSolving) },
      { subject: 'Behavioral', value: Math.min(100, behavioral) },
    ];
  };

  // 6. Recent History List
  const getRecentHistory = () => {
    const all = [
      ...interviewSessions.map(s => ({ ...s, type: 'Technical Quiz', timestamp: s.date })),
      ...assessmentHistory.map(s => ({ ...s, type: 'Assessment', timestamp: s.completedAt })),
      ...textSessions.map(s => ({ ...s, type: 'Text Interview', timestamp: s.date })),
      ...voiceSessions.map(s => ({ ...s, type: 'Voice Interview', timestamp: s.date })),
      ...botSessions.map(s => ({ ...s, type: 'Bot Interview', timestamp: s.date })),
    ];
    return all.sort((a, b) => b.timestamp - a.timestamp);
  };

  return {
    totalActivities,
    averageScore,
    totalHours,
    activityData: getLast7DaysActivity(),
    skillData: getSkillRadarData(),
    recentHistory: getRecentHistory()
  };
};
