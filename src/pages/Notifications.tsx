import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import {
  getNotifications,
  markNotificationAsRead,
  Notification,
} from "../api/notifications";
import toast from "react-hot-toast";

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<string[]>([]); // track updating notifications

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Mark single notification as read
  const handleMarkAsRead = async (id: string) => {
    if (updatingIds.includes(id)) return; // avoid double click
    setUpdatingIds((prev) => [...prev, id]);

    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    } finally {
      setUpdatingIds((prev) => prev.filter((uid) => uid !== id));
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (!unreadIds.length) return;

    setUpdatingIds(unreadIds);
    try {
      await Promise.all(unreadIds.map((id) => markNotificationAsRead(id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to mark all notifications as read";

        toast.error(message);
    } finally {
      setUpdatingIds([]);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
        <button
          onClick={handleMarkAllAsRead}
          className="text-sm font-bold text-primary hover:underline"
          disabled={updatingIds.length > 0}
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <EmptyState
            title="All Caught Up!"
            description="You don't have any new notifications at the moment."
          />
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`group flex items-start gap-4 p-5 rounded-3xl border transition-all ${
                n.is_read
                  ? "bg-card border-border"
                  : "bg-primary/5 border-primary/10 ring-1 ring-primary/5"
              }`}
            >
              <div
                className={`h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center ${
                  n.notif_type === "alert"
                    ? "bg-destructive/10 text-destructive"
                    : n.notif_type === "success"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4
                    className={`text-sm font-bold ${
                      n.is_read ? "text-foreground" : "text-primary"
                    }`}
                  >
                    {n.notif_type}
                  </h4>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    {n.updated_at}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {n.message}
                </p>
                {!n.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    disabled={updatingIds.includes(n.id)}
                    className="mt-3 text-[10px] font-black uppercase tracking-widest text-primary hover:text-indigo-700 disabled:opacity-50"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
