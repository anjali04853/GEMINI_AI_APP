
import React from 'react';
import { Database, Plus, ToggleLeft, ToggleRight, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAdminStore } from '../../store/adminStore';

export const DatasetManagement = () => {
  const { datasets, toggleDatasetStatus } = useAdminStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Dataset Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Dataset
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {datasets.map((dataset) => (
          <Card key={dataset.id} className={dataset.isActive ? "border-blue-200 bg-blue-50/20" : "border-slate-200 opacity-80"}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="p-2 bg-white rounded-lg border border-slate-100">
                  <Database className={`h-6 w-6 ${dataset.isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                </div>
                <button onClick={() => toggleDatasetStatus(dataset.id)} className="text-slate-500 hover:text-blue-600">
                  {dataset.isActive ? <ToggleRight className="h-8 w-8 text-green-500" /> : <ToggleLeft className="h-8 w-8 text-slate-400" />}
                </button>
              </div>
              <CardTitle className="mt-4">{dataset.name}</CardTitle>
              <CardDescription>{dataset.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-slate-500">Questions:</span>
                <span className="font-semibold">{dataset.questionCount}</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-6">
                <span className="text-slate-500">Last Updated:</span>
                <span>{new Date(dataset.lastUpdated).toLocaleDateString()}</span>
              </div>
              <Button variant="outline" className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Edit Content
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
