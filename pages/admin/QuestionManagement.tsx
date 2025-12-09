
import React, { useState } from 'react';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAdminStore } from '../../store/adminStore';
import { Badge } from '../../components/ui/Badge';

export const QuestionManagement = () => {
  const { questions, deleteQuestion } = useAdminStore();
  const [search, setSearch] = useState('');

  const filtered = questions.filter(q => 
    q.text.toLowerCase().includes(search.toLowerCase()) || 
    q.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Question Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search questions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interview Question Bank</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t border-slate-200">
            {filtered.map((q) => (
              <div key={q.id} className="flex items-center justify-between p-4 border-b border-slate-100 hover:bg-slate-50">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{q.topic}</Badge>
                    <Badge variant={q.difficulty === 'Easy' ? 'success' : q.difficulty === 'Medium' ? 'warning' : 'destructive'}>
                      {q.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-slate-900">{q.text}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 text-slate-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteQuestion(q.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                No questions found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
