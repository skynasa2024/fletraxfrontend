import { useEffect, useState } from 'react';
import { getTopics } from '@/api/user.ts';
import mqtt, { OnMessageCallback } from 'mqtt';

const useMqttNotifications = (mqttClient: mqtt.MqttClient | undefined, onMessage: OnMessageCallback) => {
  const [notificationsTopic, setNotificationsTopic] = useState<string | null>(null);

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

    const subscribeToTopic = async () => {
      if (mqttClient.connected) {
        await mqttClient.subscribeAsync(notificationsTopic);
      } else {
        mqttClient.once('connect', async () => {
          await mqttClient.subscribeAsync(notificationsTopic);
        });
      }

      mqttClient.on('message', onMessage);

      return () => {
        mqttClient.off('message', onMessage);
        mqttClient.unsubscribeAsync(notificationsTopic);
      };
    };

    subscribeToTopic();

  }, [mqttClient, notificationsTopic, onMessage]);

};

export { useMqttNotifications };
