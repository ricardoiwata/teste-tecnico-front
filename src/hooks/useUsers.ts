import { useEffect, useState } from "react"

export interface User {
    id: number
    name: string
    email: string
}

export const useUsers = (onError?: (errorMessage: string) => void) => {
    const [users, setUsers] = useState<User[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0)

    useEffect(() => {
        fetchUsers()
    }, [refreshTrigger])

    const fetchUsers = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch("http://localhost:3001/users")
            if (!response.ok) {
                throw new Error("Erro ao buscar usuários: " + response.statusText)
            }
            const data: User[] = await response.json()
            setUsers(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido")
            if (onError) {
                onError(err instanceof Error ? err.message : "Erro desconhecido")
            }
        } finally {
            setLoading(false)
        }
    }

    const createUser = async (user: Omit<User, "id">) => {
        try {
            const response = await fetch("http://localhost:3001/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            })
            if (!response.ok) {
                throw new Error("Erro ao criar usuário: " + response.statusText)
            }

            setRefreshTrigger((prev) => prev + 1)
            return await response.json()
        } catch (err) {
            if (onError) {
                onError(err instanceof Error ? err.message : "Erro desconhecido")
            }
            throw err
        }
    }

    const updateUser = async (id: number, user: Omit<User, "id">) => {
        try {
            const response = await fetch(`http://localhost:3001/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            })
            if (!response.ok) {
                throw new Error("Erro ao atualizar usuário: " + response.statusText)
            }

            setRefreshTrigger((prev) => prev + 1)
            return await response.json()
        } catch (err) {
            if (onError) {
                onError(err instanceof Error ? err.message : "Erro desconhecido")
            }
            throw err
        }
    }

    const deleteUser = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3001/users/${id}`, {
                method: "DELETE",
            })
            if (!response.ok) {
                throw new Error("Erro ao deletar usuário: " + response.statusText)
            }

            setRefreshTrigger((prev) => prev + 1)
        } catch (err) {
            if (onError) {
                onError(err instanceof Error ? err.message : "Erro desconhecido")
            }
            throw err
        }
    }

    return { users, error, loading, createUser, updateUser, deleteUser, fetchUsers }
}
