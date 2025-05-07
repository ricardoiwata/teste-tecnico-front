import { Box, Container, Typography } from "@mui/material";
import type React from "react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UserForm from "./components/UserForm";
import { UserList } from "./components/UserList";
import { type User, useUsers } from "./hooks/useUsers";

const App: React.FC = () => {
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const handleError = (message: string) => {
    toast.error(message);
  };

  const { users, createUser, updateUser, deleteUser, fetchUsers } =
    useUsers(handleError);

  const handleUserSaved = async () => {
    await fetchUsers();
    toast.success("Usuário cadastrado com sucesso!");
    setEditingUserId(null);
  };

  const handleUpdateUser = async (userId: number, user: Omit<User, "id">) => {
    await updateUser(userId, user);
    await fetchUsers();
    toast.success("Usuário atualizado com sucesso!");
    setEditingUserId(null);
  };

  const handleDeleteUser = async (userId: number) => {
    await deleteUser(userId);
    await fetchUsers();
    toast.success("Usuário excluído com sucesso!");
    setEditingUserId(null);
  };

  return (
    <>
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" gutterBottom>
            Cadastro de Usuários
          </Typography>
        </Box>
        <UserForm
          userId={editingUserId}
          onUserSaved={handleUserSaved}
          createUser={createUser}
          updateUser={updateUser}
          onUserEdited={handleUpdateUser}
          onError={handleError}
        />
        <Box mt={5}>
          <UserList
            users={users}
            onEdit={setEditingUserId}
            onDelete={handleDeleteUser}
          />
        </Box>
      </Container>
      <ToastContainer />
    </>
  );
};

export default App;
