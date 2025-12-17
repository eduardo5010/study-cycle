import express from 'express';
import type { Request, Response } from 'express';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection.js';
import { users } from '../db/schema.js';

// Passport configuration
passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, id));
    done(null, user[0]);
  } catch (error) {
    done(error);
  }
});

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: '/api/auth/github/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        let user = await db
          .select()
          .from(users)
          .where(eq(users.email, profile.emails?.[0].value || ''));
        if (user.length === 0) {
          const [firstName, ...lastName] = (profile.displayName || '').split(' ');
          const hashedPassword = await bcrypt.hash('oauth', 10);
          const newUser = await db
            .insert(users)
            .values({
              email: profile.emails?.[0].value || '',
              password: hashedPassword,
              firstName: firstName || '',
              lastName: lastName.join(' ') || '',
              avatar: profile.photos?.[0].value,
            })
            .returning();
          user = newUser;
        }
        return done(null, user[0]);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        let user = await db
          .select()
          .from(users)
          .where(eq(users.email, profile.emails?.[0].value || ''));
        if (user.length === 0) {
          const [firstName, ...lastName] = (profile.displayName || '').split(' ');
          const hashedPassword = await bcrypt.hash('oauth', 10);
          const newUser = await db
            .insert(users)
            .values({
              email: profile.emails?.[0].value || '',
              password: hashedPassword,
              firstName: firstName || '',
              lastName: lastName.join(' ') || '',
              avatar: profile.photos?.[0].value,
            })
            .returning();
          user = newUser;
        }
        return done(null, user[0]);
      } catch (error) {
        return done(error);
      }
    }
  )
);

const router = express.Router();

// Login route
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await db.select().from(users).where(eq(users.email, email));
    if (user.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user[0].password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user: user[0] });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Signup route
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name required' });
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [firstName, ...lastName] = name.split(' ');
    const newUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        firstName: firstName || '',
        lastName: lastName.join(' ') || '',
      })
      .returning();

    const token = jwt.sign({ userId: newUser[0].id }, process.env.JWT_SECRET || 'secret');
    res.status(201).json({ token, user: newUser[0] });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Logout route
router.post('/logout', (_req: Request, res: Response) => {
  res.json({ message: 'Logout endpoint' });
});

// Verify token route
router.post('/verify', (_req: Request, res: Response) => {
  res.json({ message: 'Token verification endpoint' });
});

// OAuth routes
router.get('/github', passport.authenticate('github'));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req: any, res: Response) => {
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET || 'secret');
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&provider=github`);
  }
);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: any, res: Response) => {
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET || 'secret');
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&provider=google`);
  }
);

export default router;
