import envConfig from '@/config/envConfig';
import * as argon2 from 'argon2';

const PEPPER = envConfig.jwt.HASH_PEPPER;

export const hashPassword = (plainPassword: string): Promise<string> => {
  return argon2.hash(plainPassword + PEPPER, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
  });
};

export const verifyPassword = (plainPassword: string, hash: string): Promise<boolean> => {
  return argon2.verify(hash, plainPassword + PEPPER);
};
