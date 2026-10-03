// Site content. Edit text here. Each project's `media.items` holds its photos (or a video).
window.CONTENT = {
  "profile": {
    "name": "Muhammad Anas Kamran",
    "university": "The Hong Kong Polytechnic University",
    "degree": "BEng (Hons) Electrical Engineering",
    "headline": "Electrical & Electronic Engineering student building hardware that is safe, measurable and easy to use.",
    "linkedin": "https://www.linkedin.com/in/muhammad-anas-kamran",
    "email": "muhammad-anas.kamran@connect.polyu.hk",
    "location": "Hong Kong",
    "logo": "polyu"
  },
  "logos": {
    "polyu": {
      "name": "The Hong Kong Polytechnic University",
      "initials": "PolyU",
      "src": "assets/logos/polyu.svg"
    },
    "astri": {
      "name": "ASTRI",
      "initials": "ASTRI",
      "src": "assets/logos/astri.png",
      "wordmark": true
    },
    "clp": {
      "name": "CLP Power",
      "initials": "CLP",
      "src": "assets/logos/clp.svg",
      "wordmark": true
    },
    "polyu-eee": {
      "name": "PolyU Department of Electrical & Electronic Engineering",
      "initials": "EEE",
      "src": "assets/logos/polyu-eee.png",
      "wordmark": true
    },
    "outlook": {
      "name": "Microsoft Outlook",
      "initials": "",
      "src": "assets/logos/outlook.svg"
    }
  },
  "projects": [
    {
      "id": "gpu-immersion-cooling",
      "name": "Control Board for GPU Immersion Cooling",
      "description": "A 4-layer ESP32-S3 board to run, monitor and protect a single-GPU immersion cooling rig.",
      "role": "Summer Intern",
      "organization": "ASTRI, NAMI Discovery Track",
      "dates": "Jun – Aug 2026",
      "skills": [
        "ESP32-S3",
        "KiCad",
        "PlatformIO",
        "PCB Design",
        "Soldering"
      ],
      "problem": "Immersion cooling puts a GPU inside a non-conductive liquid. The pump, fans and sensors must work together, and one fault can damage hardware worth far more than the controller. The rig needed one board to keep it safe, cool it without wasting power, and show the operator what is happening.",
      "myRole": "I designed the board end to end, from schematic and 4-layer layout to part selection. I assembled and soldered it by hand, brought it up in C, and planned the full control firmware.",
      "insights": [
        {
          "title": "Safety does not depend on the firmware alone",
          "body": "I designed two separate safety layers. In hardware, a heat-activated switch turns off the power supply if the coolant gets too hot, even if the microcontroller has frozen. In firmware, a watchdog restarts the board if the safety checks ever stop, and every restart begins with the pump and fans off until a self-check passes."
        },
        {
          "title": "Efficiency needs a measurement, not an assumption",
          "body": "Fan speed follows a coolant-temperature curve, so the fans draw only what cooling requires. Two INA226 monitors read the 12 V and 5 V rails through Kelvin-sensed shunts, and a PZEM-004T reads AC input. GPU power is the difference, which includes the supply's conversion loss, a limitation I raised and my supervisor accepted."
        }
      ],
      "outcome": "Testing confirmed the power rails, temperature sensing, fan control and all three power monitors. The board shows live readings on its touchscreen and on a web page, so any phone on the same Wi-Fi network can see temperature, power and fan speeds. The touchscreen replaced a potentiometer and indicator LEDs. I kept a latching service switch in hardware on purpose.",
      "logo": "astri",
      "media": {
        "aspect": "3 / 4",
        "items": [
          {
            "src": "assets/projects/gpu-immersion-cooling.jpg?v=2",
            "alt": "The assembled 4-layer ESP32-S3 control board with screw terminals for the pump, fans, LEDs and sensors",
            "position": "45% 48%"
          }
        ]
      }
    },
    {
      "id": "ai-cad-drawing",
      "name": "AI Drawing Tool for 2D CAD Diagrams",
      "description": "A pipeline that turns an electrical part number into a standards-compliant 2D engineering drawing.",
      "role": "Summer Intern",
      "organization": "ASTRI, NAMI Discovery Track",
      "dates": "Jun – Aug 2026",
      "skills": [
        "Python",
        "Gemini API",
        "Multi-Agent Pipeline"
      ],
      "problem": "Product user manuals need wiring drawings, and KiCad schematics are hard for most users to read. Simple 2D drawings of each component are much easier to follow, but drawing every part by hand takes a long time. The project needed a tool that takes only a part number and returns a drawing with real dimensions, following the drawing standard every time.",
      "myRole": "I built the pipeline end to end: the AI agents, the checking code and the web app. I wrote both instruction files that guide the agents from scratch.",
      "insights": [
        {
          "title": "The AI looks up the part before it draws",
          "body": "A language model asked for dimensions will often make them up. So the first agent uses Gemini with Google Search to find the part's published specifications, and only then does a second agent draw it. Keeping research and drawing separate means the dimensions come from real sources, not the model's guess."
        },
        {
          "title": "Telling the AI a rule is not the same as enforcing it",
          "body": "Early versions listed the eleven drawing rules in the instructions, and the drawings still broke them. So I turned each rule into Python code that measures the finished drawing, whatever the model claims it did. One check confirms the drawing shows the part's real faces; another makes sure it is strictly black and white."
        }
      ],
      "outcome": "The pipeline works end to end: enter a part number and get an SVG drawing, checked against all eleven rules and ready to place in a manual. It runs as a web app deployed on Render, with drawings stored in Cloudflare R2.",
      "logo": "astri",
      "media": {
        "aspect": "20 / 11",
        "items": [
          {
            "type": "video",
            "src": "https://drive.google.com/file/d/1b_pt6gNomqDBwoK55WjzriiHSwQ6vYB4/preview",
            "poster": "assets/projects/ai-cad-drawing-poster.jpg",
            "videoAspect": "20 / 11",
            "alt": "Demo video of the AI drawing tool generating a 2D drawing from a part number"
          }
        ]
      }
    },
    {
      "id": "clp-inspection-robot",
      "name": "CLP Generator Inspection Robot",
      "description": "A ring-shaped robot that clamps around a power-station generator to check it for current leakage.",
      "role": "Industrial Project Trainee",
      "organization": "Dept. of Electrical & Electronic Engineering, PolyU · Industry project with CLP",
      "dates": "Jul – Aug 2025",
      "skills": [
        "Shapr3D",
        "AutoCAD",
        "3D Printing",
        "Mechanical Assembly"
      ],
      "problem": "A power-station generator has to be checked for current leakage around its whole stator. This robot is a ring that clamps around the stator and drives along and around it. Compressed-air pistons tighten its grip and push the sensors down toward the stator. The ring splits into six sections so it is easy to store and carry, so air and power had to cross every joint without getting in the way.",
      "myRole": "I was the student assistant in a six-person team led by a professor. I helped assemble the prototype in aluminium, ABS and carbon fibre, and redesigned parts that had design problems.",
      "insights": [
        {
          "title": "Air and power have to cross joints that come apart",
          "body": "The original design ran one continuous air tube across all six sections, so the tube carried the load between them and was pulled tight whenever sections separated. I designed a pass-through that lets the tube slide freely, and a 3D-printed connector that carries both the air lines and the heavy-gauge wiring across each joint."
        }
      ],
      "outcome": "The team demonstrated the prototype live to CLP during the placement, with the robot moving around the stator and detecting leakage.",
      "logo": "clp",
      "media": {
        "aspect": "4 / 3",
        "items": [
          {
            "src": "assets/projects/clp-inspection-robot-1.jpg?v=2",
            "alt": "Top view of the six-section ring robot assembled on the lab floor",
            "position": "50% 50%"
          },
          {
            "src": "assets/projects/clp-inspection-robot-2.jpg?v=2",
            "alt": "Side view of the ring robot showing the carbon-fibre panels, wiring and sensor modules",
            "position": "52% 62%"
          }
        ]
      }
    },
    {
      "id": "underwater-rov",
      "name": "Underwater Robot (ROV)",
      "description": "A small underwater robot built for the EEE Mini ROV Contest, placing 4th overall.",
      "role": "Electrical team member",
      "organization": "EEE Mini ROV Contest, PolyU · Team of 6",
      "dates": "Oct 2025",
      "skills": [
        "Arduino",
        "C++",
        "Soldering"
      ],
      "problem": "The contest asks teams to build a small underwater vehicle and complete five tasks within a time limit, such as lifting props from the pool floor and towing a hooked wire across the surface. The vehicle needed steady power, easy control from a joystick, and enough buoyancy to hold its depth.",
      "myRole": "I was one of three members in the electrical group. I set up the power supply, using a buck converter to step 12 V down to 5 V for the electronics, and soldered the connectors that join the ROV's long power cable to the supply. I also worked on the control firmware that turns joystick input into PWM thruster commands, and helped rebalance the second prototype.",
      "insights": [
        {
          "title": "Perfectly straight movement made it harder to control",
          "body": "The first prototype moved in straight lines up, down, left and right without tilting. That sounds ideal, but it turned badly, kept sinking, and needed many small corrections to line up with each prop. For the second prototype, the team moved the thrusters such that the vehicle tips forward and dives quickly, and we added buoyancy using foam boards so it no longer sank. It became much easier to steer, especially around corners."
        }
      ],
      "outcome": "The ROV placed 4th overall, completing 4 of 5 tasks within the time limit with no electrical or software failures.",
      "logo": "polyu-eee",
      "media": {
        "aspect": "4 / 3",
        "items": [
          {
            "src": "assets/projects/underwater-rov-1.jpg?v=2",
            "alt": "The ROV from above, with three thrusters, red gripper arms and foam buoyancy blocks",
            "position": "0% 50%"
          },
          {
            "src": "assets/projects/underwater-rov-2.jpg?v=2",
            "alt": "Joystick controller with an Arduino and the 12 V to 5 V buck converter",
            "position": "55% 55%"
          }
        ]
      }
    },
    {
      "id": "generator-power-monitor",
      "name": "Power Monitor for a 3-Phase Generator",
      "description": "An Arduino-based monitor that measures the output of a team-built 3-phase axial-flux generator.",
      "role": "Team of 8",
      "organization": "Industrial Centre, PolyU",
      "dates": "Feb – Apr 2025",
      "skills": [
        "Arduino",
        "C++",
        "INA219",
        "Rectifier Circuit"
      ],
      "problem": "A generator is only useful if you know how much power it produces. Our team built a 3-phase axial-flux permanent-magnet generator, and it needed a way to measure its output voltage, current and power and show them clearly.",
      "myRole": "I built the power-monitoring subsystem: a rectifier, an INA219 sensor read by an Arduino, and firmware that calculates output power and shows voltage, current and power on a small screen.",
      "insights": [
        {
          "title": "The sensor reads DC, but the generator makes AC",
          "body": "The INA219 can only measure DC, while a 3-phase generator produces AC. So the monitor starts with a rectifier that converts the output to DC before the sensor reads it."
        },
        {
          "title": "The monitor could not wait for the generator",
          "body": "The generator was still being built, so I tested the monitor on its own. I fed it from the lab's AC power supply in place of the generator and checked its readings against a multimeter."
        }
      ],
      "outcome": "The monitor worked, and its readings agreed with the multimeter. The generator itself did not produce usable output, so the monitor was never used on its real source.",
      "logo": "polyu",
      "media": {
        "aspect": "3 / 4",
        "items": [
          {
            "src": "assets/projects/generator-power-monitor-1.jpg?v=2",
            "alt": "Breadboard power monitor with an Arduino Nano and INA219, showing voltage, current and power on an LCD",
            "position": "50% 64%"
          },
          {
            "src": "assets/projects/generator-power-monitor-2.jpg?v=2",
            "alt": "The team-built axial-flux generator with its copper stator coils",
            "position": "45% 55%"
          }
        ]
      }
    },
    {
      "id": "robotic-arm-cad",
      "name": "Robotic Arm Design (CAD)",
      "description": "A six-joint pick-and-place arm designed and motion-tested in SOLIDWORKS.",
      "role": "Solo coursework",
      "organization": "Industrial Centre, PolyU",
      "dates": "Feb – Apr 2025",
      "skills": [
        "SOLIDWORKS",
        "Motion Study"
      ],
      "problem": "The coursework brief was to design a robotic arm that could pick and place objects. Six joints let the gripper reach a point from many angles, but only if each joint really moves the way it should. The arm was designed and tested entirely in CAD, so the simulation had to be trustworthy.",
      "myRole": null,
      "insights": [
        {
          "title": "Simulated joints must stop where real ones would",
          "body": "In a CAD assembly, parts can rotate through angles a real joint never could. I set limits on each joint so it matched a real range of motion, which means the simulation only showed movements a built arm could actually make."
        }
      ],
      "outcome": "The motion study confirmed the arm reaches its full intended working range with every joint inside its limits. The arm was not built.",
      "logo": "polyu",
      "media": {
        "aspect": "4 / 3",
        "items": [
          {
            "src": "assets/projects/robotic-arm-cad.jpg?v=2",
            "alt": "SOLIDWORKS render of the six-joint robotic arm on its base with the control board",
            "fit": "contain",
            "background": "#FFFFFF"
          }
        ]
      }
    }
  ]
};
