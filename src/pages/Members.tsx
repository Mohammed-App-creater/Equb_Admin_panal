import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import { getEqubMembers, approveMember, rejectMember } from "../api/members";
import { Member } from "../types";
import toast from "react-hot-toast";

const Members: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [actionType, setActionType] = useState<"approve" | "removed" | null>(
    null
  );

  useEffect(() => {
    if (id) fetchMembers();
  }, [id]);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const data = await getEqubMembers(id!);
      setMembers(data);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to fetch members. Please try again.";

      toast.error(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedMember || !actionType || !id) return;
    try {
      if (actionType === "approve") await approveMember(id, selectedMember.id);
      else await rejectMember(id, selectedMember.id);

      // Update UI locally (simulate)
      setMembers(
        members.map((m) =>
          m.id === selectedMember.id
            ? {
                ...m,
                status: actionType === "approve" ? "active" : "removed",
              }
            : m
        )
      );
      toast.success(`Member ${actionType}d successfully.`);
      setSelectedMember(null);
      setActionType(null);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Operation failed. Please try again.";

      toast.error(message);
    }
  };

  if (isLoading) return <Loader />;
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-900">Member Management</h2>
        <p className="text-slate-500">
          Review and manage participation for this Equb circle.
        </p>
      </div>

      <Card className="overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {member?.user_name?.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-800">
                        {member.user_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {member.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(member?.joined_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={member.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {member.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setActionType("approve");
                          }}
                          className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-100 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setActionType("removed");
                          }}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium italic">
                        Handled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={!!selectedMember}
        onClose={() => {
          setSelectedMember(null);
          setActionType(null);
        }}
        title="Confirm Action"
        footer={
          <>
            <button
              onClick={() => {
                setSelectedMember(null);
                setActionType(null);
              }}
              className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAction}
              className={`rounded-xl px-6 py-2 text-sm font-bold text-white transition-all shadow-lg active:scale-95 ${
                actionType === "approve"
                  ? "bg-emerald-500 shadow-emerald-200"
                  : "bg-red-500 shadow-red-200"
              }`}
            >
              Confirm {actionType}
            </button>
          </>
        }
      >
        <p className="text-slate-600 leading-relaxed">
          Are you sure you want to{" "}
          <strong className="text-slate-900">{actionType}</strong> the
          membership for
          <strong className="text-slate-900">
            {" "}
            {selectedMember?.user_name}
          </strong>
          ?
          {actionType === "approve"
            ? " They will be allowed to participate and contribute."
            : " They will be removed from the list."}
        </p>
      </Modal>
    </div>
  );
};

export default Members;
