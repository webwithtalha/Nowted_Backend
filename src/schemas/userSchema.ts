import { z } from 'zod';

export const loginUserSchema = z.object({
    body: z.object({
        email: z.string().email({message: "Invalid email address"}),
        password: z.string().min(6, {message: "Password must be at least 6 characters long"}),
    }),
    });

export const createUserSchema = z.object({
    body: z.object({
        username: z.string().min(3, {message: "Username must be at least 3 characters long"}),
        email: z.string().email({message: "Invalid email address"}),
        password: z.string().min(6, {message: "Password must be at least 6 characters long"}),
    }),
});    

export const updateUserSchema = z.object({
    body: z.object({
      username: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
    }),
    params: z.object({
      id: z.string(),
    }),
  });

export const userIdSchema = z.object({
    params: z.object({
      id: z.string(),
    }),
  });
  