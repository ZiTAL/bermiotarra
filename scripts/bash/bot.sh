#!/bin/bash
/usr/bin/podman start docker_python_1
/usr/bin/podman exec docker_python_1 python3 /app/bot/bot.py
/usr/bin/podman stop docker_python_1
