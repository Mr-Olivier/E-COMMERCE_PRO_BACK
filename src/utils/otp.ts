export const generateOTP = (length = 6): string => {
  // Generate random numeric OTP
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};
