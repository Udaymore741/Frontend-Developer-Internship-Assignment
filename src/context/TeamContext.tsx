'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { TeamMember, MemberFormData } from '@/types';
import { mockTeam } from '@/data/mockTeam';
import { generateId } from '@/lib/utils';

interface TeamContextType {
  members: TeamMember[];
  isLoading: boolean;
  addMember: (data: MemberFormData) => void;
  removeMember: (id: string) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<TeamMember[]>(mockTeam);
  const [isLoading] = useState(false);

  const addMember = useCallback((data: MemberFormData) => {
    const newMember: TeamMember = {
      ...data,
      id: generateId(),
      joinedAt: new Date().toISOString(),
    };
    setMembers((prev) => [...prev, newMember]);
  }, []);

  const removeMember = useCallback((id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return (
    <TeamContext.Provider value={{ members, isLoading, addMember, removeMember }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam(): TeamContextType {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error('useTeam must be used within TeamProvider');
  return ctx;
}
