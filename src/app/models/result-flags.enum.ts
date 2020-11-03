export enum ResultFlags {
    unknownError = 0x0,
    success = 0x1,
    recaptchaError = 0x2,
    requestRateLimit = 0x3,
    modelError = 0x4,
    notVerified = 0x5,
    accountIsBanned = 0x6,
    databaseError = 0x7
}
