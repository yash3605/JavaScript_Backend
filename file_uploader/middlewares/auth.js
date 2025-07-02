import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      console.log('Username:', username);
      console.log('Password:', password);

      const user = await prisma.user.findUnique({
        where: { username }
      });
      console.log('User from DB:', user);

      if (!user) {
        console.log('User not found.');
        return done(null, false, { message: 'Invalid username or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);

      if (!isMatch) {
        console.log('Password does not match.');
        return done(null, false, { message: 'Invalid username or password' });
      }

      console.log('Authentication successful!');
      return done(null, user);

    } catch (err) {
      console.error('Error in auth strategy:', err);
      return done(err);
    }
  }
));


passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id)},
        });

        return done(null, user);
    } catch (err) {
        done(err)
    }
})

export const isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

export default passport;
