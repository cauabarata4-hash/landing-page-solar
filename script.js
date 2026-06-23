// ========== MENU RESPONSIVO ==========
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ========== VALIDAÇÃO E ENVIO DO FORMULÁRIO ==========
const formContato = document.getElementById('formContato');

if (formContato) {
    formContato.addEventListener('submit', (e) => {
        e.preventDefault();

        // Coletar dados do formulário
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const cidade = document.getElementById('cidade').value.trim();
        const tipo = document.getElementById('tipo').value;
        const mensagem = document.getElementById('mensagem').value.trim();

        // Validar campos
        if (!nome || !email || !telefone || !cidade || !tipo) {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, insira um email válido!');
            return;
        }

        // Validar telefone
        const telefoneRegex = /^(\(?\d{2}\)?)\s?9?\d{4}-?\d{4}$/;
        if (!telefoneRegex.test(telefone)) {
            alert('Por favor, insira um telefone válido!');
            return;
        }

        // Simular envio (em produção, seria uma requisição ao servidor)
        console.log({
            nome,
            email,
            telefone,
            cidade,
            tipo,
            mensagem,
            dataEnvio: new Date().toLocaleString('pt-BR')
        });

        // Exibir mensagem de sucesso
        showSuccessMessage();

        // Limpar formulário
        formContato.reset();
    });
}

// ========== FUNÇÃO DE SUCESSO DO FORMULÁRIO ==========
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <span class="success-icon">✓</span>
            <h3>Orçamento Solicitado com Sucesso!</h3>
            <p>Nossos especialistas entrarão em contato em breve.</p>
        </div>
    `;

    document.body.appendChild(successDiv);

    // Animar entrada
    setTimeout(() => {
        successDiv.classList.add('show');
    }, 100);

    // Remover após 5 segundos
    setTimeout(() => {
        successDiv.classList.remove('show');
        setTimeout(() => {
            successDiv.remove();
        }, 300);
    }, 5000);
}

// ========== ANIMAÇÃO DE SCROLL ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos para animação
document.querySelectorAll('.servico-card, .beneficio-item, .depoimento-card').forEach(el => {
    observer.observe(el);
});

// ========== FORMATAÇÃO DE TELEFONE ==========
const telefonInput = document.getElementById('telefone');
if (telefonInput) {
    telefonInput.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '');

        if (valor.length > 0) {
            if (valor.length <= 2) {
                valor = `(${valor}`;
            } else if (valor.length <= 7) {
                valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
            } else {
                valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7, 11)}`;
            }
        }

        e.target.value = valor;
    });
}

// ========== CONTADOR DE CARACTERES ==========
const mensagemTextarea = document.getElementById('mensagem');
if (mensagemTextarea) {
    const createCharCounter = () => {
        const counter = document.createElement('small');
        counter.className = 'char-counter';
        counter.textContent = '0/500';
        mensagemTextarea.parentNode.appendChild(counter);
    };

    createCharCounter();

    mensagemTextarea.addEventListener('input', (e) => {
        const counter = document.querySelector('.char-counter');
        const length = e.target.value.length;
        counter.textContent = `${length}/500`;

        if (length > 500) {
            e.target.value = e.target.value.slice(0, 500);
            counter.textContent = '500/500';
        }
    });
}

// ========== EFEITO PARALLAX NA HERO SECTION ==========
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPosition = `0 ${scrollPosition * 0.5}px`;
    }
});

// ========== ATIVA LINK DA NAVEGAÇÃO ATUAL ==========
window.addEventListener('scroll', () => {
    let current = '';

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ========== SUAVIZAÇÃO DE SCROLL PARA LINKS ÂNCORA ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ========== DETECÇÃO DE DISPOSITIVO MÓVEL ==========
function isMobileDevice() {
    return (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

if (isMobileDevice()) {
    document.body.classList.add('mobile-device');
}

// ========== CARREGAR ANIMAÇÕES DINÂMICAS ==========
document.addEventListener('DOMContentLoaded', () => {
    // Animar números
    const animateNumbers = (element, target, duration = 2000) => {
        let current = 0;
        const increment = target / (duration / 16);
        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(interval);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    };

    // Exemplo de uso (descomentar se houver elementos com classe 'number-animate')
    // document.querySelectorAll('.number-animate').forEach(el => {
    //     const target = parseInt(el.textContent);
    //     animateNumbers(el, target);
    // });
});

console.log('Script carregado com sucesso!');
