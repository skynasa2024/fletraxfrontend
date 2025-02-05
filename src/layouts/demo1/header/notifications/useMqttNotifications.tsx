import { useEffect, useState } from 'react';
import { getTopics } from '@/api/user.ts';
import { OnMessageCallback } from 'mqtt';
import { useMqttProvider } from '@/providers/MqttProvider';

const useMqttNotifications = (onMessage: OnMessageCallback) => {
  const [notificationsTopic, setNotificationsTopic] = useState<string | null>(null);
  const { mqttClient } = useMqttProvider();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topics = await getTopics();
        const notificationsTopic = topics.notifications[0];
        setNotificationsTopic(notificationsTopic || null);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    if (!mqttClient) return;
    fetchTopics();

    return () => {
      setNotificationsTopic(null);
    };
  }, [mqttClient]);

  useEffect(() => {
    if (!mqttClient || !notificationsTopic) return;

    if (mqttClient.connected) {
      mqttClient.subscribeAsync(notificationsTopic);
    } else {
      mqttClient.once('connect', async () => {
        mqttClient.subscribeAsync(notificationsTopic);
      });
    }

    mqttClient.on('message', onMessage);

    return () => {
      mqttClient.off('message', onMessage);
      mqttClient.unsubscribeAsync(notificationsTopic);
    };
  }, [mqttClient, notificationsTopic, onMessage]);
};

export { useMqttNotifications };
