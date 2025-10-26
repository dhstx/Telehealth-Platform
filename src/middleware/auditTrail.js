import AuditLog from '../models/AuditLog.js';

export async function auditTrail(req, _res, next) {
  try {
    const userId = req.user?.id || 'anonymous';
    const action = `${req.method} ${req.originalUrl}`;
    await AuditLog.create({ action, userId });
  } catch (err) {
    // Swallow errors to not block the request path
  } finally {
    next();
  }
}
