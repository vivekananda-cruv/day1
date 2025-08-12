import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { requestPermissionAndGetToken, onMessage, messaging } from '../firebase';

const API_BASE = 'http://localhost:8000/api';

export default function NotificationManager() {
  const [token, setToken] = useState('');
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    // Listen for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground message', payload);
      alert(`Notification: ${payload.notification?.title}\n${payload.notification?.body}`);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  const handleGetToken = async () => {
    try {
      setMsg('Requesting permission...');
      const fcmToken = await requestPermissionAndGetToken();
      setToken(fcmToken);
      setMsg('Token received — saving to backend...');
      await axios.post(`${API_BASE}/save-fcm-token/`, { token: fcmToken });
      setMsg('Token saved on backend.');
    } catch (err) {
      console.error(err);
      setMsg('Error: ' + (err.message || 'unknown'));
    }
  };

  const handleSendNotification = async () => {
    if (!title || !body) { alert('fill title + body'); return; }
    try {
      const resp = await axios.post(`${API_BASE}/send-notification/`, { title, body });
      alert(`Sent: success=${resp.data.success_count}, failure=${resp.data.failure_count}`);
    } catch (err) {
      console.error(err);
      alert('Error sending: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={{padding:20}}>
      <h2>Push Notification Demo</h2>

      <div style={{marginBottom:10}}>
        <button onClick={handleGetToken}>Request Permission & Get Token</button>
        <div style={{marginTop:8, color: token ? 'green' : 'black'}}>{msg}</div>
      </div>

      {token && (
        <div style={{marginBottom:10}}>
          <label>FCM token (saved to backend):</label>
          <textarea readOnly value={token} style={{width:'100%', height:80}} />
        </div>
      )}

      <div style={{marginBottom:10}}>
        <h3>Send Test Notification (from frontend → backend → FCM)</h3>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <br />
        <textarea placeholder="Body" value={body} onChange={e=>setBody(e.target.value)} style={{width:'100%',height:80}} />
        <br />
        <button onClick={handleSendNotification} disabled={!token}>Send Notification</button>
      </div>
    </div>
  );
}
