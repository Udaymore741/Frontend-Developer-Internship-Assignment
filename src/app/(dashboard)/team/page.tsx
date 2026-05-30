'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useTeam } from '@/context/TeamContext';
import { useAuth } from '@/context/AppContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { MemberList } from '@/components/team/MemberList';
import { MemberFormModal } from '@/components/team/MemberFormModal';

export default function TeamPage() {
  const { removeMember } = useTeam();
  const { addToast } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRemove = (id: string) => {
    removeMember(id);
    addToast('success', 'Member removed');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Team"
        description="Manage your team members and their assignments"
        action={
          <Button leftIcon={<UserPlus size={16} />} onClick={() => setIsModalOpen(true)}>
            Add Member
          </Button>
        }
      />

      <MemberList onRemove={handleRemove} onAdd={() => setIsModalOpen(true)} />

      <MemberFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
