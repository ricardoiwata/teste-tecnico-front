import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { User } from "../hooks/useUsers";

interface UserListProps {
  onEdit: (userId: number) => void;
}

interface UserListProps {
  users: User[];
  onEdit: (userId: number) => void;
  onDelete: (userId: number) => void;
}

interface UserListProps {
  users: User[];
  onEdit: (userId: number) => void;
  onDelete: (userId: number) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  onEdit,
  onDelete,
}) => {
  if (users.length === 0) {
    return <Typography variant="h6">Nenhum usuário encontrado.</Typography>;
  }

  return (
    <List>
      {users.map((user) => (
        <ListItem
          key={user.id}
          secondaryAction={
            <>
              <IconButton edge="end" onClick={() => onEdit(user.id)}>
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => onDelete(user.id)}
                sx={{ ml: 1 }}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </>
          }
        >
          <ListItemText primary={user.name} secondary={user.email} />
        </ListItem>
      ))}
    </List>
  );
};
