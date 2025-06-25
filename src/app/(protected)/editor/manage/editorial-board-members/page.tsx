"use client"
import React, { useState, useEffect } from "react";
import { EditorialBoardMembersTable } from "@/components/editorial-board-members/EditorialBoardMembersTable";
import { Button } from "@/components/ui/button";
import EditorialBoardMemberFormModal from "@/components/editorial-board-members/EditorialBoardMemberFormModal";
import { editorialBoardMembers } from "@/db/schema";
import { toast } from "sonner";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

const EditorialBoardMembersPage = () => {
  const [members, setMembers] = useState<InferSelectModel<typeof editorialBoardMembers>[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<InferSelectModel<typeof editorialBoardMembers> | null>(null);

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/editorial-board-members");
      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }
      const data: InferSelectModel<typeof editorialBoardMembers>[] = await response.json();
      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to load editorial board members.");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleEdit = (member: InferSelectModel<typeof editorialBoardMembers>) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = async (memberId: string) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        const response = await fetch(`/api/editorial-board-members/${memberId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete member");
        }
        toast.success("Editorial board member deleted successfully.");
        fetchMembers();
      } catch (error) {
        console.error("Error deleting member:", error);
        toast.error("Failed to delete editorial board member.");
      }
    }
  };

  const handleAddMember = () => {
    setSelectedMember(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData: InferInsertModel<typeof editorialBoardMembers>) => {
    try {
      let response;
      if (selectedMember) {
        // Update existing member
        response = await fetch(`/api/editorial-board-members/${selectedMember.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error("Failed to update member");
        }
        toast.success("Editorial board member updated successfully.");
      } else {
        // Add new member
        response = await fetch("/api/editorial-board-members", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error("Failed to add member");
        }
        toast.success("Editorial board member added successfully.");
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (error) {
      console.error("Error saving member:", error);
      toast.error("Failed to save editorial board member.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Editorial Board Members</h1>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddMember}>Add New Member</Button>
      </div>
      <EditorialBoardMembersTable
        data={members}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EditorialBoardMemberFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        member={selectedMember}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default EditorialBoardMembersPage;
