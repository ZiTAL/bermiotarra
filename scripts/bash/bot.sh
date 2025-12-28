#/bin/bash
/usr/bin/podman start bermiotarra_python_1
/usr/bin/podman exec -it bermiotarra_python_1 python3 /app/bot/bot.py
/usr/bin/podman stop bermiotarra_python_1
