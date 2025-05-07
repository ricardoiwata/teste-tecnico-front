import {
  Box,
  Button,
  Grid,
  GridProps,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { User, useUsers } from "../hooks/useUsers";

interface UserFormProps {
  userId: number | null;
  onUserSaved: () => void;
  onUserEdited: (userId: number, user: User) => void;
  createUser: (user: Omit<User, "id">) => Promise<void>;
  updateUser: (id: number, user: Omit<User, "id">) => Promise<void>;
  onError: (errorMessage: string) => void;
}

const UserForm: React.FC<UserFormProps> = ({
  userId,
  onUserSaved,
  onUserEdited,
  onError,
}) => {
  const { users, createUser, updateUser } = useUsers(onError);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    const user = users.find((user) => user.id === userId);
    if (user) {
      setName(user.name);
      setEmail(user.email);
    } else {
      setName("");
      setEmail("");
    }
  }, [userId, users]);

  const validate = () => {
    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim()) newErrors.name = "Nome é obrigatório";
    if (!email.trim()) newErrors.email = "Email é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Email inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const user = { name, email };

    try {
      if (userId) {
        await updateUser(userId, user);
        onUserEdited(userId, { id: userId, ...user });
      } else {
        await createUser(user);
        onUserSaved();
      }
    } catch (error) {
      // Handle error appropriately
      onError("Ocorreu um erro ao salvar o usuário.");
    } finally {
      setName("");
      setEmail("");
      setErrors({});
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      maxWidth={500}
      mx="auto"
      p={4}
      bgcolor="#f9f9f9"
      borderRadius={2}
      boxShadow={3}
    >
      <Typography variant="h6" gutterBottom>
        {userId ? "Editar Usuário" : "Criar Usuário"}
      </Typography>
      <Grid container spacing={2}>
        <Grid {...({ item: true, xs: 12 } as GridProps)}>
          <TextField
            fullWidth
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            error={!!errors.name}
            helperText={errors.name}
            autoFocus
          />
        </Grid>
        <Grid {...({ item: true, xs: 12 } as GridProps)}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>
        <Grid {...({ item: true, xs: 12 } as GridProps)}>
          <Button variant="contained" color="primary" type="submit">
            {userId ? "Atualizar" : "Criar"} Usuário
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserForm;
