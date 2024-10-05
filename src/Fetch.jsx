import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Fetch = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [surname, setSurname] = useState('');
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null); // Для отслеживания редактируемого пользователя

    // Обработчик для создания нового пользователя или редактирования существующего
    const handleSubmituscr = async (e) => {
        e.preventDefault();

        const user = {
            name,
            age: Number(age),
            surname
        };

        if (editingUserId) {
            // Редактируем существующего пользователя
            try {
                const response = await axios.put(`http://localhost:5001/users/${editingUserId}`, user);

                if (response.status === 200) {
                    // Обновляем пользователя в списке
                    setUsers((prevUsers) =>
                        prevUsers.map((usr) => (usr._id === editingUserId ? response.data : usr))
                    );
                    console.log('User updated:', response.data);
                }
                resetForm();
            } catch (error) {
                console.error('Error updating user:', error);
            }
        } else {
            // Создаем нового пользователя
            try {
                const response = await fetch('http://localhost:5001/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user)
                });

                if (!response.ok) {
                    throw new Error('Something went wrong');
                }

                const data = await response.json();
                console.log('User created:', data);
                setUsers((prevUsers) => [...prevUsers, data.data]);
                resetForm();
            } catch (error) {
                console.error('Error creating user:', error);
            }
        }
    };

    // Эффект для получения пользователей при монтировании компонента
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5001/users');

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setUsers(data.data); // Настройте в зависимости от структуры вашего ответа
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:5001/users/${id}`);
            setUsers((prevUsers) => prevUsers.filter(user => user._id !== id));
            console.log(`User with id ${id} deleted successfully`);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const editUser = (user) => {
        // Заполняем поля формы существующими данными пользователя
        setName(user.name);
        setAge(user.age);
        setSurname(user.surname);
        setEditingUserId(user._id); // Сохраняем ID редактируемого пользователя
    };

    const resetForm = () => {
        setName('');
        setAge('');
        setSurname('');
        setEditingUserId(null); // Сбрасываем ID после редактирования
    };

    return (
        <div>
            <h1>{editingUserId ? 'Edit User' : 'Create a User'}</h1>
            <form onSubmit={handleSubmituscr}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                />
                <button type="submit">{editingUserId ? 'Update' : 'Create'}</button>
                {editingUserId && <button type="button" onClick={resetForm}>Cancel</button>}
            </form>

            <div>
                <h1>Users List</h1>
                {
                    users.length > 0 ? (
                        <ol>
                            {users.map((user) => (
                                <div key={user._id}>
                                    <li>
                                        Name: {user.name}, Age: {user.age}, Surname: {user.surname}
                                    </li>
                                    <button onClick={() => editUser(user)} type='button'>Edit</button>
                                    <button onClick={() => deleteUser(user._id)} type='button'>Delete</button>
                                </div>
                            ))}
                        </ol>
                    ) : (
                        <p>No users found.</p>
                    )
                }
            </div>
        </div>
    );
};

export default Fetch;
