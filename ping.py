import subprocess
import time
import concurrent.futures
import pymongo
from datetime import datetime

# MongoDB setup
client = pymongo.MongoClient("mongodb+srv://Quant:Quant@cluster0.2zexqm3.mongodb.net/")
test_db = client["test"]
status_collection = test_db["serverstatuslogs"]
servers_collection = test_db["servers"]

def get_servers():
    servers = servers_collection.find({})
    return [server["ip"] for server in servers]

def ping_server(ip, timeout=2):
    try:
        output = subprocess.check_output(["ping", "-w", str(timeout), ip], stderr=subprocess.STDOUT, universal_newlines=True)
        return ip, True
    except subprocess.CalledProcessError:
        return ip, False

def log_status(ip, status):
    timestamp = datetime.utcnow()
    status_collection.insert_one({
        "ip": ip,
        "status": "up" if status else "down",
        "timestamp": timestamp
    })
    print(f"Logged {ip} as {'up' if status else 'down'} at {timestamp}")

def monitor_servers():
    servers = get_servers()
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(servers)) as executor:
        futures = {executor.submit(ping_server, server): server for server in servers}
        for future in concurrent.futures.as_completed(futures):
            ip, status = future.result()
            log_status(ip, status)

if __name__ == "__main__":
    while True:
        monitor_servers()
        time.sleep(2)
