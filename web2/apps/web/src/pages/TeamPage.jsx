
import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card } from '@/components/ui/card';
import { ArrowUpDown } from 'lucide-react';

const MOCK_TEAM = [
  { id: '1', name: 'Dustin Allema',  role: 'Sales Manager',  leads_assigned: 4,  deals_closed_this_week: 1, status: 'Active' },
  { id: '2', name: 'Rep One',        role: 'Sales Rep',      leads_assigned: 11, deals_closed_this_week: 3, status: 'Active' },
  { id: '3', name: 'Rep Two',        role: 'Sales Rep',      leads_assigned: 8,  deals_closed_this_week: 2, status: 'Active' },
];

export default function TeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  useEffect(() => {
    setTeam(MOCK_TEAM);
    setLoading(false);
  }, []);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedTeam = React.useMemo(() => {
    return [...team].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [team, sortConfig]);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  const SortableHead = ({ label, sortKey }) => (
    <TableHead onClick={() => handleSort(sortKey)} className="cursor-pointer hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-2">
        {label}
        <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
      </div>
    </TableHead>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
        <p className="text-muted-foreground">Manage your solar sales and support staff.</p>
      </div>

      <Card className="border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <SortableHead label="Name"                  sortKey="name" />
              <SortableHead label="Role"                  sortKey="role" />
              <SortableHead label="Leads Assigned"        sortKey="leads_assigned" />
              <SortableHead label="Deals Closed (Week)"   sortKey="deals_closed_this_week" />
              <SortableHead label="Status"                sortKey="status" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTeam.map((member) => (
              <TableRow key={member.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell className="text-muted-foreground">{member.role}</TableCell>
                <TableCell>
                  <span className="bg-muted px-2.5 py-1 rounded-md text-sm font-medium border border-border shadow-sm">
                    {member.leads_assigned}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-sm font-bold">
                    {member.deals_closed_this_week}
                  </span>
                </TableCell>
                <TableCell>
                  {member.status === 'Active' ? (
                    <div className="flex items-center gap-1.5 bg-accent/10 text-accent px-2.5 py-1 rounded-full w-max border border-accent/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                      <span className="text-xs font-semibold uppercase tracking-wider">Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full w-max border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      <span className="text-xs font-semibold uppercase tracking-wider">Away</span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
