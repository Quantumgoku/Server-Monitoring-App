import subprocess
import time
import concurrent.futures
import psutil
import socket

servers = ["8.8.8.8", "142.250.193.46", "yahoo.com", "bing.com", "172.20.63.2"]

def ping_server(ip, timeout=2):
    try:
        
        output = subprocess.check_output(["ping","-w", str(timeout), ip], stderr=subprocess.STDOUT, universal_newlines=True)
        return ip, True
    except subprocess.CalledProcessError:
        return ip, False

def log_status(ip, status):
    print(f"Server {ip} is {'up' if status else 'down'}")

def monitor_servers():
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(servers)) as executor:
        futures = {executor.submit(ping_server, server): server for server in servers}
        for future in concurrent.futures.as_completed(futures):
            ip, status = future.result()
            log_status(ip, status)

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
        print("You are not connected to the private network. Skipping checks for private IPs.")
        servers = [ip for ip in servers if not ip.startswith("172.") and not ip.startswith("192.168.") and not ip.startswith("10.")]
    
    while True:
        monitor_servers()
        time.sleep(2)
