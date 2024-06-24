import React, { useState, useEffect } from 'react';
import { getReport, getRole, getServers } from '../services/api';
import Navbar from './Navbar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Report = () => {
    const [ip, setIp] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [userRole, setUserRole] = useState('');
    const [report, setReport] = useState(null);
    const [ips, setIps] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const roleResponse = await getRole();
                setUserRole(roleResponse.data.role);
                
                const serverResponse = await getServers();
                setIps(serverResponse.data.map(server => server.ip));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleGenerateReport = async () => {
        try {
            const response = await getReport({ ip, startDate, endDate });
            setReport(response.data);
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    const handleDownloadPDF = () => {
        if (!report) {
            alert('Please generate the report first!');
            return;
        }

        const doc = new jsPDF();
        doc.text(`Report for IP: ${ip}`, 10, 10);
        doc.text(`Date Range: ${startDate} to ${endDate}`, 10, 20);

        const tableColumns = ["Down Date", "Down Time", "Up Date", "Up Time", "Duration"];
        const tableRows = report.map(log => [
            log.downDate,
            log.downTime,
            log.upDate,
            log.upTime,
            log.duration
        ]);

        doc.autoTable({
            head: [tableColumns],
            body: tableRows,
            startY: 30,
        });

        doc.save(`report_${ip}_${startDate}_to_${endDate}.pdf`);
    };

    return (
        <div>
            <Navbar userRole={userRole} />
            <div className="container mt-5">
                <h2>Generate Report</h2>
                <div className="card p-4 mb-4">
                    <div className="mb-3">
                        <label htmlFor="ip" className="form-label">Server IP</label>
                        <select
                            className="form-select"
                            id="ip"
                            value={ip}
                            onChange={(e) => setIp(e.target.value)}
                        >
                            <option value="" disabled>Select an IP</option>
                            {ips.map((serverIp) => (
                                <option key={serverIp} value={serverIp}>
                                    {serverIp}
                                </option>
                            ))}
                        </select>
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
                    <button onClick={handleGenerateReport} className="btn btn-primary me-2">Generate Report</button>
                    <button onClick={handleDownloadPDF} className="btn btn-secondary">Download PDF</button>
                </div>
                {report && (
                    <div className="card p-4">
                        <h3>Report</h3>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Down Date</th>
                                    <th>Down Time</th>
                                    <th>Up Date</th>
                                    <th>Up Time</th>
                                    <th>Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.map((log) => (
                                    <tr key={log._id}>
                                        <td>{log.downDate}</td>
                                        <td>{log.downTime}</td>
                                        <td>{log.upDate}</td>
                                        <td>{log.upTime}</td>
                                        <td>{log.duration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Report;
