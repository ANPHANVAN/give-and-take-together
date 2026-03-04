import { verify, hash, argon2id } from 'argon2';

export const hashPassword = (plainPassword: string): Promise<string> => {
  return hash(plainPassword, {
    type: argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
  });
};

export const verifyPassword = (plainPassword: string, hash: string): Promise<boolean> => {
  return verify(hash, plainPassword);
};
