## Mongodb Setup

### MongoDB Keyfile Setup

This guide explains how to create a **MongoDB keyfile** for replica set authentication or internal communication between MongoDB nodes.

---

```bash
cd mongodb
mkdir -p secrets
cd secrets
openssl rand -base64 756 > mongodb-keyfile
chmod 400 mongodb-keyfile
sudo chown 999:999 mongodb-keyfile
```

### Setup replica

- docker compose exec -it mongodb bash
- mongosh -u your_env_init_user -p your_env_init_password --authentication admin

```bash
rs.initiate({
  _id: 'rs0',
  members: [
    { _id: 0, host: 'mongodb:27017' },
    { _id: 1, host: 'mongodb2:27017' },
  ],
});
```
