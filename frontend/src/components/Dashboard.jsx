import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  addServer, getServers, deleteServer,getServerStatus , getRole, logoutUser } from '../services/api';
import Navbar from './Navbar';

const Dashboard = () => {
    const [servers, setServers] = useState([]);
    const [newServerIP, setNewServerIP] = useState('');
    const [newServerName, setNewServerName] = useState('');
    const [selectedServerIp, setSelectedServerIp] = useState('');
    const [serverStatus, setServerStatus] = useState('');
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const serverResponse = await getServers();
                setServers(serverResponse.data);
                const roleResponse = await getRole();
                setUserRole(roleResponse.data.role);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleAddServer = async () => {
        try {
            await addServer({ ip: newServerIP, name: newServerName });
            setNewServerIP('');
            setNewServerName('');
            const serverResponse = await getServers();
            setServers(serverResponse.data);
        } catch (error) {
            console.error('Error adding server:', error);
        }
    };

    const handleDeleteServer = async (id) => {
        try {
            await deleteServer(id);
            const serverResponse = await getServers();
            setServers(serverResponse.data);
        } catch (error) {
            console.error('Error deleting server:', error);
        }
    };

    const handleGetServerStatus = async (ip) => {
        try {
            const response = await getServerStatus(ip);
            const latestStatus = response.data[response.data.length - 1]; 
            setServerStatus(latestStatus.status);
            setSelectedServerIp(ip);
        } catch (err) {
            console.error('Error getting server status:', err);
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleGenerateReport = () => {
        navigate('/report');
    }

    const handleLogout = () => {
        logoutUser();
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <div>
        <Navbar userRole={userRole} />
        <div className="container mt-5">
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">Server Monitoring</a>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <span className="navbar-text">
                                    Role: {userRole}
                                </span>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-outline-danger ms-3" onClick={handleLogout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <h2 className="mb-4">Dashboard</h2>
            {userRole === 'admin' || userRole === 'masteradmin' ? (
                <div className="card mb-4">
                    <div className="card-header">
                        Add Server
                    </div>
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="serverIP" className="form-label">Server IP</label>
                            <input
                                type="text"
                                className="form-control"
                                id="serverIP"
                                placeholder="Server IP"
                                value={newServerIP}
                                onChange={(e) => setNewServerIP(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="serverName" className="form-label">Server Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="serverName"
                                placeholder="Server Name"
                                value={newServerName}
                                onChange={(e) => setNewServerName(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-primary" onClick={handleAddServer}>Add</button>
                    </div>
                </div>
            ) : null}
            <div className="card mb-4">
                <div className="card-header">
                    Servers
                </div>
                <ul className="list-group list-group-flush">
                    {servers.map((server) => (
                        <li key={server._id} className="list-group-item d-flex justify-content-between align-items-center">
                            {server.name}
                            <div>
                                {userRole === 'admin' || userRole === 'masteradmin' ? (
                                    <button className="btn btn-danger me-2" onClick={() => handleDeleteServer(server._id)}>Delete</button>
                                ) : null}
                                <button className="btn btn-info" onClick={() => handleGetServerStatus(server.ip)}>Get Status</button>
                                {selectedServerIp === server.ip && serverStatus && (
                                    <div className="mt-2">
                                        <p>Status: {serverStatus}</p>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="card mb-4">
                <div className="card-header">
                    Report
                </div>
                <div className="card-body">
                    <button className="btn btn-warning" onClick={handleGenerateReport}>Get Report</button>
                </div>
            </div>
            {userRole === 'masteradmin' && (
                <div className="card mb-4">
                    <div className="card-header">
                        Master Admin Actions
                    </div>
                    <div className="card-body">
                        <button className="btn btn-secondary" onClick={handleRegister}>Register New User</button>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default Dashboard;
