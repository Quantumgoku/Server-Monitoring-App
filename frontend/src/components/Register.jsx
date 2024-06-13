import React, { useState } from 'react';
import { registerUser } from '../services/api';
import Navbar from './Navbar';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await registerUser({ username, password, role });
            setMessage('User registered successfully!');
            console.log('User registered:', response.data);
        } catch (error) {
            console.error('Error registering user:', error);
            setMessage('Error registering user');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h2>Register</h2>
                {message && <div className="alert alert-info">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Role:</label>
                        <select
                            className="form-select"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="">Select role</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="masteradmin">Master Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
