export default function errorHandler(err, req, res, next) {
    console.log(`[DEEPSCHEDULE] [B] [ERROR] Napotkano blad!`);
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({
      error: err.message || 'Coś poszło nie tak!'
    });
  }