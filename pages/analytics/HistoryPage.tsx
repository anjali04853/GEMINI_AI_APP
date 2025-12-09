import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronLeft,
  Calendar,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAnalytics } from '../../hooks/useAnalytics';

export const HistoryPage = () => {
  const { recentHistory } = useAnalytics();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filtered = recentHistory.filter((item: any) => {
    const matchesSearch = item.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.config?.topic || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const types = ['All', 'Technical Quiz', 'Assessment', 'Text Interview', 'Voice Interview', 'Bot Interview'];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/analytics">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Activity History</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
           <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
           <Input 
             placeholder="Search history..." 
             className="pl-9"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
           {types.map(t => (
             <button
               key={t}
               onClick={() => setFilterType(t)}
               className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                 filterType === t 
                   ? 'bg-blue-600 text-white' 
                   : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
               }`}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
         <div className="min-w-full divide-y divide-slate-200">
            <div className="bg-slate-50 px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider grid grid-cols-12 gap-4">
               <div className="col-span-4 md:col-span-3">Activity Type</div>
               <div className="col-span-4 md:col-span-4">Details/Topic</div>
               <div className="col-span-2 hidden md:block">Date</div>
               <div className="col-span-2 hidden md:block">Duration</div>
               <div className="col-span-4 md:col-span-1 text-right">Score</div>
            </div>
            
            <div className="divide-y divide-slate-100 bg-white">
               {filtered.length > 0 ? (
                 filtered.map((item: any, i) => (
                    <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors group">
                       <div className="col-span-4 md:col-span-3">
                          <span className="font-medium text-slate-900 block">{item.type}</span>
                          <span className="text-xs text-slate-500 md:hidden">{new Date(item.timestamp).toLocaleDateString()}</span>
                       </div>
                       
                       <div className="col-span-4 md:col-span-4">
                          <div className="text-sm text-slate-600 truncate">
                             {item.config?.topic || item.activeAssessment?.title || (item.config?.types ? item.config.types.join(', ') : 'General Practice')}
                          </div>
                       </div>
                       
                       <div className="col-span-2 hidden md:flex items-center text-sm text-slate-500">
                          <Calendar className="h-3 w-3 mr-1.5" />
                          {new Date(item.timestamp).toLocaleDateString()}
                       </div>
                       
                       <div className="col-span-2 hidden md:flex items-center text-sm text-slate-500">
                          <Clock className="h-3 w-3 mr-1.5" />
                          {item.durationSeconds ? `${Math.floor(item.durationSeconds/60)}m ${item.durationSeconds%60}s` : '--'}
                       </div>
                       
                       <div className="col-span-4 md:col-span-1 text-right flex justify-end items-center gap-3">
                          {item.score !== undefined ? (
                             <Badge variant={item.score >= 80 ? 'success' : item.score >= 50 ? 'warning' : 'default'}>
                                {item.score}%
                             </Badge>
                          ) : (
                             <span className="text-xs text-slate-400">N/A</span>
                          )}
                          <Link 
                            to={
                                item.type === 'Technical Quiz' ? `/interview/results?session=${item.id}` :
                                item.type === 'Assessment' ? `/assessments/${item.assessmentId}/results` : // Basic link, real app would need persisted ID
                                item.type === 'Text Interview' ? `/interview/text/results?session=${item.id}` :
                                item.type === 'Voice Interview' ? `/interview/voice/results?session=${item.id}` :
                                `/interview/bot/results?session=${item.id}`
                            }
                            className="text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                             <ArrowUpRight className="h-4 w-4" />
                          </Link>
                       </div>
                    </div>
                 ))
               ) : (
                 <div className="px-6 py-12 text-center text-slate-500">
                    No history found matching your filters.
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};
