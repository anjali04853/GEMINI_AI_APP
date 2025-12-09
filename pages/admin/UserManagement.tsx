import React, { useState } from 'react';
import { Search, Ban, CheckCircle, Trash2, MoreVertical, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAdminStore } from '../../store/adminStore';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/utils';

export const UserManagement = () => {
  const { users, toggleUserStatus, deleteUser } = useAdminStore();
  const [search, setSearch] = useState('');

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Users</h1>
           <p className="text-slate-500 text-sm mt-1">Manage user access and roles.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-purple"
          />
        </div>
        <div className="flex gap-2">
            <Badge className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 cursor-pointer">All</Badge>
            <Badge className="bg-transparent text-slate-400 border-transparent hover:bg-slate-100 cursor-pointer">Admins</Badge>
            <Badge className="bg-transparent text-slate-400 border-transparent hover:bg-slate-100 cursor-pointer">Users</Badge>
        </div>
      </div>

      <Card className="bg-white border-slate-200 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">User</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Role</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Joined</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-turquoise flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{user.name}</div>
                            <div className="text-xs text-slate-400">{user.email}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'admin' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                            <Shield className="w-3 h-3 mr-1" /> Admin
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-sky/10 text-brand-sky border border-brand-sky/20">
                            User
                        </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                        <div className={cn("h-2.5 w-2.5 rounded-full mr-2", user.status === 'active' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-red-500")}></div>
                        <span className={cn("text-xs font-medium capitalize", user.status === 'active' ? "text-slate-600" : "text-slate-400")}>{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                    {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="icon"
                        variant="ghost" 
                        onClick={() => toggleUserStatus(user.id)}
                        className={cn("h-8 w-8 hover:bg-slate-100", user.status === 'active' ? 'text-orange-500' : 'text-green-500')}
                        title={user.status === 'active' ? "Suspend User" : "Activate User"}
                      >
                        {user.status === 'active' ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteUser(user.id)} className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-slate-100">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};