import rateLimit from 'express-rate-limit';

// Rate limiting for file uploads
export const uploadRateLimit = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5, // Limit each IP to 5 uploads per windowMs
    message: {
        error: 'Too many upload attempts, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiting for code verification
export const codeRateLimit = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // Limit each IP to 10 code checks per windowMs
    message: {
        error: 'Too many code verification attempts, please try again later.',
        retryAfter: '5 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// General API rate limiting
export const apiRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
