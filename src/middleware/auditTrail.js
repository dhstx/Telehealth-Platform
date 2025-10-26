import AuditLog from '../models/AuditLog.js';

export async function auditTrail(req, _res, next) {
  try {
    const userId = req.user?.id || null;
    await AuditLog.create({
      action: `${req.method} ${req.originalUrl}`,
      userId,
      timestamp: new Date(),
      meta: {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });
  } catch (err) {
    // non-blocking
  }
  next();
}
