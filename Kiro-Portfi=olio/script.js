// ===== Boot Sequence Animation =====
(function() {
    const bootScreen = document.getElementById('boot-screen');
    const bootLinesEl = document.getElementById('boot-lines');
    const progressBar = document.getElementById('progress-bar');
    const bootStatus = document.getElementById('boot-status');

    // Skip boot if already seen this session
    if (sessionStorage.getItem('booted')) {
        bootScreen.remove();
        return;
    }

    const bootMessages = [
        { text: 'BIOS v4.2.1 - Darshan Systems Inc.', type: 'dim' },
        { text: 'Performing POST check...', type: 'dim' },
        { text: 'CPU: Cloud Engineer x64 @ 3.83 GHz', type: 'normal' },
        { text: 'RAM: 1200 racks allocated', type: 'normal' },
        { text: 'Checking disk integrity...                    [  OK  ]', type: 'ok' },
        { text: 'Loading kernel modules...', type: 'dim' },
        { text: '  > aws-sdk.module                           [  OK  ]', type: 'ok' },
        { text: '  > kubernetes.module                        [  OK  ]', type: 'ok' },
        { text: '  > terraform.module                         [  OK  ]', type: 'ok' },
        { text: '  > docker.module                            [  OK  ]', type: 'ok' },
        { text: '  > security.module                          [  OK  ]', type: 'ok' },
        { text: '  > grafana-monitoring.module                [  OK  ]', type: 'ok' },
        { text: 'Initializing network interfaces...           [  OK  ]', type: 'ok' },
        { text: 'Mounting cloud infrastructure...             [  OK  ]', type: 'ok' },
        { text: 'Loading certificates...', type: 'dim' },
        { text: '  > AWS Security Specialty                   [VALID]', type: 'ok' },
        { text: '  > CompTIA Security+                        [VALID]', type: 'ok' },
        { text: 'Establishing secure connection...            [  OK  ]', type: 'ok' },
        { text: 'Starting portfolio services...               [  OK  ]', type: 'ok' },
        { text: '', type: 'dim' },
        { text: 'System ready. Welcome, visitor.', type: 'normal' },
    ];

    let index = 0;

    function showLine() {
        if (index >= bootMessages.length) {
            bootStatus.textContent = 'Boot complete. Launching portfolio...';
            progressBar.style.width = '100%';
            setTimeout(function() {
                bootScreen.style.opacity = '0';
                setTimeout(function() {
                    bootScreen.remove();
                    window.scrollTo(0, 0);
                }, 600);
            }, 700);
            sessionStorage.setItem('booted', 'true');
            return;
        }

        var msg = bootMessages[index];
        var line = document.createElement('p');

        if (msg.type === 'ok') {
            line.innerHTML = msg.text.replace('[  OK  ]', '<span class="ok">[  OK  ]</span>').replace('[VALID]', '<span class="ok">[VALID]</span>');
        } else if (msg.type === 'dim') {
            line.className = 'dim';
            line.textContent = msg.text;
        } else {
            line.textContent = msg.text;
            line.style.color = '#00ff41';
        }

        bootLinesEl.appendChild(line);
        bootLinesEl.scrollTop = bootLinesEl.scrollHeight;

        var pct = Math.round(((index + 1) / bootMessages.length) * 100);
        progressBar.style.width = pct + '%';
        bootStatus.textContent = 'Loading... ' + pct + '%';

        index++;
        var delay = msg.text === '' ? 80 : (Math.random() * 100 + 60);
        setTimeout(showLine, delay);
    }

    // Start boot after small delay
    setTimeout(showLine, 400);
})();

// ===== Theme Toggle =====
var themeToggle = document.getElementById('theme-toggle');
var themeIcon = document.getElementById('theme-icon');
var html = document.documentElement;

var savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'light' ? '\u2600' : '\u263E';

themeToggle.addEventListener('click', function() {
    var current = html.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    themeIcon.textContent = next === 'light' ? '\u2600' : '\u263E';
});

// ===== Terminal Typing Animation =====
var commands = [
    'kubectl get pods --all-namespaces',
    'terraform plan -out=infra.tfplan',
    'aws ec2 describe-instances --query "Reservations[*]"',
    'docker build -t cloud-app:latest .',
    'helm upgrade --install monitoring grafana/grafana',
    'git push origin main --force-with-lease'
];

var commandIndex = 0;
var charIndex = 0;
var isDeleting = false;
var typingElement = document.getElementById('typing-text');

function typeCommand() {
    var currentCommand = commands[commandIndex];

    if (!isDeleting) {
        typingElement.textContent = currentCommand.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentCommand.length) {
            setTimeout(function() {
                isDeleting = true;
                typeCommand();
            }, 2500);
            return;
        }
    } else {
        typingElement.textContent = currentCommand.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            commandIndex = (commandIndex + 1) % commands.length;
        }
    }

    var speed = isDeleting ? 25 : 50;
    setTimeout(typeCommand, speed);
}

setTimeout(typeCommand, 1500);

// ===== Mobile Navigation Toggle =====
var mobileToggle = document.getElementById('mobile-toggle');
var terminalNav = document.getElementById('terminal-nav');

mobileToggle.addEventListener('click', function() {
    terminalNav.classList.toggle('active');
});

terminalNav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
        terminalNav.classList.remove('active');
    });
});

// ===== Active Nav Highlight =====
var sections = document.querySelectorAll('.term-section');
var navCmds = document.querySelectorAll('.nav-cmd');

window.addEventListener('scroll', function() {
    var current = '';
    var scrollPos = window.scrollY + 150;

    sections.forEach(function(section) {
        var sectionTop = section.offsetTop;
        var sectionHeight = section.offsetHeight;

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navCmds.forEach(function(cmd) {
        cmd.classList.remove('active');
        var href = cmd.getAttribute('href').substring(1);
        if (href === current) {
            cmd.classList.add('active');
        }
    });
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Scroll Reveal Animation =====
var observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -30px 0px'
};

var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.exp-block, .skill-dir, .project-entry, .stat-block, .cert-entry, .contact-entry').forEach(function(el) {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== Command Input Bar =====
var commandInput = document.getElementById('command-input');
var commandOutput = document.getElementById('command-output');
var commandHistory = [];
var historyIndex = -1;

var commandMap = {
    'help': function() {
        return [
            { text: 'Available commands:', type: 'cmd-help' },
            { text: '  help        - Show this help message', type: '' },
            { text: '  about       - Jump to About section', type: '' },
            { text: '  experience  - Jump to Experience section', type: '' },
            { text: '  exp         - Jump to Experience section', type: '' },
            { text: '  skills      - Jump to Skills section', type: '' },
            { text: '  projects    - Jump to Projects section', type: '' },
            { text: '  certs       - Jump to Certifications section', type: '' },
            { text: '  contact     - Jump to Contact section', type: '' },
            { text: '  home        - Scroll to top', type: '' },
            { text: '  whoami      - About Darshan', type: '' },
            { text: '  clear       - Clear output', type: '' },
            { text: '  date        - Show current date', type: '' },
            { text: '  neofetch    - System info', type: '' },
        ];
    },
    'about': function() {
        scrollToSection('about');
        return [{ text: 'Navigating to about...', type: 'cmd-info' }];
    },
    'experience': function() {
        scrollToSection('experience');
        return [{ text: 'Navigating to experience...', type: 'cmd-info' }];
    },
    'exp': function() {
        scrollToSection('experience');
        return [{ text: 'Navigating to experience...', type: 'cmd-info' }];
    },
    'skills': function() {
        scrollToSection('skills');
        return [{ text: 'Navigating to skills...', type: 'cmd-info' }];
    },
    'projects': function() {
        scrollToSection('projects');
        return [{ text: 'Navigating to projects...', type: 'cmd-info' }];
    },
    'certs': function() {
        scrollToSection('certs');
        return [{ text: 'Navigating to certifications...', type: 'cmd-info' }];
    },
    'contact': function() {
        scrollToSection('contact');
        return [{ text: 'Navigating to contact...', type: 'cmd-info' }];
    },
    'home': function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return [{ text: 'Scrolling to top...', type: 'cmd-info' }];
    },
    'whoami': function() {
        return [
            { text: 'Darshan Sathish', type: 'cmd-help' },
            { text: 'Cloud & Infrastructure Engineer', type: 'cmd-info' },
            { text: 'AWS | Kubernetes | Terraform | Security', type: '' },
            { text: 'M.S. Cyber Security - Western Michigan University', type: '' },
        ];
    },
    'clear': function() {
        commandOutput.innerHTML = '';
        commandOutput.classList.remove('active');
        return null;
    },
    'date': function() {
        return [{ text: new Date().toString(), type: 'cmd-info' }];
    },
    'neofetch': function() {
        return [
            { text: '  darshan@cloud', type: 'cmd-help' },
            { text: '  ─────────────────────', type: '' },
            { text: '  Role:    Cloud Security & Infrastructure Engineer', type: '' },
            { text: '  Exp:     4+ years', type: '' },
            { text: '  Focus:   Cloud Security, Cyber Security, SRE', type: '' },
            { text: '  Certs:   AWS Security Specialty, CompTIA Sec+', type: '' },
            { text: '  Skills:  AWS, K8s, Terraform, IAM, KMS, Docker', type: '' },
            { text: '  Edu:     M.S. Cyber Security (GPA: 3.83)', type: '' },
            { text: '  Status:  Open to opportunities', type: 'cmd-help' },
            { text: '  Location: Indiana, USA', type: '' },
        ];
    },
};

function scrollToSection(id) {
    var el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function handleCommand(cmd) {
    var trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    commandHistory.push(trimmed);
    historyIndex = commandHistory.length;

    if (commandMap[trimmed]) {
        var result = commandMap[trimmed]();
        if (result) {
            showOutput(result);
        }
    } else {
        showOutput([
            { text: "command not found: " + trimmed, type: 'cmd-error' },
            { text: "Type 'help' for available commands.", type: '' }
        ]);
    }
}

function showOutput(lines) {
    commandOutput.innerHTML = '';
    lines.forEach(function(line) {
        var p = document.createElement('p');
        p.textContent = line.text;
        if (line.type) p.className = line.type;
        commandOutput.appendChild(p);
    });
    commandOutput.classList.add('active');

    // Auto-hide after 4 seconds for navigation commands
    setTimeout(function() {
        commandOutput.classList.remove('active');
    }, 4000);
}

commandInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        handleCommand(this.value);
        this.value = '';
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            this.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            this.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            this.value = '';
        }
    }
});

// Focus input on '/' key press
document.addEventListener('keydown', function(e) {
    if (e.key === '/' && document.activeElement !== commandInput) {
        e.preventDefault();
        commandInput.focus();
    }
});
