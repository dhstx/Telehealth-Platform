import { config } from '../../../config/env.js';

// Socket.io-based Corti stub for sandbox: emits synthetic transcript + insights
export function cortiSocketHandler(io) {
  io.of('/corti').on('connection', (socket) => {
    socket.emit('connected', { projectId: config.cortiProjectId });

    const demo = [
      { transcript: 'Hello, can you hear me?', emotion: 'neutral', intent: 'greeting', urgency: 'low' },
      { transcript: 'I have chest discomfort when I walk uphill.', emotion: 'concerned', intent: 'symptom_report', urgency: 'medium' },
      { transcript: 'It lasts about 5 minutes and resolves with rest.', emotion: 'neutral', intent: 'detail', urgency: 'medium' },
      { transcript: 'No shortness of breath at rest.', emotion: 'neutral', intent: 'negation', urgency: 'low' },
    ];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= demo.length) {
        socket.emit('complete');
        clearInterval(interval);
        return;
      }
      socket.emit('corti_event', demo[idx]);
      idx += 1;
    }, 1200);

    socket.on('disconnect', () => {
      clearInterval(interval);
    });
  });
}
