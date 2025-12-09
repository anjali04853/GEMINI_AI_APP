import React from 'react';
import { Database, Plus, ToggleLeft, ToggleRight, Edit, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAdminStore } from '../../store/adminStore';
import { cn } from '../../lib/utils';

export const DatasetManagement = () => {
  const { datasets, toggleDatasetStatus } = useAdminStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-white">Datasets</h1>
           <p className="text-slate-400 text-sm mt-1">Manage question collections and packs.</p>
        </div>
        <Button className="bg-brand-purple hover:bg-brand-darkPurple text-white shadow-lg shadow-brand-purple/20">
          <Plus className="mr-2 h-4 w-4" />
          Create Dataset
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {datasets.map((dataset) => (
          <Card 
            key={dataset.id} 
            className={cn(
               "bg-brand-darkCharcoal border-t-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group",
               dataset.isActive ? "border-brand-sky border-x-slate-700 border-b-slate-700" : "border-slate-600 opacity-75 hover:opacity-100"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <div className={cn(
                    "p-2.5 rounded-xl border border-slate-700 transition-colors",
                    dataset.isActive ? "bg-brand-sky/10 text-brand-sky" : "bg-slate-800 text-slate-500"
                )}>
                  <Database className="h-6 w-6" />
                </div>
                <button 
                    onClick={() => toggleDatasetStatus(dataset.id)} 
                    className="text-slate-500 hover:text-white transition-colors focus:outline-none"
                    title={dataset.isActive ? "Deactivate" : "Activate"}
                >
                  {dataset.isActive ? <ToggleRight className="h-9 w-9 text-green-500" /> : <ToggleLeft className="h-9 w-9 text-slate-600" />}
                </button>
              </div>
              <CardTitle className="text-xl text-white group-hover:text-brand-sky transition-colors">{dataset.name}</CardTitle>
              <CardDescription className="text-slate-400 h-10 line-clamp-2">{dataset.description}</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="bg-slate-800/50 rounded-lg p-3 space-y-2 border border-slate-700/50">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center text-slate-400 gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Questions</span>
                    </div>
                    <span className="font-mono font-bold text-white">{dataset.questionCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center text-slate-400 gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Updated</span>
                    </div>
                    <span className="font-mono text-slate-300">{new Date(dataset.lastUpdated).toLocaleDateString()}</span>
                  </div>
               </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 hover:border-slate-500">
                <Edit className="mr-2 h-4 w-4" />
                Edit Content
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};