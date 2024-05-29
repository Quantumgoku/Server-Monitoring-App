import subprocess
import requests
import time
import concurrent.futures
from datetime import datetime
import psutil
import socket

servers = ["8.8.8.8", "142.250.193.46", "yahoo.com", "bing.com","172.20.63.2"]
server_status = {server: {'status': None, 'last_change': datetime.now(), 'downtime': [], 'reasons': []} for server in servers}

def ping_server(ip):
    try:
        output = subprocess.check_output(["ping", ip], stderr=subprocess.STDOUT, universal_newlines=True)
        return ip, True, None
    except subprocess.CalledProcessError as e:
        if "Name or service not known" in e.output:
            reason = "DNS resolution failed"
        elif "Destination Host Unreachable" in e.output:
            reason = "Host unreachable"
        elif "Request timed out" in e.output or "100% packet loss" in e.output:
            reason = "Request timed out"
        else:
            reason = "Unknown error"
        return ip, False, reason

def http_check(url):
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return url, True, None
        else:
            return url, False, f"HTTP {response.status_code}"
    except requests.RequestException as e:
        return url, False, str(e)

def traceroute(ip):
    try:
        output = subprocess.check_output(["traceroute", ip], stderr=subprocess.STDOUT, universal_newlines=True)
        return ip, True, None
    except subprocess.CalledProcessError as e:
        return ip, False, e.output

def log_status(ip, status, reason):
    current_time = datetime.now()
    last_status = server_status[ip]['status']
    
    if last_status is None or last_status != status:
        if last_status is not None and not status:
            # Log the downtime start
            server_status[ip]['downtime'].append({'start': current_time, 'reason': reason})
        elif last_status is not None and status:
            # Log the downtime end
            last_downtime = server_status[ip]['downtime'][-1]
            last_downtime['end'] = current_time
            last_downtime['duration'] = (current_time - last_downtime['start']).total_seconds()
        
        server_status[ip]['status'] = status
        server_status[ip]['last_change'] = current_time

    if not status:
        server_status[ip]['reasons'].append(reason)

    print(f"Server {ip} is {'up' if status else 'down'}: {reason if reason else ''}")

def monitor_servers():
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(servers)) as executor:
        while True:
            futures = {executor.submit(ping_server, server): server for server in servers}
            for future in concurrent.futures.as_completed(futures):
                ip, status, reason = future.result()
                if not status:
                    _, status_http, reason_http = http_check(ip)
                    if not status_http:
                        _, status_trace, reason_trace = traceroute(ip)
                        reason = reason_trace if not status_trace else reason_http
                log_status(ip, status, reason)
            time.sleep(5)

def generate_report(ip, from_date, to_date):
    from_date = datetime.strptime(from_date, "%Y-%m-%d %H:%M:%S")
    to_date = datetime.strptime(to_date, "%Y-%m-%d %H:%M:%S")
    report = {"total_downtime": 0, "details": []}

    for downtime in server_status[ip]['downtime']:
        if 'end' in downtime and from_date <= downtime['start'] <= to_date:
            report['details'].append({
                'from': downtime['start'],
                'to': downtime['end'],
                'duration': downtime['duration'],
                'reason': downtime['reason']
            })
            report['total_downtime'] += downtime['duration']

    return report

def check_private_network():
    addrs = psutil.net_if_addrs()
    for iface_name, iface_addrs in addrs.items():
        for addr in iface_addrs:
            if addr.family == socket.AF_INET:  # Check only IPv4 addresses
                ip_addr = addr.address
                if ip_addr.startswith("10.") or ip_addr.startswith("172.") or ip_addr.startswith("192.168."):
                    return True
    return False

if __name__ == "__main__":
    if not check_private_network():
        print("You are not connected to the private network.")
    else:
        monitoring_thread = concurrent.futures.ThreadPoolExecutor().submit(monitor_servers)
        
        ping_server("172.20.63.2")
        time.sleep(10)
        #report = generate_report("172.20.63.2", "2024-05-23 00:00:00", "2024-05-23 23:59:59")
        #print(report)
