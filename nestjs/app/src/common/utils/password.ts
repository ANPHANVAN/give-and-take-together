import { verify, hash, argon2id } from 'argon2';
export const hashPassword = (plainPassword: string): Promise<string> => {
  const pepper = process.env.HASH_PEPPER;
  return hash(plainPassword + pepper, {
    type: argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
  });
};

export const verifyPassword = (plainPassword: string, hash: string): Promise<boolean> => {
  const pepper = process.env.HASH_PEPPER;

  return verify(hash, plainPassword + pepper);
};
