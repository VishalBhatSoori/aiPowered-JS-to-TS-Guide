
#  ![alt text](frontend/public/JsToTs-converted-from-webp.svg) AI-Powered-JavaScript-to-Typescript-Guide
### *This is an ai powered guide to help me convert my javascript code to typescript and debug any issues in my code and correct it using Gemini Api and React,Nodejs and Express*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](#)
[![Docker Support](https://img.shields.io/badge/docker-ready-blue?logo=docker)](#)

## 🎨 Preview

! Send the Request Here by Pasting or Writing the Code and Press Review![alt text](/assets/image.png)! Request is Being Processed![alt text](/assets/image-3.png)! Response![alt text](/assets/image-1.png)! Response Header with Server:Nginx![alt text](/assets/image-2.jpeg)! Rate Limiting Based on IP to prevent single user from making multiple requests![alt text](/assets/image-4.jpeg)

## 

## 🏗 Architecture 
![alt text](/assets/image-5.png)

## 🛠 Tech Stack

* **Frontend:** React
* **Backend:** Node.js (Express)
* **AI Engine:** Gemini API
* **Infrastructure:** Docker , Nginx , AWS(EC2 instance) and Vercel

## Capacity Planning and Estimation

Our infrastructure is highly optimized to handle substantial concurrent traffic smoothly, utilizing custom Nginx and system-level configurations on our AWS EC2 instance:

### 1. Maximum Connection Capacity (System & Nginx)
* **OS File Descriptor Limits:** The EC2 Linux environment (`limits.conf`, `commonsession.conf`, & Systemd `editnginx.conf`) has `nofile` (LimitNOFILE) strictly set to **65,536**. This is a hard OS boundary for maximum open sockets.
* **Nginx Workers & Connections:** Nginx is configured with `worker_processes 2` and `worker_connections 30000`. This gives the reverse proxy a theoretical maximum capacity of **60,000 simultaneous connections** (2 × 30,000), safely fitting within the OS file descriptor limits. **Important:** Because Nginx acts as a reverse proxy, each client request consumes *two* connections: one connection between the client (Frontend on Vercel) and Nginx, and another between Nginx and the Node.js backend container. Therefore, the actual maximum number of concurrent client requests the system can handle is **30,000**.
* **Throughput Estimation:** Based on our tests introducing a 5-second response delay (to mimic the processing time of the Gemini API), the system achieved a throughput of **~6,000 requests per second (RPS)**. This aligns perfectly with the mathematical model: **30,000 concurrent capacity ÷ 5 seconds average response time = 6,000 RPS**.

### 2. Application Load Balancing & Timeouts
* **Backend Nodes:** Traffic is distributed across two separate Node.js processes (Ports `3001` & `3002`) using the `least_conn` algorithm. This ensures the Node process with the fewest active requests gets the next request, preventing single-thread event loop bottlenecks.
* **Keepalive & Timeouts:** Nginx maintains `keepalive 64` idle connections to the backend to reduce TCP handshake overhead. Because AI processing via Gemini API takes time, extended timeouts are in place (`proxy_read_timeout 120s`, `proxy_connect_timeout 300s`) to prevent premature gateway drops.

### 3. Rate Limiting & Client Backoff Strategy
* **IP State Tracking:** Nginx has a `limit_conn_zone` allocating **10MB** of memory (`zone=addr:10m`), which is capable of tracking state for approximately **160,000 unique IP addresses** concurrently.
* **Backoff Calculation:** When connection rates exceed the allocated limits, Nginx explicitly triggers a **`429 Too Many Requests`** status (`limit_conn_status 429;`). Client applications capturing this 429 code must implement an **Exponential Backoff** retry algorithm (e.g., base wait of 1s, doubling up to a max cap) before resending code review requests. This guarantees fair usage and system stability during traffic spikes or abuse attempts.
