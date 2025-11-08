
import React from 'react';
import Card from '../ui/Card';
import { useAppContext } from '../../context/AppContext';
import { Notification } from '../../types';
import Button from '../ui/Button';

const NotificationItem: React.FC<{notification: Notification}> = ({notification}) => {
    const { dispatch } = useAppContext();

    const handleMarkAsRead = () => {
        dispatch({type: 'MARK_NOTIFICATION_READ', payload: notification.id});
    }

    return (
        <li className={`p-4 rounded-lg flex items-center justify-between ${notification.read ? 'bg-gray-100 dark:bg-gray-800 opacity-60' : 'bg-yellow-100 dark:bg-yellow-900/50'}`}>
            <div>
                <p className={`font-semibold ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-yellow-800 dark:text-yellow-200'}`}>Low Stock Alert</p>
                <p className={`text-sm ${notification.read ? 'text-gray-500 dark:text-gray-500' : 'text-yellow-700 dark:text-yellow-300'}`}>{notification.message}</p>
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">{new Date(notification.date).toLocaleString()}</p>
            </div>
            {!notification.read && (
                <Button size="sm" variant="secondary" onClick={handleMarkAsRead}>Mark as Read</Button>
            )}
        </li>
    )
}

const ReportsPage: React.FC = () => {
    const { state } = useAppContext();
    const sortedNotifications = [...state.notifications].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return (
        <div>
            <Card title="Notifications">
                {sortedNotifications.length > 0 ? (
                    <ul className="space-y-4">
                        {sortedNotifications.map(notification => (
                            <NotificationItem key={notification.id} notification={notification} />
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">No notifications yet.</p>
                )}
            </Card>
        </div>
    );
};

export default ReportsPage;
