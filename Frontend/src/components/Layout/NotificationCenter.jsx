import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const NotificationCenter = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const getRole = () => {
        if (!token) return null;
        try {
            return jwtDecode(token).user?.role;
        } catch {
            return null;
        }
    };

    const fetchNotifications = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/api/notifications", {
                headers: { Authorization: token },
            });
            setNotifications(response.data.notifications || []);
            setUnreadCount(response.data.unreadCount || 0);
        } catch (error) {
            console.error("Unable to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        if (!token) return;
        try {
            const response = await axios.get("http://localhost:3000/api/notifications/unread-count", {
                headers: { Authorization: token },
            });
            setUnreadCount(response.data.unreadCount || 0);
        } catch (error) {
            console.error("Unable to fetch notification count:", error);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [token]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggle = () => {
        const nextOpen = !open;
        setOpen(nextOpen);
        if (nextOpen) {
            fetchNotifications();
        }
    };

    const markAllRead = async () => {
        if (!token) return;
        try {
            await axios.patch("http://localhost:3000/api/notifications/mark-all-read", {}, {
                headers: { Authorization: token },
            });
            setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Unable to mark notifications read:", error);
        }
    };

    const getDonationLink = (notification) => {
        const donationId = notification.donation?._id || notification.donation;
        if (!donationId) return "/profile";

        const role = getRole();
        if (role === "donor") return `/mydonation/${donationId}`;
        if (role === "ngos") return `/donation/${donationId}`;
        return "/profile";
    };

    const openNotification = async (notification) => {
        if (!token) return;
        try {
            if (!notification.read) {
                await axios.patch(`http://localhost:3000/api/notifications/${notification._id}/read`, {}, {
                    headers: { Authorization: token },
                });
                setUnreadCount((count) => Math.max(0, count - 1));
            }
            setNotifications((current) =>
                current.map((item) =>
                    item._id === notification._id ? { ...item, read: true } : item
                )
            );
            setOpen(false);
            navigate(getDonationLink(notification));
        } catch (error) {
            console.error("Unable to open notification:", error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={handleToggle}
                className="relative flex items-center rounded px-3 py-2 transition hover:bg-gray-700"
                aria-label="Notifications"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5-6.71V3a2 2 0 1 0-4 0v1.29A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2Z" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-600 px-1.5 py-0.5 text-center text-xs font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-3 w-96 overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl ring-1 ring-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                        <div>
                            <h2 className="text-sm font-semibold">Notifications</h2>
                            <p className="text-xs text-slate-500">{unreadCount} unread</p>
                        </div>
                        <button
                            type="button"
                            onClick={markAllRead}
                            className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
                        >
                            Mark all read
                        </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <p className="px-4 py-6 text-center text-sm text-slate-500">Loading notifications...</p>
                        ) : notifications.length === 0 ? (
                            <p className="px-4 py-6 text-center text-sm text-slate-500">No notifications yet.</p>
                        ) : (
                            notifications.map((notification) => (
                                <button
                                    type="button"
                                    key={notification._id}
                                    onClick={() => openNotification(notification)}
                                    className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${
                                        notification.read ? "bg-white" : "bg-emerald-50"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                                            <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                                            {notification.donation?.title && (
                                                <p className="mt-2 text-xs font-medium text-emerald-700">{notification.donation.title}</p>
                                            )}
                                        </div>
                                        {!notification.read && (
                                            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-600" />
                                        )}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
