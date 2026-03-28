import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell, Check, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 消息通知页面
 */
export const Notifications = () => {
  const { user } = useAuth();
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications(user?.id);

  const getNotificationIcon = (type) => {
    switch (type) {
      case '录取通知':
        return <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><Bell className="w-5 h-5 text-green-600" /></div>;
      case '拒绝通知':
        return <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"><Bell className="w-5 h-5 text-red-600" /></div>;
      case '报名成功':
        return <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><Bell className="w-5 h-5 text-blue-600" /></div>;
      default:
        return <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"><Bell className="w-5 h-5 text-gray-600" /></div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 py-4 sticky top-0 z-10 shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-bold">消息通知</h1>
        {notifications.some(n => !n.is_read) && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            <Check className="w-4 h-4 mr-1" />
            全部已读
          </Button>
        )}
      </div>

      <div className="p-4 max-w-lg mx-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无消息</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notification => (
              <Card
                key={notification.id}
                className={notification.is_read ? 'opacity-60' : ''}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-sm">{notification.title}</h3>
                        {!notification.is_read && (
                          <Badge className="bg-red-500 h-2 w-2 p-0 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                          locale: zhCN,
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
