import crypto from 'crypto';
import User, { IUser } from '../../models/user/user.schema';
import CustomError from '../../utils/custom.error';
import { signAccessToken, signRefreshToken } from '../../utils/jwt';
import { sanitizeUser } from '../../utils/sanitize.user';
import { sendEmail } from '../../utils/send.email';
import config from '../../config';

interface loginResponse {
    accessToken: string;
    refreshToken: string;
}

class AuthService {
    async register(
        name: string,
        email: string,
        password: string
    ): Promise<Partial<IUser>> {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new CustomError('User already exists!', 400);
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        return sanitizeUser(newUser);
    }

    async login(email: string, password: string): Promise<loginResponse & { user: Partial<IUser> }> {
        const user = await User.findOne({ email });
        if (!user) {
            throw new CustomError('Invalid credentials', 401);
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new CustomError('Invalid credentials', 401);
        }

        const accessToken = signAccessToken(user._id as string);
        const refreshToken = signRefreshToken(user._id as string);

        return {
            accessToken,
            refreshToken,
            user: sanitizeUser(user)
        };
    }

    /**
     * Forgot Password - Generates a reset token and emails it to the user
     */
    async forgotPassword(email: string): Promise<string> {
        const user = await User.findOne({ email });
        if (!user) {
            throw new CustomError('User not found', 404);
        }

        // Create a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
       user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
        await user.save();

        const resetLink = `${config.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send the reset email
        await sendEmail(
            user.email,
            'Password Reset Request',
            `
                <h2>Password Reset</h2>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetLink}" style="color:blue;">Reset Password</a>
                <p>This link will expire in 10 minutes.</p>
            `
        );

        return 'Password reset email sent';
    }

    /**
     * Change Password - Resets the user's password using a valid reset token
     */
    async changePassword(resetToken: string, newPassword: string): Promise<void> {
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() } // token must still be valid
        });

        if (!user) {
            throw new CustomError('Invalid or expired reset token', 400);
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
    }
}

export default new AuthService();
