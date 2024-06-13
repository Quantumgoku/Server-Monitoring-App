import React, { useState, useEffect } from 'react';
import { getReport, getRole } from '../services/api';
import Navbar from './Navbar';

const Report = () => {
    const [ip, setIp] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [userRole, setUserRole] = useState('');
    const [report, setReport] = useState(null);

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const roleResponse = await getRole();
                setUserRole(roleResponse.data.role);
            } catch (error) {
                console.error('Error fetching role:', error);
            }
        };

        fetchRole();
    }, []);

    const handleGenerateReport = async () => {
        try {
            const response = await getReport({ ip, startDate, endDate });
            setReport(response.data);
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    return (
        <div>
            <Navbar userRole={userRole} />
            <div className="container mt-5">
                <h2>Generate Report</h2>
                <div className="card p-4 mb-4">
                    <div className="mb-3">
                        <label htmlFor="ip" className="form-label">Server IP</label>
                        <input
                            type="text"
                            className="form-control"
                            id="ip"
                            placeholder="Server IP"
                            value={ip}
                            onChange={(e) => setIp(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="startDate" className="form-label">Start Date</label>
                        <input
                            type="date"
                            className="form-control"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="endDate" className="form-label">End Date</label>
                        <input
                            type="date"
                            className="form-control"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <button onClick={handleGenerateReport} className="btn btn-primary">Generate Report</button>
                </div>
                {report && (
                    <div className="card p-4">
                        <h3>Report</h3>
                        <ul className="list-group">
                            {report.map((log) => (
                                <li key={log._id} className="list-group-item">
                                    {log.timestamp}: {log.status}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Report;
